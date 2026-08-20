import { HeroData, ServiceData, AboutUsData, SocialLinkItem } from "@/types/home";

// ─────────────────────────────────────────────────────────────────────────────
// Available Social Icons configuration for the dropdown selector
// ─────────────────────────────────────────────────────────────────────────────
export interface SocialIconOption {
  name: string;
  label: string;
  placeholder: string;
}

export const AVAILABLE_SOCIAL_ICONS: SocialIconOption[] = [
  { name: "Twitter", label: "Twitter / X", placeholder: "https://x.com/username" },
  { name: "Instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
  { name: "Github", label: "GitHub", placeholder: "https://github.com/username" },
  { name: "Linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  { name: "Facebook", label: "Facebook", placeholder: "https://facebook.com/username" },
  { name: "Youtube", label: "YouTube", placeholder: "https://youtube.com/@channel" },
  { name: "Dribbble", label: "Dribbble", placeholder: "https://dribbble.com/username" },
  { name: "Globe", label: "Website", placeholder: "https://example.com" },
  { name: "Mail", label: "Email", placeholder: "mailto:hello@example.com" },
  { name: "Phone", label: "Phone", placeholder: "tel:+15551234567" },
  { name: "MapPin", label: "Location", placeholder: "123 Innovation Drive, NY" },
  { name: "Send", label: "Telegram", placeholder: "https://t.me/username" },
];

export const DEFAULT_SOCIAL_LINKS: SocialLinkItem[] = [
  { id: "1", iconName: "Twitter", url: "https://x.com", label: "Twitter / X" },
  { id: "2", iconName: "Instagram", url: "https://instagram.com", label: "Instagram" },
  { id: "3", iconName: "Github", url: "https://github.com", label: "GitHub" },
  { id: "4", iconName: "Linkedin", url: "https://linkedin.com", label: "LinkedIn" },
];

export const DEFAULT_HERO: HeroData = {
  logoUrl: "/BusinessBearLogo.png",
  title: "Welcome to Business Bear",
  description:
    "Welcome to our digital agency where innovation meets aesthetics. We specialize in transforming complex challenges into elegant, robust, and intuitive software solutions. Partner with us to elevate your brand's digital presence and build scalable products that your users will love.",
};

export const DEFAULT_ABOUT: AboutUsData = {
  fullName: "Hasibul Hasan",
  designation: "Lead Software Engineer & Designer",
  bio: "With over a decade of experience in software architecture and interactive design, I focus on bridging the gap between engineering and art. My mission is to build digital products that are not only extremely performant and scalable but also deeply engaging and visually breathtaking.",
  avatarUrl: "/ProfilePicture.png",
  email: "hello@businessbear.com",
  phone: "+1 (555) 123-4567",
  location: "123 Innovation Drive, NY",
  socialLinksJson: JSON.stringify(DEFAULT_SOCIAL_LINKS),
};

export const DEFAULT_SERVICES: ServiceData[] = [
  { id: 1, title: "Web Development",       description: "Building robust, scalable, and responsive web applications using cutting-edge technologies.",                              iconName: "Code",       isActive: true, displayOrder: 1 },
  { id: 2, title: "UI/UX Design",          description: "Crafting intuitive and engaging user experiences with modern aesthetics and user-centered design.",                        iconName: "Palette",    isActive: true, displayOrder: 2 },
  { id: 3, title: "Mobile App Development",description: "Developing cross-platform mobile applications that provide seamless experiences on all devices.",                          iconName: "Smartphone", isActive: true, displayOrder: 3 },
  { id: 4, title: "Frontend Engineering",  description: "Creating highly interactive and performant front-end interfaces using React and Next.js.",                                iconName: "Layout",     isActive: true, displayOrder: 4 },
  { id: 5, title: "Backend Solutions",     description: "Designing secure and scalable server-side architectures, APIs, and database structures.",                                 iconName: "Server",     isActive: true, displayOrder: 5 },
  { id: 6, title: "Digital Marketing",     description: "Enhancing brand presence and driving growth through data-driven digital marketing strategies.",                           iconName: "Megaphone",  isActive: true, displayOrder: 6 },
];

export function parseSocialLinks(jsonStr?: string): SocialLinkItem[] {
  if (!jsonStr) return DEFAULT_SOCIAL_LINKS;
  try {
    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SOCIAL_LINKS;
  } catch {
    return DEFAULT_SOCIAL_LINKS;
  }
}

export function stringifySocialLinks(links: SocialLinkItem[]): string {
  return JSON.stringify(links);
}

export function withDefaults<T extends object>(defaults: T, data?: Partial<T> | null): T {
  if (!data) return { ...defaults };

  return Object.fromEntries(
    Object.entries(defaults).map(([key, defaultVal]) => {
      const apiVal = (data as Record<string, unknown>)[key];
      const resolved = apiVal !== undefined && apiVal !== null && apiVal !== ""
        ? apiVal
        : defaultVal;
      return [key, resolved];
    })
  ) as T;
}
