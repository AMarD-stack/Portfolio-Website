// Projects page. Two parts:
//   PROJECTS  = Featured + Work in progress (shown as full case-study cards with pictures)
//   ARCHIVES  = everything else (listed with a short description, grouped in dropdown sections)
// coDev: true adds a "Co-Developed" badge. Only fields that exist are rendered, so unknown details never show as placeholders.
// Add to any entry: role, timeline, stack[], problem, approach[], outcome[], learnings, links[{label, href}].
export const SECTIONS = [
  { id: 'projects', label: 'Projects', groups: [{ id: 'featured', label: 'Featured' }, { id: 'wip', label: 'Work in progress' }] },
  { id: 'archives', label: 'Archives', groups: [
    { id: 'ml', label: 'Machine learning' }, { id: 'challenges', label: 'Challenges' }, { id: 'systems', label: 'Systems & data' },
    { id: 'cases', label: 'Case studies' }, { id: 'venture', label: 'Venture' }] },
];
export const GROUP_LABEL = Object.fromEntries(SECTIONS.flatMap((s) => s.groups.map((g) => [g.id, g.label])));

export const PROJECTS = [
  // ---------------- Featured (also drive the hero banners and the folder intro) ----------------
  { id: 'oremining', group: 'featured', title: 'OreMining Silica Prediction ML', heroTitle: 'OreMining', kicker: 'Machine learning · Industrial analytics',
    tagline: 'Silica prediction on industrial process data.',
    // VERIFY before publishing: 59% / 90% are your figures; the documented runs report R² (0.807 clean stack, 0.723 blind holdout, ≈0.50 rolling-origin).
    summary: 'Silica prediction with a leakage-free gradient-boosting ensemble (XGBoost, LightGBM, CatBoost, Optuna-tuned, Ridge-stacked), reaching R² 0.807 on industrial flotation process data.',
    tags: ['Gradient boosting', 'XGBoost', 'CatBoost', 'Optuna'],
    image: '/projects/oremining.jpg', imageM: '/projects/oremining-m.jpg', thumb: '/projects/oremining-thumb.jpg' },
  { id: 'parkspace', group: 'featured', title: 'ParkSpace Parking Booking System', heroTitle: 'ParkSpace', kicker: 'Mobile product · UI/UX', coDev: true,
    tagline: 'Parking reservations with real-time availability.',
    summary: 'End-to-end parking reservation system with real-time availability and booking workflows.',
    tags: ['Real-time availability', 'Slot selection', 'Booking flow'],
    image: '/projects/parkspace.jpg', imageM: '/projects/parkspace-m.jpg', thumb: '/projects/parkspace-thumb.jpg' },
  { id: 'research', group: 'featured', title: 'Research Article: AI Video Misinformation Trust', heroTitle: 'AI Video & Information Trust', kicker: 'Research article', coDev: true,
    tagline: 'Generation X and Generation Y in Indonesia.',
    summary: 'The Influence of Generative AI Video on Information Trust Among Generation X and Generation Y in Indonesia.',
    tags: ['Mixed methods', 'SOR framework', 'n = 25'], team: 'With Hafidz Dwinata, Darren Emanuel and Hall Kell Then',
    image: '/projects/research.jpg', imageM: '/projects/research-m.jpg', thumb: '/projects/research-thumb.jpg' },
  { id: 'ojaib', group: 'featured', title: 'Ojaib AI Trading Bot', heroTitle: 'Ojaib', kicker: 'AI trading system', coDev: true,
    tagline: 'Automated financial decision making, end to end.',
    summary: 'End-to-end AI trading system covering data ingestion, signal generation, risk controls and execution logic for automated financial decision making.',
    tags: ['Data ingestion', 'Signal generation', 'Risk controls', 'Execution logic'],
    image: '/projects/ojaib.jpg', imageM: '/projects/ojaib-m.jpg', thumb: '/projects/ojaib-thumb.jpg' },

  // ---------------- Work in progress ----------------
  { id: 'kai', group: 'wip', status: 'In progress', coDev: true, title: 'PT KAI Digitalization DataWarehouse', kicker: 'Enterprise data warehouse',
    tagline: 'Optimising train-ticket pricing and availability.',
    summary: 'An enterprise data warehouse for PT KAI Indonesia to optimise ticket pricing and availability, with unstructured-data analysis (sentiment, topic modelling) feeding the warehouse.',
    tags: ['Enterprise data warehouse', 'Sentiment analysis', 'Topic modelling'] },
  { id: 'garuda', group: 'wip', status: 'In progress', coDev: true, title: 'Garuda Indonesia FA Training System', kicker: 'Enterprise systems',
    tagline: 'Functional specifications and database workflows for automated compliance tracking.',
    stack: ['Oracle SQL', 'Oracle APEX', 'Relational schemas'],
    problem: 'Training and certification compliance was tracked by hand, so expiries were easy to miss.',
    approach: ['Wrote functional specifications with stakeholders', 'Designed the relational schema and approval workflows', 'Prototyped screens for expiry alerts and reporting'] },
  { id: 'trump', group: 'wip', status: 'In progress', coDev: true, title: 'Research Article: The 2026 Trump Effect', kicker: 'Research · Sentiment analysis',
    tagline: 'Presidential rhetoric, stock markets and crypto volatility on X.',
    summary: 'The 2026 Trump Effect: A Sentiment Analysis of Presidential Rhetoric, Stock Markets & Cryptocurrency Volatility in X.',
    tags: ['Sentiment analysis', 'Stock markets', 'Cryptocurrency', 'X'] },
  { id: 'quantum', group: 'wip', status: 'In progress', title: 'Supply Chain Hybrid Quantum Optimization', kicker: 'Quantum · Optimisation',
    tagline: 'Hybrid quantum optimisation for supply chains.' },
  { id: 'westernunion', group: 'wip', status: 'In progress', title: 'WesternUnion DataWarehouse Optimization', kicker: 'Enterprise data warehouse',
    tagline: 'Optimising a data warehouse for Western Union.' },

  // ---------------- Archives: machine learning ----------------
  { id: 'churn', group: 'ml', title: 'Bank Customer Churn Prediction', desc: 'A churn model for a bank, including a fix for data leakage in the modelling pipeline.' },
  { id: 'behaviour', group: 'ml', title: 'Customer Behaviour Prediction', desc: 'Machine-learning models that predict customer behaviour.' },
  { id: 'rice', group: 'ml', title: 'Sumatera Rice Production Prediction', desc: 'Predicting rice production across Sumatera.' },
  { id: 'spatial', group: 'ml', title: 'BINUS Campus Spatial Graph OML', desc: 'A spatial graph model of the BINUS campus built on Oracle.' },
  { id: 'housing', group: 'ml', coDev: true, title: 'California Housing Prices Prediction', desc: 'House-price prediction with Linear Regression, Random Forest and XGBoost; XGBoost scored highest (R² 0.7499 vs 0.7344).' },

  // ---------------- Archives: challenges ----------------
  { id: 'ey', group: 'challenges', title: 'EY AI & Data Challenge — Snowflake', desc: 'Spatio-temporal regression pipelines for predicting clean water supply parameters, built in Python and Snowflake.' },
  { id: 'dwdg', group: 'challenges', coDev: true, title: 'Do Well Do Good Business Case Challenge', desc: 'A team entry for the Do Well Do Good business case challenge.' },

  // ---------------- Archives: systems & data ----------------
  { id: 'nicelaundry', group: 'systems', coDev: true, title: 'NiceLaundry Database Management System', desc: 'A database management system for a laundry service.' },
  { id: 'portugal', group: 'systems', coDev: true, title: 'Portugal School Data Modelling', desc: 'Data cleaning, Power Pivot relationships, DAX measures and an interactive dashboard on Portuguese student performance.' },
  { id: 'genai-dashboard', group: 'systems', title: 'Enterprise GenAI Adoption Dashboard', desc: 'A Power BI dashboard on a 100k-row GenAI adoption dataset; profiling showed the data is synthetic, which became the critical reflection.' },
  { id: 'sweethome', group: 'systems', title: 'AI SweetHome IoT', desc: 'An IoT prototype built around backend services and APIs.' },
  { id: 'binusmaya', group: 'systems', coDev: true, title: 'BINUSMAYA App Quality Testing', desc: 'Quality testing of the BINUSMAYA app.' },

  // ---------------- Archives: case studies ----------------
  { id: 'lively', group: 'cases', coDev: true, title: 'Lively Streaming UI App Development', desc: 'UI design and development for a streaming app.' },
  { id: 'moneyrv', group: 'cases', title: 'MoneyRv E-Commerce UI App Development', desc: 'UI design and development for an e-commerce app.' },
  { id: 'skypiea', group: 'cases', title: 'Skypiea IT Network Infrastructure Management', desc: 'Planning and managing an IT network infrastructure.' },
  { id: 'gamezy', group: 'cases', coDev: true, title: 'Gamezy Database Management', desc: 'A database management case study.' },
  { id: 'kainkita', group: 'cases', coDev: true, title: 'KainKita System Analysis Mobile Platform', desc: 'System analysis of a mobile platform.' },
  { id: 'stylehub', group: 'cases', coDev: true, title: 'StyleHub E-Commerce Data Modelling', desc: 'Data modelling for an e-commerce platform.' },
  { id: 'fitzone', group: 'cases', coDev: true, title: 'Fitzone Enterprise DataWarehouse', desc: 'Design of an enterprise data warehouse.' },

  // ---------------- Archives: venture ----------------
  { id: 'vibewinter', group: 'venture', coDev: true, title: 'VibeWinter Rent Winter Apparel App', desc: 'An app for renting winter apparel, with a pitch deck covering revenue and cost structure.' },
  { id: 'infosphere', group: 'venture', coDev: true, title: 'AI Infosphere Centre', desc: 'A university AI centre concept, with a 10-year financial model in IDR.' },
];

export const byId = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));
export const isArchive = (p) => ['ml', 'challenges', 'systems', 'cases', 'venture'].includes(p.group);
// hero banner order (kept as before); the projects page / folder intro follow the page order of the featured group
export const FEATURED = PROJECTS.filter((p) => p.group === 'featured');
export const HERO = ['oremining', 'ojaib', 'parkspace', 'research'].map((id) => byId[id]);
