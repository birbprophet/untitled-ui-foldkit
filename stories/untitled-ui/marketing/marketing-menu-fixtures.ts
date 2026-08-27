export const marketingMenuIconPaths = {
  book: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  lifeBuoy: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 8v4l3 3",
  play: "M9 9.003a1 1 0 0 1 1.532-.845l6.113 3.558a1 1 0 0 1 0 1.69l-6.113 3.558A1 1 0 0 1 9 14.996V9.003Z",
  stars:
    "m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z",
} as const;

export const marketingMenuItems = [
  {
    href: "/blog",
    iconPath: marketingMenuIconPaths.book,
    id: "blog",
    subtitle: "The latest industry news and guides curated by our expert team.",
    title: "Blog",
  },
  {
    href: "/customer-stories",
    iconPath: marketingMenuIconPaths.stars,
    id: "customer-stories",
    subtitle: "Learn how customers use Siglata to run the same report every time.",
    title: "Customer stories",
  },
  {
    href: "/tutorials",
    iconPath: marketingMenuIconPaths.play,
    id: "tutorials",
    subtitle: "Get up and running on our newest features and in-depth guides.",
    title: "Video tutorials",
  },
  {
    href: "/docs",
    iconPath: marketingMenuIconPaths.code,
    id: "docs",
    subtitle: "In-depth articles on our tools and technologies to empower teams.",
    title: "Documentation",
  },
  {
    href: "/help",
    iconPath: marketingMenuIconPaths.lifeBuoy,
    id: "help",
    subtitle: "Need help with something? Our expert team is here to help 24/7.",
    title: "Help and support",
  },
] as const;

export const marketingMenuColumns = [
  {
    id: "product",
    items: marketingMenuItems.slice(0, 3),
    title: "Product",
  },
  {
    id: "resources",
    items: marketingMenuItems.slice(3),
    title: "Resources",
  },
] as const;

export const marketingMenuFooterActions = [
  { href: "#", iconPath: marketingMenuIconPaths.book, id: "changelog", label: "Changelog" },
  { href: "#", iconPath: marketingMenuIconPaths.code, id: "api", label: "API" },
  { href: "#", iconPath: marketingMenuIconPaths.lifeBuoy, id: "support", label: "Support" },
] as const;

export const marketingMenuBlogPosts = [
  {
    href: "#",
    id: "auto-layout",
    imageAlt: "Auto Layout explained",
    imageSrc: "https://www.untitledui.com/marketing/auto-layout.webp",
    subtitle: "Jump right in—get an overview of the basics and fundamentals of auto layout.",
    title: "Auto Layout explained",
  },
  {
    href: "#",
    id: "product-design",
    imageAlt: "Top techniques to level up your product design",
    imageSrc: "https://www.untitledui.com/marketing/man-and-laptop.webp",
    subtitle: "The latest best practices and tips from the best in the industry.",
    title: "Top techniques to level up your product design",
  },
  {
    href: "#",
    id: "affinity",
    imageAlt: "Synthesize data like a pro",
    imageSrc: "https://www.untitledui.com/marketing/typing-girl.webp",
    subtitle: "Synthesis is the rabbit hole every data scientist learns eventually.",
    title: "Synthesize data like a pro through affinity diagramming",
  },
] as const;

export const marketingMenuCategoryItems = [
  { href: "#", id: "design", title: "Design" },
  { href: "#", id: "product", title: "Product" },
  { href: "#", id: "data", title: "Data analytics" },
  { href: "#", id: "marketing", title: "Marketing & growth" },
  { href: "#", id: "success", title: "Customer success" },
  { href: "#", id: "collaboration", title: "Team collaboration" },
] as const;

export const marketingMenuTutorials = [
  {
    description: "Learn how to build a clean and functional web app.",
    href: "#",
    id: "tutorial-1",
    imageAlt: "Build your first Robot",
    imageSrc: "https://www.untitledui.com/marketing/spirals.webp",
    title: "Build your first Robot",
    watchLabel: "Watch",
  },
  {
    description: "Learn how to design a clean and modern web app.",
    href: "#",
    id: "tutorial-2",
    imageAlt: "Design a web app",
    imageSrc: "https://www.untitledui.com/marketing/conversation.webp",
    title: "Design a web app",
    watchLabel: "Watch",
  },
] as const;

export const marketingMenuGetStartedItems = [
  { href: "#", id: "overview", title: "Overview" },
  { href: "#", id: "features", title: "Features" },
  { href: "#", id: "pricing", title: "Pricing" },
] as const;

export const marketingHeaderItems = [
  { hasMenu: true, id: "products", label: "Products" },
  { hasMenu: true, id: "services", label: "Services" },
  { href: "/pricing", id: "pricing", label: "Pricing" },
  { hasMenu: true, id: "resources", label: "Resources" },
  { href: "/about", id: "about", label: "About" },
] as const;

export const marketingHeaderFooterLinks = [
  { href: "/", id: "about-us", label: "About us" },
  { href: "/press", id: "press", label: "Press" },
  { href: "/careers", id: "careers", label: "Careers" },
  { href: "/legal", id: "legal", label: "Legal" },
  { href: "/support", id: "support", label: "Support" },
  { href: "/contact", id: "contact", label: "Contact" },
  { href: "/sitemap", id: "sitemap", label: "Sitemap" },
  { href: "/cookies", id: "cookies", label: "Cookie settings" },
] as const;
