'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c] to-transparent opacity-60 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        <div className="md:col-span-2 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 group w-max">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6366F1] to-[#D4AF37] flex items-center justify-center shadow-md">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-widest text-white group-hover:text-[#D4AF37] transition-all">
              SANCHO<span className="text-[#D4AF37]">.AI</span>
            </span>
          </Link>
          <p className="text-sm text-[#94A3B8] max-w-sm leading-relaxed">
            {`Sun'iy intellekt yordamida dunyo darajasidagi qisqa va uzun videolar yaratishni o'rgatuvchi yuqori sifatli ta'lim platformasi.`}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Platforma</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-[#94A3B8]">
            <li><Link href="/#syllabus" className="hover:text-[#D4AF37] transition-colors">Kurs Dasturi</Link></li>
            <li><Link href="/#about-me" className="hover:text-[#D4AF37] transition-colors">Men Haqimda</Link></li>
            <li><Link href="/#faq" className="hover:text-[#D4AF37] transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Aloqa & Tarmoqlar</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-[#94A3B8]">
            <li>
              <a href="https://instagram.com/sanchoai1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-all duration-300 hover:translate-x-0.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                Instagram <ArrowUpRight size={12} />
              </a>
            </li>
            <li>
              <a href="https://tiktok.com/@sancho.ai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-all duration-300 hover:translate-x-0.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
                TikTok <ArrowUpRight size={12} />
              </a>
            </li>
            <li>
              <a href="https://t.me/sancho_ai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-all duration-300 hover:translate-x-0.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Telegram <ArrowUpRight size={12} />
              </a>
            </li>
            <li>
              <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/5 border border-[#D4AF37]/15 px-2 py-1 rounded block w-max">
                Support: saburowsanjar1@gmail.com
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8] relative z-10">
        <span>&copy; {new Date().getFullYear()} SANCHO.AI. Barcha huquqlar himoyalangan.</span>
        <div className="flex gap-6">
          <Link href="/terms" className="hover:text-white transition-colors">Foydalanish shartlari</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Maxfiylik siyosati</Link>
        </div>
      </div>
    </footer>
  );
}
