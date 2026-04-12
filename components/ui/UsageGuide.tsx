"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Play, Smartphone, RotateCcw } from "lucide-react";

interface UsageGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UsageGuide({ isOpen, onClose }: UsageGuideProps) {
  const steps = [
    {
      title: "1. 가볍게 가입하기",
      description: "구글 버튼이나 이메일로 3초 만에 시작하세요. 공부 기록이 자동으로 저장됩니다.",
      icon: <CheckCircle2 className="text-primary" size={32} />
    },
    {
      title: "2. 소리 내어 읽기",
      description: "일본어 카드가 나오면 스피커 버튼을 눌러보세요. 정통 일본어 발음을 들을 수 있습니다.",
      icon: <Play className="text-primary" size={32} />
    },
    {
      title: "3. 카드 뒤집기",
      description: "카드를 톡 건드리면 한국어 뜻이 나타납니다. 다 외웠다면 다음 단계로 넘어가세요.",
      icon: <Smartphone className="text-primary" size={32} />
    },
    {
      title: "4. 언제든 이어서",
      description: "바쁠 땐 끄셔도 됩니다. 다시 들어오면 아까 공부하던 그 카드부터 시작합니다.",
      icon: <motion.div animate={{ rotateY: 180 }} transition={{ repeat: Infinity, duration: 2 }}><Smartphone className="text-primary" size={32} /></motion.div>
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden shadow-2xl"
          >
            <div className="p-8 pb-4 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50">
              <h2 className="text-3xl font-black tracking-tight">처음이신가요? ✨</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
              >
                <X size={32} />
              </button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {steps.map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4 items-start p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30"
                >
                  <div className="shrink-0 p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-snug">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-8 pt-4">
              <button
                onClick={onClose}
                className="w-full h-16 bg-primary text-white text-xl font-black rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-primary/20"
              >
                네, 이해했습니다!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
