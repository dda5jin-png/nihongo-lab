"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BookOpenText, LibraryBig } from "lucide-react";
import FlashCard from "@/components/ui/FlashCard";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

function StudyContent() {
  const searchParams = useSearchParams();
  const level = searchParams.get("level") || "1";
  const [user, setUser] = useState<User | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savedCardIds, setSavedCardIds] = useState<string[]>([]);
  const router = useRouter();
  
  const cards = [
    { id: "c1", japanese: "こんにちは", reading: "Konnichiwa", meaning: "안녕하세요" },
    { id: "c2", japanese: "ありがとう", reading: "Arigatou", meaning: "고맙습니다" },
    { id: "c3", japanese: "すみません", reading: "Sumimasen", meaning: "미안합니다 / 실례합니다" },
    { id: "c4", japanese: "さようなら", reading: "Sayounara", meaning: "작별 인사 (안녕히 가세요)" },
    { id: "c5", japanese: "はい", reading: "Hai", meaning: "네" },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        void Promise.all([
          loadProgress(currentUser.uid),
          loadSavedCards(currentUser.uid),
        ]);
      } else {
        setSavedCardIds([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [level]);

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

  const loadSavedCards = async (userId: string) => {
    try {
      const savedQuery = query(
        collection(db, "saved_cards"),
        where("userId", "==", userId),
        where("level", "==", level)
      );
      const snapshot = await getDocs(savedQuery);
      setSavedCardIds(snapshot.docs.map((savedDoc) => savedDoc.data().cardId as string));
    } catch (error) {
      console.error("Saved Cards Load Error:", error);
    }
  };

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
  const isCurrentCardSaved = savedCardIds.includes(currentCard.id);

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
    if (status === "learned" || status === "review") {
      setTimeout(handleNext, 800);
    }
  };

  const handleToggleSave = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }

    const savedDocId = `${user.uid}_${level}_${currentCard.id}`;
    const savedDocRef = doc(db, "saved_cards", savedDocId);

    try {
      if (isCurrentCardSaved) {
        await deleteDoc(savedDocRef);
        setSavedCardIds((prev) => prev.filter((cardId) => cardId !== currentCard.id));
        return;
      }

      await setDoc(savedDocRef, {
        userId: user.uid,
        level,
        cardId: currentCard.id,
        japanese: currentCard.japanese,
        reading: currentCard.reading,
        meaning: currentCard.meaning,
        savedAt: new Date().toISOString(),
      });
      setSavedCardIds((prev) => [...prev, currentCard.id]);
    } catch (error) {
      console.error("Saved Card Toggle Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          />
          <p className="text-xl font-black" style={{ color: "var(--text-strong)" }}>데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-zinc-950 overflow-hidden">
      <div className="w-full border-b py-3 md:py-4 backdrop-blur-xl" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center gap-3 md:gap-4">
          <div className="w-full flex justify-end">
            <button
              onClick={() => router.push("/vault")}
              className="luxury-button h-11 px-4 rounded-2xl border flex items-center gap-2 text-sm font-black"
              style={{ background: "linear-gradient(180deg, var(--surface-strong), var(--surface))", color: "var(--text-strong)", borderColor: "var(--border)" }}
            >
              <LibraryBig size={16} className="text-primary" />
              보관함
            </button>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-primary font-black" />
              <span className="text-sm font-black tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>Mission Level 0{level}</span>
            </div>
            <div className="text-xl md:text-2xl font-black text-primary tabular-nums">
              {currentIndex + 1} <span className="font-black" style={{ color: "var(--text-soft)" }}>/</span> {cards.length}
            </div>
          </div>
          
          <div className="h-1.5 w-full max-w-2xl rounded-full overflow-hidden" style={{ backgroundColor: "var(--muted)" }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              className="h-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            />
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center pt-10 md:pt-24 px-4 md:px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute top-8 left-4 md:left-10 rounded-full px-3 py-2 text-xs md:text-sm font-black uppercase tracking-[0.22em] flex items-center gap-2" style={{ backgroundColor: "var(--surface)", color: "var(--text-soft)", border: "1px solid var(--border)" }}>
          <BookOpenText size={14} className="text-primary" />
          Flip and listen
        </div>
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
              saved={isCurrentCardSaved}
              canSave={Boolean(user)}
              onStatusChange={handleStatusChange}
              onNext={handleNext}
              onPrev={handlePrev}
              onToggleSave={handleToggleSave}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="py-8 md:py-12 flex flex-col items-center gap-3 md:gap-4 font-black px-4 text-center" style={{ color: "var(--text-strong)" }}>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-base md:text-lg">
          <span className="flex items-center gap-2"><span className="text-green-600">✅</span> 외움</span>
          <span className="flex items-center gap-2"><span className="text-orange-600">❓</span> 헷갈림</span>
          <span className="flex items-center gap-2"><span className="text-primary">🔖</span> 보관함 저장</span>
        </div>
        <p className="font-black tracking-tight" style={{ color: "var(--text-muted)" }}>카드를 터치하면 뜻을 볼 수 있습니다.</p>
      </footer>
    </div>
  );
}

export default function StudyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-zinc-950 text-xl font-bold" style={{ color: "var(--text-muted)" }}>
        준비 중...
      </div>
    }>
      <StudyContent />
    </Suspense>
  );
}
