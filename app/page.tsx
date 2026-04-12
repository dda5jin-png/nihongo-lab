"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Star, Play, Lock, ChevronRight, CheckCircle2, HelpCircle, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { 
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import UsageGuide from "@/components/ui/UsageGuide";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [showGuide, setShowGuide] = useState(false);
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
  };

  const missions = [
    { id: 1, title: "레벨 1: 히라가나 기초", subtitle: "일본어의 시작! '아이우에오'를 배워요.", status: "학습 가능" },
    { id: 2, title: "레벨 2: 인사말 나누기", subtitle: "간단한 아침, 점심, 저녁 인사를 배워요.", status: "잠김", locked: true },
    { id: 3, title: "레벨 3: 숫자 읽기", subtitle: "가격을 묻거나 숫자를 읽어보아요.", status: "잠김", locked: true },
  ];

  return (
    <div className="min-h-screen bg-[#fdfdfd] dark:bg-zinc-950 font-sans selection:bg-primary/10">
      <UsageGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
      
      {/* Home Modern Header */}
      <header className="sticky top-0 z-50 w-full glass-effect border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-all overflow-hidden border border-zinc-100 dark:border-zinc-800">
              <img src="/logo.png" alt="Nihongo LAB" className="w-full h-full object-contain p-1.5" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-zinc-800 dark:text-white font-display">
              니혼고 <span className="text-primary">LAB</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs md:text-sm font-bold text-zinc-400">성실함 점수</span>
                  <span className="text-sm md:text-base font-black text-primary px-3 py-1 bg-primary/10 rounded-full">
                    {userData?.attendanceCount || 1}일째 출석 중!
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1.5 md:p-2 rounded-2xl">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-zinc-700 rounded-xl flex items-center justify-center text-zinc-400">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="p" className="w-full h-full rounded-xl object-cover" />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <span className="hidden md:block font-black pr-2">{userData?.displayName || user.displayName || '학습자'}님</span>
                  <button onClick={handleLogout} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors text-zinc-500">
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20"
                >
                  가입하기
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-20">
        {/* Hero Section */}
        <section className="mb-16 md:mb-24 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-sm mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Nihongo Lab Premium Study
          </motion.div>
          
          <div className="flex flex-col items-center gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-[40px] shadow-premium flex items-center justify-center overflow-hidden border border-zinc-50"
            >
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-4 md:p-6" />
            </motion.div>
            
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-4 font-display"
              >
                니혼고 <span className="text-primary">LAB</span>
              </motion.h1>
              
              <motion.button 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => setShowGuide(true)}
                className="mx-auto px-6 py-3 bg-white dark:bg-zinc-900 rounded-3xl text-lg font-bold text-zinc-400 hover:text-primary transition-all flex items-center gap-2 shadow-sm border border-zinc-100 dark:border-zinc-800"
              >
                <HelpCircle size={24} />
                <span>니혼고 LAB 사용법</span>
              </motion.button>
            </div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl text-zinc-400 dark:text-zinc-500 font-medium leading-tight max-w-3xl mx-auto text-center"
          >
            부드럽고 우아한 시니어 맞춤형 <br className="hidden sm:block" />
            일본어 학습 연구소에 오신 것을 환영합니다.
          </motion.p>
        </section>

        {/* Hero Card */}
        <section className="relative">
          <div className="card-premium glass-effect bg-primary text-white border-none overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <BookOpen size={200} />
            </div>
            <div className="relative z-10 space-y-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-black">오늘의 학습을 시작할까요?</h2>
                <p className="text-xl opacity-80 max-w-lg">이전에 학습하던 단어들을 다시 복습하거나 새로운 미션에 도전해보세요.</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/study" className="btn-premium bg-white text-primary hover:bg-zinc-50 border-none shadow-xl">
                  <Play size={28} fill="currentColor" />
                  <span>학습 이어가기</span>
                </Link>
                <Link href="/vault" className="btn-premium glass-effect text-white border-white/20 hover:bg-white/10">
                  <Star size={28} />
                  <span>내 보관함</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Selection */}
        <section className="space-y-8 pb-24">
          <div className="flex items-end justify-between px-2">
            <div className="space-y-2">
              <h3 className="text-premium-headline">미션 리스트</h3>
              <p className="text-muted-foreground font-medium">체계적인 단계별 학습을 제공합니다.</p>
            </div>
          </div>
          
          <div className="grid gap-6">
            {missions.map((mission) => (
              <Link 
                key={mission.id}
                href={mission.locked ? "#" : `/study?level=${mission.id}`}
                className={`card-premium group ${mission.locked ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:border-primary/30'} flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 md:p-12`}
              >
                <div className="flex items-start gap-8">
                  <div className={`touch-target rounded-3xl ${mission.locked ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-primary/5 text-primary'} shrink-0`}>
                    <span className="text-2xl font-black">{mission.id}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-muted-foreground tracking-widest uppercase">Level 0{mission.id}</span>
                      {mission.locked && <Lock size={16} className="text-muted-foreground" />}
                    </div>
                    <h4 className="text-3xl font-black tracking-tight">{mission.title}</h4>
                    <p className="text-xl text-muted-foreground leading-relaxed">{mission.subtitle}</p>
                  </div>
                </div>
                
                <div className={`btn-premium w-full md:w-auto h-20 ${mission.locked ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-none' : 'bg-secondary text-primary border-none group-hover:bg-primary group-hover:text-white'}`}>
                  {mission.locked ? '학습 불가' : (
                    <>
                      <span>학습 시작</span>
                      <ChevronRight size={28} />
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <p className="text-zinc-400 font-medium">© 2026 니혼고 LAB. 시니어를 위한 가장 쉬운 일본어 연구소.</p>
        </footer>
      </main>
    </div>
  );
}
