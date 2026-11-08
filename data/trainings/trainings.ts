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
    price: "دورة مدفوعة",
    level: "مبتدئين",
    maxParticipants: "20-25",
    // "لمن هاد التكوين؟": who it's for and what you need, summed up in a few ticks
    audience: [
      "للمبتدئين: لي حاب يفهم الذكاء الإصطناعي و يستعملو صح",
      "للطلبة و الخدامين لي حابين يربحو الوقت، و لي حاب يدخل بيه دراهم",
      "تحتاج غير PC ولا تيليفون مع كونيكسيون مليحة",
      "حساب Google و حساب مجاني في ChatGPT ولا Gemini ولا Claude",
    ],
    outcomes: [
      "تفهم واش هو الذكاء الاصطناعي وكيفاش يخدم خلف الكواليس بطريقة بسيطة",
      "تعرف واش يقدر يدير و واش ما يقدرش، و كيفاش تشوف الأخطاء تاعو",
      "تكتب prompt ملاح بطريقة بسيطة تخدم مع أي أداة: ChatGPT و Claude و Gemini",
      "نعلمك كيفاه تستعمل هاذ الأدوات في القراية تاعك، الخدمة ولا كيفاش تطور البيزنس تاعك",
      "تتعرف على خدمات تقدر تبيعها بالذكاء الاصطناعي وكيفاش تبدا (graphic design, social media management) و العديد من الخدمات الرقمية",
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
        price: "1500 DA",
        oldPrice: "3000 DA",
      },
      {
        // id = the bot's key (first planned date), kept when the date moves: never change it
        id: "2026-11-28",
        date: "السبت 21 نوفمبر",
        day: "2026-11-21",
        time: "20:00 - 22:00",
        bookingOpen: true,
        seats: 25,
        seatsLeft: 25,
        price: "1500 DA",
        oldPrice: "3000 DA",
      },
      {
        id: "2026-12-12",
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
      "ابعث اسمك و رقم التيليفون (بزر واحد)، و البلاصة تتحجزلك 48 ساعة",
      "خلّص بـ BaridiMob ولا في مكتب البريد، و ابعث صورة الوصل في البوت",
      "نأكدو الدفع و تاخذ رابط المجموعة الخاصة: فيها كامل التفاصيل و رابط الحصة",
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
        title: "واش هو الذكاء الإصطناعي؟",
        duration: "30 دقيقة",
        points: [
          "كيفاش تخدم أدوات الذكاء الإصطناعي كيما ChatGPT و Claude... إلخ",
          "واش يقدر يدير و واش ما يقدرش",
          "الأخطاء تاعو و كيفاش تتأكد من المعلومات لي يمدهملك",
        ],
      },
      {
        title: "كيفاش تهدر معاه: الـ prompt",
        duration: "30 دقيقة",
        points: [
          "أفضل الطرق باش تكتب prompt مليح يوصلك لأفضل نتيجة ممكنة",
          "أمثلة قبل و بعد إستعمال البرومبت",
          "تطبيق مباشر مع بعض على عدة أمثلة يومية",
        ],
      },
      {
        title: "سهّل حياتك بالذكاء الإصطناعي",
        duration: "30 دقيقة",
        points: [
          "كيفاش تستعمل الأدوات باش تسهل المهام اليومية تاعك",
          "إستعمال الأدوات في الدراسة و التحضير، في تسهيل العمل و حتى تسيير البيزنس تاعك",
          "أدوات مجانية لي تربحلك الوقت",
        ],
      },
      {
        title: "كيفاش تدخل بيه دراهم",
        duration: "30 دقيقة",
        points: ["خدمات تقدر تبيعها (كتابة، تصميم، فيديو...)", "كيفاش تلقى أول زبون", "أسئلة و أجوبة"],
      },
    ],
    // Add real attendee reviews after the first session, e.g. { name: "Amine", text: "...", rating: 5 }
    reviews: [],
    faq: [
      {
        question: "علاش الدورة مدفوعة؟",
        answer:
          "بكل شفافية هاد السعر رمزي لتغطية و تعويض الوقت و الجهد لي راني نمدوا باش نشارك معاكم هاذ المعلومات و نساعد في تطوير شباب بلادي",
      },
      {
        question: "لازم يكون عندي مستوى في الذكاء الاصطناعي؟",
        answer: "لا، التكوين للمبتدئين. إذا تعرف تستعمل التيليفون ولا PC يكفي.",
      },
      {
        question: "بأي لغة يكون التكوين؟",
        answer: "بالدارجة، و الكلمات التقنية نشرحوهم و نبسطوا أي موضوع معقد.",
      },
      {
        question: "كيفاش ندخل نهار التكوين؟",
        answer:
          "كي تسجل وتدفع تكاليف الدورة راح يوصلك رابط للدخول لقناة تليغرام اللي راح نبارطاجيو فيها كل تفاصيل الدورة.",
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
