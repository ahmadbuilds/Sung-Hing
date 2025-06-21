import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
const inter=Inter({
  variable:"--font-inter-mono",
  subsets:["latin"],
})

// Enhanced metadata for better SEO
export const metadata: Metadata = {
  title: {
    default: "Sun Hing - Premium Asian Food Products & Ingredients",
    template: "%s | Sun Hing"
  },
  description: "Discover authentic Asian food products, premium ingredients, and traditional recipes. Sun Hing offers coconut products, rice, canned meat, seafood, and dried mushrooms from trusted brands like Black and White, Parrot, and Longevity Brand.",
  keywords: [
    "Asian food products",
    "coconut products",
    "premium rice",
    "canned meat",
    "canned seafood",
    "dried mushrooms",
    "Asian ingredients",
    "traditional recipes",
    "Black and White brand",
    "Parrot brand",
    "Longevity Brand",
    "Sun Hing"
  ],
  authors: [{ name: "Sun Hing" }],
  creator: "Sun Hing",
  publisher: "Sun Hing",
  
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sunhing.com",
    siteName: "Sun Hing",
    title: "Sun Hing - Premium Asian Food Products & Ingredients",
    description: "Discover authentic Asian food products, premium ingredients, and traditional recipes. Quality guaranteed from trusted brands.",
    images: [
      {
        url: "/og-image.jpg", //here will come the url of the openGraph
        width: 1200,
        height: 630,
        alt: "Sun Hing - Premium Asian Food Products",
      },
    ],
  },
  
  
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
  
  
  
  alternates: {
    canonical: "https://sunhing.com", 
  },
  
  category: "food",
  classification: "Business",
  
  applicationName: "Sun Hing",
  referrer: "origin-when-cross-origin",
  
  
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen">
          <Header/>
          {children}
          {/* Footer */}
          <Footer/>
        </div>
      </body>
    </html>
  );
}
