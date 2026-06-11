'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen text-white select-none bg-transparent flex flex-col justify-between">
      {/* Header / Navbar */}
      <header className="w-full h-20 border-b border-white/5 bg-[#050505]/60 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#D4AF37] flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-all duration-300">
            <Sparkles size={18} className="text-white animate-pulse" />
          </div>
          <span className="text-lg font-bold tracking-widest bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent group-hover:text-[#D4AF37] transition-all">
            SANCHO<span className="text-[#D4AF37]">.AI</span>
          </span>
        </Link>
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold transition-all text-white"
        >
          <ArrowLeft size={14} /> Asosiyga qaytish
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl w-full mx-auto px-6 py-16 flex-grow">
        <div className="rounded-3xl glass border border-white/5 p-8 md:p-12 relative overflow-hidden backdrop-blur-xl bg-black/40">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/5 rounded-full filter blur-[80px] -z-10" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#6366F1]/5 rounded-full filter blur-[80px] -z-10" />

          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Loyiha qoidalari</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2 mb-8 tracking-tight">Foydalanish shartlari</h1>
          
          <div className="space-y-8 text-sm text-[#94A3B8] leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-wide border-l-2 border-[#D4AF37] pl-3">1. Umumiy shartlar</h2>
              <p>
                Sancho.AI platformasiga xush kelibsiz. Platformadan foydalanish orqali siz ushbu foydalanish shartlariga to'liq roziligingizni bildirasiz. Agar shartlarga rozi bo'lmasangiz, platformadan foydalanmasligingizni so'raymiz.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-wide border-l-2 border-[#D4AF37] pl-3">2. Mualliflik huquqlari va intellektual mulk</h2>
              <p>
                Loyiha tarkibidagi barcha o'quv materiallari, darsliklar, videolar, ssenariylar, promptlar, dizayn elementlari va matnlar Sancho.AI ning intellektual mulki hisoblanadi va qonun bilan himoyalangan.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Kurs materiallarini ko'chirib olish, ko'paytirish va boshqa shaxslarga tarqatish taqiqlanadi.</li>
                <li>Darslarni uchinchi shaxslarga sotish yoki bepul ulashish qat'iyan man etiladi.</li>
                <li>Platformada taqdim etilgan video materiallarning havolalarini (URL) har qanday dasturlar yoki brauzer vositalari orqali o'g'irlash yoki tarqatish qonunga xilofdir.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-wide border-l-2 border-[#D4AF37] pl-3">3. Akkaunt xavfsizligi va cheklovlar</h2>
              <p>
                Har bir foydalanuvchi akkaunti shaxsiydir va faqat bitta qurilma yoki bitta shaxs uchun mo'ljallangan. Akkaunt ma'lumotlarini (login va parol) boshqalarga berish taqiqlanadi.
              </p>
              <p className="text-[#D4AF37]">
                <strong>DIQQAT:</strong> Bir akkauntdan bir nechta shaxslar yoki shubhali tarzda turli joylardan kirish aniqlansa, tizim akkauntni ogohlantirishsiz avtomatik tarzda bloklaydi va to'langan mablag' qaytarilmaydi.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-wide border-l-2 border-[#D4AF37] pl-3">4. To'lovlar va qaytarib berish siyosati</h2>
              <p>
                Platformadagi kurslarga kirish pullik obuna (Premium) orqali amalga oshiriladi. Raqamli axborot xizmatlari va o'quv materiallari sotib olingandan so'ng darhol to'liq taqdim etilishi sababli, to'lovlar qaytarilmaydi.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-wide border-l-2 border-[#D4AF37] pl-3">5. Shartlarning o'zgarishi</h2>
              <p>
                Sancho.AI platformasi ushbu qoidalarni istalgan vaqtda o'zgartirish huquqini saqlab qoladi. Qoidalar o'zgarganda ularning yangi tahriri ushbu sahifada e'lon qilinadi.
              </p>
            </section>

            <div className="pt-6 border-t border-white/5 text-xs text-[#6366F1]">
              Oxirgi yangilanish sanasi: 11-Iyun, 2026-yil
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
