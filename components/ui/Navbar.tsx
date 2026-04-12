"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { 
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userDoc = await getDoc(doc(db, "users", u.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          // Initialize user data if not exists
          const newData = {
            displayName: u.displayName || "공부왕",
            attendanceCount: 1,
            lastCheckIn: new Date().toISOString()
          };
          await setDoc(doc(db, "users", u.uid), newData);
          setUserData(newData);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-xl" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-soft)" }}>
      <div className="max-w-7xl mx-auto px-3 md:px-8 h-14 md:h-16 flex items-center justify-between gap-3">
        {/* Branding */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-all overflow-hidden border" style={{ background: "linear-gradient(180deg, var(--surface-strong), var(--surface))", borderColor: "var(--border)", boxShadow: "var(--shadow-soft)" }}>
            <img src="/logo-mark.svg" alt="Nihongo LAB" className="w-full h-full object-contain p-1" />
          </div>
          <span className="text-base sm:text-xl md:text-2xl font-black tracking-tighter font-display" style={{ color: "var(--text-strong)" }}>
            にほんご <span className="text-primary">(일본어)</span> LAB
          </span>
        </div>

        {/* Action Area */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[11px] font-black tracking-[0.22em] uppercase" style={{ color: "var(--text-soft)" }}>Attendance</span>
                <span className="text-sm font-black text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                  {userData?.attendanceCount || 1}일째 출석 중!
                </span>
              </div>
              <div className="flex items-center gap-2 p-1.5 md:p-2 rounded-2xl border" style={{ backgroundColor: "var(--surface-muted)", borderColor: "var(--border)" }}>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center border shadow-sm" style={{ backgroundColor: "var(--surface-strong)", color: "var(--text-strong)", borderColor: "var(--border)" }}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="p" className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <span className="hidden md:block text-sm font-black pr-2" style={{ color: "var(--text-strong)" }}>
                  {userData?.displayName || user.displayName || '학습자'}님
                </span>
                <button 
                  onClick={handleLogout} 
                  className="p-2 rounded-xl transition-colors font-black"
                  style={{ color: "var(--text-strong)" }}
                  aria-label="로그아웃"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-4">
              <Link href="/auth">
                <button className="luxury-button px-4 py-2 md:px-6 md:py-2.5 bg-primary text-white text-xs sm:text-sm md:text-base font-black rounded-2xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all whitespace-nowrap">
                  가입하기
                </button>
              </Link>
            </div>
          )}
          <div className="pl-2 ml-1 md:ml-2 border-l" style={{ borderColor: "var(--border)" }}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
