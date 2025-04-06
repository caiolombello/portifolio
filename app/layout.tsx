import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { AuthProvider } from "@/contexts/auth-context"
import DynamicTitle from "@/components/dynamic-title"
import { getBlob } from "@/lib/blob-storage"

const inter = Inter({ subsets: ["latin"] })

async function getSiteSettings() {
  try {
    const settings = await getBlob("settings.json")
    if (!settings) {
      return {
        siteName: "Caio Lombello",
        baseUrl: "https://caiolombelllo.com",
        contactEmail: "contato@caiolombelllo.com",
        socialLinks: {
          github: "https://github.com/caiolombello",
          linkedin: "https://linkedin.com/in/caiolombello",
          twitter: "https://twitter.com/caiolombello",
        },
      }
    }
    return JSON.parse(settings)
  } catch (error) {
    console.error("Erro ao carregar configurações:", error)
    return {
      siteName: "Caio Lombello",
      baseUrl: "https://caiolombelllo.com",
      contactEmail: "contato@caiolombelllo.com",
      socialLinks: {
        github: "https://github.com/caiolombello",
        linkedin: "https://linkedin.com/in/caiolombello",
        twitter: "https://twitter.com/caiolombello",
      },
    }
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const seoSettings = await getBlob("seo.json")

  let metadata: Metadata = {
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: "Portfólio de Caio Lombello, DevOps & Cloud Engineer",
    keywords: [
      "DevOps",
      "Cloud",
      "Kubernetes",
      "Docker",
      "AWS",
      "CI/CD",
      "Infraestrutura",
      "Software",
      "Engenharia",
    ],
    authors: [{ name: "Caio Lombello" }],
    creator: "Caio Lombello",
    publisher: "Caio Lombello",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: settings.baseUrl,
      title: settings.siteName,
      description: "Portfólio de Caio Lombello, DevOps & Cloud Engineer",
      siteName: settings.siteName,
      images: [
        {
          url: `${settings.baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: settings.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteName,
      description: "Portfólio de Caio Lombello, DevOps & Cloud Engineer",
      images: [`${settings.baseUrl}/og-image.jpg`],
      creator: "@caiolombello",
    },
    verification: {
      google: "google-site-verification-code",
      yandex: "yandex-verification-code",
      yahoo: "yahoo-verification-code",
    },
    alternates: {
      canonical: settings.baseUrl,
      languages: {
        "pt-BR": settings.baseUrl,
        "en-US": `${settings.baseUrl}/en`,
      },
    },
    category: "technology",
    themeColor: "#121212",
    colorScheme: "dark",
    generator: "Next.js",
  }

  if (seoSettings) {
    try {
      const seo = JSON.parse(seoSettings)
      metadata = {
        ...metadata,
        ...seo,
      }
    } catch (error) {
      console.error("Erro ao carregar configurações de SEO:", error)
    }
  }

  return metadata
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="msapplication-TileColor" content={metadata.themeColor} />
        <meta name="theme-color" content={metadata.themeColor} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={metadata.title.default} />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://caiolombelllo.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Caio Lombello",
              url: "https://caiolombelllo.com",
              sameAs: [
                "https://github.com/caiolombello",
                "https://linkedin.com/in/caiolombello",
                "https://twitter.com/caiolombello",
              ],
              jobTitle: "DevOps & Cloud Engineer",
              worksFor: {
                "@type": "Organization",
                name: "Freelancer",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AuthProvider>
              <DynamicTitle />
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <ScrollToTop />
              </div>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'