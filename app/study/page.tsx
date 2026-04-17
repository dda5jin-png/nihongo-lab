"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BookOpenText, LibraryBig, CheckCircle2, ChevronRight, RotateCcw } from "lucide-react";
import FlashCard from "@/components/ui/FlashCard";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

type Card = {
  id: string;
  japanese: string;
  reading: string;
  meaning: string;
};

const cardsByLevel: Record<string, Card[]> = {
  "1": [
    { id: "c1", japanese: "こんにちは", reading: "Konnichiwa", meaning: "안녕하세요" },
    { id: "c2", japanese: "ありがとうございます", reading: "Arigatou gozaimasu", meaning: "감사합니다" },
    { id: "c3", japanese: "すみません", reading: "Sumimasen", meaning: "미안합니다 / 실례합니다" },
    { id: "c4", japanese: "さようなら", reading: "Sayounara", meaning: "안녕히 가세요 / 안녕히 계세요" },
    { id: "c5", japanese: "はい", reading: "Hai", meaning: "네" },
  ],
  "2": [
    { id: "c6", japanese: "おはようございます", reading: "Ohayou gozaimasu", meaning: "좋은 아침입니다" },
    { id: "c7", japanese: "こんばんは", reading: "Konbanwa", meaning: "안녕하세요 / 좋은 저녁입니다" },
    { id: "c8", japanese: "はじめまして", reading: "Hajimemashite", meaning: "처음 뵙겠습니다" },
    { id: "c9", japanese: "よろしくお願いします", reading: "Yoroshiku onegaishimasu", meaning: "잘 부탁드립니다" },
    { id: "c10", japanese: "お元気ですか", reading: "Ogenki desu ka", meaning: "잘 지내세요?" },
  ],
  "3": [
    { id: "c11", japanese: "いくらですか", reading: "Ikura desu ka", meaning: "얼마예요?" },
    { id: "c12", japanese: "これは何ですか", reading: "Kore wa nan desu ka", meaning: "이것은 무엇인가요?" },
    { id: "c13", japanese: "もう一度お願いします", reading: "Mou ichido onegaishimasu", meaning: "한 번 더 부탁드립니다" },
    { id: "c14", japanese: "わかりました", reading: "Wakarimashita", meaning: "알겠습니다" },
    { id: "c15", japanese: "大丈夫です", reading: "Daijoubu desu", meaning: "괜찮습니다" },
  ],
};

const maxLevel = Object.keys(cardsByLevel).length;

function shuffleCards(cards: Card[]) {
  const next = [...cards];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
  }
  return next;
}

