import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/auth-context";
import { ReactQueryProvider } from "@/contexts/query-client-provider";

const BASE_URL = 'https://motionforce.io';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "MotionForce — AI Content Creation Platform",
    template: "%s | MotionForce",
  },
  description:
    "Create viral AI videos, music, and voice content in minutes. MotionForce combines Sora 2, VEO 3.1, Kling 3.0, ElevenLabs, and Suno AI in one powerful platform.",
  keywords: [
    "AI video generator",
    "AI content creation",
    "text to video AI",
    "AI image generator",
    "AI music generator",
    "AI voice generator",
    "Sora 2",
    "VEO 3",
    "Kling AI",
    "ElevenLabs TTS",
    "Suno music",
    "video editor",
    "ASMR creator",
    "MotionForce",
  ],
  authors: [{ name: "MotionForce" }],
  creator: "MotionForce",
  publisher: "MotionForce",
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
    locale: "en_US",
    url: BASE_URL,
    siteName: "MotionForce",
    title: "MotionForce — AI Content Creation Platform",
    description:
      "Create viral AI videos, music, and voice content in minutes. Access Sora 2, VEO 3.1, Kling 3.0, and more — all in one platform.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MotionForce — AI Content Creation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@motionforce",
    creator: "@motionforce",
    title: "MotionForce — AI Content Creation Platform",
    description:
      "Create viral AI videos, music, and voice content in minutes. Access Sora 2, VEO 3.1, Kling 3.0, and more.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/logos/favicon.png" }],
    shortcut: "/logos/favicon.png",
    apple: "/logos/favicon.png",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "MotionForce",
              url: BASE_URL,
              description:
                "AI content creation platform for images, videos, music, and voice",
              potentialAction: {
                "@type": "SearchAction",
                target: `${BASE_URL}/blog?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              <main className="bg-black">
                {children}
                <Toaster />
              </main>
            </ThemeProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
