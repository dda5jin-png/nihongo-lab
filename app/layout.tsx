import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "にほんご (일본어) LAB | 세상에서 가장 쉬운 일본어 학습",
  description: "일본어 공부를 시작하는 모든 분을 위한 가장 쉽고 즐거운 연구소, にほん고 (일본어) LAB입니다.",
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
      <body className={`${inter.className} min-h-screen bg-background text-foreground transition-colors duration-500`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex flex-col min-h-screen">
            {/* Global Modern Header */}
            <header className="sticky top-0 z-50 w-full glass-effect">
              <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                      <img src="/logo.png" alt="Nihongo LAB" className="w-10 h-10 object-contain group-hover:rotate-6 transition-transform" />
                      <span className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">
                        にほんご <span className="text-primary">(일본어)</span> LAB
                      </span>
                    </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm font-medium">
                    <span>출석률 92%</span>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </header>
            
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
