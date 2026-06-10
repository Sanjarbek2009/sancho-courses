'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Sparkles, Menu, X, LogOut, ShieldAlert, Award, User as UserIcon } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, update } = useSession();
  const user = session?.user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Dynamic token synchronization on redirect from payment page
    if (typeof window !== 'undefined' && (window.location.search.includes('session_id') || window.location.search.includes('payment'))) {
      update();
    }
  }, [pathname, update]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.refresh();
    router.push('/');
  };

  const isCoursePage = pathname.startsWith('/course');
  const isPaid = user?.isPaid || user?.role === 'ADMIN';

  const showDashboardLink = user && isPaid && !isCoursePage;
  const showBuyLink = user && !isPaid && user.role !== 'ADMIN';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050505]/60 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#D4AF37] flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-all duration-300">
            <Sparkles size={18} className="text-white animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-widest bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent group-hover:text-[#D4AF37] transition-all">
            SANCHO<span className="text-[#D4AF37]">.AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/#home" className="text-[#94A3B8] hover:text-white transition-colors">Asosiy</Link>
          <Link href="/#syllabus" className="text-[#94A3B8] hover:text-white transition-colors">Kurs Haqida</Link>
          <Link href="/#about-me" className="text-[#94A3B8] hover:text-white transition-colors">Men Haqimda</Link>
          <Link href="/#faq" className="text-[#94A3B8] hover:text-white transition-colors">FAQ</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-red-950/40 border border-red-500/20 text-red-400 hover:bg-red-950/60 transition-all shadow-md"
                >
                  <ShieldAlert size={14} />
                  Admin Panel
                </Link>
              )}
              
              {showDashboardLink && (
                <Link
                  href="/course"
                  className="flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                >
                  <Award size={14} />
                  Dashboard
                </Link>
              )}



              {showBuyLink && (
                <Link
                  href="/#pricing"
                  className="flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                >
                  <Award size={14} />
                  Kursni Sotib Olish
                </Link>
              )}

              <Link
                href="/profile"
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white hover:bg-white/10 transition-all"
              >
                <UserIcon size={14} />
                Profil
              </Link>
              
              <button
                onClick={handleLogout}
                className="text-[#94A3B8] hover:text-red-400 p-2 rounded-lg transition-colors"
                title="Tizimdan chiqish"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors">
                Kirish
              </Link>
              <Link
                href="/register"
                className="text-xs font-bold px-5 py-2.5 rounded-xl bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                Kursni Boshlash
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-3">
          {user && user.role === 'ADMIN' && (
            <Link href="/admin/dashboard" className="text-red-400 p-2" title="Admin Panel">
              <ShieldAlert size={18} />
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 inset-x-0 bg-[#0B0B0C] border-b border-white/5 p-6 flex flex-col gap-5 text-center shadow-2xl z-50">
          <Link href="/#home" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-[#94A3B8] hover:text-white">Asosiy</Link>
          <Link href="/#syllabus" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-[#94A3B8] hover:text-white">Kurs Haqida</Link>
          <Link href="/#about-me" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-[#94A3B8] hover:text-white">Men Haqimda</Link>
          <Link href="/#faq" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-[#94A3B8] hover:text-white">FAQ</Link>
          <hr className="border-white/5" />
          {user ? (
            <div className="flex flex-col gap-3">
              {showDashboardLink && (
                <Link
                  href="/course"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold text-sm"
                >
                  {`Dashboardga o'tish`}
                </Link>
              )}

              {showBuyLink && (
                <Link
                  href="/#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold text-sm"
                >
                  {`Kursni Sotib Olish`}
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 rounded-xl border border-white/10 text-white font-semibold text-sm flex items-center justify-center gap-1.5"
              >
                <UserIcon size={14} />
                Profil
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="py-3 rounded-xl border border-red-500/20 bg-red-950/20 text-red-400 text-sm font-semibold"
              >
                Tizimdan Chiqish
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 rounded-xl border border-white/10 text-white font-semibold text-sm"
              >
                Kirish
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 rounded-xl bg-white text-black font-bold text-sm"
              >
                Kursni Boshlash
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
