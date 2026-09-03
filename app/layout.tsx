import type { Metadata } from "next";
import { Black_Han_Sans, Share_Tech_Mono, Press_Start_2P } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const blackHanSans = Black_Han_Sans({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-mono",
  weight: "400",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ayomide Oshilaja — Interactive Portfolio",
  description:
    "A Persona 5 RPG + Cyberpunk Brutalism styled interactive portfolio, built as a fully functional desktop OS in the browser.",
};

const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('persona-os-theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${blackHanSans.variable} ${shareTechMono.variable} ${pressStart2P.variable} h-full antialiased`}
    >
      <body className="min-h-full h-full overflow-hidden">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
