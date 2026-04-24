import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ErrorProvider } from "@/contexts/ErrorContext";
import { ConfirmDialogProvider } from "@/contexts/ConfirmDialogContext";
import { SnippetModalProvider } from "@/contexts/SnippetModalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SnippifyX - Smart Snippet Manager & Code Organizer",
  description: "Professional snippet manager for developers and content creators. Save, organize, and reuse code snippets with AI-powered suggestions. Free tier available with advanced features for teams.",
  keywords: "snippet manager, code organizer, developer tools, content management, AI snippets, programming tools, code library, developer productivity",
  authors: [{ name: "SnippifyX Team" }],
  creator: "SnippifyX",
  publisher: "SnippifyX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://SnippifyX.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "SnippifyX - Smart Snippet Manager",
    description: "Professional snippet manager for developers and content creators. Save, organize, and reuse code snippets with AI-powered suggestions.",
    url: 'https://SnippifyX.com',
    siteName: 'SnippifyX',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SnippifyX - Smart Snippet Manager',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "SnippifyX - Smart Snippet Manager",
    description: "Professional snippet manager for developers and content creators.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Force light mode - prevent dark class */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Remove dark class if it exists
              document.documentElement.classList.remove('dark');
              // Prevent dark class from being added
              const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                  if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (document.documentElement.classList.contains('dark')) {
                      document.documentElement.classList.remove('dark');
                    }
                  }
                });
              });
              observer.observe(document.documentElement, { attributes: true });
            `
          }}
        />
        
        {/* Force light color scheme */}
        <meta name="color-scheme" content="light" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "SnippifyX",
              "description": "Smart snippet manager for developers and content creators",
              "url": "https://SnippifyX.com",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free tier available"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250"
              }
            })
          }}
        />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and app icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className={inter.className}>
        <ConfirmDialogProvider>
          <ErrorProvider>
            <AuthProvider>
              <NotificationProvider>
                <SnippetModalProvider>
                  {children}
                </SnippetModalProvider>
              </NotificationProvider>
            </AuthProvider>
          </ErrorProvider>
        </ConfirmDialogProvider>
      </body>
    </html>
  );
}