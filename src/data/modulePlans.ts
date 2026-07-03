import type { CampSlug } from "@/data/camps";

export type ModuleDay = {
  day: string;
  topic: string;
  practice?: string;
  result?: string;
};

export type ModuleWeek = {
  week: number;
  title: string;
  dates: string;
  goal: string;
  output: string;
  days: ModuleDay[];
};

export type ModulePlan = {
  tagline: string;
  moduleDuration: string;
  startTime: string;
  scheduleType: string;
  trialWeek: boolean;
  note: string;
  dailyStructure: string[];
  weeks: ModuleWeek[];
  finalThreeDays: Omit<ModuleWeek, "week" | "output">;
  technicalNote?: string;
};

const note = "Reja guruh darajasi, format va texnik imkoniyatlarga qarab moslashtirilishi mumkin.";

const dailyStructure = [
  "09:00 - Start",
  "09:00-09:15 - Recap / warm-up",
  "09:15-10:15 - Main topic",
  "10:15-10:30 - Short break",
  "10:30-11:45 - Practice / challenge",
  "11:45-12:00 - Reflection, task, next step"
];

export const modulePlans: Record<CampSlug, ModulePlan> = {
  algocamp: {
    tagline: "Python, algoritmlar va informatika olimpiadasi uchun mustahkam start.",
    moduleDuration: "45 kun / 1.5 oy",
    startTime: "09:00",
    scheduleType: "Dushanba-Shanba",
    trialWeek: true,
    note,
    dailyStructure,
    weeks: [
      {
        week: 1,
        title: "Sinov hafta: Python foundation and diagnostic",
        dates: "13-18 iyul",
        goal: "Participant level check, Python basics, logical thinking start.",
        output: "Har bir ishtirokchi sodda Python masalalarini yechadi va AlgoCamp o'ziga mosligini ko'radi.",
        days: [
          { day: "Dushanba", topic: "Orientation, diagnostic test, why algorithms matter", practice: "Simple logic questions", result: "Personal level identified" },
          { day: "Seshanba", topic: "Python setup, variables, input/output, data types", practice: "10 basic problems", result: "First working programs" },
          { day: "Chorshanba", topic: "Conditions: if/elif/else, comparison, boolean logic", practice: "Decision problems", result: "Conditional thinking" },
          { day: "Payshanba", topic: "Loops: for/while, counters, accumulators", practice: "Repetition tasks", result: "Loop logic" },
          { day: "Juma", topic: "Lists and strings basics", practice: "List/string manipulation", result: "Data sequence thinking" },
          { day: "Shanba", topic: "Trial mini-contest and review", practice: "60-90 minute beginner contest", result: "Personal roadmap" }
        ]
      },
      {
        week: 2,
        title: "Python problem-solving toolkit",
        dates: "20-25 iyul",
        goal: "Competitive tasklar uchun amaliy Python toolkit qurish.",
        output: "Ishtirokchi easy olympiad-style masalalarni mustaqil yecha boshlaydi.",
        days: [
          { day: "Dushanba", topic: "Functions, code structure, reusable logic" },
          { day: "Seshanba", topic: "Lists deeper: indexing, slicing, append, sorting basics" },
          { day: "Chorshanba", topic: "Strings deeper: parsing, character operations, split/join" },
          { day: "Payshanba", topic: "Sets and dictionaries for counting and uniqueness" },
          { day: "Juma", topic: "Math basics: divisibility, modulo, gcd idea, primes intro" },
          { day: "Shanba", topic: "Practice contest + debugging session" }
        ]
      },
      {
        week: 3,
        title: "Core algorithms",
        dates: "27 iyul-1 avgust",
        goal: "Olimpiadalarda kerak bo'ladigan asosiy algoritmlarni tanishtirish.",
        output: "Ishtirokchi faqat kodni emas, yechim yondashuvini ham tushunadi.",
        days: [
          { day: "Dushanba", topic: "Algorithmic thinking and complexity intuition" },
          { day: "Seshanba", topic: "Searching: linear search, binary search concept" },
          { day: "Chorshanba", topic: "Sorting logic and built-in sort usage" },
          { day: "Payshanba", topic: "Prefix sums and cumulative logic" },
          { day: "Juma", topic: "Two pointers / sliding window intro for simple cases" },
          { day: "Shanba", topic: "Mixed algorithm challenge" }
        ]
      },
      {
        week: 4,
        title: "Competitive programming patterns",
        dates: "3-8 avgust",
        goal: "Ko'p uchraydigan CP patternlarni amaliy mashq orqali o'rganish.",
        output: "Ishtirokchi problem type'larni taniy boshlaydi.",
        days: [
          { day: "Dushanba", topic: "Brute force and optimization" },
          { day: "Seshanba", topic: "Greedy thinking: choose the best local step" },
          { day: "Chorshanba", topic: "Recursion basics and backtracking idea" },
          { day: "Payshanba", topic: "Graph thinking intro: nodes, edges, BFS concept" },
          { day: "Juma", topic: "Implementation discipline: reading statement, edge cases" },
          { day: "Shanba", topic: "Mock contest + editorial review" }
        ]
      },
      {
        week: 5,
        title: "Olympiad preparation and advanced basics",
        dates: "10-15 avgust",
        goal: "Real contest sharoiti va qiyinroq masalalarga tayyorlanish.",
        output: "Aniqlik va contest strategiyasi kuchayadi.",
        days: [
          { day: "Dushanba", topic: "Number theory practice: gcd, lcm, primes, modulo" },
          { day: "Seshanba", topic: "Combinatorics intuition and counting tasks" },
          { day: "Chorshanba", topic: "Dynamic programming intro: state, transition, small examples" },
          { day: "Payshanba", topic: "Graph BFS/DFS practical examples" },
          { day: "Juma", topic: "Time management and test case strategy" },
          { day: "Shanba", topic: "Full practice contest" }
        ]
      },
      {
        week: 6,
        title: "Consolidation and performance",
        dates: "17-22 avgust",
        goal: "Zaif joylarni mustahkamlash va ishonchni oshirish.",
        output: "Shaxsiy CP practice roadmap shakllanadi.",
        days: [
          { day: "Dushanba", topic: "Review of weak topics from contests" },
          { day: "Seshanba", topic: "Easy-to-medium problem set" },
          { day: "Chorshanba", topic: "Pair problem-solving / explanation practice" },
          { day: "Payshanba", topic: "Common mistakes and debugging workshop" },
          { day: "Juma", topic: "Final mock contest preparation" },
          { day: "Shanba", topic: "Final mock contest" }
        ]
      }
    ],
    finalThreeDays: {
      title: "Yakuniy 3 kun",
      dates: "24-26 avgust",
      goal: "Progressni baholash va next-step roadmap berish.",
      days: [
        { day: "Dushanba", topic: "Final contest editorial and score analysis" },
        { day: "Seshanba", topic: "Individual feedback and next topics roadmap" },
        { day: "Chorshanba", topic: "Closing session, certificates/demo, next practice plan" }
      ]
    }
  },
  datacamp: {
    tagline: "Python, SQL va Power BI orqali data analytics'ga real start.",
    moduleDuration: "45 kun / 1.5 oy",
    startTime: "09:00",
    scheduleType: "Dushanba-Shanba",
    trialWeek: true,
    note,
    dailyStructure,
    weeks: [
      {
        week: 1,
        title: "Sinov hafta: Python for data foundation",
        dates: "13-18 iyul",
        goal: "Data analytics yo'nalishi va basic Python bilan tanishtirish.",
        output: "Ishtirokchi DataCamp o'ziga mosligini tushunadi va ilk kichik tahlil qiladi.",
        days: [
          { day: "Dushanba", topic: "What is Data Analytics? Real examples and diagnostic" },
          { day: "Seshanba", topic: "Python basics: variables, data types, input/output" },
          { day: "Chorshanba", topic: "Lists, dictionaries, tables mindset" },
          { day: "Payshanba", topic: "Conditions and loops for data tasks" },
          { day: "Juma", topic: "Functions and clean code basics" },
          { day: "Shanba", topic: "Mini task: analyze a small table manually and with Python basics" }
        ]
      },
      {
        week: 2,
        title: "Data handling with Python",
        dates: "20-25 iyul",
        goal: "Amaliy data manipulation asoslarini o'rganish.",
        output: "Data load, inspect, clean va summarize qilishni boshlaydi.",
        days: [
          { day: "Dushanba", topic: "CSV/data files, rows, columns, data types" },
          { day: "Seshanba", topic: "Pandas intro: DataFrame, read_csv, head, info" },
          { day: "Chorshanba", topic: "Filtering, selecting columns, sorting" },
          { day: "Payshanba", topic: "Cleaning: missing values, duplicates, text cleanup" },
          { day: "Juma", topic: "Grouping and summary statistics" },
          { day: "Shanba", topic: "Mini project: student/sales dataset summary" }
        ]
      },
      {
        week: 3,
        title: "SQL foundation",
        dates: "27 iyul-1 avgust",
        goal: "Data qanday saqlanishi va query qilinishini o'rganish.",
        output: "Basic SQL query yozadi.",
        days: [
          { day: "Dushanba", topic: "Database thinking: tables, rows, columns, keys" },
          { day: "Seshanba", topic: "SELECT, WHERE, ORDER BY, LIMIT" },
          { day: "Chorshanba", topic: "Aggregations: COUNT, SUM, AVG, GROUP BY" },
          { day: "Payshanba", topic: "JOIN basics and real examples" },
          { day: "Juma", topic: "SQL practice tasks" },
          { day: "Shanba", topic: "SQL mini challenge" }
        ]
      },
      {
        week: 4,
        title: "Power BI and dashboards",
        dates: "3-8 avgust",
        goal: "Data'ni visual va dashboardga aylantirish.",
        output: "Birinchi dashboard yaratiladi.",
        days: [
          { day: "Dushanba", topic: "Dashboard thinking and business questions" },
          { day: "Seshanba", topic: "Power BI interface, importing data" },
          { day: "Chorshanba", topic: "Charts, cards, filters, slicers" },
          { day: "Payshanba", topic: "Basic data model and relationships" },
          { day: "Juma", topic: "Dashboard design: clarity, layout, colors" },
          { day: "Shanba", topic: "Mini dashboard presentation" }
        ]
      },
      {
        week: 5,
        title: "End-to-end analytics project",
        dates: "10-15 avgust",
        goal: "Python, SQL va Power BI'ni birlashtirish.",
        output: "Full mini analytics workflow quriladi.",
        days: [
          { day: "Dushanba", topic: "Define project question and dataset" },
          { day: "Seshanba", topic: "Clean and prepare data in Python" },
          { day: "Chorshanba", topic: "Query data with SQL" },
          { day: "Payshanba", topic: "Build Power BI dashboard" },
          { day: "Juma", topic: "Insight writing: what happened, why, what to do" },
          { day: "Shanba", topic: "Project review and improvements" }
        ]
      },
      {
        week: 6,
        title: "Portfolio and real-world analytics",
        dates: "17-22 avgust",
        goal: "Presentable beginner portfolio project tayyorlash.",
        output: "Final analytics project tayyor bo'ladi.",
        days: [
          { day: "Dushanba", topic: "Case study: education/business/sales analytics" },
          { day: "Seshanba", topic: "KPI thinking and metrics" },
          { day: "Chorshanba", topic: "Data storytelling and presentation" },
          { day: "Payshanba", topic: "Dashboard polish and feedback" },
          { day: "Juma", topic: "Final project preparation" },
          { day: "Shanba", topic: "Final project presentation" }
        ]
      }
    ],
    finalThreeDays: {
      title: "Feedback and career roadmap",
      dates: "24-26 avgust",
      goal: "Har bir ishtirokchiga keyingi learning step berish.",
      days: [
        { day: "Dushanba", topic: "Final feedback and dashboard improvements" },
        { day: "Seshanba", topic: "Roadmap: Excel, SQL, Python, Power BI, portfolio" },
        { day: "Chorshanba", topic: "Closing session, certificates/demo, next project ideas" }
      ]
    }
  },
  robocamp: {
    tagline: "Bolalar uchun Scratch, robocoding va robototexnika orqali mantiq va ijod.",
    moduleDuration: "45 kun / 1.5 oy",
    startTime: "09:00",
    scheduleType: "Dushanba-Shanba",
    trialWeek: true,
    note,
    dailyStructure,
    technicalNote: "Robototexnika mashg'ulotlari mavjud texnik imkoniyatlarga qarab real qurilma yoki simulyatsiya asosida o'tiladi.",
    weeks: [
      {
        week: 1,
        title: "Sinov hafta: visual coding and logic",
        dates: "13-18 iyul",
        goal: "Bolalarni visual tasklar orqali coding bilan tanishtirish.",
        output: "Har bir ishtirokchi oddiy interactive Scratch project yaratadi.",
        days: [
          { day: "Dushanba", topic: "Camp orientation, safety, what is coding/robotics?" },
          { day: "Seshanba", topic: "Scratch interface, sprites, motion, events" },
          { day: "Chorshanba", topic: "Loops and repeated actions" },
          { day: "Payshanba", topic: "Conditions: if/else through games" },
          { day: "Juma", topic: "Variables and scores" },
          { day: "Shanba", topic: "Mini project: simple game or animation" }
        ]
      },
      {
        week: 2,
        title: "Game logic and creative coding",
        dates: "20-25 iyul",
        goal: "Projectlar orqali mantiqni kuchaytirish.",
        output: "Playable Scratch mini-game yaratiladi.",
        days: [
          { day: "Dushanba", topic: "Game design basics: goal, rules, player" },
          { day: "Seshanba", topic: "Movement controls and collision" },
          { day: "Chorshanba", topic: "Score, timer, levels" },
          { day: "Payshanba", topic: "Sounds, effects, feedback" },
          { day: "Juma", topic: "Debugging: why the project does not work" },
          { day: "Shanba", topic: "Mini-game demo day" }
        ]
      },
      {
        week: 3,
        title: "Robocoding basics",
        dates: "27 iyul-1 avgust",
        goal: "Coding logic'ni robot behavior bilan bog'lash.",
        output: "Robot commands va sequences tushuniladi.",
        days: [
          { day: "Dushanba", topic: "What is a robot? Input, process, output" },
          { day: "Seshanba", topic: "Commands, sequence, movement logic" },
          { day: "Chorshanba", topic: "Sensors concept: distance/light/touch" },
          { day: "Payshanba", topic: "Conditions with sensors" },
          { day: "Juma", topic: "Loops in robot movement" },
          { day: "Shanba", topic: "Maze or path challenge" }
        ]
      },
      {
        week: 4,
        title: "Robotics practical challenges",
        dates: "3-8 avgust",
        goal: "Physical yoki simulated robotics tasks yechish.",
        output: "Structured robot challenges bajariladi.",
        days: [
          { day: "Dushanba", topic: "Build or simulate simple robot behavior" },
          { day: "Seshanba", topic: "Obstacle avoidance logic" },
          { day: "Chorshanba", topic: "Line-following concept or path tracking" },
          { day: "Payshanba", topic: "Team challenge: robot mission planning" },
          { day: "Juma", topic: "Debugging and improving robot behavior" },
          { day: "Shanba", topic: "Robotics challenge day" }
        ]
      },
      {
        week: 5,
        title: "Team project",
        dates: "10-15 avgust",
        goal: "Team bo'lib creative robot/coding project qurish.",
        output: "Team project prototype tayyor bo'ladi.",
        days: [
          { day: "Dushanba", topic: "Choose project idea" },
          { day: "Seshanba", topic: "Divide team roles" },
          { day: "Chorshanba", topic: "Build core logic" },
          { day: "Payshanba", topic: "Add interaction and improvements" },
          { day: "Juma", topic: "Test and fix" },
          { day: "Shanba", topic: "First demo and feedback" }
        ]
      },
      {
        week: 6,
        title: "Final project and confidence",
        dates: "17-22 avgust",
        goal: "Clean final demo tayyorlash.",
        output: "Completed final project.",
        days: [
          { day: "Dushanba", topic: "Improve design and logic" },
          { day: "Seshanba", topic: "Add storytelling to project" },
          { day: "Chorshanba", topic: "Practice explaining the project" },
          { day: "Payshanba", topic: "Final debugging" },
          { day: "Juma", topic: "Demo rehearsal" },
          { day: "Shanba", topic: "Final RoboCamp demo" }
        ]
      }
    ],
    finalThreeDays: {
      title: "Showcase and next step",
      dates: "24-26 avgust",
      goal: "Learning'ni nishonlash va keyingi qadamlarni ko'rsatish.",
      days: [
        { day: "Dushanba", topic: "Feedback and project improvement" },
        { day: "Seshanba", topic: "Parent/mentor showcase preparation" },
        { day: "Chorshanba", topic: "Closing demo, certificates, next learning path" }
      ]
    }
  },
  startupcamp: {
    tagline: "G'oyani prototipga aylantirish: vibe coding, MVP, networking va pitch.",
    moduleDuration: "45 kun / 1.5 oy",
    startTime: "09:00",
    scheduleType: "Dushanba-Shanba",
    trialWeek: true,
    note,
    dailyStructure,
    weeks: [
      {
        week: 1,
        title: "Sinov hafta: idea and problem discovery",
        dates: "13-18 iyul",
        goal: "Real problem va idea topishga yordam berish.",
        output: "Har bir ishtirokchi/team bitta idea tanlaydi.",
        days: [
          { day: "Dushanba", topic: "What is a startup? Idea vs problem" },
          { day: "Seshanba", topic: "Problem discovery and user pain" },
          { day: "Chorshanba", topic: "Target audience and user persona" },
          { day: "Payshanba", topic: "Competitor/simple market research" },
          { day: "Juma", topic: "Value proposition" },
          { day: "Shanba", topic: "Idea selection and feedback" }
        ]
      },
      {
        week: 2,
        title: "Validation and product thinking",
        dates: "20-25 iyul",
        goal: "Idea qurishga arziydimi - tekshirish.",
        output: "Validation plan va simple product concept.",
        days: [
          { day: "Dushanba", topic: "Hypothesis and assumptions" },
          { day: "Seshanba", topic: "User interview questions" },
          { day: "Chorshanba", topic: "Survey/feedback collection plan" },
          { day: "Payshanba", topic: "Feature prioritization: must-have vs nice-to-have" },
          { day: "Juma", topic: "User flow and wireframe basics" },
          { day: "Shanba", topic: "Product concept presentation" }
        ]
      },
      {
        week: 3,
        title: "Vibe coding and prototype basics",
        dates: "27 iyul-1 avgust",
        goal: "AI/no-code/low-code tools bilan prototype yaratish.",
        output: "First clickable yoki working prototype.",
        days: [
          { day: "Dushanba", topic: "What is vibe coding? How to prompt AI tools" },
          { day: "Seshanba", topic: "Landing page or simple app structure" },
          { day: "Chorshanba", topic: "UI sections and content generation" },
          { day: "Payshanba", topic: "Forms, buttons, simple database concept" },
          { day: "Juma", topic: "Testing prototype with users" },
          { day: "Shanba", topic: "Prototype demo and feedback" }
        ]
      },
      {
        week: 4,
        title: "MVP building",
        dates: "3-8 avgust",
        goal: "Prototype'ni simple MVP'ga aylantirish.",
        output: "MVP v1.",
        days: [
          { day: "Dushanba", topic: "MVP scope and build plan" },
          { day: "Seshanba", topic: "Build core feature" },
          { day: "Chorshanba", topic: "Improve design and usability" },
          { day: "Payshanba", topic: "Add registration/contact/feedback flow" },
          { day: "Juma", topic: "Basic analytics and feedback tracking" },
          { day: "Shanba", topic: "MVP review" }
        ]
      },
      {
        week: 5,
        title: "Marketing, networking, and growth",
        dates: "10-15 avgust",
        goal: "First users uchun taqdimot va growth asoslari.",
        output: "Basic go-to-market plan.",
        days: [
          { day: "Dushanba", topic: "Brand message and naming" },
          { day: "Seshanba", topic: "Landing page copy and offer" },
          { day: "Chorshanba", topic: "Social media launch plan" },
          { day: "Payshanba", topic: "Networking and partnership basics" },
          { day: "Juma", topic: "Pricing/revenue model basics" },
          { day: "Shanba", topic: "Growth experiment plan" }
        ]
      },
      {
        week: 6,
        title: "Pitch and demo preparation",
        dates: "17-22 avgust",
        goal: "Final presentation va demo tayyorlash.",
        output: "Pitch deck + demo.",
        days: [
          { day: "Dushanba", topic: "Pitch structure: problem, solution, market, product" },
          { day: "Seshanba", topic: "Storytelling and presentation design" },
          { day: "Chorshanba", topic: "Demo polishing" },
          { day: "Payshanba", topic: "Financial/basic planning and next steps" },
          { day: "Juma", topic: "Pitch rehearsal" },
          { day: "Shanba", topic: "Final pitch day" }
        ]
      }
    ],
    finalThreeDays: {
      title: "Feedback and launch roadmap",
      dates: "24-26 avgust",
      goal: "Har bir team uchun aniq next step berish.",
      days: [
        { day: "Dushanba", topic: "Pitch feedback and product improvements" },
        { day: "Seshanba", topic: "30-day post-camp action plan" },
        { day: "Chorshanba", topic: "Closing demo, certificates, networking, next milestone" }
      ]
    }
  }
};
