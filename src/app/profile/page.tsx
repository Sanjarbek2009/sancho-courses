'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { ShieldCheck, Mail, DollarSign, Award, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface Metrics {
  totalRevenue: number;
  activePaidStudents: number;
  averageProgress: number;
  totalStudents: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || !session.user) {
      router.replace('/login?redirect=/profile');
      return;
    }

    if (session.user.role === 'ADMIN') {
      fetchMetrics();
    } else {
      setLoading(false);
    }
  }, [session, status, router]);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/admin/metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (e) {
      console.error('Error fetching admin metrics', e);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold tracking-wider text-[#94A3B8]">{`Profil yuklanmoqda...`}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isPremium = user.isPaid || user.role === 'ADMIN';

  return (
    <div className="min-h-screen text-white select-none bg-transparent flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 main-content md:pt-0 pt-16 justify-between">

      <main className="max-w-4xl w-full mx-auto px-6 py-12 flex-1 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{`Foydalanuvchi Profili`}</h1>
          <p className="text-xs text-[#94A3B8] mt-1">{`Shaxsiy ma'lumotlaringiz va obuna holatini boshqaring`}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left profile info card */}
          <div className="md:col-span-5 rounded-2xl glass border border-white/5 p-6 flex flex-col items-center text-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#D4AF37]/5 blur-[25px] pointer-events-none" />

            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#D4AF37] flex items-center justify-center text-white text-3xl font-extrabold shadow-lg relative border-2 border-white/10">
              {user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold text-white">{user.name || 'Ismsiz foydalanuvchi'}</h2>
              <span className="text-xs text-[#94A3B8] font-mono flex items-center justify-center gap-1.5">
                <Mail size={12} />
                {user.email}
              </span>
            </div>

            <div className="w-full pt-4 border-t border-white/5 flex flex-col gap-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#94A3B8]">{`Obuna holati:`}</span>
                {isPremium ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-[#FFD700]/20 border border-[#D4AF37]/35 text-[#FFD700] text-[10px] font-extrabold uppercase tracking-wide shadow-[0_0_10px_rgba(212,175,55,0.15)]">
                    <ShieldCheck size={12} />
                    Premium
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#94A3B8] text-[10px] font-bold uppercase tracking-wide">
                    Bepul
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#94A3B8]">{`Hisob roli:`}</span>
                <span className="font-semibold text-white uppercase tracking-wider text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                  {user.role === 'ADMIN' ? 'Admin' : 'Foydalanuvchi'}
                </span>
              </div>
            </div>
          </div>

          {/* Right details or Admin metrics card */}
          <div className="md:col-span-7 flex flex-col gap-6 w-full">
            {/* Student access details card */}
            {!metrics && (
              <div className="rounded-2xl glass border border-white/5 p-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">{`Kursga kirish huquqi`}</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {isPremium 
                    ? `Sizda SANCHO.AI masterklassiga to'liq va umrbod kirish huquqi faollashtirilgan. Barcha modullar, shablonlar va kelajakdagi video yangilanishlar siz uchun ochiq.`
                    : `Siz hozirda bepul hisobdasiz. Darslar va video materiallarni ochish uchun pastdagi tugmani bosing va obunani faollashtiring.`
                  }
                </p>

                {isPremium ? (
                  <Link
                    href="/course"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-xs hover:opacity-90 hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 mt-2"
                  >
                    <Award size={14} />
                    {`Darslarni boshlash`}
                  </Link>
                ) : (
                  <Link
                    href="/#pricing"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-xs hover:opacity-90 hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 mt-2"
                  >
                    <DollarSign size={14} />
                    {`Premium Obunani Sotib Olish`}
                  </Link>
                )}
              </div>
            )}

            {/* Admin metrics card */}
            {metrics && (
              <div className="rounded-2xl glass border border-white/5 p-6 flex flex-col gap-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">{`Tizim Daromadlari (Admin)`}</h3>
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 text-[10px] font-bold bg-red-950/20 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-xl hover:bg-red-950/40 transition-all"
                  >
                    <ShieldAlert size={12} />
                    Admin Panel
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#050505] border border-white/5 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{`Jami Daromad`}</span>
                    <span className="text-2xl font-extrabold text-white mt-1">${metrics.totalRevenue}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#050505] border border-white/5 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{`Faol Talabalar`}</span>
                    <span className="text-2xl font-extrabold text-white mt-1">{metrics.activePaidStudents}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#050505] border border-white/5 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{`O'rtacha Progress`}</span>
                    <span className="text-2xl font-extrabold text-white mt-1">{metrics.averageProgress}%</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#050505] border border-white/5 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{`Jami Foydalanuvchilar`}</span>
                    <span className="text-2xl font-extrabold text-white mt-1">{metrics.totalStudents}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
