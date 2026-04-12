"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ChevronRight, ChevronLeft } from "lucide-react";

interface FlashCardProps {
  japanese: string;
  reading: string;
  meaning: string;
  onNext?: () => void;
  onPrev?: () => void;
  onStatusChange?: (status: string) => void;
}

export default function FlashCard({ japanese, reading, meaning, onNext, onPrev, onStatusChange }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const playTTS = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-4xl mx-auto px-4">
      {/* Premium Flashcard Container */}
      <motion.div
        layout
        className="w-full aspect-[4/3] relative cursor-pointer group rounded-[3rem] shadow-premium bg-white dark:bg-zinc-900 border border-zinc-100/50 dark:border-zinc-800/50 overflow-hidden"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            <motion.div
              key="front"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="space-y-4 mb-8">
                <span className="text-sm font-black text-zinc-300 dark:text-zinc-600 tracking-[0.3em] uppercase">일본어 발음</span>
                <p className="text-3xl md:text-4xl font-medium text-zinc-400 font-display italic">
                  {reading}
                </p>
              </div>
              
              <h2 className="text-7xl md:text-9xl font-black text-zinc-800 dark:text-white leading-tight font-display mb-12">
                {japanese}
              </h2>
              
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-1 bg-primary/10 rounded-full" />
                <p className="text-xl font-bold text-zinc-400 animate-pulse">
                  터치해서 뜻 확인하기
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-primary/5 dark:bg-primary/10"
            >
              <div className="space-y-6 mb-12">
                <span className="text-lg font-black text-primary tracking-[0.2em] uppercase opacity-50">한국어 뜻</span>
                <p className="text-7xl md:text-9xl font-black text-primary drop-shadow-sm leading-tight">
                  {meaning}
                </p>
              </div>

              {/* Status Action Buttons */}
              <div className="flex gap-4 w-full max-w-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange?.("learned");
                  }}
                  className="flex-1 h-16 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center gap-2 border-2 border-green-500/20 hover:bg-green-500 hover:text-white transition-all font-bold text-lg"
                >
                  <span className="text-2xl">✅</span> 외웠어요
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange?.("review");
                  }}
                  className="flex-1 h-16 bg-orange-500/10 text-orange-600 rounded-2xl flex items-center justify-center gap-2 border-2 border-orange-500/20 hover:bg-orange-500 hover:text-white transition-all font-bold text-lg"
                >
                  <span className="text-2xl">❓</span> 헷갈려요
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TTS Floating Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playTTS(japanese);
          }}
          className="absolute bottom-8 right-8 w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg flex items-center justify-center text-zinc-400 hover:text-primary hover:scale-105 transition-all border border-zinc-100 dark:border-zinc-700 z-10"
        >
          <Volume2 size={32} />
        </button>
      </motion.div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-6 w-full max-w-md">
        <button
          onClick={onPrev}
          className="flex-1 h-20 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition-all shadow-sm"
        >
          <ChevronLeft size={40} />
          <span className="font-bold ml-2">이전 카드</span>
        </button>
        <button
          onClick={onNext}
          className="flex-1 h-20 bg-primary text-white rounded-[2rem] flex items-center justify-center shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
        >
          <span className="font-bold mr-2 text-xl">다음 카드</span>
          <ChevronRight size={40} />
        </button>
      </div>
    </div>
  );
}
