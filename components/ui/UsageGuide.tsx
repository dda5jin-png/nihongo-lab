"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Play, Smartphone, LibraryBig } from "lucide-react";

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
            className="relative w-full max-w-lg rounded-[32px] overflow-hidden border"
            style={{ backgroundColor: "var(--surface-strong)", borderColor: "var(--border)", boxShadow: "var(--shadow-card)" }}
          >
            <div className="p-8 pb-5 border-b relative overflow-hidden" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="hero-orb w-28 h-28 -top-6 right-10 bg-primary/10" />
              <div className="flex justify-between items-start gap-4 relative z-10">
                <div className="space-y-4">
                  <div className="luxury-label">
                    <LibraryBig size={14} className="text-primary" />
                    Welcome Guide
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[1.4rem] border flex items-center justify-center" style={{ background: "linear-gradient(180deg, var(--surface-strong), var(--surface))", borderColor: "var(--border)", boxShadow: "var(--shadow-soft)" }}>
                      <img src="/logo-mark.svg" alt="Nihongo LAB mark" className="w-full h-full object-contain p-2.5" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black tracking-tight" style={{ color: "var(--text-strong)" }}>처음이신가요? ✨</h2>
                      <p className="font-medium leading-[1.7]" style={{ color: "var(--text-muted)" }}>
                        차분한 흐름으로 가입하고, 듣고, 뒤집고, 다시 이어가는 법을 안내해드릴게요.
                      </p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full transition-colors border shrink-0"
                  style={{ borderColor: "var(--border)", color: "var(--text-strong)", backgroundColor: "var(--surface-muted)" }}
                >
                  <X size={32} />
                </button>
              </div>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {steps.map((step, idx) => (
                <motion.div 
                   key={idx}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   className="flex gap-4 items-start p-6 rounded-2xl border shadow-sm"
                   style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
                 >
                   <div className="shrink-0 p-3 rounded-xl border shadow-sm" style={{ backgroundColor: "var(--surface-muted)", borderColor: "var(--border)" }}>
                     {step.icon}
                   </div>
                   <div>
                     <h3 className="text-2xl font-black mb-1" style={{ color: "var(--text-strong)" }}>{step.title}</h3>
                     <p className="font-semibold leading-[1.7]" style={{ color: "var(--text-muted)" }}>{step.description}</p>
                   </div>
                 </motion.div>
               ))}
            </div>

            <div className="p-8 pt-4">
              <button
                onClick={onClose}
                className="w-full h-16 bg-primary text-white text-2xl font-black rounded-2xl border hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                style={{ borderColor: "color-mix(in srgb, var(--primary) 45%, white)" }}
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
