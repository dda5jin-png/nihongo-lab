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
        className="w-full aspect-[4/3] relative cursor-pointer group rounded-[3rem] shadow-xl bg-white dark:bg-zinc-900 border-2 border-black dark:border-white overflow-hidden"
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
                <span className="text-sm font-black text-black dark:text-zinc-600 tracking-[0.3em] uppercase">일본어 발음</span>
                <p className="text-3xl md:text-5xl font-black text-zinc-800 font-display italic">
                  {reading}
                </p>
              </div>
              
              <h2 className="text-7xl md:text-9xl font-black text-black dark:text-white leading-tight font-display mb-12">
                {japanese}
              </h2>
              
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-2 bg-black dark:bg-white rounded-full" />
                <p className="text-2xl font-black text-black animate-pulse">
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
                <span className="text-xl font-black text-black tracking-[0.2em] uppercase">한국어 뜻</span>
                <p className="text-7xl md:text-9xl font-black text-black leading-tight drop-shadow-md">
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
                  className="flex-1 h-20 bg-green-500 text-white rounded-2xl flex items-center justify-center gap-2 border-2 border-black dark:border-white shadow-lg hover:scale-105 transition-all font-black text-xl"
                >
                  <span className="text-3xl">✅</span> 외움
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange?.("review");
                  }}
                  className="flex-1 h-20 bg-orange-500 text-white rounded-2xl flex items-center justify-center gap-2 border-2 border-black dark:border-white shadow-lg hover:scale-105 transition-all font-black text-xl"
                >
                  <span className="text-3xl">❓</span> 모름
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
          className="absolute bottom-8 right-8 w-20 h-20 bg-black text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-all border-2 border-white z-10"
        >
          <Volume2 size={40} />
        </button>
      </motion.div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-6 w-full max-w-md">
        <button
          onClick={onPrev}
          className="flex-1 h-20 bg-white dark:bg-zinc-900 rounded-[2rem] border-2 border-black dark:border-white flex items-center justify-center text-black dark:text-white hover:bg-zinc-100 transition-all shadow-lg"
        >
          <ChevronLeft size={40} />
          <span className="font-black ml-2 text-xl">이전 카드</span>
        </button>
        <button
          onClick={onNext}
          className="flex-1 h-20 bg-primary text-white rounded-[2rem] border-2 border-black dark:border-white flex items-center justify-center shadow-lg hover:brightness-110 transition-all"
        >
          <span className="font-black mr-2 text-xl">다음 카드</span>
          <ChevronRight size={40} />
        </button>
      </div>
    </div>
  );
}
