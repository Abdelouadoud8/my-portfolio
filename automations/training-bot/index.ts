// Neon Function "trainbot": Telegram bot that handles registrations for paid training sessions.
//
// Flow (all in Telegram, no email):
//   1. The "تسجيل" button on the training page opens t.me/<bot>?start=<sessionId>
//   2. The bot asks for the name, then the phone number through Telegram's "share contact" button
//      (the number tied to the account: no typos, no fake numbers)
//   3. It sends the payment details and holds the seat for HOLD_HOURS
//   4. The person sends a photo of the receipt; the bot forwards it to the admin with Accept / Reject buttons
//   5. Accepted → the bot sends the private group's invite link. That link needs approval: the bot approves a join
//      request only if that Telegram account has paid for that session, so a forwarded link is useless to others
//   6. Admin commands: /list, /remind, /sendlinks, /setgroup (see helpText)
//
// Env: TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET (Telegram sends it back in a header on every update),
//      TELEGRAM_ADMIN_CHAT_ID (the only account allowed to approve and use admin commands),
//      BOT_DATABASE_URL (least-privilege role "training_bot", schema training_bot),
//      PAYMENT_DETAILS (CCP / RIP text shown to people at step 3; "\n" for new lines)
import { neon } from "@neondatabase/serverless";
import { Hono } from "hono";

const HOLD_HOURS = 48;
const TELEGRAM = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
const ADMIN_ID = Number(process.env.TELEGRAM_ADMIN_CHAT_ID);
const PAYMENT_DETAILS = (process.env.PAYMENT_DETAILS ?? "").replaceAll("\\n", "\n");

const sql = neon(process.env.BOT_DATABASE_URL!);
const app = new Hono();

// ---------- Telegram types (only the fields used here) ----------

type User = { id: number; first_name?: string; username?: string };
type Chat = { id: number; type: "private" | "group" | "supergroup" | "channel"; title?: string };
type Message = {
  message_id: number;
  from?: User;
  chat: Chat;
  text?: string;
  contact?: { phone_number: string; user_id?: number };
  photo?: unknown[];
  document?: { mime_type?: string };
};
type CallbackQuery = { id: string; from: User; data?: string; message?: Message };
type ChatJoinRequest = { chat: Chat; from: User; user_chat_id: number; invite_link?: { invite_link: string } };
type Update = { message?: Message; callback_query?: CallbackQuery; chat_join_request?: ChatJoinRequest };

type Session = {
  id: string;
  label: string;
  price: string;
  seats: number;
  reserved_seats: number;
  booking_open: boolean;
  group_chat_id: string | null;
  invite_link: string | null;
};
type Registration = {
  id: number;
  session_id: string;
  tg_user_id: string;
  name: string | null;
  phone: string | null;
  status: string;
  hold_expires_at: string | null;
};

// ---------- Telegram API ----------

async function tg<T = unknown>(method: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${TELEGRAM}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  const json = (await res.json()) as { ok: boolean; result?: T; description?: string };
  // Never log the URL: it contains the bot token
  if (!json.ok) throw new Error(`Telegram ${method}: ${json.description}`);
  return json.result as T;
}

function send(chatId: number | string, text: string, extra: Record<string, unknown> = {}) {
  return tg<Message>("sendMessage", { chat_id: chatId, text, ...extra });
}

const removeKeyboard = { reply_markup: { remove_keyboard: true } };

// ---------- Data ----------

async function getSession(id: string) {
  const [row] = (await sql`
    SELECT id, label, price, seats, reserved_seats, booking_open, group_chat_id, invite_link
    FROM training_bot.sessions WHERE id = ${id}`) as Session[];
  return row;
}

// Taken seats: sold outside the bot, paid, waiting for review, or held (payment details sent, hold not expired)
async function seatsLeft(session: Session) {
  const [{ taken }] = (await sql`
    SELECT count(*)::int AS taken FROM training_bot.registrations
    WHERE session_id = ${session.id}
      AND (status IN ('paid', 'pending_review')
           OR (status = 'awaiting_receipt' AND hold_expires_at > now()))`) as { taken: number }[];
  return Math.max(0, session.seats - session.reserved_seats - taken);
}

