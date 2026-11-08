import type { Service } from "@/data/types";
import type { PrefixedLocale } from "@/lib/i18n";

// English and French text of each service (key = service id). Links and ids stay in services.ts.
// A missing field falls back to the Darja text. When you edit a text in services.ts, update it here too.
type ServiceText = Partial<Omit<Service, "id" | "requestHref">>;

export const serviceTranslations: Record<PrefixedLocale, Record<string, ServiceText>> = {
  en: {
    "one-to-one": {
      badge: "1:1",
      cardTitle: "Private 1:1 session",
      cardDescription:
        "Have a clear goal? We work on it, just you and me, and you leave with a written plan.",
      title: "Private 1:1 session: an AI plan made for you",
      description:
        "A private video call, just you and me. We look at your studies, your job or your business, and you leave with a written plan: which tools to use, how to use them, and where to start.",
      price: "4900 DA",
      priceNote: "per session",
      duration: "45 minutes",
      facts: [
        { label: "Length", value: "45 minutes", icon: "clock" },
        { label: "Where", value: "Google Meet", icon: "video" },
        { label: "Who's there", value: "Just you and me", icon: "user" },
        { label: "You leave with", value: "A written plan", icon: "file" },
      ],
      includedTitle: "What you get",
      included: [
        "I read about your situation before the call so we don't waste time",
        "A written plan after the call: the tools, the steps and their order",
        "Ready-to-use prompt examples made for your work",
        "You can send me your questions on Telegram after the session",
      ],
      steps: [
        "Message me on Telegram: who you are and what you want to work on. Asking is free.",
        "I answer within 48 hours. If I can't help with your case, I'll tell you honestly.",
        "If we agree, I send you the payment details (BaridiMob or Algérie Poste).",
        "You send a photo of the receipt and I confirm within 24 hours.",
        "You pick a time that suits you and we meet on Google Meet.",
      ],
      forWho: [
        "You have a clear goal (studies, work, a project) and want to use AI for it",
        "Student, employee, freelancer or small business owner",
        "You want a plan made for you, not general advice",
      ],
      notFor: [
        "You want someone to do the work for you",
        "You're looking for a magic fix or a guaranteed result",
        "You want to learn the basics from scratch: the group course suits you better",
      ],
      honestNote:
        "This is paid personal help, not a shortcut. A lot of this information is free online and from people with more experience than me. What you pay for is my time and attention: I study your case, prepare, and work on it with you. Don't pay if the price puts you under pressure.",
      faq: [
        {
          question: "What if the session doesn't help me?",
          answer: "If you leave without a clear view of your next steps, tell me and I'll refund you.",
        },
        {
          question: "What's the difference with the course?",
          answer:
            "The course is a group session that teaches the basics. The private session is only for you: we work on your exact case and you leave with a written plan.",
        },
        {
          question: "Can the session be in French or English?",
          answer: "Yes, we can talk in Darja, French or English.",
        },
      ],
      requestLabel: "Request a session on Telegram",
    },
    business: {
      badge: "For companies",
      cardTitle: "Automation and AI for companies",
      cardDescription:
        "We analyse how your company works, automate the repetitive tasks and bring AI into them.",
      title: "We analyse your company's system and bring AI into it",
      description:
        "We look at how your company works today (tools, files, team), find the tasks that eat time and repeat every day, and propose how to automate them and bring AI into them. Then we build it and train your team.",
      price: "Depends on the project",
      priceNote: "First call is free",
      duration: "30 minutes",
      facts: [
        { label: "First call", value: "30 minutes, free", icon: "clock" },
        { label: "Where", value: "Google Meet", icon: "video" },
        { label: "You get", value: "A report and a plan", icon: "file" },
        { label: "Price", value: "Depends on the project", icon: "tag" },
      ],
      includedTitle: "What we do",
      included: [
        "Analysis of your system and workflows: tools, files and how information flows in the team",
        "We identify what can be automated: invoices, customer messages, reports, data entry",
        "AI solutions: a customer assistant, document analysis, an internal assistant for the team",
        "Building it and connecting it to the tools you already use",
        "Training your team to use the new tools every day",
      ],
      steps: [
        "Free intro call (30 minutes): tell me about the company and what wastes your time.",
        "Analysis: we review the system, the tools and how the team works.",
        "Report and plan: what to automate, ranked by impact, with time and cost.",
        "Build and training: we set up the solutions and train the team on them.",
        "Follow-up: we look at the results and improve.",
      ],
      forWho: [
        "Small and medium companies, and business owners",
        "A team that loses time on repetitive tasks every day",
        "You want to use AI but don't know where to start",
      ],
      faq: [
        {
          question: "Do we need a tech team?",
          answer:
            "No. We work with the tools you already use and train your team to handle the solutions on their own.",
        },
        {
          question: "Does our company data stay confidential?",
          answer:
            "Yes. We only work with the information you give us, and we can sign an NDA before we start.",
        },
        {
          question: "How much does it cost?",
          answer:
            "It depends on the size of the company and what we automate. The first call is free, and the price is set in the report after the analysis, before you commit to anything.",
        },
      ],
      requestLabel: "Book a free call",
    },
  },
  fr: {
    "one-to-one": {
      badge: "1:1",
      cardTitle: "Session privée 1:1",
      cardDescription:
        "Tu as un objectif clair ? On y travaille, juste toi et moi, et tu repars avec un plan écrit.",
      title: "Session privée 1:1 : un plan IA sur mesure",
      description:
        "Un appel vidéo privé, juste toi et moi. On regarde tes études, ton travail ou ton business, et tu repars avec un plan écrit : quels outils utiliser, comment, et par où commencer.",
      price: "4900 DA",
      priceNote: "la session",
      duration: "45 minutes",
      facts: [
        { label: "Durée", value: "45 minutes", icon: "clock" },
        { label: "Lieu", value: "Google Meet", icon: "video" },
        { label: "Qui est là", value: "Juste toi et moi", icon: "user" },
        { label: "Tu repars avec", value: "Un plan écrit", icon: "file" },
      ],
      includedTitle: "Ce que tu obtiens",
      included: [
        "J'étudie ta situation avant l'appel pour ne pas perdre de temps",
        "Un plan écrit après l'appel : les outils, les étapes et leur ordre",
        "Des exemples de prompts prêts à l'emploi, adaptés à ton travail",
        "Tu peux m'envoyer tes questions sur Telegram après la session",
      ],
      steps: [
        "Écris-moi sur Telegram : qui tu es et sur quoi tu veux travailler. La demande est gratuite.",
        "Je te réponds en moins de 48 heures. Si je ne peux pas t'aider, je te le dis honnêtement.",
        "Si on est d'accord, je t'envoie les infos de paiement (BaridiMob ou Algérie Poste).",
        "Tu envoies la photo du reçu et je confirme en moins de 24 heures.",
        "Tu choisis le créneau qui te va et on se retrouve sur Google Meet.",
      ],
      forWho: [
        "Tu as un objectif clair (études, travail, projet) et tu veux y utiliser l'IA",
        "Étudiant, salarié, freelance ou petit entrepreneur",
        "Tu veux un plan fait pour toi, pas des conseils généraux",
      ],
      notFor: [
        "Tu veux que quelqu'un fasse le travail à ta place",
        "Tu cherches une solution miracle ou un résultat garanti",
        "Tu veux apprendre les bases de zéro : la formation de groupe te convient mieux",
      ],
      honestNote:
        "C'est une aide personnelle payante, pas un raccourci. Beaucoup de ces informations sont gratuites en ligne et auprès de personnes plus expérimentées que moi. Ce que tu paies, c'est mon temps et mon attention : j'étudie ton cas, je prépare et je travaille dessus avec toi. Ne paie pas si le prix te met en difficulté.",
      faq: [
        {
          question: "Et si la session ne m'aide pas ?",
          answer: "Si tu repars sans y voir clair sur tes prochaines étapes, dis-le-moi et je te rembourse.",
        },
        {
          question: "Quelle différence avec la formation ?",
          answer:
            "La formation est une session de groupe qui enseigne les bases. La session privée est juste pour toi : on travaille sur ton cas précis et tu repars avec un plan écrit.",
        },
        {
          question: "La session peut être en français ou en anglais ?",
          answer: "Oui, on peut parler en darija, en français ou en anglais.",
        },
      ],
      requestLabel: "Demander une session sur Telegram",
    },
    business: {
      badge: "Entreprises",
      cardTitle: "Automatisation et IA pour les entreprises",
      cardDescription:
        "On analyse le fonctionnement de ton entreprise, on automatise les tâches répétitives et on y intègre l'IA.",
      title: "On analyse le système de ton entreprise et on y intègre l'IA",
      description:
        "On regarde comment ton entreprise fonctionne aujourd'hui (outils, fichiers, équipe), on repère les tâches qui prennent du temps et se répètent chaque jour, et on propose comment les automatiser et y intégrer l'IA. Ensuite on met tout en place et on forme l'équipe.",
      price: "Selon le projet",
      priceNote: "Premier appel gratuit",
      duration: "30 minutes",
      facts: [
        { label: "Premier appel", value: "30 minutes, gratuit", icon: "clock" },
        { label: "Lieu", value: "Google Meet", icon: "video" },
        { label: "Tu obtiens", value: "Un rapport et un plan", icon: "file" },
        { label: "Prix", value: "Selon le projet", icon: "tag" },
      ],
      includedTitle: "Ce qu'on fait",
      included: [
        "Analyse du système et des processus : outils, fichiers et circulation de l'information dans l'équipe",
        "On identifie ce qui peut être automatisé : factures, messages clients, rapports, saisie de données",
        "Des solutions IA : assistant client, analyse de documents, assistant interne pour l'équipe",
        "La mise en place et la connexion avec les outils que vous utilisez déjà",
        "La formation de l'équipe pour utiliser les nouveaux outils au quotidien",
      ],
      steps: [
        "Appel découverte gratuit (30 minutes) : tu me parles de l'entreprise et de ce qui vous fait perdre du temps.",
        "Analyse : on étudie le système, les outils et la façon de travailler de l'équipe.",
        "Rapport et plan : quoi automatiser, par ordre d'impact, avec le temps et le coût.",
        "Mise en place et formation : on installe les solutions et on forme l'équipe.",
        "Suivi : on mesure les résultats et on améliore.",
      ],
      forWho: [
        "Les PME et les porteurs de projet",
        "Une équipe qui perd du temps sur des tâches répétitives chaque jour",
        "Vous voulez utiliser l'IA sans savoir par où commencer",
      ],
      faq: [
        {
          question: "Faut-il une équipe technique ?",
          answer:
            "Non. On travaille avec les outils que vous utilisez déjà et on forme l'équipe pour qu'elle gère les solutions en autonomie.",
        },
        {
          question: "Les données de l'entreprise restent confidentielles ?",
          answer:
            "Oui. On travaille uniquement avec les informations que vous nous donnez, et on peut signer un accord de confidentialité (NDA) avant de commencer.",
        },
        {
          question: "Combien ça coûte ?",
          answer:
            "Ça dépend de la taille de l'entreprise et de ce qu'on automatise. Le premier appel est gratuit, et le prix est fixé dans le rapport après l'analyse, avant tout engagement.",
        },
      ],
      requestLabel: "Réserver un appel gratuit",
    },
  },
};
