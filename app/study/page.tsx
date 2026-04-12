"use client";

import { useState, useEffect } from "react";
import Link from "next/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Home, Sparkles, User as UserIcon } from "lucide-react";
import FlashCard from "@/components/ui/FlashCard";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default function StudyPage() {
  const searchParams = useSearchParams();
  const level = searchParams.get("level") || "1";
  const [user, setUser] = useState<User | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Mock data for initial testing
  const cards = [
    { id: "c1", japanese: "こんにちは", reading: "Konnichiwa", meaning: "안녕하세요" },
    { id: "c2", japanese: "ありがとう", reading: "Arigatou", meaning: "고맙습니다" },
    { id: "c3", japanese: "すみません", reading: "Sumimasen", meaning: "미안합니다 / 실례합니다" },
    { id: "c4", japanese: "さようなら", reading: "Sayounara", meaning: "작별 인사 (안녕히 가세요)" },
    { id: "c5", japanese: "はい", reading: "Hai", meaning: "네" },
  ];

  // Auth State Monitor
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadProgress(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [level]);

  // Load Progress from Firestore
  const loadProgress = async (userId: string) => {
    try {
      const docRef = doc(db, "user_progress", `${userId}_level_${level}`);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentIndex(data.lastIndex || 0);
      }
    } catch (error) {
      console.error("Progress Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save Progress to Firestore
  const saveProgress = async (index: number) => {
    if (!user) return;
    try {
      const docRef = doc(db, "user_progress", `${user.uid}_level_${level}`);
      await setDoc(docRef, {
        userId: user.uid,
        level: level,
        lastIndex: index,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error("Progress Save Error:", error);
    }
  };

  useEffect(() => {
    const newProgress = ((currentIndex + 1) / cards.length) * 100;
    setProgress(newProgress);
    if (user) saveProgress(currentIndex);
  }, [currentIndex, cards.length, user]);

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleStatusChange = (status: string) => {
    console.log(`Card status changed to: ${status}`);
    if (status === "mastered" || status === "confused") {
      setTimeout(handleNext, 800);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd] dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          />
          <p className="text-xl font-bold text-zinc-400">학습 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd] dark:bg-zinc-950 overflow-hidden">
      {/* Premium Progress Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <button 
              onClick={() => router.push("/")}
              className="flex items-center gap-2 group text-zinc-400 hover:text-primary transition-colors"
            >
              <div className="p-2 rounded-xl group-hover:bg-primary/5 transition-colors">
                <Home size={24} />
              </div>
              <span className="font-bold text-lg hidden md:block">홈으로</span>
            </button>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-primary opacity-50" />
                <span className="text-sm font-black tracking-widest text-zinc-400 uppercase">Mission Level 0{level}</span>
              </div>
              <div className="text-2xl font-black text-primary tabular-nums">
                {currentIndex + 1} <span className="text-zinc-300 font-medium">/</span> {cards.length}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 rounded-2xl border border-zinc-100 dark:border-zinc-700">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <UserIcon size={18} />
                  </div>
                  <span className="font-bold text-zinc-600 dark:text-zinc-300">{user.displayName || "수강생"}님</span>
                </div>
              ) : (
                <button 
                  onClick={() => router.push("/auth")}
                  className="btn-premium py-2 px-6 h-12 text-sm bg-secondary text-primary border-none shadow-none"
                >
                  로그인
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Animated Progress Bar */}
        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="h-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          />
        </div>
      </div>

      {/* Main Study Area */}
      <main className="flex-1 flex flex-col items-center justify-center pt-24 px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full flex justify-center"
          >
            <FlashCard 
              japanese={currentCard.japanese}
              reading={currentCard.reading}
              meaning={currentCard.meaning}
              onStatusChange={handleStatusChange}
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="mt-16 flex items-center gap-8">
          <button 
            disabled={currentIndex === 0}
            onClick={handlePrev}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg border ${
              currentIndex === 0 
                ? 'bg-zinc-50 text-zinc-300 border-zinc-100 cursor-not-allowed' 
                : 'bg-white dark:bg-zinc-900 text-zinc-600 border-zinc-200 hover:border-primary hover:text-primary active:scale-90'
            }`}
          >
            <ChevronLeft size={40} />
          </button>
          
          <button 
            onClick={handleNext}
            className={`px-12 h-20 rounded-full flex items-center gap-4 transition-all shadow-xl font-black text-2xl ${
              currentIndex === cards.length - 1
                ? 'bg-green-600 text-white shadow-green-200'
                : 'bg-primary text-white shadow-primary/20 hover:scale-105 active:scale-95'
            }`}
          >
            {currentIndex === cards.length - 1 ? (
              <span>학습 완료 🎉</span>
            ) : (
              <>
                <span>다음으로</span>
                <ChevronRight size={32} />
              </>
            )}
          </button>
        </div>
      </main>

      <footer className="py-12 flex flex-col items-center gap-4 text-zinc-400 font-bold">
        <div className="flex items-center gap-6 text-senior-md">
          <span className="flex items-center gap-2"><span className="text-green-500">✅</span> 외움</span>
          <span className="flex items-center gap-2"><span className="text-orange-500">❓</span> 헷갈림</span>
          <span className="flex items-center gap-2"><span className="text-amber-400">⭐</span> 중요</span>
        </div>
        <p className="opacity-50">카드를 터치하면 뜻을 볼 수 있습니다.</p>
      </footer>
    </div>
  );
}
