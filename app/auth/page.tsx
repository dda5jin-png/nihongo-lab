"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile 
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react";
import Link from "next/link";

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

  return (
    <div className="min-h-screen bg-[#fdfcfb] dark:bg-[#121212] flex items-center justify-center p-6 relative overflow-hidden selection:bg-primary/10">
      {/* Soft Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl rounded-[3rem] p-10 md:p-16 shadow-premium border border-zinc-100 dark:border-zinc-800">
          {/* Logo & Header */}
          <div className="flex flex-col items-center gap-8 mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-28 h-28 md:w-36 md:h-36 bg-white rounded-[40px] shadow-premium flex items-center justify-center overflow-hidden border border-zinc-100"
            >
              <img src="/logo.png" alt="Nihongo LAB" className="w-full h-full object-contain p-5" />
            </motion.div>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 font-display">
                니혼고 <span className="text-primary">LAB</span>
              </h1>
              <p className="text-xl text-zinc-400 font-medium leading-tight">
                {isLogin ? "부드럽고 우아한 학습의 시작" : "연구소의 소중한 회원이 되어보세요"}
              </p>
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
                      className="w-full h-16 pl-14 pr-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 text-lg transition-all"
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
                className="w-full h-16 pl-14 pr-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 text-lg transition-all"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-primary transition-colors" size={24} />
              <input
                type="password" placeholder="비밀번호" required
                className="w-full h-16 pl-14 pr-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 text-lg transition-all"
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

          {/* Social Social Login */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-white dark:bg-zinc-900 px-4 text-zinc-400 font-bold tracking-widest">간편 로그인</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full h-16 bg-white dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold rounded-2xl hover:bg-zinc-50 transition-all flex items-center justify-center gap-4 group"
            >
              <img src="https://www.google.com/favicon.ico" alt="GP" className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all" />
              <span className="text-lg">구글로 3초 만에 시작하기</span>
            </button>

            <button
              onClick={() => alert("카카오 로그인은 현재 점검 중입니다. (OIDC 설정 필요)")}
              className="w-full h-16 bg-[#FEE500] text-[#191919] font-bold rounded-2xl hover:brightness-95 transition-all flex items-center justify-center gap-4 group"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.553 1.706 4.8 4.27 6.054l-.81 2.982c-.048.18.063.37.247.42.052.015.105.02.158.02.13 0 .252-.075.303-.198l3.483-2.31c.44.04.887.062 1.344.062 4.97 0 9-3.185 9-7.115S16.97 3 12 3z" />
              </svg>
              <span className="text-lg">카카오톡으로 시작하기</span>
            </button>
          </div>

          <p className="mt-12 text-center text-zinc-400 font-medium">
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
