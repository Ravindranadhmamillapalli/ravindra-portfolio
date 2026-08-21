export type TabId =
  | "about"
  | "work"
  | "projects"
  | "skills"
  | "notes"
  | "education"
  | "contact";

export type TabDef = {
  id: TabId;
  label: string;
  accent: string;
  camera: [number, number, number];
  caption: string;
};

export const tabs: TabDef[] = [
  {
    id: "about",
    label: "About",
    accent: "#2dd4a8",
    camera: [0, 0.4, 5.2],
    caption: "Who I am and how I work",
  },
  {
    id: "work",
    label: "Work",
    accent: "#5eead4",
    camera: [1.2, 0.6, 5.5],
    caption: "Roles, teams, and delivery",
  },
  {
    id: "projects",
    label: "Projects",
    accent: "#c4a574",
    camera: [-0.8, 0.8, 5.8],
    caption: "Systems I designed and shipped",
  },
  {
    id: "skills",
    label: "Skills",
    accent: "#7dd3c0",
    camera: [0.4, 1.1, 5.4],
    caption: "Stack, depth, and core concepts",
  },
  {
    id: "notes",
    label: "Notes",
    accent: "#93c5fd",
    camera: [-1.1, 0.3, 5.6],
    caption: "Writing from production work",
  },
  {
    id: "education",
    label: "Education",
    accent: "#f0abfc",
    camera: [0.9, -0.2, 5.9],
    caption: "Degrees and certifications",
  },
  {
    id: "contact",
    label: "Contact",
    accent: "#e8c98a",
    camera: [0, 0.2, 4.6],
    caption: "Let's build something",
  },
];

export const hero = {
  kicker: "Full Stack Developer · Hyderabad, India",
  name: "Ravindra Nadh Mamillapalli",
  lead:
    "I build product systems end to end — Angular and React interfaces, Java, Node, and Golang services, and MySQL data models that hold up under real reporting load.",
  stats: [
    { value: "3+", label: "Years shipping" },
    { value: "6", label: "Products delivered" },
    { value: "5", label: "Languages in rotation" },
    { value: "1M+", label: "Records reported on" },
  ],
};

export const about = {
  title: "A full-stack developer who owns the whole path",
  paragraphs: [
    "I am a Full Stack Developer with 3+ years of experience across education and enterprise systems. My work usually starts at a business question — how much fee is pending, which student is slipping, which camera flagged motion — and ends with a screen someone actually trusts.",
    "Day to day I move between Angular and React for the interface, Java, Spring Boot, Node.js, and Golang for services, and MySQL for the data that has to stay correct. I care most about the seams: the API contract, the query plan, and the empty state nobody designed.",
    "I work well in small teams with real ownership — picking up a feature at the ticket stage, shaping the contract with backend and product, shipping it, then watching the logs after release.",
  ],
  facts: [
    { label: "Based in", value: "Hyderabad, Telangana, India" },
    { label: "Experience", value: "3+ years · Dec 2022 – Present" },
    { label: "Current role", value: "Full Stack Developer, Varsity Education" },
    { label: "Core stack", value: "Angular, React, Java, Node.js, Golang, MySQL" },
    { label: "Domains", value: "Education, finance ops, HR, surveillance" },
    { label: "Open to", value: "Full-stack roles · hybrid or remote" },
  ],
  principles: [
    {
      title: "Contract first",
      body: "Agree on the payload before the UI exists. A boring, stable contract beats a clever one.",
    },
    {
      title: "Query plans matter",
      body: "Dashboards die on slow joins. I read EXPLAIN output before adding another widget.",
    },
    {
      title: "Design the sad path",
      body: "Failed payments, expired sessions, empty reports — recovery copy is part of the feature.",
    },
    {
      title: "Ship, then watch",
      body: "Logs and support tickets after release tell you what the spec missed.",
    },
  ],
};

export const work = [
  {
    role: "Full Stack Developer",
    company: "Varsity Education Management Pvt. Ltd.",
    location: "Hyderabad, India",
    when: "Dec 2022 – Present",
    summary:
      "Build and maintain full-stack products across student data, finance, HR, and analytics for a large education group.",
    points: [
      "Delivered full-stack applications with React.js, Angular, Golang, Node.js, and MySQL, from ticket to production release.",
      "Designed and shipped REST APIs covering student records, fee collection, HR workflows, and reporting.",
      "Built CFO, MIS, and Student Progress dashboards with role-based access and business-shaped filters.",
      "Integrated Razorpay for online fee payments, including failure recovery and reconciliation views.",
      "Wrote Golang and Node.js services for realtime surveillance processing — motion events and plate recognition.",
      "Tuned MySQL queries and indexes so reporting screens stayed fast as data volume grew.",
    ],
    stack: ["React", "Angular", "Golang", "Node.js", "Java", "MySQL", "Razorpay"],
  },
  {
    role: "Java Full Stack Trainee",
    company: "JSpiders Training & Development",
    location: "Hyderabad, India",
    when: "2022",
    summary:
      "Intensive training in Core Java, SQL, and web technologies before moving into product work.",
    points: [
      "Core Java, OOP, collections, and exception handling with daily coding practice.",
      "SQL fundamentals: joins, grouping, subqueries, and normalization.",
      "Built small CRUD web applications on servlets, JSP, and JDBC.",
    ],
    stack: ["Core Java", "SQL", "JDBC", "HTML/CSS", "JavaScript"],
  },
];

