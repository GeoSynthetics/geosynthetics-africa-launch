import { notFound } from "@tanstack/react-router";
import { getLocalizedPage, type LocalLang, type LocalizedPage } from "@/i18n/localized-pages";

export function loadLocalizedPage(lang: LocalLang, slug: string): { page: LocalizedPage } {
  const page = getLocalizedPage(lang, slug);
  if (!page) throw notFound();
  return { page };
}

export function localizedHead(page: LocalizedPage | undefined) {
  if (!page) return {};
  const faq =
    page.faqs.length > 0
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              inLanguage: page.lang,
              mainEntity: page.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          },
        ]
      : [];
  return {
    meta: [
      { title: page.title },
      { name: "description", content: page.description },
      { property: "og:title", content: page.title },
      { property: "og:description", content: page.description },
      { property: "og:locale", content: page.lang === "fr" ? "fr_FR" : "pt_PT" },
    ],
    scripts: faq,
  };
}
