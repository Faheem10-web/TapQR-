// Premium mock data for TapQR profiles and analytics

export const DEFAULT_PROFILES = [
  {
    id: "alex-rivera",
    name: "Alex Rivera",
    title: "Lead Product Designer",
    company: "Aura Design Studio",
    category: "Product Design",
    bio: "Crafting premium brand experiences & digital interfaces. Ex-Apple & Stripe designer based in San Francisco.",
    phone: "+1 (555) 019-2834",
    whatsapp: "+15550192834",
    email: "alex@auradesign.studio",
    website: "https://auradesign.studio",
    address: "450 Mission St, San Francisco, CA 94105",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&h=300&fit=crop",
    coverPhoto: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&fit=crop",
    theme: {
      primaryColor: "#a855f7", // Purple
      textColor: "#1d1d1f",
      backgroundColor: "#f4f5f8",
      themeMode: "glass-light", // glass-dark / glass-light / dark / light
      fontFamily: "Outfit",
      layout: "premium"
    },
    socials: {
      instagram: "https://instagram.com/alexrivera.design",
      twitter: "https://twitter.com/alexdesign",
      linkedin: "https://linkedin.com/in/alex-rivera",
      github: "https://github.com/alexrivera",
      youtube: "https://youtube.com/@alexdesign",
      tiktok: "https://tiktok.com/@alexdesign"
    },
    links: [
      {
        id: "link-1",
        title: "View Portfolio Site",
        subtitle: "Explore my latest case studies & interactive design prototypes.",
        url: "https://auradesign.studio",
        icon: "globe",
        highlight: true
      },
      {
        id: "link-2",
        title: "Download Case Study PDF",
        subtitle: "How we scaled Stripe's dashboard interactions.",
        url: "https://auradesign.studio/case-study.pdf",
        icon: "file-text",
        highlight: false
      }
    ],
    services: [
      {
        id: "srv-1",
        name: "SaaS Brand Strategy",
        description: "Comprehensive design system setup, typography alignment, and market positioning.",
        price: "$2,500+",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300&fit=crop"
      },
      {
        id: "srv-2",
        name: "High-Fidelity UI/UX Design",
        description: "End-to-end web & mobile interfaces, custom interactive components and Figma kits.",
        price: "$5,000+",
        image: "https://images.unsplash.com/photo-1541462608141-2ff65a60a9c5?q=80&w=300&fit=crop"
      }
    ],
    testimonials: [
      {
        id: "test-1",
        quote: "Alex completely revolutionized our product interface. User engagement increased by 40% within two weeks of launch.",
        author: "Sarah Jenkins",
        role: "CEO at LinearFlow"
      },
      {
        id: "test-2",
        quote: "Incredibly professional and details-focused. The design files were cleaner than any agency we've ever worked with.",
        author: "Marcus Aurelius",
        role: "Lead Engineer at Colosseum"
      }
    ],
    hours: {
      timezone: "America/Los_Angeles",
      monday: { open: "09:00", close: "18:00" },
      tuesday: { open: "09:00", close: "18:00" },
      wednesday: { open: "09:00", close: "18:00" },
      thursday: { open: "09:00", close: "18:00" },
      friday: { open: "09:00", close: "17:00" },
      saturday: { open: "closed", close: "closed" },
      sunday: { open: "closed", close: "closed" }
    },
    faqs: [
      {
        id: "faq-1",
        question: "What is your typical turnaround time?",
        answer: "For design systems, it is 1-2 weeks. For full platform UI/UX design, typical timelines run between 4 to 8 weeks depending on the complexity of the pages."
      },
      {
        id: "faq-2",
        question: "Do you work with early-stage startups?",
        answer: "Yes, I regularly collaborate with seed and Series-A startups to help them build their MVPs and scale their design systems."
      }
    ]
  },
  {
    id: "luna-brew",
    name: "Luna Brew Coffee",
    title: "Specialty Cafe & Roastery",
    company: "Luna Brew",
    category: "Coffee Roastery",
    bio: "Artisanal coffee and locally baked pastries in a warm, architectural setting. Experience coffee elevated.",
    phone: "+1 (555) 890-4321",
    whatsapp: "+15558904321",
    email: "hello@lunabrew.coffee",
    website: "https://lunabrew.coffee",
    address: "820 Valencia St, San Francisco, CA 94110",
    avatar: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=300&h=300&fit=crop",
    coverPhoto: "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=800&fit=crop",
    theme: {
      primaryColor: "#d97706", // Amber / Warm Orange
      textColor: "#1c1917",
      backgroundColor: "#fafaf9",
      themeMode: "glass-light",
      fontFamily: "Inter",
      layout: "minimal"
    },
    socials: {
      instagram: "https://instagram.com/lunabrew.coffee",
      twitter: "",
      linkedin: "",
      github: "",
      youtube: "",
      tiktok: "https://tiktok.com/@lunabrew"
    },
    links: [
      {
        id: "link-1",
        title: "Order Delivery Online",
        subtitle: "Get fresh hot brew and beans delivered to your door via DoorDash.",
        url: "https://lunabrew.coffee/order",
        icon: "shopping-bag",
        highlight: true
      },
      {
        id: "link-2",
        title: "Join our Loyalty Program",
        subtitle: "Earn 10% cash back in points on every drink purchased.",
        url: "https://lunabrew.coffee/loyalty",
        icon: "award",
        highlight: false
      }
    ],
    services: [
      {
        id: "srv-1",
        name: "Single Origin Espresso Box",
        description: "A subscription pack of three 250g bags of micro-lot Ethiopian and Colombian beans.",
        price: "$48.00",
        image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=300&fit=crop"
      },
      {
        id: "srv-2",
        name: "Home Barista Masterclass",
        description: "A 2-hour private session with our head barista learning espresso dialing & milk steaming.",
        price: "$120.00",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=300&fit=crop"
      }
    ],
    testimonials: [
      {
        id: "test-1",
        quote: "Best espresso in the Mission. The staff dial in their coffees every morning and you can really taste the difference.",
        author: "David Chen",
        role: "Neighborhood regular"
      }
    ],
    hours: {
      timezone: "America/Los_Angeles",
      monday: { open: "07:00", close: "17:00" },
      tuesday: { open: "07:00", close: "17:00" },
      wednesday: { open: "07:00", close: "17:00" },
      thursday: { open: "07:00", close: "17:00" },
      friday: { open: "07:00", close: "17:00" },
      saturday: { open: "08:00", close: "18:00" },
      sunday: { open: "08:00", close: "18:00" }
    },
    faqs: [
      {
        id: "faq-1",
        question: "Do you have free Wi-Fi?",
        answer: "Yes, we offer high-speed Wi-Fi with seating limits of 2 hours during peak weekend hours."
      },
      {
        id: "faq-2",
        question: "Can I rent the cafe for private events?",
        answer: "Absolutely. We host corporate tastings, coffee education classes, and private gatherings after 6:00 PM."
      }
    ]
  }
];