export const projects = [
  {
    tag: "Realtime / Golang",
    title: "Surveillance Platform",
    year: "2025",
    role: "Backend + services",
    blurb:
      "Live video pipeline with motion detection and license plate recognition, backed by Golang and Node services.",
    highlights: [
      "Concurrent event processing with goroutines and worker pools",
      "Noise control so operators see attention-worthy events only",
      "Event history persisted to MySQL for audit and review",
    ],
    tech: ["Golang", "Node.js", "REST", "MySQL", "WebSockets"],
  },
  {
    tag: "Education platform",
    title: "SCAITS Platform",
    year: "2024 – 2025",
    role: "Full stack",
    blurb:
      "Course fees, student progress, and executive dashboards with role-based access across multiple campuses.",
    highlights: [
      "CFO and MIS dashboards driven by tuned aggregate queries",
      "Role-aware routing and API guards per user type",
      "Fee lifecycle from invoice to receipt to reconciliation",
    ],
    tech: ["React", "Angular", "Golang", "MySQL", "REST"],
  },
  {
    tag: "Maps / reporting",
    title: "MIS Geo Reports",
    year: "2024",
    role: "Frontend + API",
    blurb:
      "Interactive Google Maps reporting with custom markers and GeoJSON radius filters over institutional data.",
    highlights: [
      "GeoJSON radius selection translated into SQL filters",
      "Clustered custom markers for dense campus regions",
      "Export paths for the reports finance actually reads",
    ],
    tech: ["Google Maps", "GeoJSON", "JavaScript", "MySQL"],
  },
  {
    tag: "Payments",
    title: "Parent Application",
    year: "2023 – 2024",
    role: "Full stack",
    blurb:
      "Parent-facing app for grievances, progress tracking, and online fee payment through Razorpay.",
    highlights: [
      "Razorpay checkout with clear success, pending, and failure states",
      "Receipt history and downloadable payment proof",
      "Grievance threads routed to the right campus staff",
    ],
    tech: ["React", "Razorpay", "Node.js", "REST", "MySQL"],
  },
  {
    tag: "HR / internal tools",
    title: "ESS — Employee Self Service",
    year: "2023",
    role: "Full stack",
    blurb:
      "Leave, attendance, and grievance workflows with an Angular frontend and Java APIs.",
    highlights: [
      "Reactive forms with policy-aware validation",
      "Approval chains reflecting real reporting hierarchy",
      "SQL reports for attendance and leave balances",
    ],
    tech: ["Angular", "Java", "Spring Boot", "SQL"],
  },
  {
    tag: "Serverless / side project",
    title: "Insider Living",
    year: "2024",
    role: "Solo build",
    blurb:
      "Anonymous apartment reviews built on Next.js with a serverless AWS backend and search.",
    highlights: [
      "Next.js frontend with server-rendered listing pages",
      "Lambda handlers over DynamoDB for reviews",
      "OpenSearch indexing for locality search",
    ],
    tech: ["Next.js", "AWS Lambda", "DynamoDB", "OpenSearch"],
  },
];

export const skills = [
  {
    group: "Frontend",
    level: "Advanced",
    items: ["Angular", "React.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Bootstrap"],
    note: "Reactive forms, component state, role-aware routing, and dashboard-heavy UI.",
  },
  {
    group: "Backend",
    level: "Advanced",
    items: ["Java", "Spring Boot", "Node.js", "Golang", "REST APIs"],
    note: "Service layers, validation, auth boundaries, and concurrent workers.",
  },
  {
    group: "Data",
    level: "Strong",
    items: ["MySQL", "SQL", "Query optimization", "Schema design", "DynamoDB"],
    note: "Joins and indexes for reporting, transactions for money movement.",
  },
  {
    group: "Product integrations",
    level: "Strong",
    items: ["Razorpay", "Google Maps", "GeoJSON", "Realtime streaming"],
    note: "Payments, geography, and live event feeds inside business products.",
  },
  {
    group: "Workflow",
    level: "Daily",
    items: ["Git", "JIRA", "Postman", "Agile / Scrum", "Code review"],
    note: "Ticket to release, with review and QA handoff in between.",
  },
];

