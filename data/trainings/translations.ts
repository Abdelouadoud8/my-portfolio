import type { Training } from "@/data/types";
import type { PrefixedLocale } from "@/lib/i18n";

// English and French text of each training (key = training id). Only text lives here: sessions, seats, prices,
// the bot and links stay in trainings.ts (session dates are formatted from each session's `day`).
// A missing field falls back to the Darja text. When you edit a text in trainings.ts, update it here too.
type TrainingText = Partial<
  Pick<
    Training,
    | "title"
    | "description"
    | "time"
    | "platform"
    | "badge"
    | "price"
    | "level"
    | "audience"
    | "notFor"
    | "outcomes"
    | "requirements"
    | "registrationSteps"
    | "paymentMethods"
    | "program"
    | "faq"
  >
>;

export const trainingTranslations: Record<PrefixedLocale, Record<string, TrainingText>> = {
  en: {
    "ai-essentials": {
      title: "Learn the basics of AI with Ouadoud in 2 hours",
      description:
        "Two full hours where I teach you everything you need to know about AI: what it is, how to use it to make your life easier, and even how to earn money with it. The session is taught in Algerian Darja.",
      time: "2 hours",
      badge: "Beginner course",
      price: "Paid course",
      level: "Beginners",
      audience: [
        "Beginners who want to understand AI and use it the right way",
        "Students and workers who want to save time, and anyone who wants to earn money with it",
        "All you need is a computer or a phone with a good connection",
      ],
      notFor: [
        "You're looking for a magic way to earn money without working",
        "You already have a lot of experience with AI: this course is for beginners",
        "You want a plan made for you: the private 1:1 session suits you better",
      ],
      registrationSteps: [
        "Click “Register” on the session that suits you: our Telegram bot opens",
        "Send your name and phone number (one button)",
        "Pay with BaridiMob or at the post office, then send a photo of the receipt in the bot on Telegram",
        "Once you send the receipt photo, I confirm your registration within 24 hours after checking it, and add you to the group with all the details and the session link",
      ],
      paymentMethods: [
        {
          kind: "baridimob",
          title: "BaridiMob",
          description: "Transfer from the BaridiMob app to a CCP account",
        },
        {
          kind: "post-office",
          title: "Algérie Poste",
          description: "Cash payment at any post office, you get a receipt",
        },
      ],
      program: [
        {
          title: "What AI is, how it works and what it can do",
          points: [
            "Understand what AI is and how it works",
            "Know what it can and can't do, how to spot its mistakes and avoid them",
          ],
        },
        {
          title: "How to talk to AI tools: prompt engineering",
          points: [
            "Learn prompt engineering: how to write the best prompt to get the best possible result",
            "Live practice together on everyday examples in ChatGPT and Gemini",
            "Learn how to use Claude, ChatGPT and Gemini to make any task easier",
          ],
        },
        {
          title: "A full walkthrough of Claude Code",
          points: [
            "How to use it for all your digital tasks (viral videos, video editing, design, writing...)",
            "Learn to make the videos that go viral (fruit videos, educational videos, animation)",
            "Learn how to edit videos with AI",
          ],
        },
        {
          title: "How to earn money with AI",
          points: [
            "We go through several fields where you can earn money with AI together (digital services, content creation, design, video editing...)",
            "I share my own experience in these fields: how I started, what worked for me and what didn't, and how you can start",
          ],
        },
      ],
      faq: [
        {
          question: "Do I need to know anything about AI?",
          answer: "No, the course is for beginners. If you can use a phone or a computer, that's enough.",
        },
        {
          question: "Why are the seats limited?",
          answer:
            "Small groups give everyone a better chance to learn: you can ask as many questions as you want, everyone gets an answer and we practise together.",
        },
        {
          question: "What if I paid and can't attend?",
          answer: "No problem: we move you to the next session at no extra cost.",
        },
      ],
    },
  },
  fr: {
    "ai-essentials": {
      title: "Apprends les bases de l'IA avec Ouadoud en 2 heures",
      description:
        "Deux heures complètes pour t'apprendre tout ce qu'il faut savoir sur l'intelligence artificielle : ce que c'est, comment l'utiliser pour te simplifier la vie, et même comment gagner de l'argent avec. La session se déroule en darija algérienne.",
      time: "2 heures",
      badge: "Formation pour débutants",
      price: "Formation payante",
      level: "Débutants",
      audience: [
        "Les débutants qui veulent comprendre l'IA et bien l'utiliser",
        "Les étudiants et salariés qui veulent gagner du temps, et ceux qui veulent en tirer un revenu",
        "Il te faut seulement un ordinateur ou un téléphone avec une bonne connexion",
      ],
      notFor: [
        "Tu cherches une méthode miracle pour gagner de l'argent sans travailler",
        "Tu as déjà beaucoup d'expérience en IA : la formation est pour les débutants",
        "Tu veux un plan sur mesure : la session privée 1:1 te convient mieux",
      ],
      registrationSteps: [
        "Clique sur « S'inscrire » sur la session qui te convient : notre bot Telegram s'ouvre",
        "Envoie ton nom et ton numéro (un seul bouton)",
        "Paie avec BaridiMob ou à la poste, puis envoie la photo du reçu dans le bot sur Telegram",
        "Dès que tu envoies la photo du reçu, je confirme ton inscription en moins de 24 heures après l'avoir vérifié, et je t'ajoute au groupe avec tous les détails et le lien de la session",
      ],
      paymentMethods: [
        {
          kind: "baridimob",
          title: "BaridiMob",
          description: "Virement depuis l'application BaridiMob vers un compte CCP",
        },
        {
          kind: "post-office",
          title: "Algérie Poste",
          description: "Paiement en espèces dans n'importe quel bureau de poste, avec un reçu",
        },
      ],
      program: [
        {
          title: "C'est quoi l'IA, comment elle fonctionne et ce qu'elle peut faire",
          points: [
            "Comprendre ce qu'est l'IA et comment elle fonctionne",
            "Savoir ce qu'elle peut faire ou non, repérer ses erreurs et les éviter",
          ],
        },
        {
          title: "Comment parler aux outils d'IA : le prompt engineering",
          points: [
            "Apprendre le prompt engineering : écrire le meilleur prompt pour obtenir le meilleur résultat possible",
            "Pratique en direct ensemble sur des exemples du quotidien dans ChatGPT et Gemini",
            "Apprendre à utiliser Claude, ChatGPT et Gemini pour te faciliter n'importe quelle tâche",
          ],
        },
        {
          title: "Claude Code expliqué de A à Z",
          points: [
            "Comment l'utiliser pour toutes tes tâches numériques (vidéos virales, montage vidéo, design, rédaction...)",
            "Apprendre à faire les vidéos qui cartonnent (vidéos de fruits, éducatives, animation)",
            "Apprendre à faire du montage vidéo avec l'IA",
          ],
        },
        {
          title: "Comment gagner de l'argent avec l'IA",
          points: [
            "On voit ensemble plusieurs domaines où tu peux gagner de l'argent grâce à l'IA (services numériques, création de contenu, design, montage vidéo...)",
            "Je te partage mon expérience dans ces domaines : comment j'ai commencé, ce qui a marché pour moi et ce qui n'a pas marché, et comment toi tu peux te lancer",
          ],
        },
      ],
      faq: [
        {
          question: "Faut-il un niveau en IA ?",
          answer:
            "Non, la formation est pour les débutants. Si tu sais utiliser un téléphone ou un ordinateur, ça suffit.",
        },
        {
          question: "Pourquoi les places sont limitées ?",
          answer:
            "Les petits groupes donnent à chacun plus de chances d'apprendre : tu poses toutes tes questions, tout le monde a une réponse et on pratique ensemble.",
        },
        {
          question: "Et si j'ai payé mais je ne peux pas venir ?",
          answer: "Pas de souci : on te place sur la session suivante, sans payer à nouveau.",
        },
      ],
    },
  },
};
