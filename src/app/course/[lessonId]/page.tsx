'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import CustomVideoPlayer from '@/components/CustomVideoPlayer';
import { 
  Play, CheckCircle2, ChevronRight, BookOpen, Download, AlertCircle, FileText, ClipboardList 
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  description: string;
  notes: string;
  orderIndex: number;
  moduleId: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  lessons: Lesson[];
}

interface ProgressItem {
  lessonId: string;
  isCompleted: boolean;
}

interface ProgressResponse {
  lessonId: string;
  isCompleted: boolean;
}

export default function LessonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const activeLessonId = params.lessonId as string;

  const [modules, setModules] = useState<Module[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notes' | 'templates' | 'homework'>('notes');

  useEffect(() => {
    if (!activeLessonId) return;

    Promise.all([
      fetch('/api/lessons').then(async (res) => {
        if (res.ok) return res.json();
        if (res.status === 403) {
          const data = await res.json().catch(() => ({}));
          if (data.error === 'premium_required') {
            throw new Error('PremiumRequired');
          }
        }
        throw new Error('Unauthorized');
      }),
      fetch('/api/progress').then((res) => {
        if (res.ok) return res.json() as Promise<ProgressResponse[]>;
        return [];
      })
    ])
      .then(([modulesData, progressData]) => {
        setModules(modulesData);
        
        let foundLesson: Lesson | null = null;
        modulesData.forEach((mod: Module) => {
          const les = mod.lessons.find((l) => l.id === activeLessonId);
          if (les) foundLesson = les;
        });
        setActiveLesson(foundLesson);

        const completedIds = progressData
          .filter((p: ProgressItem) => p.isCompleted)
          .map((p: ProgressItem) => p.lessonId);
        setCompletedLessons(completedIds);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (err instanceof Error && err.message === 'PremiumRequired') {
          router.replace('/#pricing');
        } else {
          router.replace(`/login?redirect=/course/${activeLessonId}`);
        }
      });
  }, [activeLessonId, router]);

  const toggleLessonComplete = async (lessonId: string, currentCompleted: boolean) => {
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, isCompleted: !currentCompleted }),
      });

      if (res.ok) {
        setCompletedLessons((prev) =>
          currentCompleted ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVideoEnded = async () => {
    if (!activeLesson) return;

    if (!completedLessons.includes(activeLesson.id)) {
      await toggleLessonComplete(activeLesson.id, false);
    }

    let flatLessons: Lesson[] = [];
    modules.forEach((mod) => {
      flatLessons = [...flatLessons, ...mod.lessons];
    });

    const currentIndex = flatLessons.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex !== -1 && currentIndex < flatLessons.length - 1) {
      const nextLesson = flatLessons[currentIndex + 1];
      router.push(`/course/${nextLesson.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold tracking-wider text-[#94A3B8]">{`Dars yuklanmoqda...`}</p>
        </div>
      </div>
    );
  }

  if (!activeLesson) {
    return (
      <div className="min-h-screen text-white select-none bg-[#050505] flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 main-content md:pt-0 pt-16 justify-between">
          <div className="max-w-md mx-auto p-8 rounded-3xl glass text-center mt-20">
            <h2 className="text-xl font-bold mb-4">{`Dars topilmadi`}</h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              {`Siz izlayotgan dars tizimda mavjud emas yoki o'chirib tashlangan.`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white select-none bg-transparent flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 main-content md:pt-0 pt-16 justify-between">

      <main className="max-w-[1600px] w-full mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 flex-1">
        <section className="flex-1 flex flex-col gap-6 lg:max-w-[75%]">
          <CustomVideoPlayer videoUrl={activeLesson.videoUrl} onEnded={handleVideoEnded} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass border border-white/5">
            <div>
              <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">{`Mavjud dars`}</span>
              <h1 className="text-xl md:text-2xl font-bold mt-1">{activeLesson.title}</h1>
            </div>
            
            <button
              onClick={() => toggleLessonComplete(activeLesson.id, completedLessons.includes(activeLesson.id))}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                completedLessons.includes(activeLesson.id)
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
              }`}
            >
              <CheckCircle2 size={16} />
              {completedLessons.includes(activeLesson.id) ? `Tugallangan` : `Tugallangan deb belgilash`}
            </button>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl glass border border-white/5 p-6">
            <div className="flex border-b border-white/5 gap-2">
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
                  activeTab === 'notes' ? 'border-[#D4AF37] text-white' : 'border-transparent text-[#94A3B8] hover:text-white'
                }`}
              >
                <BookOpen size={14} />
                {`Dars tavsifi`}
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
                  activeTab === 'templates' ? 'border-[#D4AF37] text-white' : 'border-transparent text-[#94A3B8] hover:text-white'
                }`}
              >
                <FileText size={14} />
                {`Ssenariy shablonlari`}
              </button>
              <button
                onClick={() => setActiveTab('homework')}
                className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold tracking-wider uppercase border-b-2 transition-all ${
                  activeTab === 'homework' ? 'border-[#D4AF37] text-white' : 'border-transparent text-[#94A3B8] hover:text-white'
                }`}
              >
                <ClipboardList size={14} />
                {`Vazifalar`}
              </button>
            </div>

            <div className="mt-2 text-sm text-[#94A3B8] leading-relaxed">
              {activeTab === 'notes' && (
                <div className="flex flex-col gap-4">
                  <p>{activeLesson.description || 'Ushbu dars uchun qisqacha izoh kiritilmagan.'}</p>
                  {activeLesson.notes && (
                    <div className="p-4 rounded-xl bg-[#050505] border border-white/5 mt-4 font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-[300px]">
                      <h4 className="text-xs font-bold uppercase text-[#D4AF37] mb-2 font-sans tracking-wider">{`Qo'shimcha eslatmalar:`}</h4>
                      {activeLesson.notes}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'templates' && (
                <div className="flex flex-col gap-4">
                  <div className="p-4 rounded-xl bg-[#050505] border border-[#D4AF37]/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-xs">{`Video Ssenariy & Promptlar Shablonlari`}</h4>
                        <p className="text-[11px] text-[#94A3B8]">{`Darsda ko'rsatilgan promptlar va strukturalar (.txt)`}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const blob = new Blob([activeLesson.notes || ''], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${activeLesson.title.toLowerCase().replace(/\s+/g, '_')}_prompts.txt`;
                        a.click();
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold"
                    >
                      <Download size={12} /> {`Yuklash`}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'homework' && (
                <div className="flex flex-col gap-4">
                  <div className="p-4 rounded-xl bg-[#050505] border border-white/5 flex gap-3">
                    <AlertCircle className="text-[#6366F1] shrink-0" size={18} />
                    <div className="flex flex-col gap-1">
                      <h4 className="font-semibold text-white text-xs">{`Amaliy vazifa:`}</h4>
                      <p className="text-xs">
                        {`Darsda olingan AI modellaridan foydalanib o'z sohangiz bo'yicha 15 soniyalik qisqa video yarating, montaj qiling va natijani hamjamiyat kanaliga yuboring.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="w-full lg:w-[25%] flex flex-col gap-4">
          <div className="rounded-2xl glass border border-white/5 p-4 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#94A3B8] px-2">{`Kurs Mundarijasi`}</h3>
            
            <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1">
              {modules.map((mod) => (
                <div key={mod.id} className="flex flex-col gap-1.5">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wide">{`Modul `}{mod.orderIndex}</span>
                    <h4 className="font-bold text-xs text-white line-clamp-1 mt-0.5">{mod.title}</h4>
                  </div>
                  
                  <div className="flex flex-col gap-1 pl-2 border-l border-white/5">
                    {mod.lessons.map((les) => {
                      const isActive = les.id === activeLessonId;
                      const isCompleted = completedLessons.includes(les.id);
                      
                      return (
                        <Link
                          key={les.id}
                          href={`/course/${les.id}`}
                          className={`flex items-center justify-between p-2.5 rounded-lg text-xs transition-all ${
                            isActive
                              ? 'bg-[#D4AF37]/10 text-white font-semibold border border-[#D4AF37]/20 shadow-sm'
                              : 'hover:bg-white/[0.02] text-[#94A3B8]'
                          }`}
                        >
                          <div className="flex items-center gap-2 line-clamp-1 pr-2">
                            {isCompleted ? (
                              <CheckCircle2 size={12} className="text-green-400 shrink-0" />
                            ) : (
                              <Play size={12} className={isActive ? 'text-[#D4AF37] shrink-0' : 'text-[#94A3B8]/60 shrink-0'} />
                            )}
                            <span className="line-clamp-1 text-[11px]">{les.title}</span>
                          </div>
                          <ChevronRight size={10} className="text-[#94A3B8]/40 shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
      </div>
    </div>
  );
}
