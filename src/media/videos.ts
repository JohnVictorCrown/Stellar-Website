export interface StellariumVideo {
  id: string;
  title: string;
  description: string;
  url: string; // Embed URL
  youtubeUrl: string; // Link to watch on YouTube
  duration: string;
  thumbnail: string;
  category: "Vision" | "Engineering" | "Masterclass" | "Culture";
  views: string;
  date: string;
}

export const STELLARIUM_VIDEOS: StellariumVideo[] = [
  {
    id: "v1",
    title: "Water Gov Presentation",
    description: "A comprehensive presentation detailing our decentralized Water Governance initiative, demonstration of operational mechanics, and community resource distribution protocols.",
    url: "https://www.youtube.com/embed/Oo2-8NT6wiQ",
    youtubeUrl: "https://youtu.be/Oo2-8NT6wiQ",
    duration: "16:24",
    thumbnail: "🌌",
    category: "Vision",
    views: "42,150",
    date: "May 2026"
  },
  {
    id: "v2",
    title: "The Stellarium Society Presentation",
    description: "An official overview of the Stellarium Society structure, detailing our constitutional principles, individual rights, and cooperative governance systems designed for mutual benefit.",
    url: "https://www.youtube.com/embed/JAMCTIpx6s0",
    youtubeUrl: "https://youtu.be/JAMCTIpx6s0",
    duration: "24:10",
    thumbnail: "👑",
    category: "Masterclass",
    views: "31,840",
    date: "May 2026"
  },
  {
    id: "v3",
    title: "Water Classroom Presentation",
    description: "A walkthrough of Stellarium's active educational classrooms, outlining our training curriculums, technical manuals, and learning paths for sustainable water engineers.",
    url: "https://www.youtube.com/embed/OaWhWBB0OCE",
    youtubeUrl: "https://youtu.be/OaWhWBB0OCE",
    duration: "12:45",
    thumbnail: "💧",
    category: "Engineering",
    views: "18,920",
    date: "May 2026"
  },
  {
    id: "v4",
    title: "Water Robotics Presentation",
    description: "An engineering run-through of our custom aquatic robotics, highlighting telemetry sensors, real-time quality scanning, and autonomous hardware maintenance.",
    url: "https://www.youtube.com/embed/ZQ11OXDZvUQ",
    youtubeUrl: "https://youtu.be/ZQ11OXDZvUQ",
    duration: "19:15",
    thumbnail: "⚙️",
    category: "Vision",
    views: "26,400",
    date: "May 2026"
  },
  {
    id: "v5",
    title: "Water Company Presentation",
    description: "An insightful analysis of the Stellarium Water Company structure, business operations, supply logistics, and sustainable utility scaling templates.",
    url: "https://www.youtube.com/embed/2402A7KTNEM",
    youtubeUrl: "https://youtu.be/2402A7KTNEM",
    duration: "22:30",
    thumbnail: "🔮",
    category: "Culture",
    views: "14,580",
    date: "May 2026"
  },
  {
    id: "v6",
    title: "Water AI Presentation",
    description: "Exploring the artificial intelligence layers, algorithmic models, and machine learning routines built to forecast consumption patterns and preserve local water table counts.",
    url: "https://www.youtube.com/embed/bqFep-M9lGU",
    youtubeUrl: "https://youtu.be/bqFep-M9lGU",
    duration: "15:50",
    thumbnail: "🔥",
    category: "Masterclass",
    views: "34,120",
    date: "May 2026"
  },
  {
    id: "new1",
    title: "Podcast About The Stellarium Foundation in Depth",
    description: "An extensive podcast exploration outlining our core roadmap, the vision of founder John Victor, and how we are constructing a mutually beneficial society.",
    url: "https://www.youtube.com/embed/31riI_s_958",
    youtubeUrl: "https://youtu.be/31riI_s_958",
    duration: "18:45",
    thumbnail: "🦅",
    category: "Masterclass",
    views: "22,140",
    date: "May 2026"
  },
  {
    id: "new2",
    title: "This is Set to Solve The Affordability Crisis Worldwide",
    description: "A pivotal blueprint for scalable public goods, affordable basic resources, and community integration plans aimed at solving modern economic disparity.",
    url: "https://www.youtube.com/embed/g7HIAp5gXw8",
    youtubeUrl: "https://youtu.be/g7HIAp5gXw8",
    duration: "29:12",
    thumbnail: "🚀",
    category: "Masterclass",
    views: "39,520",
    date: "May 2026"
  },
  {
    id: "new3",
    title: "Stellarium Roles",
    description: "Guidance on career paths, contributor functions, and operational governance roles open to candidates within the Stellarium ecosystem.",
    url: "https://www.youtube.com/embed/kuj7ukMhUhc",
    youtubeUrl: "https://youtu.be/kuj7ukMhUhc",
    duration: "14:20",
    thumbnail: "🖥️",
    category: "Engineering",
    views: "12,850",
    date: "May 2026"
  },
  {
    id: "new4",
    title: "How To Sponsor Through Monero",
    description: "A straightforward, secure step-by-step tutorial on financial contributions, sponsorships, and anonymous support using the Monero privacy network.",
    url: "https://www.youtube.com/embed/dVNW8AJ9kxU",
    youtubeUrl: "https://youtu.be/dVNW8AJ9kxU",
    duration: "21:35",
    thumbnail: "🏗️",
    category: "Vision",
    views: "24,800",
    date: "May 2026"
  },
  {
    id: "new5",
    title: "Pronouncement",
    description: "An official public declaration and foundational values decree by the leadership of the Stellarium Foundation.",
    url: "https://www.youtube.com/embed/oUa33X_T8TE",
    youtubeUrl: "https://youtu.be/oUa33X_T8TE",
    duration: "17:50",
    thumbnail: "🗣️",
    category: "Culture",
    views: "15,220",
    date: "May 2026"
  },
  {
    id: "new6",
    title: "Pronouncement",
    description: "The secondary foundational announcement, continuing the cultural and organizational focus of the Stellarium network's expanding boundaries.",
    url: "https://www.youtube.com/embed/wxLhO9pBWmg",
    youtubeUrl: "https://youtu.be/wxLhO9pBWmg",
    duration: "25:10",
    thumbnail: "📈",
    category: "Engineering",
    views: "31,400",
    date: "May 2026"
  },
  {
    id: "new7",
    title: "John Victor: The Beloved King",
    description: "A documentary highlight focusing on the leadership of sovereign wealth activist John Victor, defining the philosophy behind Stellarium's forward-looking roadmap.",
    url: "https://www.youtube.com/embed/bdbu5VdWOgA",
    youtubeUrl: "https://youtu.be/bdbu5VdWOgA",
    duration: "19:42",
    thumbnail: "🗺️",
    category: "Vision",
    views: "17,350",
    date: "May 2026"
  },
  {
    id: "new8",
    title: "Water Enterprises Demonstration",
    description: "A live presentation of the Water Suite automatic enterprises, showcasing decentralized water automation, utility platforms, and sovereign investment pathways.",
    url: "https://www.youtube.com/embed/rk-eOwsRu7I",
    youtubeUrl: "https://youtu.be/rk-eOwsRu7I",
    duration: "10:20",
    thumbnail: "💧",
    category: "Vision",
    views: "28,950",
    date: "May 2026"
  },
  {
    id: "new9",
    title: "Enterprise Housing Pledge Initiative",
    description: "A revolutionary model for collaborative philanthropy and construction efficiency, aiming to solve the affordable housing crises locally and globally.",
    url: "https://www.youtube.com/embed/VkFHZVZ1RtU",
    youtubeUrl: "https://youtu.be/VkFHZVZ1RtU",
    duration: "0:58",
    thumbnail: "🏢",
    category: "Culture",
    views: "19,410",
    date: "May 2026"
  },
  {
    id: "new10",
    title: "Stellarium Mansion & Office Fundraising",
    description: "A serene sanctuary where visionaries and creative activists unite. Learn how we are building a collaborative launchpad for peace, prosperity, and masterclasses.",
    url: "https://www.youtube.com/embed/ENJqQ7-uo20",
    youtubeUrl: "https://youtu.be/ENJqQ7-uo20",
    duration: "4:15",
    thumbnail: "🏰",
    category: "Culture",
    views: "15,800",
    date: "May 2026"
  },
  {
    id: "v_party",
    title: "Water Party Platform Presentation",
    description: "Interactive showcase of the curated celebration protocol designed to foster real-world social connection, celebration, and eradicate isolation.",
    url: "https://www.youtube.com/embed/Sa1dXoArjEo",
    youtubeUrl: "https://youtu.be/Sa1dXoArjEo",
    duration: "13:40",
    thumbnail: "🎉",
    category: "Culture",
    views: "21,340",
    date: "May 2026"
  },
  {
    id: "v_fluid",
    title: "Water AI Fluid Specification",
    description: "Deep dive into the decentralized peer-to-peer compute grid built to democratize high-power GPU resources for micro-businesses and autonomous agents.",
    url: "https://www.youtube.com/embed/1KEom398rsg",
    youtubeUrl: "https://youtu.be/1KEom398rsg",
    duration: "11:15",
    thumbnail: "🌀",
    category: "Engineering",
    views: "25,180",
    date: "May 2026"
  },
  {
    id: "v_coach",
    title: "Stellarium Coach (Water Coach)",
    description: "Productivity companion and focus loop engineered directly on-device to maximize professional output and optimize stress.",
    url: "https://www.youtube.com/embed/cky0Z9AVIn0",
    youtubeUrl: "https://youtu.be/cky0Z9AVIn0",
    duration: "14:50",
    thumbnail: "🧠",
    category: "Masterclass",
    views: "33,620",
    date: "May 2026"
  },
  {
    id: "v_economics",
    title: "Water Economics Blueprint",
    description: "Macroeconomic simulations and systemic policy feedback models built to validate financial paradigms empirically.",
    url: "https://www.youtube.com/embed/jaxlhPEMTm8",
    youtubeUrl: "https://youtu.be/jaxlhPEMTm8",
    duration: "18:30",
    thumbnail: "📊",
    category: "Vision",
    views: "29,450",
    date: "May 2026"
  }
];
