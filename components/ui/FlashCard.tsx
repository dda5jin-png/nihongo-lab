"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ChevronRight, ChevronLeft, Bookmark, BookmarkCheck } from "lucide-react";

interface FlashCardProps {
  japanese: string;
  reading: string;
  meaning: string;
  progressLabel?: string;
  saved?: boolean;
  canSave?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  onStatusChange?: (status: string) => void;
  onToggleSave?: () => void;
}

export default function FlashCard({
  japanese,
  reading,
  meaning,
  progressLabel,
  saved = false,
  canSave = false,
  onNext,
  onPrev,
  onStatusChange,
  onToggleSave,
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardTransition = {
    duration: 0.52,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  const playTTS = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    setIsFlipped(false);
  }, [japanese, reading, meaning]);

  return (
    <div className="flex flex-col items-center gap-6 md:gap-10 w-full max-w-4xl mx-auto px-1 sm:px-4">
      {/* Premium Flashcard Container */}
      <motion.div
        layout
        className="w-full min-h-[420px] sm:min-h-0 sm:aspect-[4/3] relative cursor-pointer group rounded-[2rem] md:rounded-[3rem] overflow-hidden"
        style={{ background: "linear-gradient(180deg, var(--surface-strong), var(--surface))", border: "1px solid var(--border)", boxShadow: "var(--shadow-lift)" }}
        onClick={() => setIsFlipped(!isFlipped)}
        whileHover={{ y: -4, scale: 1.006 }}
        whileTap={{ scale: 0.994 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute -top-10 left-1/2 h-36 w-[72%] -translate-x-1/2 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.78), transparent 70%)", filter: "blur(18px)" }}
          animate={{ opacity: isFlipped ? 0.42 : 0.78, scale: isFlipped ? 0.92 : 1.04 }}
          transition={cardTransition}
        />
        <motion.div
          className="absolute inset-x-0 top-0 h-28 pointer-events-none"
          style={{ background: "linear-gradient(180deg,rgba(255,255,255,0.72),transparent)" }}
          animate={{ opacity: isFlipped ? 0.35 : 0.8 }}
          transition={cardTransition}
        />
        <motion.div
          className="absolute inset-y-6 left-0 w-[1px] pointer-events-none"
          style={{ background: "linear-gradient(180deg, transparent, var(--metal-soft), transparent)" }}
          animate={{ opacity: isFlipped ? 0.2 : 0.45, x: isFlipped ? 18 : 10 }}
          transition={cardTransition}
        />
        <motion.div
          className="absolute inset-y-6 right-0 w-[1px] pointer-events-none"
          style={{ background: "linear-gradient(180deg, transparent, var(--metal-soft), transparent)" }}
          animate={{ opacity: isFlipped ? 0.2 : 0.45, x: isFlipped ? -18 : -10 }}
          transition={cardTransition}
        />
        {progressLabel ? (
          <div
            className="absolute top-4 left-4 md:top-8 md:left-8 px-3 py-2 rounded-full text-[11px] md:text-xs font-black uppercase tracking-[0.22em] z-10"
            style={{ backgroundColor: "rgba(255,255,255,0.75)", color: "var(--text-soft)", border: "1px solid var(--border)" }}
          >
            {progressLabel}
          </div>
        ) : null}
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            <motion.div
              key="front"
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
              transition={cardTransition}
              className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 text-center"
            >
              <h2
                className="safe-wrap balanced-copy text-4xl sm:text-6xl md:text-8xl xl:text-9xl font-black leading-[1.08] font-display mb-8 md:mb-12 max-w-[92%]"
                style={{ color: "var(--text-strong)" }}
              >
                {japanese}
              </h2>
              
              <div className="flex flex-col items-center gap-3 md:gap-4">
                <div className="w-16 h-2 rounded-full bg-primary/70" />
                <p className="balanced-copy text-base sm:text-lg md:text-2xl font-semibold animate-pulse max-w-[24rem]" style={{ color: "var(--text-muted)" }}>
                  터치해서 뜻 확인하기
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
              transition={cardTransition}
              className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 text-center"
              style={{ background: "linear-gradient(180deg, color-mix(in srgb, var(--primary) 10%, white), var(--surface-accent))" }}
            >
              <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                <div className="space-y-2">
                  <span className="text-[11px] sm:text-sm font-black tracking-[0.3em] uppercase" style={{ color: "var(--text-soft)" }}>일본어 발음</span>
                  <p className="safe-wrap balanced-copy text-xl sm:text-2xl md:text-4xl font-semibold font-display italic max-w-[92%] mx-auto" style={{ color: "var(--text-muted)" }}>
                    {reading}
                  </p>
                </div>
                <span className="text-sm sm:text-xl font-black tracking-[0.2em] uppercase" style={{ color: "var(--text-soft)" }}>한국어 뜻</span>
                <p
                  className="safe-wrap balanced-copy text-3xl sm:text-5xl md:text-7xl xl:text-8xl font-black leading-[1.12] drop-shadow-md max-w-[94%] mx-auto"
                  style={{ color: "var(--text-strong)" }}
                >
                  {meaning}
                </p>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full max-w-sm">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange?.("learned");
                  }}
                  className="luxury-button flex-1 h-16 md:h-20 bg-green-500 text-white rounded-2xl flex items-center justify-center gap-2 border shadow-lg hover:scale-105 transition-all font-black text-lg md:text-xl"
                  style={{ borderColor: "rgba(255,255,255,0.45)" }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-3xl">✅</span> 외움
                </motion.button>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange?.("review");
                  }}
                  className="luxury-button flex-1 h-16 md:h-20 bg-orange-500 text-white rounded-2xl flex items-center justify-center gap-2 border shadow-lg hover:scale-105 transition-all font-black text-lg md:text-xl"
                  style={{ borderColor: "rgba(255,255,255,0.45)" }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-3xl">❓</span> 모름
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TTS Floating Button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            playTTS(japanese);
          }}
          className="luxury-button absolute bottom-4 right-4 md:bottom-8 md:right-8 w-14 h-14 md:w-20 md:h-20 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-all border z-10"
          style={{ backgroundColor: "var(--primary)", borderColor: "rgba(255,255,255,0.45)" }}
          whileHover={{ y: -3, scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <Volume2 size={24} className="md:w-10 md:h-10" />
        </motion.button>

        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave?.();
          }}
          disabled={!canSave}
          className="absolute bottom-4 left-4 md:bottom-8 md:left-8 h-12 md:h-14 px-4 md:px-5 rounded-2xl border flex items-center gap-2 font-black text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(180deg, var(--surface-strong), var(--surface))",
            color: saved ? "var(--primary)" : "var(--text-strong)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow-soft)",
          }}
          whileHover={canSave ? { y: -2 } : undefined}
          whileTap={canSave ? { scale: 0.98 } : undefined}
        >
          {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          <span>{saved ? "보관 해제" : "보관함 저장"}</span>
        </motion.button>
      </motion.div>

      {/* Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-6 w-full max-w-md">
        <button
          onClick={onPrev}
          className="w-full flex-1 h-14 md:h-20 rounded-[1.5rem] md:rounded-[2rem] border flex items-center justify-center transition-all shadow-lg"
          style={{ background: "linear-gradient(180deg, var(--surface-strong), var(--surface))", color: "var(--text-strong)", borderColor: "var(--border)" }}
        >
          <ChevronLeft size={24} className="md:w-10 md:h-10" />
          <span className="font-black ml-2 text-base md:text-xl">이전 카드</span>
        </button>
        <button
          onClick={onNext}
          className="luxury-button w-full flex-1 h-14 md:h-20 bg-primary text-white rounded-[1.5rem] md:rounded-[2rem] border flex items-center justify-center shadow-lg hover:brightness-110 transition-all"
          style={{ borderColor: "color-mix(in srgb, var(--primary) 45%, white)" }}
        >
          <span className="font-black mr-2 text-base md:text-xl">다음 카드</span>
          <ChevronRight size={24} className="md:w-10 md:h-10" />
        </button>
      </div>
    </div>
  );
}