export const concepts = [
  {
    language: "JavaScript / TypeScript",
    badge: "Interface layer",
    items: [
      { title: "Closures", body: "Private state inside handlers and modules." },
      { title: "Event loop", body: "Why long sync work freezes the UI." },
      { title: "Generics", body: "Reusable helpers without losing type safety." },
      { title: "Unions", body: "Explicit success and error states." },
    ],
  },
  {
    language: "Java / Golang",
    badge: "Services",
    items: [
      { title: "OOP layering", body: "Controllers, services, and DTOs kept apart." },
      { title: "Goroutines", body: "Concurrent job handling for event streams." },
      { title: "Explicit errors", body: "Predictable API failures over hidden throws." },
      { title: "Interfaces", body: "Small swappable contracts between packages." },
    ],
  },
  {
    language: "SQL / REST",
    badge: "Foundations",
    items: [
      { title: "Indexes", body: "Fast filters when reports grow past a million rows." },
      { title: "Transactions", body: "Fee updates that commit together or not at all." },
      { title: "Pagination", body: "Safe list endpoints for reporting screens." },
      { title: "Status codes", body: "Honest 4xx and 5xx so the UI can recover." },
    ],
  },
];

export const notes = [
  {
    date: "Aug 11, 2026",
    topic: "Career",
    read: "4 min",
    title: "What full stack actually means on a real team",
    body:
      "On paper it sounds like a checklist of frameworks. In practice it is a responsibility model: connect the screen to the contract, the contract to the query, and the query to something operators can trust. A single week might include an Angular form, a Node endpoint, a MySQL index change, a Razorpay edge case, and a dashboard filter that only makes sense after talking to finance.",
  },
  {
    date: "Jul 28, 2026",
    topic: "Product",
    read: "3 min",
    title: "Building dashboards people open twice",
    body:
      "Charts are easy; decision-ready filters and fast SQL are the real work. The dashboards that stick share clear roles, boring defaults, business-shaped filters, and queries that stay fast. CFO and MIS work taught me to optimize for the two-minute question, not for more widgets.",
  },
  {
    date: "Jun 18, 2026",
    topic: "Backend",
    read: "3 min",
    title: "REST APIs across Java, Node, and Golang",
    body:
      "Same resource, three runtimes — the contract matters more than the logo. Validation, status codes, pagination, auth boundaries, and searchable logs are required in every language. A stable contract beats a clever one when Angular and React clients depend on it.",
  },
  {
    date: "May 9, 2026",
    topic: "Payments",
    read: "3 min",
    title: "Razorpay in education: trust is the feature",
    body:
      "A payment screen in a parent app is systems design with an SDK attached. Success and failure states, fee reconciliation, retry paths, and calm copy matter as much as the gateway call itself. Parents need a receipt they can show tomorrow.",
  },
  {
    date: "Apr 22, 2026",
    topic: "Maps",
    read: "3 min",
    title: "Maps, GeoJSON, and reports that respect place",
    body:
      "Geography is a filter language. Markers and radius selection only help if the query behind them stays honest and permissions hold as data grows. Otherwise you have shipped a pretty picture of the wrong subset.",
  },
  {
    date: "Mar 14, 2026",
    topic: "Realtime",
    read: "3 min",
    title: "Streaming, motion events, and calm operators",
    body:
      "Realtime is a UX problem as much as a throughput problem. Operators need attention management, not noise. Golang and Node solve the concurrency; the product only wins when the noise floor stays under control.",
  },
];

export const education = [
  {
    title: "MCA — Master of Computer Applications",
    place: "Prakasam Engineering College (JNTU Kakinada)",
    when: "2022 – 2025",
    detail: "CGPA 7.3 · Advanced programming, DBMS, and software engineering.",
  },
  {
    title: "B.Sc. in Computers",
    place: "Acharya Nagarjuna University",
    when: "2019 – 2022",
    detail: "CGPA 7.0 · Programming fundamentals, data structures, and databases.",
  },
  {
    title: "Java Full Stack Certification",
    place: "JSpiders Training & Development",
    when: "2022",
    detail: "Core Java, SQL, and web technologies with hands-on project work.",
  },
];

export const contact = {
  title: "Say hello",
  lead:
    "Open to full-stack roles across web, APIs, and product systems — hybrid or remote from Hyderabad. Happy to talk through dashboards, payments, or realtime work.",
  email: "ravindra30101997@gmail.com",
  phone: "+91 99899 89052",
  linkedin: "https://www.linkedin.com/in/ravindra-mamillapalli-820887261",
  location: "Hyderabad, Telangana, India",
  availability: "Open to new opportunities",
  responseTime: "Usually replies within a day",
};
