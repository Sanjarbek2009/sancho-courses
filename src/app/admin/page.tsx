'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function AdminGatePage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authRes = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const authData = await authRes.json();

      if (!authRes.ok || !authData.success) {
        setError(authData.error || 'Noto\'g\'ri boshqaruv paroli');
        setLoading(false);
        return;
      }

      const res = await signIn('credentials', {
        email: 'saburowsanjar1@gmail.com',
        password: password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error || 'Kirishda xatolik yuz berdi');
        setLoading(false);
      } else {
        document.cookie = "admin_session=true; path=/; max-age=86400; SameSite=Strict; Secure";
        router.push('/admin/dashboard');
      }
    } catch {
      setError('Tizimda kutilmagan xatolik');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative select-none">
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-bold text-[#94A3B8] hover:text-white transition-colors bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md"
      >
        <ArrowLeft size={14} />
        {`Bosh sahifaga`}
      </Link>

      <div className="w-full max-w-md p-8 rounded-3xl glass-premium glow-gold relative z-10 animate-fadeIn">
        <div className="flex flex-col items-center gap-3 text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#6366F1] flex items-center justify-center shadow-lg">
            <ShieldAlert size={20} className="text-black" />
          </div>
          <h2 className="text-2xl font-bold">{`Boshqaruv Darvozasi`}</h2>
          <p className="text-xs text-[#94A3B8]">{`Admin panelga kirish uchun shaxsiy parolni kiriting`}</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-950/25 text-red-400 text-xs font-semibold mb-6 animate-slideDown">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-[#94A3B8] tracking-wider">{`Admin Paroli`}</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolni kiriting..."
                className="w-full pl-12 pr-12 py-3.5 bg-[#050505] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-sm hover:opacity-90 hover:scale-[1.01] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 mt-2"
          >
            {loading ? 'Kirilmoqda...' : 'Kirish Huquqini Tekshirish'}
          </button>
        </form>
      </div>
    </div>
  );
}
