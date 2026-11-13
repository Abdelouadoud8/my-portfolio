import { Training } from "@/data/types";

// Trainings: a card on /links + a details page at /trainings/<id>. Edit this file only.
// Empty array hides the /links section. Draft content: check the date, time, seats and sign-up link before sharing.

export const trainings: Training[] = [
  {
    id: "ai-essentials",
    title: "أتعلم أساسيات الذكاء الإصطناعي مع ودود في ساعتين",
    description:
      "ساعتين كاملين راح نعلمك فيهم كامل واش تحتاج تعرف على الذكاء الإصطناعي، واش هو الذكاء الإصطناعي؟ كيفاش تستخدمو باش تسهل حياتك؟ و حتى كيفاش تدخل بيه دراهم",
    date: "ثلاث حصص مفتوحة",
    time: "ساعتين",
    // Free Google accounts cut group calls at 60 min: a 2-hour session needs Google Workspace / Google One
    platform: "Google Meet",
    badge: "دورة للمبتدئين",
    price: "دورة مدفوعة",
    level: "مبتدئين",
    maxParticipants: "20-25",
    // "لمن هاد التكوين؟": who it's for and what you need, summed up in a few ticks (hidden for now: hideAudience)
    hideAudience: true,
    audience: [
      "للمبتدئين: لي حاب يفهم الذكاء الإصطناعي و يستعملو صح",
      "للطلبة و الخدامين لي حابين يربحو الوقت، و لي حاب يدخل بيه دراهم",
      "تحتاج غير PC ولا تيليفون مع كونيكسيون مليحة",
    ],
    notFor: [
      "تحوس على طريقة سحرية باش تربح الدراهم بلا ما تخدم",
      "عندك خبرة كبيرة في الذكاء الاصطناعي: الدورة للمبتدئين",
      "حاب خطة على حسابك: الحصة الخاصة 1:1 خير ليك",
    ],
    // seatsLeft is the fallback: once telegramBot is set, the page shows the bot's live count (paid + held seats).
    // seatsLeft 0 shows "مكتملة". Keep sessions in date order.
    sessions: [
      {
        id: "2026-11-07",
        date: "السبت 7 نوفمبر",
        day: "2026-11-07",
        time: "20:00 - 22:00",
        seats: 25,
        seatsLeft: 0,
        reservedSeats: 25,
        price: "2000 DA",
      },
      {
        // id = the bot's key (first planned date), kept when the date moves: never change it
        id: "2026-11-28",
        // Website shows "باقي 12 بلاصة" whatever the bot counts (display only). Remove to show the live count again.
        displaySeatsLeft: 12,
        date: "السبت 21 نوفمبر",
        day: "2026-11-21",
        time: "20:00 - 22:00",
        bookingOpen: true,
        seats: 25,
        seatsLeft: 25,
        price: "1000 DA",
        oldPrice: "2000 DA",
      },
      {
        id: "2026-12-12",
        // Hidden for now: everyone is pushed to the 21 November session
        hidden: true,
        date: "السبت 5 ديسمبر",
        day: "2026-12-05",
        time: "20:00 - 22:00",
        seats: 25,
        seatsLeft: 25,
        price: "1500 DA",
        oldPrice: "3000 DA",
      },
    ],
    // "كيفاش تسجل": the Telegram bot flow (automations/training-bot)
    registrationSteps: [
      "اضغط على «تسجيل» في الحصة اللي تناسبك: يتفتحلك البوت تاعنا في تيليغرام",
      "ابعث اسمك و رقم التيليفون (بزر واحد)",
      "خلّص بـ BaridiMob ولا في مكتب البريد، و ابعث صورة الوصل في البوت على تيليغرام",
      "كي تبعت صورة الوصل راح نأكد لك التسجيل في 24 ساعة بعد ما نتأكد من الوصل وندخلك في رابط المجموعة اللي فيها كامل تفاصيل ورابط الحصة",
    ],
    paymentMethods: [
      {
        kind: "baridimob",
        title: "BaridiMob",
        description: "تحويل من تطبيق BaridiMob لحساب CCP",
      },
      {
        kind: "post-office",
        title: "Algérie Poste",
        description: "دفع نقدي في أي مكتب بريد وتاخذ وصل",
      },
    ],
    program: [
      {
        title: "واش هو الذكاء الإصطناعي، كيفاش يخدم و واش يقدر يدير",
        points: [
          "تفهم واش هو الذكاء الاصطناعي وكيفاش يخدم",
          "تعرف واش يقدر يدير و واش ما يقدرش، و كيفاش تشوف الأخطاء تاعو و تتجنبها",
        ],
      },
      {
        title: "كيفاش تهدر معا أدوات الذكاء الإصطناعي: الـ prompt engineering",
        points: [
          "نعلمك الـ prompt engineering و كيفاه تكتب أفضل prompt يخليك تتحصل على أفضل نتيجة ممكنة.",
          "تطبيق مباشر مع بعض على عدة أمثلة يومية في ChatGPT و Gemini",
          "نعلمك كيفاه تستعمل claude, chatgpt, gemini باش تسهل أي مهمة عندك",
        ],
      },
      {
        title: "شرح كامل لـ Claude Code",
        points: [
          "كيفاه تخدم بيه كامل المهام الرقمية (تخدم فيديوهات الشايعة، مونطاج فيديو، ديزاين، كتابة...)",
          "نعلمك تخدم الفيديوهات المنتشرة (فيديوهات الفواكه، التعليمية، الأنيمايشن)",
          "نعلمك كيفاه دير مونطاج فيديو بالAI",
        ],
      },
      {
        title: "كيفاش تدخل الدراهم بالذكاء الإصطناعي",
        points: [
          "نشوفو مع بعض مجموعة من المجالات لي تقدر تدخل فيها الدراهم بالذكاء الإصطناعي (خدمات رقمية، صناعة المحتوى، ديزاين، مونطاج...)",
          "نشارك معاك الخبرة تاعي في هاد المجالات: كيفاش بديت، واش خدم معايا و واش ما خدمش، و كيفاش تبدا انت",
        ],
      },
    ],
    // Add real attendee reviews after the first session, e.g. { name: "Amine", text: "...", rating: 5 }
    reviews: [],
    // Messages from the free session (cropped Telegram screenshots, no profile photos), best first
    feedbackImages: [
      { src: "/links/ai-session/feedback-1.webp", width: 900, height: 544 },
      { src: "/links/ai-session/feedback-2.webp", width: 900, height: 542 },
      { src: "/links/ai-session/feedback-3.webp", width: 900, height: 434 },
      { src: "/links/ai-session/feedback-4.webp", width: 900, height: 324 },
      { src: "/links/ai-session/feedback-5.webp", width: 900, height: 275 },
      { src: "/links/ai-session/feedback-6.webp", width: 900, height: 275 },
      { src: "/links/ai-session/feedback-7.webp", width: 900, height: 283 },
    ],
    faq: [
      {
        question: "لازم يكون عندي مستوى في الذكاء الاصطناعي؟",
        answer: "لا، التكوين للمبتدئين. إذا تعرف تستعمل التيليفون ولا PC يكفي.",
      },
      {
        question: "علاش عدد الأماكن محدود؟",
        answer:
          "باش نظمنوا فرصة أكبر للتعلم في مجموعات صغيرة لي راح تقدروا تسقسوا فيها كيما تحبوا و نقدرو نجاوبو على الأسئلة تاع كامل الناس و نطبقو مع بعض.",
      },
      {
        question: "واش يصرا إذا خلصت وما قدرتش نحضر؟",
        answer: "ماكاش مشكل: إذا خلصت وما قدرتش تحضر، نحولوك للحصة اللي من بعد بلا ما تخلص مرة أخرى.",
      },
    ],
    // Registration bot (automations/training-bot); without it, open sessions show "التسجيل يتفتح قريبا"
    telegramBot: "LearnAiWithOuadoudBot",
    // Telegram username link (never a t.me/+<phone> link: it would publish the number)
    questionsHref: "https://t.me/abdelouadoud_mahdaoui",
    // signupHref: "https://forms.gle/...",
  },
];
