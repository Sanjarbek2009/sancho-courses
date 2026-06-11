'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
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

          <span className="text-xs font-bold text-[#6366F1] uppercase tracking-widest">Ma'lumotlar himoyasi</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2 mb-8 tracking-tight">Maxfiylik siyosati</h1>
          
          <div className="space-y-8 text-sm text-[#94A3B8] leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-wide border-l-2 border-[#6366F1] pl-3">1. Ma'lumotlarni to'plash</h2>
              <p>
                Sancho.AI platformasi siz ro'yxatdan o'tganingizda, obunani xarid qilganingizda yoki platformadan foydalanganingizda quyidagi shaxsiy ma'lumotlarni to'playdi:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Ismingiz va familiyangiz;</li>
                <li>Elektron pochta manzilingiz (email);</li>
                <li>Tizimdagi faolligingiz va darslarni yakunlash ko'rsatkichlari;</li>
                <li>To'lov tranzaksiyalari haqidagi zaruriy ma'lumotlar (plastik karta raqamlari platformamizda saqlanmaydi va to'liq xavfsiz to'lov shlyuzlari orqali boshqariladi).</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-wide border-l-2 border-[#6366F1] pl-3">2. Ma'lumotlardan foydalanish maqsadi</h2>
              <p>
                Siz taqdim etgan shaxsiy ma'lumotlar platformamizning to'g'ri ishlashi va xizmat sifatini oshirish uchun ishlatiladi:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Premium darslarga va chat tizimiga kirish huquqini berish;</li>
                <li>Tizimdagi shaxsiy profilingizni shakllantirish va saqlash;</li>
                <li>Foydalanuvchini qo'llab-quvvatlash va so'rovlarga javob berish;</li>
                <li>Tizim xavfsizligini ta'minlash va shubhali xatti-harakatlarni tekshirish.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-wide border-l-2 border-[#6366F1] pl-3">3. Ma'lumotlar xavfsizligi va himoyasi</h2>
              <p>
                Biz sizning shaxsiy ma'lumotlaringiz xavfsizligini juda qadrlaymiz. Ma'lumotlaringiz ruxsatsiz kirish, foydalanish yoki oshkor etilishidan himoyalanishi uchun zamonaviy shifrlangan ma'lumotlar bazalaridan (SSL texnologiyalari orqali) foydalanamiz.
              </p>
              <p>
                Sizning ma'lumotlaringiz hech qachon uchinchi shaxslarga sotilmaydi yoki ijaraga berilmaydi.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-wide border-l-2 border-[#6366F1] pl-3">4. Cookies va kesh fayllari</h2>
              <p>
                Platformamiz sizning sessiyalaringizni va tizimdagi tanlovlaringizni eslab qolish uchun vaqtincha browser cookies fayllaridan foydalanishi mumkin. Siz istalgan vaqtda browser sozlamalari orqali cookiesni o'chirib qo'yishingiz mumkin.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-wide border-l-2 border-[#6366F1] pl-3">5. Aloqa va qo'llab-quvvatlash</h2>
              <p>
                Maxfiylik siyosatiga doir har qanday savollar yuzasidan quyidagi pochta orqali biz bilan bog'lanishingiz mumkin: <strong>saburowsanjar1@gmail.com</strong>.
              </p>
            </section>

            <div className="pt-6 border-t border-white/5 text-xs text-[#D4AF37]">
              Oxirgi yangilanish sanasi: 11-Iyun, 2026-yil
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
