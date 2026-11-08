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
      outcomes: [
        "Understand what AI is and how it works behind the scenes, in simple words",
        "Know what it can and can't do, how to spot its mistakes and avoid them",
        "Learn prompt engineering: how to write the best prompt to get the best possible result with as few tokens as possible",
        "Learn how to use AI tools like Claude, ChatGPT and Gemini for your studies, your job or to grow your business",
        "Learn what agents are and how to use them to automate any complex or repetitive task, so an agent does it for you",
        "Discover services you can sell with AI and how to start: graphic design, social media management and many other digital services",
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
          title: "What is AI?",
          duration: "30 min",
          points: [
            "How AI tools like ChatGPT and Claude work",
            "What it can and can't do",
            "Its mistakes and how to check the information it gives you",
          ],
        },
        {
          title: "How to talk to it: prompt engineering",
          duration: "30 min",
          points: [
            "The best ways to write a good prompt that gets the best possible result with as few tokens as possible",
            "Examples before and after using the prompt",
            "Live practice together on everyday examples in ChatGPT and Gemini",
          ],
        },
        {
          title: "Make your life easier with agents and automations",
          duration: "30 min",
          points: [
            "A full, simple explanation of agents and how they work",
            "How to use agents to finish repetitive or complex tasks",
            "Live practice with several examples in Claude Code and Cowork",
          ],
        },
        {
          title: "How to earn money with it",
          duration: "30 min",
          points: [
            "The best AI tools for each field",
            "Services you can sell (writing, design, video...)",
            "How to find your first client",
            "Questions and answers",
          ],
        },
      ],
      faq: [
        {
          question: "Course price",
          answer:
            "The course has a symbolic price that covers the time and effort it takes me to prepare the session in the best conditions, so I can share this knowledge with you and help young people in my country grow.",
        },
        {
          question: "Do I need to know anything about AI?",
          answer: "No, the course is for beginners. If you can use a phone or a computer, that's enough.",
        },
        {
          question: "What language is the course in?",
          answer: "Algerian Darja. Technical words are explained and every complex topic is made simple.",
        },
        {
          question: "How do I join on the day?",
          answer:
            "Once you register and pay, you get a link to a Telegram channel where we share all the course details.",
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
      outcomes: [
        "Comprendre ce qu'est l'IA et comment elle fonctionne en coulisses, simplement",
        "Savoir ce qu'elle peut faire ou non, repérer ses erreurs et les éviter",
        "Apprendre le prompt engineering : écrire le meilleur prompt pour obtenir le meilleur résultat possible avec le moins de tokens possible",
        "Apprendre à utiliser les outils d'IA comme Claude, ChatGPT et Gemini pour tes études, ton travail ou pour développer ton business",
        "Découvrir les agents et comment les utiliser pour automatiser n'importe quelle tâche complexe ou répétitive, pour qu'un agent la fasse à ta place",
        "Découvrir des services que tu peux vendre grâce à l'IA et comment te lancer : graphisme, gestion des réseaux sociaux et beaucoup d'autres services numériques",
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
          title: "C'est quoi l'IA ?",
          duration: "30 min",
          points: [
            "Comment fonctionnent les outils d'IA comme ChatGPT et Claude",
            "Ce qu'elle peut faire et ce qu'elle ne peut pas faire",
            "Ses erreurs et comment vérifier les informations qu'elle te donne",
          ],
        },
        {
          title: "Comment lui parler : le prompt engineering",
          duration: "30 min",
          points: [
            "Les meilleures façons d'écrire un bon prompt pour obtenir le meilleur résultat possible avec le moins de tokens possible",
            "Des exemples avant et après le prompt",
            "Pratique en direct ensemble sur des exemples du quotidien dans ChatGPT et Gemini",
          ],
        },
        {
          title: "Simplifie-toi la vie avec les agents et les automatisations",
          duration: "30 min",
          points: [
            "Une explication complète et simple des agents et de leur fonctionnement",
            "Comment utiliser des agents pour accomplir les tâches répétitives ou complexes",
            "Pratique en direct avec plusieurs exemples sur Claude Code et Cowork",
          ],
        },
        {
          title: "Gagner de l'argent avec",
          duration: "30 min",
          points: [
            "Les meilleurs outils d'IA pour chaque domaine",
            "Des services que tu peux vendre (rédaction, design, vidéo...)",
            "Comment trouver ton premier client",
            "Questions et réponses",
          ],
        },
      ],
      faq: [
        {
          question: "Prix de la formation",
          answer:
            "La formation a un prix symbolique qui couvre le temps et l'effort nécessaires pour préparer la session dans les meilleures conditions, afin de partager ces connaissances avec vous et d'aider les jeunes de mon pays à progresser.",
        },
        {
          question: "Faut-il un niveau en IA ?",
          answer:
            "Non, la formation est pour les débutants. Si tu sais utiliser un téléphone ou un ordinateur, ça suffit.",
        },
        {
          question: "La formation est en quelle langue ?",
          answer:
            "En darija algérienne. Les mots techniques sont expliqués et chaque sujet complexe est simplifié.",
        },
        {
          question: "Comment je rejoins la session le jour J ?",
          answer:
            "Une fois inscrit et le paiement fait, tu reçois le lien d'un canal Telegram où on partage tous les détails de la formation.",
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
