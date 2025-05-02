import { Project } from "./types";

export const projects: Project[] = [
  {
    id: "1",
    role: "UI/UX designer",
    title: "Medicol mobile UI kit",
    subtitle: "Control your medical life & health from your home",
    description:
      "Medicol is a mobile application dedicated to all users that want to control their medical life including their medical folders, appointments with doctors, access to all pharmacies and also a space for exchange with doctors and people. If you are a dad or a mom, Medicol allows you to follow your son's vaccination and the follow-up with his doctor",
    coverUrl: "/img/projects/medicol/1.png",
    slug: "medicol",
    topics: [
      { title: "Date", content: "May - Juin 2021" },
      { title: "Role", content: "UI/UX designer" },
      { title: "Agency", content: "Medicol SAS" },
      {
        title: "Deliverables",
        content:
          "Mobile UI kit, customizable components, pre-made layouts, figma source file.",
      },
    ],
    sections: [
      {
        id: "1",
        title: "The Challenge",
        subtitle: "Why we did this UI kit?",
        description:
          "There are thousands of new medical applications and the number is increasing everyday, there lot of developers and designers that need a creative and attractive design with a good UX, but they don't have enough time to make a design from scratch, here our UI kit comes to help with various components, screens and layouts.",
        images: ["/img/projects/medicol/2.png"],
      },
      {
        id: "2",
        title: "The sollution",
        subtitle: "How we resolved the problem?",
        description:
          "This UI kit helps the designers to get a modern design in a short time by providing more than 50 pre-made components, +36 customisable screens and also a high organized layouts.",
        images: [
          "/img/projects/medicol/3.png",
          "/img/projects/medicol/4.png",
          "/img/projects/medicol/5.png",
        ],
      },
      {
        id: "3",
        title: "UI screens & parts",
        subtitle: "What does the UI kit includes?",
        description:
          "The UI kit includes 6 main parts organized -welcome and authentification-, -Doctors, appointments & pharmacies-, -Medical folder-, -chat-, -BLog & discussion space-, -Fitness & body-, all parts are high organized and consistent by providing various choices with quality design.",
        images: ["/img/projects/medicol/7.png", "/img/projects/medicol/8.png"],
      },
    ],
    quote: {
      author: "Martin LeBlanc",
      description:
        "A user interface is like a joke. If you have to explain it, it’s not that good.",
    },
  },
  {
    id: "2",
    role: "UI/UX designer",
    title: "Momyz mobile application",
    subtitle: "Order your gift and send it anywhere with one click",
    description:
      "Momyz is a set of applications made to link the stores, delivery and clients together in one service, it businesses to manage their stores, products and sales. It also facilitate the work of delivery men with guaranteed service. It is also destinated for user, who want to purchase prizes of gifts and send it someone with just an online service.",
    coverUrl: "/img/projects/momyz/1.png",
    slug: "momyz",
    topics: [
      { title: "Date", content: "March - April 2022" },
      { title: "Role", content: "UI/UX designer" },
      { title: "Agency", content: "HoskaDev company" },
      {
        title: "Deliverables",
        content:
          "Mobile UI design, iPhone 11 Pro mockups, complete prototype and figma source file.",
      },
    ],
    sections: [
      {
        id: "1",
        title: "About the project",
        subtitle: "Applications overview",
        description:
          "Momyz is a project composed of 3 mobile applications related to perform a specific service, all 3 applications have a similar UX to help multiple users adapt with them, whether you are a store owner, a delivery man or a client, we found solutions for your problems, below you will find common problems and the solution we found for each problem.",
        images: ["/img/projects/momyz/2.png"],
      },
      {
        id: "2",
        title: "Steps",
        subtitle: "Design process",
        description:
          "During the design of 3 applications, we performed many steps [Scope definition - UX research - User flow - Wireframing - UI Design - Design system - prototyping - Usability testing - Design updates] to get a final product that satisfies our clients and complies with our end user standars and criteria.",
        images: ["/img/projects/momyz/3.png"],
      },
      {
        id: "3",
        title: "Users workflow",
        subtitle: "Flow Chart",
        description:
          "Since the applications are destinated to multiple users audience, we had to divide each application with its flow chart to determine functionnalities, screens and realtions between them, here you will finnd an overview for -Store application- flow chart.",
        images: ["/img/projects/momyz/4.png"],
      },
      {
        id: "4",
        title: "Wireframing",
        subtitle: "What to do before design?",
        description:
          "After finishing our UX research and User Flow, we started the wireframe to determine the structure of our screens, the items places and how to organize and keep consistency throw the pages, the wireframing part is just to show a general and minimal idea about the project before the design phase.",
        images: ["/img/projects/momyz/5.png"],
      },
      {
        id: "5",
        title: "Graphic chart",
        subtitle: "What about colors & font?",
        description:
          "The application idea is gifts, so it is all about joy, love and kindness, for this we choosed the pink as our main color as it describes love and kindness and also gives the idea of sharing for users. We also used the Gilroy font, a flexible font to give more flexibility and joy to our user experience. We used the same colors and font for all 3 applciations to keep the consistency and also the branding.",
        images: ["/img/projects/momyz/6.png"],
      },
      {
        id: "6",
        title: "User Interface Design",
        subtitle: "UI Screens & parts",
        description:
          "Here you will find some parts of the design of each application, you will notice that we made our best to keep consistency between applications by applying the same design style with same graphic chart.",
        images: ["/img/projects/momyz/7.png"],
      },
      {
        id: "7",
        title: "Design system",
        subtitle: "What about components?",
        description:
          "To facilitate our work and make it easier to collaborate, we started by implementing a design system including all important components, after finishing design we added some additional components, here you will find an overview with some components from our design system.",
        images: ["/img/projects/momyz/8.png"],
      },
    ],
    quote: {
      author: "Paula Scher",
      description:
        "It's through mistakes that you actually can grow. You have to get bad in order to get good.",
    },
  },
  {
    id: "3",
    role: "UI/UX designer",
    title: "Medecin Quiz Web App",
    subtitle: "Revise your lessons, try exams and rock your studies",
    description:
      "Medecin Quiz is a web application dedicated for dental students, it contains all years modules including lectures and exams which allows student to revise and prepare their exams, the plateform provide an essaie version before paying to unlock all exams and content.",
    coverUrl: "/img/projects/medecin-quiz/1.png",
    slug: "medecin-quiz",
    topics: [
      { title: "Date", content: "December 2021 - January 2022" },
      { title: "Agency", content: "Blue Dental Clinic" },
      { title: "Role", content: "UI/UX designer" },
      {
        title: "Deliverable",
        content: "Web UI design, complete prototype and figma source file.",
      },
    ],
    sections: [
      {
        id: "1",
        title: "The Challenge",
        subtitle: "Why we did this work?",
        description:
          "The company offers an educational system and she decided to automate it by creating a solution that allows student to revise or even test their capacities before the real exam and always keep track of their progress, and here our web app comes as a solution!",
        images: ["/img/projects/medecin-quiz/1.png"],
      },
      {
        id: "2",
        title: "Graphic chart",
        subtitle: "What about fonts? colors?",
        description:
          "Colors used are some fresh colors that goes with the dental environment with the white, and that helps student concentrate while scrolling in our plateform. For the fonts, we used mainly the poppins font.",
        images: ["/img/projects/medecin-quiz/2.png"],
      },
      {
        id: "3",
        title: "Landing Page",
        subtitle: "A modern minimalist landing page",
        description:
          "The landing page has been designed to attract the student, showcase what the website offers, multiple modules included, pricing, some clients testimonials, FAQ and most important why to choose us!",
        images: ["/img/projects/medecin-quiz/3.png"],
      },
      {
        id: "4",
        title: "Login / Sign up",
        subtitle: "A modern & simple login",
        description:
          "The user has the ability to sign in and sign up to his account and also to reset his password.",
        images: [
          "/img/projects/medecin-quiz/3_1.png",
          "/img/projects/medecin-quiz/3_2.png",
        ],
      },
      {
        id: "5",
        title: "Logged in",
        subtitle: "User workflow",
        description:
          "The user has a simple and main workflow for both revision and exams, he either start by choosing a year, then a module then a semester and finaly ends up with the exam/lesson lists, or he can access directly if he has already marked the exam/lesson in favoris. There are two kinds of questions, QCM and long questions, by finishing all questions student will get the result of his session with all previous answers.",
        images: [
          "/img/projects/medecin-quiz/4.png",
          "/img/projects/medecin-quiz/5.png",
          "/img/projects/medecin-quiz/6.png",
          "/img/projects/medecin-quiz/7.png",
          "/img/projects/medecin-quiz/8.png",
          "/img/projects/medecin-quiz/9.png",
          "/img/projects/medecin-quiz/11.png",
          "/img/projects/medecin-quiz/12.png",
          "/img/projects/medecin-quiz/10.png",
        ],
      },
    ],
    quote: {
      author: "Antoine de Saint-Exupéry",
      description:
        "A designer knows he has achieved perfection not when there is nothing left to add, but when there is nothing left to take away.",
    },
  },
  {
    id: "4",
    role: "UI/UX Designer",
    title: "To Do App",
    subtitle: "Simplest way to track & control all your daily tasks in one app",
    description:
      "We all have a busy day from work to shopping to home obligations, managing all these stuff together without forgetting any task is way too hard to maintain, the best solution is TODO lists! but with the advancement of the world and technology it is not practicle to take a book or a list with you everywhere!! Here where our todo app comes! In this research we will take a deep look on our users needs and best solutions we can provide, let’s roll into it!",
    coverUrl: "/img/projects/todo-app/1.png",
    slug: "todo-app",
    topics: [
      { title: "Date", content: "June 2022" },
      { title: "Platforms", content: "Web & mobile design" },
      { title: "Role", content: "UI/UX Designer" },
      {
        title: "Company",
        content: "Lasting Dynamics",
      },
    ],
    sections: [
      {
        id: "1",
        title: "The Challenge",
        subtitle: "Why we did this work?",
        description:
          "This to do app is a part from my training at the Lasting Dynamics academy before joining the team, this was my final task to conduct a complete UX research followed by the UI design of a to do application. The task was guided by some guidlines and requirements that should be respected",
        images: ["/img/projects/todo-app/1.png"],
      },
      {
        id: "2",
        title: "User persona",
        subtitle: "Our user persona",
        description:
          "To better understand our user persona and requirement and identify our enduser, we created a user persona that includes a bio, psychographics and a user story to identify our main functionalities and get out with an end goal",
        images: ["/img/projects/todo-app/2.png"],
      },
      {
        id: "3",
        title: "UX Research",
        subtitle: "A detailed UX research about product",
        description:
          "To better identify our functionalities, a detailed UX research has been made including our user problems, goals and the common points and we get with some possible solution. After brainstorming we selected the best solution to implement. We also studied the market and our competitors, the strengths and weaknesses to better improve our user experience in our application.",
        images: ["/img/projects/todo-app/3.png"],
      },
      {
        id: "4",
        title: "User workflow",
        subtitle: "Flow chart",
        description:
          "Our mobile and web applications have different user workflows, we focused more on the mobile application since it is the main platform for our enduser, it has a simple main flow that facilitate as much as possible our main goal which creating tasks and tracking them, in addition we added a focus mode to allow users to focus while doing a task.",
        images: ["/img/projects/todo-app/4.png"],
      },
      {
        id: "5",
        title: "Graphic chart",
        subtitle: "Colors & typography",
        description:
          "For colors, we used mainly a dark purple combined with a black, in addition to this we used a light color for background and a gray for most typo and content. For typography we used Gilroy font by creating both Web & mobile styles with more than 4 different weights used.",
        images: ["/img/projects/todo-app/5.png"],
      },
      {
        id: "6",
        title: "Wireframes",
        subtitle: "Low fidelity mockups",
        description:
          "After finishing our UX research and User Flow, we started the wireframe phase to determine the structure of our screens, the items places and how to organize and keep consistency throw the pages, the wireframing part is just to show a low fidelity mockups to give an idea about the design before the UI phase.",
        images: ["/img/projects/todo-app/6.png"],
      },
      {
        id: "7",
        title: "User Interface Design",
        subtitle: "Let's talk about UI now",
        description:
          "After finishing the wireframes and the approval from the team, we start implementing these screens and turning them to high fidelity mockups that will be presented for the final review, the application includ both mobile and web versions",
        images: ["/img/projects/todo-app/7.png"],
      },
      {
        id: "8",
        title: "Reusable components",
        subtitle: "What about design components",
        description:
          "To facilitate work and make it easier for future changes and improvements, and in additional to our general design system, we created some reusable local components that we used in both mobile and web versions, below you will find an overview of some of these components.",
        images: ["/img/projects/todo-app/8.png"],
      },
    ],
    quote: {
      author: "Paul Rand",
      description:
        "Simplicity is not the goal. It is the by-product of a good idea and modest expectations.",
    },
  },
  {
    id: "5",
    role: "UI/UX Designer",
    title: "Said Etudes web app",
    subtitle: "The easiest way to get your studies visa abroad.",
    description:
      "This web application is made to help a company specialized in getting visa and help students get accpeted in other countries, by facilitating the process to the very low level and manage complicated applications.",
    coverUrl: "/img/projects/said-etudes/1.png",
    slug: "said-etudes",
    topics: [
      { title: "Date", content: "December 2021 - January 2022" },
      { title: "Client", content: "Said Travel" },
      { title: "Role", content: "UI/UX Designer" },
      {
        title: "Deliverable",
        content: "Web application UI and complete prototype.",
      },
    ],
    sections: [
      {
        id: "1",
        title: "The Challenge",
        subtitle: "Why we did this work?",
        description:
          "After making a huge success, the company decided to change from social media and automate their work system, since managing clients throw social media is not such a professional way, this is why we made this plateform where all agents can work together and also company can keep track of all process between students and agents and also process of application of students alone.",
        images: ["/img/projects/said-etudes/1.png"],
      },
      {
        id: "2",
        title: "Graphic chart",
        subtitle: "What about fonts? colors?",
        description:
          "Colors used are some fresh colors that goes with students rang age and gives a sence of confidence and trust. For the typography, we used a usual font poppins combined with some Inter.",
        images: ["/img/projects/said-etudes/2.png"],
      },
      {
        id: "3",
        title: "Landing Page",
        subtitle: "A modern minimalist landing page",
        description:
          " The landing page has been designed to attract the student, showcase what the website offers, multiple destinations and programs included, pricing, some clients testimonials and also an explanation video.",
        images: ["/img/projects/said-etudes/3.png"],
      },
      {
        id: "4",
        title: "General view - before login",
        subtitle: "Giving more options for user",
        description:
          "In this part, any user even without an account can get more information about the company, to get their trust and insure credibility in addition to multiple ways of contact in case of need for more help.",
        images: [
          "/img/projects/said-etudes/4.png",
          "/img/projects/said-etudes/5.png",
        ],
      },
      {
        id: "5",
        title: "Login / Sign up",
        subtitle: "A modern & simple login",
        description:
          "The user has the ability to sign in and sign up to his account and also to reset his password.",
        images: [
          "/img/projects/said-etudes/6.png",
          "/img/projects/said-etudes/7.png",
        ],
      },
      {
        id: "6",
        title: "Logged in",
        subtitle: "User Side Workflow",
        description:
          "The design include both user and admin side, in the next section, we will present the user side workflow including the mail functionnalities and path to follow to finish the basic tasks. Main goal of the user is to login, find a program and apply for it, after finishing the payment, the user will have a chat support from the agent until finishing all application process.",
        images: [
          "/img/projects/said-etudes/8.png",
          "/img/projects/said-etudes/9.png",
          "/img/projects/said-etudes/10.png",
          "/img/projects/said-etudes/11.png",
          "/img/projects/said-etudes/12.png",
          "/img/projects/said-etudes/13.png",
          "/img/projects/said-etudes/14.png",
          "/img/projects/said-etudes/15.png",
        ],
      },
      {
        id: "7",
        title: "Logged in",
        subtitle: "Admin Side",
        description:
          "The admin has the ability to manage all the website by adding/editing and removing (country/unniversity/program...), manage users and also manage payments and applications. After submitting an application with successful payment the agent will take care of the rest of the process and keep the student updated.",
        images: [
          "/img/projects/said-etudes/16.png",
          "/img/projects/said-etudes/17.png",
          "/img/projects/said-etudes/18.png",
          "/img/projects/said-etudes/19.png",
          "/img/projects/said-etudes/20.png",
          "/img/projects/said-etudes/21.png",
          "/img/projects/said-etudes/22.png",
        ],
      },
    ],
    quote: {
      author: "Lindo Leader",
      description:
        "I strive for two things in design: simplicity and clarity. Great design is born of those two things.",
    },
  },
  {
    id: "6",
    role: "UI/UX Designer",
    title: "smart-trans Mobile app",
    subtitle: "Complete your transactions in seconds with one click!",
    description:
      "smart-trans is a mobile application made a special big banking company to manage all their transactions between their offices around the world and automate all their system.",
    coverUrl: "/img/projects/smart-trans/1.png",
    slug: "smart-trans",
    topics: [
      { title: "Date", content: "October - December 2021" },
      { title: "Agency", content: "HoskaDev company" },
      { title: "Role", content: "UI/UX Designer" },
      {
        title: "Deliverable",
        content:
          "Mobile UI design, iPhone 11 Pro mockups, complete prototype and figma source file.",
      },
    ],
    sections: [
      {
        id: "1",
        title: "The Challenge",
        subtitle: "Why we did this work?",
        description:
          "This mobile app is made for a big banking company that has been using papers and cash money for so long and decided to automate their system by automating the transactions, reports and customer support and here smart-trans comes as the solution with complete banking system management customized regarding the company's needs. The company is based in middle east, so the application was designed in two different languages, both arabic and english.",
        images: ["/img/projects/smart-trans/1.png"],
      },
      {
        id: "2",
        title: "Graphic chart",
        subtitle: "What about fonts? colors?",
        description:
          "The colors are choosed regarding the company's identity and logos to keep consistancy and branding. For the typography, for the english version we used the Poppins and for the arabic the choice was on IBM Plex Sans Arabic.",
        images: ["/img/projects/smart-trans/2.png"],
      },
      {
        id: "3",
        title: "UI/UX design & screens",
        subtitle: "A modern minimalist UI",
        description:
          "The application UI was inspired from PAYSERA mobile app, In general, the app consists on banking transactions and exchanges by offering 6 main functionnalities between offices and also between customers (deposit, withdrawal, remittances, reports, currency exchange and inventory), and here we can see each part in details.",
        images: [
          "/img/projects/smart-trans/3.png",
          "/img/projects/smart-trans/4.png",
          "/img/projects/smart-trans/5.png",
          "/img/projects/smart-trans/6.png",
          "/img/projects/smart-trans/7.png",
        ],
      },
    ],
    quote: {
      author: "Andrew Grove",
      description:
        "How well we communicate is determined not by how well we say things, but how well we are understood.",
    },
  },
  {
    id: "7",
    role: "UI/UX Designer",
    title: "Social Media Application",
    subtitle: "Expend your network, make new relations",
    description:
      "A social media application that helps people make new relations with people and extend their network with a cool theme that help the user having a funny and relaxinng experience.",
    coverUrl: "/img/projects/social-media-app/1.png",
    slug: "social-media-app",
    topics: [
      { title: "Date", content: "April 2021" },
      { title: "Role", content: "UI/UX Designer" },
      {
        title: "Plateforms",
        content: "Destinated for mobile - android & iOS -",
      },
      {
        title: "Deliverable",
        content:
          "Mobile app design, iPhone 11 Pro mockups, Wireframes, prototype, figma source file.",
      },
    ],
    sections: [
      {
        id: "1",
        title: "The Challenge",
        subtitle: "Why we did this work?",
        description:
          "The client was searching for a solution to make people interact more with others and push them to make new friendships, know new people and the most important is enjoying their time while doing thi. In another side, the solution has to be made in a modern way that attract people and gives an idea about the daily improvement of the world.",
        images: ["/img/projects/social-media-app/1.png"],
      },
      {
        id: "2",
        title: "Graphic chart",
        subtitle: "What about fonts? colors?",
        description:
          "For our colors, we used fresh modern colors that sends the idea of joy and love, the design includes both light and dark versions, the colors choice was completely based on the idea of giving the user the sense of love and more emotions that impacts him and help spreading love among people.",
        images: [
          "/img/projects/social-media-app/5.png",
          "/img/projects/social-media-app/6.png",
        ],
      },
      {
        id: "3",
        title: "UI screens & parts",
        subtitle: "What does the work includes?",
        description:
          "As mentioned before the application is available in both light & dark modes, by openinng it you will face a simple login and sigup pages, after signing up you will get into the home page where you can find people, like them and share your interests, the profiles are displayed in an attractive way that allows users to know others, like them and even contacting them throw a chat section, the user has the ability to edit and customize their profiles.",
        images: [
          "/img/projects/social-media-app/2.png",
          "/img/projects/social-media-app/3.png",
          "/img/projects/social-media-app/4.png",
          "/img/projects/social-media-app/6.png",
          "/img/projects/social-media-app/7.png",
          "/img/projects/social-media-app/8.png",
        ],
      },
    ],
    quote: {
      author: " Naoto Fukasawa",
      description:
        "Design needs to be plugged into human behavior. Design dissolves in behavior.",
    },
  },
  {
    id: "8",
    role: "UI/UX Designer",
    title: "Beach & Snow Volleyball",
    subtitle: "A fresh re-design for french beach & snow volleyball website",
    description:
      "A website related with a mobile application for a new fresh design of the official french beach & snow volley website, this was a design for a client participating in a competition for the best re-design for the website, and hopefully the client was completely satisfied and that helped him win the prize.",
    coverUrl: "/img/projects/beach-snow-volleyball/1.png",
    slug: "beach-snow-volleyball",
    topics: [
      { title: "Date", content: "July - August 2020" },
      { title: "Platforms", content: "Both web and mobile" },
      { title: "Role", content: "UI/UX Designer" },
      {
        title: "Deliverable",
        content:
          "Web app design, mobile app design, iPhone 11 Pro mockups, Wireframes, prototype, figma source file.",
      },
    ],
    sections: [
      {
        id: "1",
        title: "The Challenge",
        subtitle: "Why we did this work?",
        description:
          "My client was participating in a competition for the best re-design of the official french beach & snow volleyball website, he asked me to do the work following the same graphic chart. The main vision is to make a modern and clean website and reinforce it with a mobile application containing pretty much the same content.",
        images: ["/img/projects/beach-snow-volleyball/1.png"],
      },
      {
        id: "2",
        title: "Graphic chart",
        subtitle: "What about fonts? colors?",
        description:
          "We used the same font and colors for both mobile and web versions to keep the consistency of course, for the font we used a mix of the Inter and Sarala nter and for their decoration that goes with the theme and their consistency together, for the colors, they were provided by the client regarding the colors of the old website design.",
        images: ["/img/projects/beach-snow-volleyball/2.png"],
      },
      {
        id: "3",
        title: "UI screens & parts",
        subtitle: "What does the work includes?",
        description:
          "The work includes generally all the information and actuality about both beach & snow volleyball including tournaments, leagues, players, media and even a shop section, every section is detailled for ex. every player with all his statistics, each leagues with ranking and tables...",
        images: [
          "/img/projects/beach-snow-volleyball/3.png",
          "/img/projects/beach-snow-volleyball/4.png",
          "/img/projects/beach-snow-volleyball/5.png",
          "/img/projects/beach-snow-volleyball/6.png",
          "/img/projects/beach-snow-volleyball/7.png",
        ],
      },
    ],
    quote: {
      author: "Steve Jobs",
      description:
        "Design is not just what it looks like and feels like. Design is how it works.",
    },
  },
  {
    id: "9",
    role: "UI/UX Designer",
    title: "Gaming Package & stream Website",
    subtitle: "Get your best game packages and live the streaming",
    description:
      "A website destinated to gamers and people interested in gaming & streaming packages allows the user to purchase their favorite game's packages with a marketplace full of customizable packages and components related with games & streaming modes .",
    coverUrl: "/img/projects/gaming-packages/1.png",
    slug: "gaming-packages",
    topics: [
      { title: "Date", content: "April 2021" },
      { title: "Platforms", content: "Web design" },
      { title: "Role", content: "UI/UX Designer" },
      {
        title: "Deliverable",
        content: "Web app design, Wireframes, prototype, figma source file.",
      },
    ],
    sections: [
      {
        id: "1",
        title: "The Challenge",
        subtitle: "Why we did this work?",
        description:
          "The client was searching for a solution to upload customizable and pre-made packages for multiple use (gaming, streaming...), attracting more gamers to purchase them by providing a simple marketplace that showcase all products.",
        images: ["/img/projects/gaming-packages/1.png"],
      },
      {
        id: "2",
        title: "Graphic chart",
        subtitle: "What about fonts? colors?",
        description:
          "For our colors, we used a fresh yellow combined with a dark-gray as main colors, and a light blue as secondary color. The colors areinspired for giving the idea of joy and activity. For the fonts, we combined the Inter and Sarala fonts to put some consistency.",
        images: ["/img/projects/gaming-packages/2.png"],
      },
      {
        id: "3",
        title: "UI screens & parts",
        subtitle: "What does the work includes?",
        description:
          "The work includes a landing page with multiples sections to showcase the companies services and also attract the user's to their products, it also includes a marketplace for showcasinng products and a page for each product details and orders.",
        images: [
          "/img/projects/gaming-packages/3.png",
          "/img/projects/gaming-packages/4.png",
          "/img/projects/gaming-packages/5.png",
        ],
      },
    ],
    quote: {
      author: "Paul Rand",
      description:
        "Simplicity is not the goal. It is the by-product of a good idea and modest expectations.",
    },
  },
];
