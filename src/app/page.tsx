'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { 
  Sparkles, Zap, Cpu, DollarSign, ArrowRight, CheckCircle2, ChevronDown, Award, PlayCircle
} from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function LandingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const handleCTA = () => {
    if (!user) {
      router.push('/register?redirect=%2Fbuy');
      return;
    }

    if (user.isPaid || user.role === 'ADMIN') {
      router.push('/course');
      return;
    }

    router.push('/buy');
  };

  const modules = [
    {
      num: '01',
      title: 'Sun\'iy intellekt va Prompt asoslari (Starter pack)',
      desc: 'Sun\'iy intellektning ishlash tamoyillari, tizim sozlamalari, ChatGPT va matnli modellar orqali professional prompt yozish sirlari hamda bepul rasm/video generatsiya qilish platformalari.',
      icon: <Cpu className="text-[#D4AF37]" size={24} />,
      topics: [
        'Sun\'iy intellekt nima va qanday ishlaydi?',
        'ChatGPT nima? Matn bilan ishlash modellari',
        'Professional prompt yozishni o\'rganish sirlari',
        'Bepulga rasm/video generatsiya qilish (VEO 3.1 & Grok)'
      ]
    },
    {
      num: '02',
      title: 'Professional Rasm va Video Generatsiyasi (Review)',
      desc: 'Midjourney, Higgsfield AI, SyntxAI, Runway va VEO 3.1 platformalari imkoniyatlari. ComfyUI-ni kompyuterga oflayn o\'rnatish va Seedance 2, meta.ai hamda UNI-1 modellarini o\'rganish.',
      icon: <Sparkles className="text-[#6366F1]" size={24} />,
      topics: [
        'Midjourney bo\'yicha birinchi darslik video',
        'Higgsfield AI, SyntxAI va Runway darslari',
        'ComfyUI - kompyuterda oflayn generatsiya qilish',
        'Seedance 2, meta.ai va UNI-1 aqlli modellar'
      ]
    },
    {
      num: '03',
      title: 'Avatarlar va Video Montaj (Workshop)',
      desc: 'Elevenlabs-da virtual ovoz yaratish, ovozni klonlash va almashtirish. Virtual avatar uchun rasm generatsiyasi, avatarni prompt bilan gapirtirish, musiqiy va reklama videolarini noldan qilish.',
      icon: <Zap className="text-[#D4AF37]" size={24} />,
      topics: [
        'Elevenlabsda virtual ovoz yaratish va klonlash',
        'Avatarlarni PROMPT bilan gapirtirish (Avatarlar 1-4 darslar)',
        'Musiqiy klip (1-3 qismlar) va reklama videosini yaratish',
        'Mashina ASMR restavratsiyasi va Speedramp animatsiyasi'
      ]
    },
    {
      num: '04',
      title: 'Video Nazariyasi, Algoritmlar va Trends',
      desc: 'Video generatsiya turlari, birinchi kard nazariyasi. Eng ko\'p ko\'riladigan virus videolar ssenariysi, selfie trend videolari, 360 panorama yaratish hamda obunalar va monetizatsiya sirlari.',
      icon: <DollarSign className="text-[#6366F1]" size={24} />,
      topics: [
        'Video generatsiya turlari va birinchi kard nazariyasi',
        'Selfie Trend video yasash va 360 panorama qilish',
        'Sun\'iy intellekt platformalari obunalarining narxlari',
        'Virus kontentlar, monetizatsiya va shogirdlar tajribalari'
      ]
    }
  ];

  const faqs = [
    {
      q: 'Kursda qatnashish uchun kuchli kompyuter kerakmi?',
      a: 'Yo\'q, deyarli barcha generatsiya jarayonlari bulutli serverlarda (Discord va web-brauzerlar) amalga oshiriladi. Smartfon yoki oddiy noutbuk yetarli.'
    },
    {
      q: 'Kurs qancha davom etadi va darslarni qachon ko\'rishim mumkin?',
      a: 'Kurs darslari yozib olingan va siz ularni o\'zingizga qulay vaqtda, cheksiz marta ko\'rishingiz mumkin. Sotib olingandan so\'ng umrbod kirish huquqi beriladi.'
    },
    {
      q: 'AI yordamida yaratilgan videolar monetizatsiya qilinadimi?',
      a: 'Ha! Hozirda YouTube, TikTok va Instagram platformalarida AI yordamida yaratilgan, to\'g\'ri ssenariy va montajga ega bo\'lgan videolar to\'liq monetizatsiya qilinadi.'
    },
    {
      q: 'To\'lovdan keyin darslarga qanday kiraman?',
      a: 'To\'lov Telegram (@sancho_ai) orqali tasdiqlanganidan so\'ng, admin sizga premium obuna beradi va darslar profilingizda avtomatik ravishda faollashadi.'
    }
  ];

  return (
    <div className="min-h-screen text-white select-none bg-transparent flex flex-col md:flex-row">
      <Sidebar />
      <div id="home" className="flex-1 flex flex-col min-w-0 main-content md:pt-0 pt-16">

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center gap-8 min-h-[80vh] justify-center">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-fadeIn">
          <Sparkles size={14} className="text-[#D4AF37]" />
          <span className="text-xs font-semibold tracking-wider text-[#94A3B8] uppercase">Premium AI Video Academy</span>
        </div>

        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.15] max-w-5xl bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent">
          {`Sun'iy Intellekt Yordamida`} <br />
          <span className="bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#6366F1] bg-clip-text text-transparent">
            {`Dunyo Darajasidagi Videolar`}
          </span> {`Yaratishni O'rganing`}
        </h1>

        <p className="text-base md:text-xl text-[#94A3B8] max-w-3xl leading-relaxed">
          {`AI texnologiyalari yordamida professional Shorts, Reels va YouTube kontentini noldan tayyorlash, algoritmlarni zabt etish va shaxsiy brendni monetizatsiya qilish bo'yicha eng mukammal masterklass.`}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center mt-4">
          <button
            onClick={handleCTA}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-sm hover:opacity-90 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            {user ? (user.isPaid || user.role === 'ADMIN' ? `Dashboardga o'tish` : `Kursni Sotib Olish`) : `Hoziroq Kirish Huquqini Oling`}
            <ArrowRight size={16} />
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('syllabus')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlayCircle size={16} className="text-[#6366F1]" />
            {`Dasturni Ko'rish`}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl w-full mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-2xl md:text-3xl font-extrabold text-[#D4AF37]">75K+</span>
            <span className="text-xs text-[#94A3B8]">{`Faol hamjamiyat`}</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-2xl md:text-3xl font-extrabold text-[#6366F1]">4+</span>
            <span className="text-xs text-[#94A3B8]">{`Amaliy modullar`}</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-2xl md:text-3xl font-extrabold text-white">40+</span>
            <span className="text-xs text-[#94A3B8]">{`AI vositalari`}</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-2xl md:text-3xl font-extrabold text-[#D4AF37]">24/7</span>
            <span className="text-xs text-[#94A3B8]">{`Talabalar qo'llab-quvvatlash`}</span>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="syllabus" className="max-w-7xl mx-auto px-6 py-28 relative">
        <div className="text-center flex flex-col items-center gap-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            {`Kurs `}
            <span className="text-[#D4AF37]">{`Modullari`}</span>
            {` & Dasturi`}
          </h2>
          <p className="text-sm md:text-base text-[#94A3B8] max-w-xl leading-relaxed">
            {`Videolarni g'oyadan tortib to virus darajasigacha generatsiya qilishni, montaj qilishni va monetizatsiya tizimini o'rganing.`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modules.map((mod, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl glass hover:border-[#D4AF37]/30 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between group animate-fadeIn"
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#D4AF37]/20 transition-all">
                    {mod.icon}
                  </div>
                  <span className="text-4xl font-extrabold text-white/5 font-mono">{mod.num}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2.5">{mod.title}</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{mod.desc}</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <h4 className="text-xs font-bold uppercase text-[#D4AF37]/80 tracking-wider mb-3">{`Asosiy mavzular`}</h4>
                <ul className="flex flex-col gap-2">
                  {mod.topics.map((t, tid) => (
                    <li key={tid} className="flex items-center gap-2 text-xs text-[#94A3B8]">
                      <CheckCircle2 size={12} className="text-[#6366F1]" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instructor About Me Section */}
      <section id="about-me" className="max-w-7xl mx-auto px-6 py-28 relative border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-80 h-80 rounded-3xl p-1.5 bg-gradient-to-tr from-[#6366F1] via-[#D4AF37] to-[#FFD700] shadow-[0_0_35px_rgba(212,175,55,0.25)] hover:scale-105 transition-all duration-500 overflow-hidden">
              <img
                src="/avatar.jpg"
                alt="Sancho AI Instructor Avatar"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col gap-6">
            <div className="flex items-center gap-2 w-max px-3 py-1 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20">
              <Award size={14} className="text-[#6366F1]" />
              <span className="text-xs font-bold text-[#6366F1] uppercase">{`Instruktor`}</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              {`Salom, Men `}
              <span className="text-[#D4AF37]">{`Sancho`}</span>
            </h2>
            
            <div className="flex flex-col gap-4 text-sm text-[#94A3B8] leading-relaxed">
              <p>
                {`Men 1.5 yilda 75,000 dan ortiq auditoriyaga ega bo'lgan media-texnologiya hamjamiyatini barpo etdim va ushbu davr mobaynida sun'iy intellekt orqali video kontent ishlab chiqarish sohasida faoliyat yuritib kelmoqdaman.`}
              </p>
              <p>
                {`Mening maqsadim — ijodkorlarga eng ilg'or generatsiya platformalari va algoritmlar sirlarini o'rgatish orqali, uydan chiqmasdan xalqaro bozorda professional daromad topadigan mutaxassislarni tayyorlashdir.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-center gap-1">
                <span className="text-2xl font-bold text-white">75K+</span>
                <span className="text-xs text-[#94A3B8]">{`Ijtimoiy tarmoqda jami auditoriya`}</span>
              </div>
              <button
                onClick={() => setIsCertModalOpen(true)}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white/5 hover:border-[#D4AF37]/35 transition-all duration-300 group"
              >
                <Award className="text-[#D4AF37] group-hover:scale-110 transition-transform" size={24} />
                <span className="text-xs text-[#94A3B8] font-bold">{`Sertifikatni Ko'rish`}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-4xl mx-auto px-6 py-28 relative">
        {user && (user.isPaid || user.role === 'ADMIN') ? (
          <div className="rounded-3xl glass-premium p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 glow-gold relative overflow-hidden animate-fadeIn">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-[#D4AF37]/5 blur-[60px] pointer-events-none" />
            
            <div className="flex flex-col gap-6 max-w-md">
              <div className="flex items-center gap-2 w-max px-3 py-1 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                <Sparkles size={14} className="text-[#D4AF37] animate-pulse" />
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">{`Premium VIP A'zo`}</span>
              </div>
              <h3 className="text-2xl md:text-4xl font-extrabold text-white">
                {`Akademiya A'zoligi Faol!`}
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                {`Siz Sancho.AI akademiyasining barcha premium darslari, promptlar kutubxonasi, tayyor darsliklar va yangilanib boradigan qo'llanmalardan cheksiz foydalanish huquqiga egasiz.`}
              </p>
              <div className="flex flex-col gap-2.5 text-xs text-[#94A3B8] mt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#D4AF37]" />
                  <span>{`Barcha 4 modul va 40 dan ortiq video darslar`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#D4AF37]" />
                  <span>{`Hamjamiyat va yordam guruhlariga to'liq kirish`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#D4AF37]" />
                  <span>{`Yangi qo'shiladigan modullarni bepul yangilash`}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 w-full md:w-80 relative z-10">
              <div className="relative w-full aspect-[1.58/1] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group hover:border-[#D4AF37]/40 transition-all duration-300">
                <img 
                  src="/premium-welcome.jpg" 
                  alt="Sancho.AI VIP Access Card" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
              
              <button
                onClick={() => router.push('/course')}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-sm hover:opacity-95 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2"
              >
                <PlayCircle size={16} className="text-black" />
                {`Kursni Boshlash`}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl glass-premium p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 glow-gold relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-[#D4AF37]/5 blur-[60px] pointer-events-none" />
            
            <div className="flex flex-col gap-4 max-w-md">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">{`Umrbod Kirish`}</span>
              <h3 className="text-2xl md:text-4xl font-extrabold">{`Kursga Umrbod Kirish`}</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                {`Barcha 4 modul, ssenariy shablonlari, promptlar kutubxonasi va yangilanib boradigan AI darsliklaridan cheksiz foydalanish.`}
              </p>
              <ul className="flex flex-col gap-2 text-xs text-[#94A3B8] mt-2">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#D4AF37]" /> {`40 dan ortiq batafsil video darslar`}</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#D4AF37]" /> {`Tayyor darsliklar va qo'llanmalar`}</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#D4AF37]" /> {`Kelajakdagi yangi modullarga bepul kirish`}</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-[#050505] border border-white/10 flex flex-col items-center gap-6 w-full md:w-64 relative z-10 shadow-2xl">
              <div className="flex flex-col items-center">
                <span className="text-xs text-[#94A3B8] line-through">$99.00</span>
                <span className="text-4xl font-extrabold text-white">$19.00</span>
                <span className="text-xs text-[#6366F1] font-semibold mt-1">{`Bir martalik to'lov`}</span>
              </div>
              <button
                onClick={handleCTA}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-sm hover:opacity-95 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                {user ? (
                  user.isPaid || user.role === 'ADMIN' ? `Dashboardga o'tish` : `Kursni Sotib Olish`
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15.82-.62 3.6-1.01 5.75-.16.91-.49 1.22-.81 1.25-.7.06-1.23-.46-1.91-.91-1.06-.7-1.66-1.13-2.69-1.81-1.19-.79-.42-1.22.26-1.93.18-.18 3.25-2.98 3.31-3.24.01-.03.01-.15-.06-.21-.07-.06-.17-.04-.25-.02-.11.02-1.91 1.21-5.38 3.55-.51.35-.97.52-1.38.51-.45-.01-1.32-.26-1.97-.47-.79-.26-1.42-.4-1.37-.84.03-.23.35-.47.96-.71 3.76-1.63 6.27-2.71 7.54-3.23 3.58-1.48 4.33-1.74 4.82-1.75.11 0 .35.03.51.17.13.12.17.29.19.41-.01.08.01.26.01.35z"/>
                    </svg>
                    Kursni Boshlash
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-28 relative">
        <div className="text-center flex flex-col items-center gap-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{`Ko'p Beriladigan Savollar`}</h2>
          <p className="text-sm text-[#94A3B8]">{`Darslar bilan bog'liq eng ko'p beriladigan savollarga javoblar.`}</p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-md overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-all duration-300"
              >
                <span className="font-semibold text-sm md:text-base text-white">{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-[#94A3B8] transition-transform duration-300 ${faqOpen === idx ? 'rotate-180 text-[#D4AF37]' : ''}`}
                />
              </button>
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  faqOpen === idx ? 'max-h-40 border-t border-white/5' : 'max-h-0'
                }`}
              >
                <p className="p-6 text-sm text-[#94A3B8] leading-relaxed bg-[#050505]/40">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      </div>

      {/* Certificate Modal */}
      {isCertModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all duration-300 animate-fadeIn"
          onClick={() => setIsCertModalOpen(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-[#0a0a0a]/90 border border-white/10 rounded-3xl p-2 md:p-4 shadow-2xl flex flex-col items-center max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsCertModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-200 text-white z-10"
            >
              <span className="text-lg font-bold">✕</span>
            </button>

            {/* Certificate Image */}
            <div className="w-full flex justify-center items-center rounded-2xl p-2">
              <img
                src="/certificate.png"
                alt="Google Coursera Sertifikati"
                className="w-full max-w-full h-auto md:w-auto md:max-h-[75vh] object-contain rounded-xl shadow-lg border border-white/5"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