async function getRegistration(sessionId: string, userId: number) {
  const [row] = (await sql`
    SELECT id, session_id, tg_user_id, name, phone, status, hold_expires_at
    FROM training_bot.registrations
    WHERE session_id = ${sessionId} AND tg_user_id = ${userId}`) as Registration[];
  return row;
}

// The registration a free-text message, contact or photo belongs to: the person's latest unfinished one
async function getActiveRegistration(userId: number) {
  const [row] = (await sql`
    SELECT id, session_id, tg_user_id, name, phone, status, hold_expires_at
    FROM training_bot.registrations
    WHERE tg_user_id = ${userId}
      AND status IN ('awaiting_name', 'awaiting_phone', 'awaiting_receipt', 'rejected')
    ORDER BY updated_at DESC LIMIT 1`) as Registration[];
  return row;
}

async function setStatus(id: number, status: string) {
  await sql`UPDATE training_bot.registrations SET status = ${status}, updated_at = now() WHERE id = ${id}`;
}

// ---------- Messages to participants (Darja) ----------

// Step 1 (sent by /start): session, price and the name question
function welcomeText(session: Session) {
  return [
    "مرحبا! راك تسجل في",
    `حصة ${session.label}`,
    `سعر الحصة (${session.price}).`,
    "",
    "للتسجيل كمل هاذ 3 خطوات",
    "الخطوة الأولى،",
    "واش هو اسمك و لقبك؟",
    "تأكد من صحة كامل المعلومات باش التسجيل تاعك يكون صحيح",
  ].join("\n");
}

