'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function CoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/lessons')
      .then(async (res) => {
        if (res.ok) return res.json();
        if (res.status === 403) {
          const data = await res.json().catch(() => ({}));
          if (data.error === 'premium_required') {
            throw new Error('PremiumRequired');
          }
        }
        throw new Error('Unauthorized');
      })
      .then((modules) => {
        if (modules && modules.length > 0 && modules[0].lessons && modules[0].lessons.length > 0) {
          const firstLessonId = modules[0].lessons[0].id;
          router.replace(`/course/${firstLessonId}`);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err instanceof Error && err.message === 'PremiumRequired') {
          router.replace('/#pricing');
        } else {
          router.replace('/login?redirect=/course');
        }
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold tracking-wider text-[#94A3B8]">Darslar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white select-none bg-transparent flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 main-content md:pt-0 pt-16 justify-between">
      <div className="max-w-md mx-auto p-8 rounded-3xl glass text-center mt-20">
        <h2 className="text-xl font-bold mb-4">Hozircha darslar mavjud emas</h2>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          Tizimda faol darslar topilmadi. Iltimos, admin akkauntingiz orqali darslarni yuklang yoki keyinroq qayta urining.
        </p>
      </div>
      <div className="h-20" />
      </div>
    </div>
  );
}
