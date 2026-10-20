import { getCurrentLocale } from "@/lib/i18n-server";
import { generateWebsiteJsonLd } from "@/lib/seo";
import { HomeHero } from "./_components/home-hero";

export default async function Home() {
  const locale = await getCurrentLocale();
  const websiteJsonLd = generateWebsiteJsonLd(locale);

  return (
    <div className="w-full">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <HomeHero />
      </div>
    </div>
  );
}
