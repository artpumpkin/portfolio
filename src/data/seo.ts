import { profile } from "./portfolio";

export const siteUrl = "https://lachkar.me/";
export const seoTitle = `${profile.name} — Senior Software Engineer`;
export const seoDescription =
  "Senior software engineer and technical lead in Casablanca, Morocco. Full-stack products with React, Next.js and TypeScript, backed by Node.js.";

export const portfolioStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      url: siteUrl,
      name: "Lachkar",
      alternateName: profile.name,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}#profile`,
      url: siteUrl,
      name: seoTitle,
      description: seoDescription,
      inLanguage: "en",
      isPartOf: { "@id": `${siteUrl}#website` },
      mainEntity: { "@id": `${siteUrl}#person` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}#person`,
      name: profile.name,
      url: siteUrl,
      jobTitle: "Senior Software Engineer & Technical Lead",
      description: seoDescription,
      sameAs: [profile.github, profile.linkedin],
      homeLocation: {
        "@type": "Place",
        name: profile.location,
      },
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "Full-stack development",
        "Technical leadership",
        "AI-assisted development",
      ],
    },
  ],
};
