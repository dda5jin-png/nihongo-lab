"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  updateProfile 
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/");
    });
    return () => unsubscribe();
  }, [router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleKakaoLogin = async () => {
    const provider = new OAuthProvider("oidc.kakao");
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#121212] flex items-center justify-center p-6 relative overflow-hidden selection:bg-primary/10">
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        <div className="premium-card rounded-[3rem] p-10 md:p-16 backdrop-blur-xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-lift)" }}>
            <div className="flex flex-col items-center gap-6 mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-24 h-24 md:w-28 md:h-28 rounded-[32px] flex items-center justify-center overflow-hidden border"
                style={{ backgroundColor: "var(--surface-strong)", borderColor: "var(--border)", boxShadow: "var(--shadow-soft)" }}
              >
                <img src="/logo-mark.svg" alt="Nihongo LAB" className="w-full h-full object-contain p-3" />
              </motion.div>
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 font-display" style={{ color: "var(--text-strong)" }}>
                  にほんご <span className="text-primary">(일본어)</span> LAB
                </h1>
                <p className="text-lg font-medium leading-[1.7]" style={{ color: "var(--text-muted)" }}>
                  일본어 공부를 시작하는 모든 분을 위한 가장 쉬운 연구소
                </p>
              </div>
            </div>

            {/* Quick Guide Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <div className="p-6 rounded-[2rem] border flex flex-col items-center text-center" style={{ backgroundColor: "var(--surface-muted)", borderColor: "var(--border)" }}>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                  <LogIn size={24} />
                </div>
                <h3 className="font-black mb-2" style={{ color: "var(--text-strong)" }}>간편 로그인</h3>
                <p className="text-sm font-medium leading-[1.7]" style={{ color: "var(--text-muted)" }}>구글/카카오로<br/>3초 만에 시작</p>
              </div>
              <div className="p-6 rounded-[2rem] border flex flex-col items-center text-center" style={{ backgroundColor: "var(--surface-muted)", borderColor: "var(--border)" }}>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                  <Mail size={24} />
                </div>
                <h3 className="font-black mb-2" style={{ color: "var(--text-strong)" }}>오늘의 단어</h3>
                <p className="text-sm font-medium leading-[1.7]" style={{ color: "var(--text-muted)" }}>AI가 추천하는<br/>기초 단어 학습</p>
              </div>
              <div className="p-6 rounded-[2rem] border flex flex-col items-center text-center" style={{ backgroundColor: "var(--surface-muted)", borderColor: "var(--border)" }}>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                  <UserPlus size={24} />
                </div>
                <h3 className="font-black mb-2" style={{ color: "var(--text-strong)" }}>학습 기록</h3>
                <p className="text-sm font-medium leading-[1.7]" style={{ color: "var(--text-muted)" }}>나만의 보관함에<br/>저장하고 복습</p>
              </div>
            </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-2xl mb-8 text-sm font-bold border border-red-100 dark:border-red-900/10"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-6 mb-10">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                >
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-primary transition-colors" size={24} />
                    <input
                      type="text" placeholder="성함" required
                      className="w-full h-16 pl-14 pr-6 rounded-2xl border text-lg transition-all"
                      style={{ backgroundColor: "var(--surface-muted)", borderColor: "var(--border)", color: "var(--text-strong)" }}
                      value={name} onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-primary transition-colors" size={24} />
              <input
                type="email" placeholder="이메일 주소" required
                className="w-full h-16 pl-14 pr-6 rounded-2xl border text-lg transition-all"
                style={{ backgroundColor: "var(--surface-muted)", borderColor: "var(--border)", color: "var(--text-strong)" }}
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-primary transition-colors" size={24} />
              <input
                type="password" placeholder="비밀번호" required
                className="w-full h-16 pl-14 pr-6 rounded-2xl border text-lg transition-all"
                style={{ backgroundColor: "var(--surface-muted)", borderColor: "var(--border)", color: "var(--text-strong)" }}
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={loading}
              className="w-full h-18 bg-primary text-white text-xl font-black rounded-3xl shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <span>{isLogin ? "로그인하기" : "회원가입 완료"}</span>
              <ArrowRight size={24} />
            </button>
          </form>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="px-4 font-bold tracking-widest" style={{ backgroundColor: "var(--surface)", color: "var(--text-soft)" }}>간편 로그인</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="luxury-button w-full h-16 border font-bold rounded-2xl transition-all flex items-center justify-center gap-4 group"
              style={{ backgroundColor: "var(--surface-strong)", borderColor: "var(--border)", color: "var(--text-strong)" }}
            >
              <img src="https://www.google.com/favicon.ico" alt="GP" className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all" />
              <span className="text-lg">구글로 3초 만에 시작하기</span>
            </button>

            <button
              onClick={handleKakaoLogin}
              className="w-full h-16 bg-[#FEE500] text-[#191919] font-bold rounded-2xl hover:brightness-95 transition-all flex items-center justify-center gap-4 group"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.553 1.706 4.8 4.27 6.054l-.81 2.982c-.048.18.063.37.247.42.052.015.105.02.158.02.13 0 .252-.075.303-.198l3.483-2.31c.44.04.887.062 1.344.062 4.97 0 9-3.185 9-7.115S16.97 3 12 3z" />
              </svg>
              <span className="text-lg">카카오톡으로 시작하기</span>
            </button>
          </div>

          <p className="mt-12 text-center font-medium" style={{ color: "var(--text-muted)" }}>
            {isLogin ? "아직 회원이 아니신가요?" : "이미 가입하셨나요?"} {" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-black hover:underline underline-offset-4 ml-2"
            >
              {isLogin ? "회원가입 하기" : "로그인 하기"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
