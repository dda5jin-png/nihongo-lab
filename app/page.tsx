"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Star, Play, Lock, ChevronRight, HelpCircle, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { 
  onAuthStateChanged,
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

  const missions = [
    { id: 1, title: "레벨 1: 히라가나 기초", subtitle: "일본어의 시작! '아이우에오'를 배워요.", status: "학습 가능" },
    { id: 2, title: "레벨 2: 인사말 나누기", subtitle: "간단한 아침, 점심, 저녁 인사를 배워요.", status: "잠김", locked: true },
    { id: 3, title: "레벨 3: 숫자 읽기", subtitle: "가격을 묻거나 숫자를 읽어보아요.", status: "잠김", locked: true },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-zinc-950 font-sans selection:bg-primary/10 flex flex-col">
      <UsageGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-20 flex-1 w-full">
        {/* Hero Section */}
        <section className="mb-12 md:mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-sm mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            にほんご (일본어) LAB - Premium Study
          </motion.div>
          
          <div className="flex flex-col items-center gap-8 mb-12">
            <div className="text-center space-y-8">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-9xl font-black tracking-tighter leading-none font-display text-zinc-900 dark:text-white"
              >
                にほんご <span className="text-primary text-5xl md:text-7xl block md:inline">(일본어)</span> LAB
              </motion.h1>
              
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGuide(true)}
                className="mx-auto px-10 py-6 bg-gradient-to-r from-primary to-orange-500 rounded-[2.5rem] text-xl md:text-3xl font-black text-white shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center gap-4 border-4 border-white dark:border-zinc-800"
              >
                <HelpCircle size={40} className="animate-bounce" />
                <span>📢 처음 오신 분! 이용 방법 확인하기</span>
              </motion.button>
            </div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl text-zinc-400 dark:text-zinc-500 font-medium leading-tight max-w-4xl mx-auto"
          >
            누구에게나 즐겁고 세상에서 가장 쉬운 <br className="hidden sm:block" />
            일본어 학습 연구소에 오신 것을 환영합니다.
          </motion.p>
        </section>

        {/* Hero Card */}
        <section className="relative mb-20">
          <div className="card-premium glass-effect bg-primary text-white border-none overflow-hidden group p-10 md:p-16">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <BookOpen size={200} />
            </div>
            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black">오늘의 학습을 시작할까요?</h2>
                <p className="text-xl opacity-80 max-w-lg font-medium italic">
                  "매일 조금씩 공부하는 습관이 실력을 만듭니다."
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/study" className="px-8 py-5 bg-white text-primary rounded-3xl text-xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                  <Play size={28} fill="currentColor" />
                  <span>학습 이어가기</span>
                </Link>
                <Link href="/vault" className="px-8 py-5 bg-primary-foreground/10 text-white border-2 border-white/20 rounded-3xl text-xl font-black hover:bg-white/10 transition-all flex items-center gap-3">
                  <Star size={28} />
                  <span>내 보관함</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Selection */}
        <section className="space-y-12 pb-24">
          <div className="flex items-end justify-between px-2">
            <div className="space-y-2">
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">학습 단계 선택</h3>
              <p className="text-xl md:text-2xl text-zinc-400 font-bold">체계적인 단계별 학습을 제공합니다.</p>
            </div>
          </div>
          
          <div className="grid gap-8">
            {missions.map((mission) => (
              <Link 
                key={mission.id}
                href={mission.locked ? "#" : `/study?level=${mission.id}`}
                className={`card-premium group ${mission.locked ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:border-primary/50 hover:bg-white dark:hover:bg-zinc-900 shadow-xl'} flex flex-col md:flex-row md:items-center justify-between gap-8 p-10 md:p-14 border-2 border-zinc-100 dark:border-zinc-800 transition-all`}
              >
                <div className="flex items-start gap-10">
                  <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl font-black ${mission.locked ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400' : 'bg-primary/10 text-primary shadow-inner'}`}>
                    {mission.id}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm md:text-base font-black text-primary tracking-widest uppercase">Lesson 0{mission.id}</span>
                      {mission.locked && <Lock size={20} className="text-zinc-400" />}
                    </div>
                    <h4 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-800 dark:text-zinc-100">{mission.title}</h4>
                    <p className="text-xl md:text-2xl text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed">{mission.subtitle}</p>
                  </div>
                </div>
                
                <div className={`px-10 h-20 rounded-3xl flex items-center justify-center gap-3 text-xl font-black transition-all ${mission.locked ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400' : 'bg-zinc-100 dark:bg-zinc-800 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                  {mission.locked ? '준비 중' : (
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
        <footer className="mt-20 pt-10 border-t border-zinc-100 dark:border-zinc-800 text-center pb-20">
          <p className="text-zinc-400 font-bold text-lg italic">© 2026 にほんご (일본어) LAB. 일본어를 시작하는 모든 분을 위한 가장 쉬운 연구소.</p>
        </footer>
      </main>
    </div>
  );
}
