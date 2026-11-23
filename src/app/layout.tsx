import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Libre de Ansiedad | Psicología & Bienestar",
  description: "Un espacio para aprender, comprender y cuidar tu bienestar emocional y mental con rigor científico y calidez humana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`h-full scroll-smooth ${plusJakartaSans.variable} ${fraunces.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet" />
        {/* Aplica el tamaño de letra elegido antes de pintar, para que no "salte" */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{var s=localStorage.getItem('lda-font-scale');if(s){document.documentElement.style.setProperty('--lda-font-scale',s)}}catch(e){}",
          }}
        />
      </head>
      <body className="bg-paper font-body-md text-ink antialiased min-h-screen flex flex-col">
        <Header />
        <main className="w-full flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