// Step 2: phone number through Telegram's share-contact button
function askPhone(chatId: number) {
  const text = [
    "الخطوة الثانية:",
    "ضرك ابعثلنا رقم التيليفون تاعك (إضغط فقط على الزر لي لتحت) باش نتواصلو معاك نهار الحصة و نبعثولك رابط الدخول",
  ].join("\n");
  return send(chatId, text, {
    reply_markup: {
      keyboard: [[{ text: "ابعث رقم التيليفون", request_contact: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
}

// Step 3: payment details, then the receipt
function paymentText(session: Session) {
  return [
    "الخطوة الثالثة:",
    `باش تكمّل التسجيل في حصة ${session.label}:`,
    "",
    `1. خلّص ${session.price}`,
    PAYMENT_DETAILS,
    "",
    "2. ابعث هنا صورة الوصل (لقطة شاشة BaridiMob ولا وصل مكتب البريد).",
  ].join("\n");
}

function joinText(session: Session) {
  return session.invite_link
    ? `تأكد الدفع، مرحبا بيك في حصة ${session.label}!\n\nادخل للمجموعة من هاد الرابط و ابعث طلب الانضمام، راح يتقبل أوتوماتيكيا:\n${session.invite_link}`
    : `تأكد الدفع، مرحبا بيك في حصة ${session.label}! راح نبعثولك رابط المجموعة هنا قريب.`;
}

// ---------- Participant flow ----------

async function handleStart(msg: Message, param: string | undefined) {
  const user = msg.from!;
  if (!param) {
    const sessions = (await sql`
      SELECT id, label, price, seats, reserved_seats, booking_open, group_chat_id, invite_link
      FROM training_bot.sessions WHERE booking_open ORDER BY id`) as Session[];
    if (!sessions.length) return send(user.id, "مرحبا! ماكاش حصة مفتوحة للتسجيل دوك. تابعنا باش تعرف وقتاش تتفتح.");
    return send(user.id, "مرحبا! اختار الحصة اللي حاب تسجل فيها:", {
      reply_markup: { inline_keyboard: sessions.map((s) => [{ text: s.label, callback_data: `pick:${s.id}` }]) },
    });
  }
  return startSession(user, param);
}

async function startSession(user: User, sessionId: string) {
  const session = await getSession(sessionId);
  if (!session || !session.booking_open) {
    return send(user.id, "التسجيل في هاد الحصة ماهوش مفتوح دوك. ارجع لصفحة الدورة و اختار حصة مفتوحة.");
  }

  const existing = await getRegistration(session.id, user.id);
  if (existing?.status === "paid") return send(user.id, joinText(session));
  if (existing?.status === "pending_review") {
    return send(user.id, "الوصل تاعك وصلنا و راهو قيد المراجعة، راح نأكدولك في أقرب وقت.");
  }
  if (existing?.status === "awaiting_phone") return askPhone(user.id);
  if (existing?.status === "awaiting_receipt" || existing?.status === "rejected") {
    return send(user.id, paymentText(session));
  }

  if ((await seatsLeft(session)) <= 0) {
    return send(user.id, `حصة ${session.label} مكتملة. شوف الحصص الأخرى في صفحة الدورة.`);
  }

  if (existing) {
    // A cancelled (or unfinished) registration starts over
    await sql`
      UPDATE training_bot.registrations
      SET status = 'awaiting_name', tg_username = ${user.username ?? null}, hold_expires_at = NULL, updated_at = now()
      WHERE id = ${existing.id}`;
  } else {
    await sql`
      INSERT INTO training_bot.registrations (session_id, tg_user_id, tg_username)
      VALUES (${session.id}, ${user.id}, ${user.username ?? null})`;
  }
  return send(user.id, welcomeText(session));
}

async function handleName(msg: Message, reg: Registration) {
  const name = (msg.text ?? "").trim().replace(/\s+/g, " ");
  if (name.length < 3 || name.length > 80 || name.startsWith("/")) {
    return send(msg.chat.id, "ابعث اسمك و لقبك من فضلك (مثلا: محمد بن علي).");
  }
  await sql`
    UPDATE training_bot.registrations SET name = ${name}, status = 'awaiting_phone', updated_at = now()
    WHERE id = ${reg.id}`;
  return askPhone(msg.chat.id);
}

async function handleContact(msg: Message, reg: Registration) {
  // Only the person's own number (Telegram fills contact.user_id for the sender's own contact)
  if (msg.contact!.user_id !== msg.from!.id) {
    return send(msg.chat.id, "ابعث رقمك أنت بالزر اللي تحت من فضلك.");
  }
  const session = await getSession(reg.session_id);
  if (!session) return;
  if ((await seatsLeft(session)) <= 0) {
    await setStatus(reg.id, "cancelled");
    return send(msg.chat.id, `سمحلنا، حصة ${session.label} تكملت. شوف الحصص الأخرى في صفحة الدورة.`, removeKeyboard);
  }
  const phone = msg.contact!.phone_number.startsWith("+")
    ? msg.contact!.phone_number
    : `+${msg.contact!.phone_number}`;
  await sql`
    UPDATE training_bot.registrations
    SET phone = ${phone}, status = 'awaiting_receipt',
        hold_expires_at = now() + make_interval(hours => ${HOLD_HOURS}), updated_at = now()
    WHERE id = ${reg.id}`;
  // One message: step 3 + hide the share-contact keyboard
  return send(msg.chat.id, paymentText(session), removeKeyboard);
}

async function handleReceipt(msg: Message, reg: Registration) {
  const session = await getSession(reg.session_id);
  if (!session) return;

  // The hold ran out and the session filled up in the meantime
  const holdExpired = reg.hold_expires_at && new Date(reg.hold_expires_at) < new Date();
  if (holdExpired && (await seatsLeft(session)) <= 0) {
    await setStatus(reg.id, "cancelled");
    return send(
      msg.chat.id,
      `سمحلنا، الحجز تاعك فات (${HOLD_HOURS} ساعة) و الحصة تكملت. إذا خلصت، تواصل معانا باش نحولوك للحصة الجاية.`,
    );
  }

  await tg("copyMessage", { chat_id: ADMIN_ID, from_chat_id: msg.chat.id, message_id: msg.message_id });
  const card = await send(
    ADMIN_ID,
    [
      `وصل جديد: ${session.label} (${session.price})`,
      `الاسم: ${reg.name ?? "-"}`,
      `التيليفون: ${reg.phone ?? "-"}`,
      msg.from?.username ? `تيليغرام: @${msg.from.username}` : `تيليغرام: ${msg.from?.first_name ?? ""}`,
      "",
      "تأكد أن الدراهم وصلت لحسابك (ECCP / BaridiMob) قبل ما تقبل.",
    ].join("\n"),
    {
      reply_markup: {
        inline_keyboard: [[
          { text: "قبول", callback_data: `ok:${reg.id}` },
          { text: "رفض", callback_data: `no:${reg.id}` },
        ]],
      },
    },
  );
  await sql`
    UPDATE training_bot.registrations
    SET status = 'pending_review', receipt_count = receipt_count + 1, admin_message_id = ${card.message_id},
        updated_at = now()
    WHERE id = ${reg.id}`;
  return send(msg.chat.id, "وصلنا الوصل، شكرا! راح نتأكدو من الدفع و نردولك هنا في أقرب وقت.");
}

async function handleCancel(msg: Message) {
  const reg = await getActiveRegistration(msg.from!.id);
  if (!reg) return send(msg.chat.id, "ماعندك حتى تسجيل جاري.");
  await setStatus(reg.id, "cancelled");
  return send(msg.chat.id, "تلغى التسجيل. تقدر تعاود من صفحة الدورة وقتما حبيت.", removeKeyboard);
}

// ---------- Admin ----------

const helpText = [
  "أوامر الأدمين:",
  "/list - الحصص و المسجلين",
  "/list <session> - المسجلين في حصة",
  "/remind <session> <رسالة> - رسالة لكل اللي خلصو",
  "/sendlinks <session> - يعاود يبعث رابط المجموعة لكل اللي خلصو",
  "/setgroup <session> - (داخل المجموعة) يربط المجموعة بالحصة",
].join("\n");

const statusLabels: Record<string, string> = {
  awaiting_name: "بدا (الاسم)",
  awaiting_phone: "بدا (التيليفون)",
  awaiting_receipt: "ينتظر الدفع",
  pending_review: "وصل للمراجعة",
  paid: "خلص",
  rejected: "مرفوض",
  cancelled: "ملغى",
};

async function handleList(chatId: number, sessionId?: string) {
  if (!sessionId) {
    const sessions = (await sql`
      SELECT id, label, price, seats, reserved_seats, booking_open, group_chat_id, invite_link
      FROM training_bot.sessions ORDER BY id`) as Session[];
    if (!sessions.length) return send(chatId, "ماكاش حصص. شغّل sync-sessions.mjs.");
    const lines = [];
    for (const s of sessions) {
      const [c] = (await sql`
        SELECT count(*) FILTER (WHERE status = 'paid')::int AS paid,
               count(*) FILTER (WHERE status = 'pending_review')::int AS review,
               count(*) FILTER (WHERE status = 'awaiting_receipt' AND hold_expires_at > now())::int AS held
        FROM training_bot.registrations WHERE session_id = ${s.id}`) as { paid: number; review: number; held: number }[];
      lines.push(
        `${s.label}\n${s.id}\n${s.booking_open ? "مفتوح" : "مسكّر"} · خلصو ${c.paid} · مراجعة ${c.review} · محجوز ${c.held} · باقي ${await seatsLeft(s)}/${s.seats}${s.group_chat_id ? "" : " · بلا مجموعة"}`,
      );
    }
    return send(chatId, lines.join("\n\n"));
  }
  const rows = (await sql`
    SELECT name, phone, status FROM training_bot.registrations
    WHERE session_id = ${sessionId} AND status <> 'cancelled' ORDER BY created_at`) as {
    name: string | null;
    phone: string | null;
    status: string;
  }[];
  if (!rows.length) return send(chatId, "حتى واحد ما سجل في هاد الحصة.");
  return send(
    chatId,
    rows.map((r, i) => `${i + 1}. ${r.name ?? "-"} · ${r.phone ?? "-"} · ${statusLabels[r.status] ?? r.status}`).join("\n"),
  );
}

async function paidUsers(sessionId: string) {
  return (await sql`
    SELECT tg_user_id FROM training_bot.registrations
    WHERE session_id = ${sessionId} AND status = 'paid'`) as { tg_user_id: string }[];
}

async function broadcast(chatId: number, sessionId: string, text: (s: Session) => string) {
  const session = await getSession(sessionId);
  if (!session) return send(chatId, "ما لقيتش هاد الحصة. شوف /list.");
  let sent = 0;
  for (const { tg_user_id } of await paidUsers(sessionId)) {
    try {
      await send(tg_user_id, text(session));
      sent++;
    } catch (error) {
      console.error(`broadcast to ${tg_user_id}: ${(error as Error).message}`);
    }
  }
  return send(chatId, `تبعثت لـ ${sent} شخص.`);
}

async function handleAdminCommand(msg: Message) {
  const [command, sessionId, ...rest] = (msg.text ?? "").trim().split(/\s+/);
  switch (command.replace(/@.*$/, "")) {
    case "/list":
      return handleList(msg.chat.id, sessionId);
    case "/remind":
      if (!sessionId || !rest.length) return send(msg.chat.id, "/remind <session> <رسالة>");
      return broadcast(msg.chat.id, sessionId, () => rest.join(" "));
    case "/sendlinks":
      if (!sessionId) return send(msg.chat.id, "/sendlinks <session>");
      return broadcast(msg.chat.id, sessionId, joinText);
    case "/help":
      return send(msg.chat.id, helpText);
    default:
      return false;
  }
}

// /setgroup <session>, sent by the admin inside the session's private group (the bot must be an admin there
// with the "invite users" right): links the group and creates its join-request invite link
async function handleSetGroup(msg: Message) {
  const sessionId = (msg.text ?? "").trim().split(/\s+/)[1];
  const session = sessionId && (await getSession(sessionId));
  if (!session) return send(msg.chat.id, "ما لقيتش هاد الحصة. /setgroup <session> (شوف /list في الخاص).");
  const link = await tg<{ invite_link: string }>("createChatInviteLink", {
    chat_id: msg.chat.id,
    name: session.id.slice(0, 32),
    creates_join_request: true,
  });
  await sql`
    UPDATE training_bot.sessions
    SET group_chat_id = ${msg.chat.id}, invite_link = ${link.invite_link}, updated_at = now()
    WHERE id = ${session.id}`;
  await send(msg.chat.id, `المجموعة تربطت بحصة ${session.label}. البوت راح يقبل غير اللي خلصو.`);
  // People approved before the group existed get the link now (the admin sees the count in private)
  return broadcast(ADMIN_ID, session.id, () => joinText({ ...session, invite_link: link.invite_link }));
}

async function handleDecision(query: CallbackQuery) {
  const [action, id] = (query.data ?? "").split(":");
  const [reg] = (await sql`
    SELECT id, session_id, tg_user_id, name, phone, status, hold_expires_at
    FROM training_bot.registrations WHERE id = ${Number(id)}`) as Registration[];
  if (!reg || reg.status !== "pending_review") {
    return tg("answerCallbackQuery", { callback_query_id: query.id, text: "تعالج من قبل" });
  }
  const session = (await getSession(reg.session_id))!;
  const accepted = action === "ok";
  if (accepted) {
    await sql`
      UPDATE training_bot.registrations SET status = 'paid', approved_at = now(), updated_at = now()
      WHERE id = ${reg.id}`;
    await send(reg.tg_user_id, joinText(session));
  } else {
    await setStatus(reg.id, "rejected");
    await send(
      reg.tg_user_id,
      "ما قدرناش نأكدو الدفع بهاد الوصل. تأكد من المبلغ و ابعث صورة وصل واضحة هنا، ولا تواصل معانا.",
    );
  }
  await tg("answerCallbackQuery", { callback_query_id: query.id, text: accepted ? "تقبل" : "ترفض" });
  if (query.message) {
    await tg("editMessageText", {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id,
      text: `${query.message.text ?? ""}\n\n${accepted ? "تقبل" : "ترفض"}`,
    });
  }
}

// ---------- Group access ----------

async function handleJoinRequest(request: ChatJoinRequest) {
  const [session] = (await sql`
    SELECT id, label, price, seats, reserved_seats, booking_open, group_chat_id, invite_link
    FROM training_bot.sessions WHERE group_chat_id = ${request.chat.id}`) as Session[];
  // Only requests made through the bot's own link of a linked group. Any other request (a group the bot was
  // just added to, a link the admin created by hand) stays pending for the admin to handle.
  if (!session?.invite_link || request.invite_link?.invite_link !== session.invite_link) return;
  const reg = await getRegistration(session.id, request.from.id);
  if (reg?.status === "paid") {
    await tg("approveChatJoinRequest", { chat_id: request.chat.id, user_id: request.from.id });
    await sql`UPDATE training_bot.registrations SET joined_at = now(), updated_at = now() WHERE id = ${reg.id}`;
    return;
  }
  await tg("declineChatJoinRequest", { chat_id: request.chat.id, user_id: request.from.id });
  // user_chat_id lets the bot write to the person for a few minutes after the request
  await send(
    request.user_chat_id,
    "المجموعة غير للي سجلو و خلصو. سجل من صفحة الدورة، و بعد ما يتأكد الدفع تقدر تدخل.",
  ).catch(() => {});
}

// ---------- Routing ----------

async function handleUpdate(update: Update) {
  if (update.chat_join_request) return handleJoinRequest(update.chat_join_request);

  if (update.callback_query) {
    const query = update.callback_query;
    if (query.data?.startsWith("pick:")) {
      await tg("answerCallbackQuery", { callback_query_id: query.id });
      return startSession(query.from, query.data.slice(5));
    }
    if (query.from.id !== ADMIN_ID) return tg("answerCallbackQuery", { callback_query_id: query.id });
    return handleDecision(query);
  }

  const msg = update.message;
  if (!msg?.from) return;
  const isAdmin = msg.from.id === ADMIN_ID;
  const text = msg.text?.trim() ?? "";

  if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
    if (isAdmin && text.startsWith("/setgroup")) return handleSetGroup(msg);
    return;
  }
  if (msg.chat.type !== "private") return;

  if (text.startsWith("/start")) return handleStart(msg, text.split(/\s+/)[1]);
  if (text === "/cancel") return handleCancel(msg);
  if (isAdmin && text.startsWith("/") && (await handleAdminCommand(msg)) !== false) return;

  const reg = await getActiveRegistration(msg.from.id);
  if (!reg) {
    // Nothing waiting for an answer: tell people with a receipt under review or a paid seat where they stand
    const [latest] = (await sql`
      SELECT status FROM training_bot.registrations
      WHERE tg_user_id = ${msg.from.id} AND status IN ('pending_review', 'paid')
      ORDER BY updated_at DESC LIMIT 1`) as { status: string }[];
    if (latest?.status === "pending_review") {
      return send(msg.chat.id, "الوصل تاعك راهو قيد المراجعة، راح نردولك هنا في أقرب وقت.");
    }
    if (latest?.status === "paid") {
      return send(msg.chat.id, "راك مسجل و الدفع تأكد. إذا عندك سؤال، اكتبهولنا في المجموعة.");
    }
    return send(msg.chat.id, "مرحبا! باش تسجل، اضغط على زر «تسجيل» في صفحة الدورة ولا ابعث /start.");
  }
  if (reg.status === "awaiting_name" && msg.text) return handleName(msg, reg);
  if (reg.status === "awaiting_phone") {
    if (msg.contact) return handleContact(msg, reg);
    return askPhone(msg.chat.id);
  }
  if (reg.status === "awaiting_receipt" || reg.status === "rejected") {
    if (msg.photo || msg.document) return handleReceipt(msg, reg);
    return send(msg.chat.id, "ابعث صورة الوصل هنا من فضلك (لقطة شاشة ولا صورة).");
  }
}

app.post("/telegram", async (c) => {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || c.req.header("x-telegram-bot-api-secret-token") !== secret) {
    return c.json({ error: "unauthorized" }, 401);
  }
  try {
    await handleUpdate(await c.req.json<Update>());
  } catch (error) {
    // Answer 200 anyway: Telegram would otherwise resend the same update again and again
    console.error(`trainbot update failed: ${(error as Error).message}`);
  }
  return c.json({ ok: true });
});

// Public, read-only: seats left per session of a training, for the training page
app.get("/public/seats/:trainingId", async (c) => {
  const sessions = (await sql`
    SELECT id, label, price, seats, reserved_seats, booking_open, group_chat_id, invite_link
    FROM training_bot.sessions WHERE training_id = ${c.req.param("trainingId")}`) as Session[];
  const result: Record<string, number> = {};
  for (const session of sessions) result[session.id] = await seatsLeft(session);
  c.header("Cache-Control", "public, max-age=300");
  return c.json({ seatsLeft: result });
});

app.onError((error, c) => {
  console.error(`trainbot failed: ${error.message}`);
  return c.json({ error: "internal error" }, 500);
});

export default app;
