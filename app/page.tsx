"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Star, Play, Lock, ChevronRight, HelpCircle, Sparkles, Flower2 } from "lucide-react";
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
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-20 flex-1 w-full relative">
        <div className="paper-grid" />
        {/* Hero Section */}
        <section className="mb-12 md:mb-16 text-center relative overflow-hidden rounded-[2.5rem] px-3 py-6 md:px-6 md:py-10">
          <div className="hero-orb w-40 h-40 md:w-64 md:h-64 -top-8 -left-8 md:left-12 bg-primary/15" />
          <div className="hero-orb w-24 h-24 md:w-36 md:h-36 top-12 right-2 md:right-24 bg-amber-300/40" />
          <div className="hero-orb w-20 h-20 bottom-4 left-10 bg-rose-200/50" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-xs md:text-sm mb-6 md:mb-8 border border-primary/15 relative z-10"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            にほんご (일본어) LAB - Premium Study
          </motion.div>
          
          <div className="flex flex-col items-center gap-6 md:gap-8 mb-10 md:mb-12 relative z-10">
            <div className="text-center space-y-6 md:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="luxury-label mx-auto relative z-10"
              >
                <Sparkles size={14} className="text-primary" />
                Easy Japanese Start
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-5xl sm:text-6xl md:text-9xl font-black tracking-tighter leading-[0.92] font-display"
                style={{ color: "var(--text-strong)" }}
              >
                にほんご <span className="text-primary text-5xl md:text-7xl block md:inline">(일본어)</span> LAB
              </motion.h1>
              
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGuide(true)}
                className="luxury-button mx-auto px-6 py-4 md:px-10 md:py-6 bg-gradient-to-r from-primary to-orange-500 rounded-[2rem] md:rounded-[2.5rem] text-lg md:text-3xl font-bold text-white shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center gap-3 md:gap-4 border"
                style={{ borderColor: "rgba(255,255,255,0.25)" }}
              >
                <HelpCircle size={28} className="animate-bounce md:w-10 md:h-10" />
                <span>처음 오신 분! 이용 방법 확인하기</span>
              </motion.button>
            </div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-xl sm:text-2xl md:text-4xl font-semibold leading-[1.45] max-w-4xl mx-auto relative z-10"
            style={{ color: "var(--text-muted)" }}
          >
            누구에게나 즐겁고 세상에서 가장 쉬운 <br className="hidden sm:block" />
            일본어 학습 연구소에 오신 것을 환영합니다.
          </motion.p>
        </section>

        {/* Hero Card */}
        <section className="relative mb-20">
          <div className="premium-card bg-primary text-white overflow-hidden group p-6 md:p-16 border-0 shadow-[0_30px_90px_-45px_rgba(184,106,79,0.7)] relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_left_bottom,rgba(255,213,153,0.22),transparent_30%)]" />
            <div className="absolute top-0 right-0 p-6 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <BookOpen size={160} className="md:w-[200px] md:h-[200px]" />
            </div>
            <div className="relative z-10 space-y-6 md:space-y-8">
              <div className="flex items-center gap-2 text-white/80 font-black text-xs sm:text-sm tracking-[0.28em] uppercase">
                <Flower2 size={16} />
                Today's gentle mission
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">오늘의 학습을 시작할까요?</h2>
                <p className="text-base md:text-xl opacity-80 max-w-lg font-medium italic leading-[1.7]">
                  "매일 조금씩 공부하는 습관이 실력을 만듭니다."
                </p>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
                <Link href="/study" className="luxury-button px-6 py-4 md:px-8 md:py-5 rounded-3xl text-lg md:text-xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3" style={{ backgroundColor: "rgba(255,255,255,0.94)", color: "var(--primary)" }}>
                  <Play size={24} fill="currentColor" className="md:w-7 md:h-7" />
                  <span>학습 이어가기</span>
                </Link>
                <Link href="/vault" className="px-6 py-4 md:px-8 md:py-5 text-white border rounded-3xl text-lg md:text-xl font-black hover:bg-white/10 transition-all flex items-center justify-center gap-3" style={{ borderColor: "rgba(255,255,255,0.28)", backgroundColor: "rgba(255,255,255,0.12)" }}>
                  <Star size={24} className="md:w-7 md:h-7" />
                  <span>내 보관함</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Selection */}
        <section className="space-y-12 pb-24">
          <div className="flex items-end justify-between px-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-3xl md:text-5xl font-black tracking-tighter" style={{ color: "var(--text-strong)" }}>학습 단계 선택</h3>
              <p className="text-lg md:text-2xl font-semibold leading-[1.6]" style={{ color: "var(--text-muted)" }}>체계적인 단계별 학습을 제공합니다.</p>
            </div>
          </div>
          
          <div className="grid gap-5 md:gap-8">
            {missions.map((mission) => (
              <Link 
                key={mission.id}
                href={mission.locked ? "#" : `/study?level=${mission.id}`}
                className={`premium-card group ${mission.locked ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.01] hover:shadow-2xl'} flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 p-6 sm:p-8 md:p-14 transition-all`}
              >
                <div className="flex items-start gap-4 sm:gap-6 md:gap-10">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-2xl sm:text-3xl font-black border ${mission.locked ? '' : 'text-primary shadow-inner'}`}
                    style={{
                      backgroundColor: mission.locked ? "var(--surface-muted)" : "color-mix(in srgb, var(--primary) 12%, white)",
                      color: mission.locked ? "var(--text-muted)" : undefined,
                      borderColor: "var(--border)"
                    }}
                  >
                    {mission.id}
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs sm:text-base font-black text-primary tracking-[0.28em] uppercase">Lesson 0{mission.id}</span>
                      {mission.locked && <Lock size={20} style={{ color: "var(--text-soft)" }} />}
                    </div>
                    <h4 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight" style={{ color: "var(--text-strong)" }}>{mission.title}</h4>
                    <p className="text-base sm:text-lg md:text-2xl font-semibold leading-[1.7]" style={{ color: "var(--text-muted)" }}>{mission.subtitle}</p>
                  </div>
                </div>
                
                <div
                  className={`w-full md:w-auto px-6 md:px-10 h-16 md:h-20 rounded-[1.5rem] md:rounded-3xl flex items-center justify-center gap-3 text-lg md:text-2xl font-black border transition-all ${mission.locked ? '' : 'group-hover:bg-primary group-hover:text-white'}`}
                  style={{
                    backgroundColor: mission.locked ? "var(--surface-muted)" : "var(--surface-strong)",
                    color: mission.locked ? "var(--text-muted)" : "var(--primary)",
                    borderColor: "var(--border)"
                  }}
                >
                  {mission.locked ? '준비 중' : (
                    <>
                      <span>학습 시작</span>
                      <ChevronRight size={32} />
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t text-center pb-20" style={{ borderColor: "var(--border)" }}>
          <p className="font-bold text-lg italic" style={{ color: "var(--text-soft)" }}>© 2026 にほんご (일본어) LAB. 일본어를 시작하는 모든 분을 위한 가장 쉬운 연구소.</p>
        </footer>
      </main>
    </div>
  );
}
