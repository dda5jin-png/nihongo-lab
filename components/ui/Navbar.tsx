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
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-zinc-950 border-b-2 border-black dark:border-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-12 md:h-16 flex items-center justify-between">
        {/* Branding */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:rotate-6 transition-all overflow-hidden border-2 border-black dark:border-white">
            <img src="/logo.png" alt="Nihongo LAB" className="w-full h-full object-contain p-1.5" />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-black dark:text-white font-display">
            にほんご <span className="text-primary">(일본어)</span> LAB
          </span>
        </div>

        {/* Action Area */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-black text-black dark:text-zinc-600">성실함 점수</span>
                <span className="text-sm font-black text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                  {userData?.attendanceCount || 1}일째 출석 중!
                </span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1.5 md:p-2 rounded-2xl border-2 border-black">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-zinc-700 rounded-xl flex items-center justify-center text-black border-2 border-black shadow-sm">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="p" className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <span className="hidden md:block text-sm font-black pr-2 text-black dark:text-zinc-200">
                  {userData?.displayName || user.displayName || '학습자'}님
                </span>
                <button 
                  onClick={handleLogout} 
                  className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors text-black font-black"
                  aria-label="로그아웃"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/auth">
                <button className="px-5 py-2 md:px-6 md:py-2.5 bg-primary text-white text-sm md:text-base font-black rounded-2xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
                  가입하기
                </button>
              </Link>
            </div>
          )}
          <div className="pl-2 border-l border-zinc-200 dark:border-zinc-800 ml-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
