'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { signIn } from 'next-auth/react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
        setLoading(false);
      } else {
        // Auto sign in using NextAuth credentials provider
        const loginRes = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (loginRes?.error) {
          setError(loginRes.error || 'Kirishda xatolik yuz berdi');
          setLoading(false);
        } else {
          router.refresh();
          router.push(redirect);
        }
      }
    } catch {
      setError("Serverga ulanib bo'lmadi");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl glass-premium glow-purple relative z-10 animate-fadeIn">
      <div className="flex flex-col items-center gap-3 text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#D4AF37] flex items-center justify-center shadow-lg">
          <Sparkles size={20} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold">{`Ro'yxatdan O'tish`}</h2>
        <p className="text-xs text-[#94A3B8]">{`Kursdagi birinchi darsingizni hoziroq boshlang`}</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-950/25 text-red-400 text-xs font-semibold mb-6 animate-slideDown">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase text-[#94A3B8] tracking-wider">Ism-familiya</label>
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full pl-12 pr-4 py-3.5 bg-[#050505] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#6366F1] transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#94A3B8] text-xs font-bold uppercase tracking-wider">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              className="w-full pl-12 pr-4 py-3.5 bg-[#050505] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#6366F1] transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase text-[#94A3B8] tracking-wider">Parol</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-12 pr-4 py-3.5 bg-[#050505] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#6366F1] transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-sm hover:opacity-90 hover:scale-[1.01] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 mt-2"
        >
          {loading ? 'Yaratilmoqda...' : 'Ro\'yxatdan O\'tish'}
        </button>
      </form>

      <p className="text-xs text-center text-[#94A3B8] mt-6">
        {`Akkauntingiz bormi? `}
        <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-[#D4AF37] font-semibold hover:underline">
          {`Tizimga kirish`}
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative select-none">
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-bold text-[#94A3B8] hover:text-white transition-colors bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md"
      >
        <ArrowLeft size={14} />
        {`Bosh sahifaga`}
      </Link>

      <Suspense fallback={
        <div className="w-full max-w-md p-8 rounded-3xl glass text-center flex items-center justify-center min-h-[350px]">
          <div className="w-8 h-8 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
