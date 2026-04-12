"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="touch-target w-[64px] h-[64px]" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="btn-premium glass-effect touch-target relative overflow-hidden group border-none"
      title="테마 전환 (밝게/어둡게)"
    >
      <div className="relative w-8 h-8">
        <Sun className={`absolute inset-0 h-full w-full transition-all duration-500 transform ${
          theme === 'dark' ? 'translate-y-12 opacity-0 rotate-90' : 'translate-y-0 opacity-100 rotate-0'
        }`} />
        <Moon className={`absolute inset-0 h-full w-full transition-all duration-500 transform ${
          theme === 'dark' ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-12 opacity-0 -rotate-90'
        }`} />
      </div>
      <span className="sr-only">테마 전환</span>
    </button>
  );
}
