"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookMarked, ChevronRight, LibraryBig, Sparkles, Volume2, Clock3, BookmarkPlus, Trash2, LogIn } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";

interface SavedCard {
  id: string;
  cardId: string;
  japanese: string;
  reading: string;
  meaning: string;
  level: string;
  savedAt?: string;
}

export default function VaultPage() {
  const [user, setUser] = useState<User | null>(null);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setSavedCards([]);
        setLoading(false);
        return;
      }

      try {
        const savedQuery = query(
          collection(db, "saved_cards"),
          where("userId", "==", currentUser.uid),
          orderBy("savedAt", "desc")
        );
        const snapshot = await getDocs(savedQuery);
        setSavedCards(
          snapshot.docs.map((savedDoc) => ({
            id: savedDoc.id,
            ...(savedDoc.data() as Omit<SavedCard, "id">),
          }))
        );
      } catch (error) {
        console.error("Vault Load Error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const reviewSummary = useMemo(() => {
    const byLevel = new Map<string, number>();
    for (const card of savedCards) {
      byLevel.set(card.level, (byLevel.get(card.level) || 0) + 1);
    }
    return Array.from(byLevel.entries()).sort(([a], [b]) => Number(a) - Number(b));
  }, [savedCards]);

  const handleRemove = async (savedCardId: string) => {
    try {
      await deleteDoc(doc(db, "saved_cards", savedCardId));
      setSavedCards((prev) => prev.filter((card) => card.id !== savedCardId));
    } catch (error) {
      console.error("Vault Remove Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-zinc-950">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
        <section className="relative overflow-hidden rounded-[2.5rem] premium-card p-6 md:p-10 mb-8 md:mb-12">
          <div className="hero-orb w-40 h-40 md:w-56 md:h-56 -top-10 -right-8 bg-primary/12" />
          <div className="hero-orb w-24 h-24 md:w-36 md:h-36 bottom-2 left-6 bg-amber-300/30" />
          <div className="relative z-10 space-y-5">
            <div className="luxury-label">
              <LibraryBig size={14} className="text-primary" />
              Personal Vault
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl font-black leading-tight" style={{ color: "var(--text-strong)" }}>
                내 보관함에서
                <br />
                복습 흐름을 이어가세요
              </h1>
              <p className="max-w-2xl text-base md:text-xl font-medium leading-[1.8]" style={{ color: "var(--text-muted)" }}>
                저장해둔 표현, 다시 듣고 싶은 발음, 아직 헷갈리는 카드를 한곳에서 차분하게 모아보는 공간이에요.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link
                href="/study"
                className="luxury-button px-6 py-4 rounded-3xl text-base md:text-lg font-black text-white flex items-center justify-center gap-3 bg-primary border"
                style={{ borderColor: "color-mix(in srgb, var(--primary) 45%, white)" }}
              >
                <BookMarked size={20} />
                복습 이어가기
              </Link>
              <div
                className="px-6 py-4 rounded-3xl border text-base md:text-lg font-black flex items-center justify-center gap-3"
                style={{ background: "linear-gradient(180deg, var(--surface-strong), var(--surface))", color: "var(--text-strong)", borderColor: "var(--border)" }}
              >
                <Sparkles size={20} className="text-primary" />
                저장 카드 {savedCards.length}개
              </div>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 md:gap-8 items-start">
          <div className="space-y-5">
            {!user && !loading && (
              <div className="premium-card p-6 md:p-8">
                <div className="rounded-[1.75rem] p-6 md:p-8 border" style={{ backgroundColor: "var(--surface-muted)", borderColor: "var(--border)" }}>
                  <div className="space-y-4">
                    <div className="luxury-label">
                      <LogIn size={14} className="text-primary" />
                      Sign In Required
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black" style={{ color: "var(--text-strong)" }}>
                      회원가입 후 보관함을 사용할 수 있어요
                    </h2>
                    <p className="font-medium leading-[1.7]" style={{ color: "var(--text-muted)" }}>
                      학습 카드에서 저장한 표현은 로그인한 계정에 연결됩니다. 먼저 가입한 뒤 다시 들어오면 보관한 내용을 확인하고 제거할 수 있어요.
                    </p>
                    <Link
                      href="/auth"
                      className="luxury-button inline-flex px-6 py-4 rounded-3xl text-base font-black text-white items-center gap-2 bg-primary border"
                      style={{ borderColor: "color-mix(in srgb, var(--primary) 45%, white)" }}
                    >
                      가입하러 가기
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {user && !loading && savedCards.length === 0 && (
              <div className="premium-card p-6 md:p-8">
                <div className="rounded-[1.75rem] p-6 md:p-8 border" style={{ backgroundColor: "var(--surface-muted)", borderColor: "var(--border)" }}>
                  <div className="space-y-4">
                    <div className="luxury-label">
                      <BookmarkPlus size={14} className="text-primary" />
                      Empty Vault
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black" style={{ color: "var(--text-strong)" }}>
                      아직 저장된 카드가 없어요
                    </h2>
                    <p className="font-medium leading-[1.7]" style={{ color: "var(--text-muted)" }}>
                      학습 화면의 `보관함 저장` 버튼을 누르면 여기에 카드가 쌓입니다.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {user && savedCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="premium-card p-5 md:p-7"
              >
                <div
                  className="rounded-[1.75rem] p-5 md:p-6 border relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(184,106,79,0.12), rgba(255,255,255,0.58))",
                    borderColor: "var(--border)"
                  }}
                >
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="space-y-3">
                      <div className="text-[11px] uppercase font-black tracking-[0.28em]" style={{ color: "var(--text-soft)" }}>
                        Level 0{card.level}
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black font-display" style={{ color: "var(--text-strong)" }}>
                        {card.japanese}
                      </h2>
                      <p className="font-semibold text-lg" style={{ color: "var(--text-muted)" }}>
                        {card.reading}
                      </p>
                      <p className="font-medium leading-[1.7]" style={{ color: "var(--text-muted)" }}>
                        {card.meaning}
                      </p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-3">
                      <Link
                        href={`/study?level=${card.level}`}
                        className="flex items-center gap-2 text-sm md:text-base font-black"
                        style={{ color: "var(--text-strong)" }}
                      >
                        다시 학습하기
                        <ChevronRight size={18} />
                      </Link>
                      <button
                        onClick={() => handleRemove(card.id)}
                        className="h-11 px-4 rounded-2xl border flex items-center gap-2 text-sm font-black"
                        style={{ color: "#b42318", borderColor: "rgba(180,35,24,0.2)", backgroundColor: "rgba(255,255,255,0.72)" }}
                      >
                        <Trash2 size={16} />
                        제거
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="premium-card p-6 md:p-7">
              <div className="space-y-5">
                <div className="luxury-label">
                  <Clock3 size={14} className="text-primary" />
                  Review Rhythm
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-black" style={{ color: "var(--text-strong)" }}>
                    오늘 복습하면 좋은 카드
                  </h3>
                  <p className="font-medium leading-[1.7]" style={{ color: "var(--text-muted)" }}>
                    최근에 헷갈렸던 표현 위주로 다시 만나보면 기억이 더 오래 남아요.
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Volume2, text: `발음 다시 듣기 ${savedCards.length}개` },
                    { icon: BookmarkPlus, text: `새로 저장한 표현 ${savedCards.length}개` },
                    { icon: Sparkles, text: user ? `학습 단계 ${reviewSummary.length || 1}개에서 복습 가능` : "가입 후 보관함 활성화" },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center gap-3 rounded-2xl border px-4 py-4"
                      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-muted)" }}
                    >
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center border" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-strong)" }}>
                        <Icon size={18} className="text-primary" />
                      </div>
                      <span className="font-black" style={{ color: "var(--text-strong)" }}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="premium-card p-6 md:p-7">
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-black" style={{ color: "var(--text-strong)" }}>
                  다음 단계 제안
                </h3>
                <p className="font-medium leading-[1.7]" style={{ color: "var(--text-muted)" }}>
                  {user
                    ? "보관함에 담긴 카드가 쌓일수록 복습 흐름이 더 분명해집니다. 학습 화면에서 필요한 카드만 남기고, 더 이상 보관하고 싶지 않으면 바로 제거하세요."
                    : "회원가입을 하면 학습 중 저장한 카드가 계정에 연결되어 다음 방문 때도 그대로 이어집니다."}
                </p>
                <Link
                  href="/study?level=1"
                  className="luxury-button w-full h-14 rounded-2xl text-white font-black flex items-center justify-center gap-2 bg-primary border"
                  style={{ borderColor: "color-mix(in srgb, var(--primary) 45%, white)" }}
                >
                  학습하러 가기
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
