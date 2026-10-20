import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getCurrentLocale, getCurrentDictionary } from "@/lib/i18n-server";
import { generatePageSeo, generateOrganizationJsonLd } from "@/lib/seo";
import { ThemeProvider } from "./providers";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { BottomNav } from "@/components/shared/bottom-nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getCurrentDictionary();

  return {
    ...generatePageSeo({
      title: dict.metadata.title,
      description: dict.metadata.description,
      locale,
    }),
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: dict.metadata.title,
    },
    formatDetection: {
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#059669" },
    { media: "(prefers-color-scheme: dark)", color: "#090d16" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getCurrentLocale();
  const { dict } = await getCurrentDictionary();
  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* JSON-LD Structured Data — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header appName={dict.common.appName} />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
