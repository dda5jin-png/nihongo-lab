import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/ui/Navbar";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const notoSerifJp = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "にほんご (일본어) LAB | 세상에서 가장 쉬운 일본어 학습",
  description: "일본어 공부를 시작하는 모든 분을 위한 가장 쉽고 즐거운 연구소, にほん고 (일본어) LAB입니다.",
  icons: {
    icon: "/logo-mark.svg",
    apple: "/logo-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className="notranslate" translate="no">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className={`${plusJakartaSans.variable} ${notoSerifJp.variable} min-h-screen bg-background text-foreground transition-colors duration-500`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