export const getMockAnalytics = (profileId) => {
  // Return interactive, premium-looking analytics tailored to profile
  const baseViews = profileId === "alex-rivera" ? 1420 : 850;
  const baseClicks = profileId === "alex-rivera" ? 482 : 210;

  // Generate 7-day stats
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const viewsSeries = [12, 18, 15, 22, 34, 45, 30].map(multiplier => Math.round(multiplier * (baseViews / 176)));
  const clicksSeries = [4, 7, 5, 8, 14, 21, 10].map(multiplier => Math.round(multiplier * (baseClicks / 69)));
  
  const dailyData = days.map((day, idx) => ({
    name: day,
    views: viewsSeries[idx],
    clicks: clicksSeries[idx]
  }));

  const linkStats = [
    { name: "View Portfolio Site", clicks: Math.round(baseClicks * 0.65), ctr: "31.2%" },
    { name: "Download Case Study PDF", clicks: Math.round(baseClicks * 0.20), ctr: "9.6%" },
    { name: "Save Contact VCF", clicks: Math.round(baseClicks * 0.15), ctr: "7.2%" }
  ];

  const referrers = [
    { name: "QR Code Scan", value: 58, color: "#10b981" },
    { name: "LinkedIn Link", value: 24, color: "#0077b5" },
    { name: "Instagram Bio", value: 12, color: "#e1306c" },
    { name: "Direct / Other", value: 6, color: "#6b7280" }
  ];

  const devices = [
    { name: "iPhone / iOS", value: 72, color: "#a855f7" },
    { name: "Android Mobile", value: 21, color: "#3b82f6" },
    { name: "Desktop / Safari", value: 7, color: "#f59e0b" }
  ];

  return {
    totalViews: baseViews,
    totalClicks: baseClicks,
    ctr: ((baseClicks / baseViews) * 100).toFixed(1) + "%",
    dailyData,
    linkStats,
    referrers,
    devices
  };
};
