'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { 
  Sparkles, CheckCircle2, MessageSquare, 
  Volume2, Users, Video, Image as ImageIcon, ArrowLeft
} from 'lucide-react';

export default function BuyPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  React.useEffect(() => {
    if (user && (user.isPaid || user.role === 'ADMIN')) {
      router.push('/course');
    }
  }, [user, router]);

  const handleTelegramPay = () => {
    if (!user) {
      router.push('/register?redirect=%2Fbuy');
      return;
    }
    const message = `Assalomu alaykum! Kursni sotib olmoqchiman. Akkaunt email: ${user.email}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://t.me/sancho_ai?text=${encodedMessage}`, '_blank');
  };

  const features = [
    {
      title: 'AI va Prompt Asoslari',
      desc: 'Sun\'iy intellektning ishlash tamoyillari, tizim sozlamalari, ChatGPT va LLM modellar orqali professional prompt yozish sirlari hamda sun\'iy intellekt bilan to\'g\'ri gaplashish.',
      icon: <MessageSquare className="text-[#D4AF37]" size={24} />,
      bgGradient: 'from-[#D4AF37]/10 to-transparent',
      image: '/buy-prompt.png'
    },
    {
      title: 'Ovoz Klonlash & Audio Yaratish',
      desc: 'Elevenlabs platformasida virtual ovoz yaratish, ovozni to\'liq klonlash va almashtirish. Professional audiolar, ovozli xabarlar va virtual qo\'shiqlar generatsiya qilish.',
      icon: <Volume2 className="text-[#6366F1]" size={24} />,
      bgGradient: 'from-[#6366F1]/10 to-transparent',
      image: '/buy-audio.png'
    },
    {
      title: 'Virtual Avatarlar Yaratish',
      desc: 'Avatar uchun rasmlar generatsiya qilish, avatarni prompt yordamida gapirtirish va sun\'iy intellekt orqali gapiruvchi video boshlovchilar va qahramonlar tayyorlash.',
      icon: <Users className="text-[#D4AF37]" size={24} />,
      bgGradient: 'from-[#D4AF37]/10 to-transparent',
      image: '/buy-avatar.png'
    },
    {
      title: 'Video Generatsiya',
      desc: 'Shorts, Reels, TikTok va YouTube kontenti uchun sun\'iy intellekt yordamida to\'liq professional videolarni noldan generatsiya qilish, algoritmlar va trendlarni zabt etish.',
      icon: <Video className="text-[#6366F1]" size={24} />,
      bgGradient: 'from-[#6366F1]/10 to-transparent',
      image: '/buy-video.png'
    },
    {
      title: 'Rasm Generatsiyasi & Tahrirlash',
      desc: 'Midjourney, VEO 3.1 va boshqa eng so\'nggi modellar yordamida mukammal tasvirlar yaratish hamda ularni sun\'iy intellekt asboblari orqali professional tahrirlash (editing).',
      icon: <ImageIcon className="text-[#D4AF37]" size={24} />,
      bgGradient: 'from-[#D4AF37]/10 to-transparent',
      image: '/buy-image.png'
    }
  ];

  return (
    <div className="min-h-screen text-white select-none bg-transparent flex flex-col md:flex-row">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 main-content md:pt-0 pt-16 justify-between">
        <main className="max-w-7xl w-full mx-auto px-6 py-12 flex flex-col gap-12 flex-1">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5">
            <div>
              <button 
                onClick={() => router.push('/')}
                className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors mb-2"
              >
                <ArrowLeft size={14} /> Asosiy sahifaga qaytish
              </button>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                Premium AI Video Academy
              </h1>
              <p className="text-xs md:text-sm text-[#94A3B8] mt-1.5">
                Noldan boshlab sun&apos;iy intellekt orqali media, video, audio va avatarlar yaratish masterklassi
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37]">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Premium Masterklass</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Grid of Features */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight mb-2">
                  Kursda Nimalarni O&apos;rganasiz?
                </h2>
                <p className="text-xs md:text-sm text-[#94A3B8]">
                  Barcha modullar to&apos;liq amaliy darsliklar va tayyor prompt shablonlari bilan ta&apos;minlangan
                </p>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feat, idx) => (
                  <div 
                    key={idx}
                    className={`rounded-3xl p-6 glass border border-white/5 bg-gradient-to-b ${feat.bgGradient} flex flex-col gap-5 hover:border-[#D4AF37]/35 hover:scale-[1.01] transition-all duration-300 group`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#D4AF37]/20 transition-all">
                        {feat.icon}
                      </div>
                      <h3 className="font-bold text-base text-white">{feat.title}</h3>
                    </div>
                    
                    <p className="text-xs text-[#94A3B8] leading-relaxed flex-1">
                      {feat.desc}
                    </p>

                    {/* Feature Image Vizuali */}
                    <div className="w-full h-36 rounded-2xl border border-white/5 overflow-hidden relative group">
                      <img 
                        src={feat.image} 
                        alt={feat.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Pricing & Purchase Widget */}
            <div className="lg:col-span-4 rounded-3xl glass-premium p-8 border border-[#D4AF37]/25 shadow-2xl relative overflow-hidden flex flex-col gap-6 sticky top-6">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-[#D4AF37]/5 blur-[50px] pointer-events-none" />
              
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">Umrbod Kirish</span>
                <h3 className="text-xl md:text-2xl font-extrabold mt-1">Akademiya A&apos;zoligi</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed mt-2.5">
                  Barcha 4 modul, ssenariy shablonlari, promptlar kutubxonasi va yangilanib boradigan AI darsliklaridan cheksiz foydalanish.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 text-xs text-[#94A3B8] py-4 border-y border-white/5">
                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#D4AF37]" /> {`40 dan ortiq batafsil video darslar`}</div>
                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#D4AF37]" /> {`Tayyor darsliklar va qo'llanmalar`}</div>
                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#D4AF37]" /> {`Kelajakdagi yangi modullarga bepul kirish`}</div>
              </div>

              <div className="flex flex-col items-center gap-1 bg-black/45 border border-white/5 p-5 rounded-2xl">
                <span className="text-xs text-[#94A3B8] line-through">$99.00</span>
                <span className="text-4xl font-extrabold text-white">$19.00</span>
                <span className="text-[10px] text-[#6366F1] font-semibold mt-1">Bir martalik to&apos;lov</span>
              </div>

              <button
                onClick={handleTelegramPay}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-xs hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15.82-.62 3.6-1.01 5.75-.16.91-.49 1.22-.81 1.25-.7.06-1.23-.46-1.91-.91-1.06-.7-1.66-1.13-2.69-1.81-1.19-.79-.42-1.22.26-1.93.18-.18 3.25-2.98 3.31-3.24.01-.03.01-.15-.06-.21-.07-.06-.17-.04-.25-.02-.11.02-1.91 1.21-5.38 3.55-.51.35-.97.52-1.38.51-.45-.01-1.32-.26-1.97-.47-.79-.26-1.42-.4-1.37-.84.03-.23.35-.47.96-.71 3.76-1.63 6.27-2.71 7.54-3.23 3.58-1.48 4.33-1.74 4.82-1.75.11 0 .35.03.51.17.13.12.17.29.19.41-.01.08.01.26.01.35z"/>
                </svg>
                Telegram orqali sotib olish
              </button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