function StudyContent() {
  const searchParams = useSearchParams();
  const level = searchParams.get("level") || "1";
  const [user, setUser] = useState<User | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savedCardIds, setSavedCardIds] = useState<string[]>([]);
  const [learnedCardIds, setLearnedCardIds] = useState<string[]>([]);
  const [orderedCards, setOrderedCards] = useState<Card[]>(cardsByLevel[level] || cardsByLevel["1"]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionReason, setCompletionReason] = useState<"finished" | "qualified">("finished");
  const router = useRouter();
  const baseCards = cardsByLevel[level] || cardsByLevel["1"];
  const nextLevel = Number(level) < maxLevel ? String(Number(level) + 1) : null;

  useEffect(() => {
    setOrderedCards(shuffleCards(baseCards));
    setCurrentIndex(0);
    setLearnedCardIds([]);
    setShowCompletionModal(false);
  }, [level]);

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
        if (Array.isArray(data.learnedCardIds)) {
          setLearnedCardIds(data.learnedCardIds);
        }
        if (Array.isArray(data.orderedCardIds) && data.orderedCardIds.length === baseCards.length) {
          const cardMap = new Map(baseCards.map((card) => [card.id, card]));
          const restoredCards = data.orderedCardIds
            .map((id: string) => cardMap.get(id))
            .filter(Boolean) as Card[];
          if (restoredCards.length === baseCards.length) {
            setOrderedCards(restoredCards);
          }
        }
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
        learnedCardIds,
        orderedCardIds: orderedCards.map((card) => card.id),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error("Progress Save Error:", error);
    }
  };

  useEffect(() => {
    const newProgress = ((currentIndex + 1) / orderedCards.length) * 100;
    setProgress(newProgress);
    if (user) saveProgress(currentIndex);
  }, [currentIndex, orderedCards, user, learnedCardIds]);

  const currentCard = orderedCards[currentIndex];
  const isCurrentCardSaved = savedCardIds.includes(currentCard.id);
  const qualifiedCardIds = new Set([...savedCardIds, ...learnedCardIds]);
  const isLevelQualified = qualifiedCardIds.size >= Math.min(5, orderedCards.length);

  useEffect(() => {
    if (!showCompletionModal && isLevelQualified) {
      setCompletionReason("qualified");
      setShowCompletionModal(true);
    }
  }, [isLevelQualified, showCompletionModal]);

  const handleNext = () => {
    if (currentIndex < orderedCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    setCompletionReason(isLevelQualified ? "qualified" : "finished");
    setShowCompletionModal(true);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleStatusChange = (status: string) => {
    if (status === "learned") {
      setLearnedCardIds((prev) => (prev.includes(currentCard.id) ? prev : [...prev, currentCard.id]));
    }

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

  const handleRestartLevel = () => {
    const reshuffledCards = shuffleCards(baseCards);
    setOrderedCards(reshuffledCards);
    setCurrentIndex(0);
    setLearnedCardIds([]);
    setShowCompletionModal(false);
  };

  const handleGoToNextLevel = () => {
    setShowCompletionModal(false);
    if (nextLevel) {
      router.push(`/study?level=${nextLevel}`);
      return;
    }
    router.push("/vault");
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
              {currentIndex + 1} <span className="font-black" style={{ color: "var(--text-soft)" }}>/</span> {orderedCards.length}
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
              progressLabel={`Level 0${level} Card ${currentIndex + 1}`}
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

      <AnimatePresence>
        {showCompletionModal ? (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCompletionModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              className="relative w-full max-w-xl rounded-[2rem] premium-card p-6 md:p-8"
            >
              <div className="space-y-5">
                <div className="luxury-label">
                  <CheckCircle2 size={14} className="text-primary" />
                  Level Complete
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl md:text-4xl font-black balanced-copy" style={{ color: "var(--text-strong)" }}>
                    {completionReason === "qualified"
                      ? `레벨 ${level} 기준을 채웠어요`
                      : `레벨 ${level} 카드가 모두 끝났어요`}
                  </h2>
                  <p className="text-base md:text-lg font-medium leading-[1.8]" style={{ color: "var(--text-muted)" }}>
                    {nextLevel
                      ? `외웠거나 보관한 카드가 ${qualifiedCardIds.size}개예요. 다음 레벨로 넘어가서 새 표현을 이어서 배워볼까요?`
                      : "마지막 레벨까지 완료했어요. 보관함에서 저장한 카드들을 다시 복습할 수 있어요."}
                  </p>
                </div>
                <div className="grid gap-3">
                  <button
                    onClick={handleGoToNextLevel}
                    className="luxury-button w-full h-14 rounded-2xl border bg-primary text-white font-black flex items-center justify-center gap-2"
                    style={{ borderColor: "color-mix(in srgb, var(--primary) 45%, white)" }}
                  >
                    <span>{nextLevel ? `다음 레벨 ${nextLevel}로 이동` : "보관함으로 이동"}</span>
                    <ChevronRight size={18} />
                  </button>
                  <button
                    onClick={handleRestartLevel}
                    className="w-full h-14 rounded-2xl border font-black flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(180deg, var(--surface-strong), var(--surface))", color: "var(--text-strong)", borderColor: "var(--border)" }}
                  >
                    <RotateCcw size={18} />
                    카드 다시 섞어서 복습하기
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
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
