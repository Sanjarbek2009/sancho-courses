'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { 
  DollarSign, Users, Award, TrendingUp, Trash2, Edit, Save, RefreshCw, X, Check, Search, Ban, ShieldCheck, UploadCloud, Film
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  description: string;
  notes: string;
  orderIndex: number;
  moduleId: string;
  module: {
    title: string;
  };
}

interface Metrics {
  totalRevenue: number;
  activePaidStudents: number;
  averageProgress: number;
  recentSignups: number;
  totalStudents: number;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
  isPaid: boolean;
  isBanned: boolean;
  createdAt: string;
}

interface ModuleResponse {
  title: string;
  lessons: {
    id: string;
    title: string;
    videoUrl: string;
    description: string;
    notes: string;
    orderIndex: number;
    moduleId: string;
  }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [clearingChat, setClearingChat] = useState(false);

  // Tabs: 'lessons' | 'users'
  const [activeTabSection, setActiveTabSection] = useState<'lessons' | 'users'>('lessons');

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [orderIndex, setOrderIndex] = useState('1');
  const [moduleTitle, setModuleTitle] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProgressMB, setUploadProgressMB] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User search state
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getCookie = (name: string) => {
      if (typeof document === 'undefined') return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const isAdminSession = getCookie('admin_session') === 'true';

    if (isAdminSession || (session?.user && session.user.role === 'ADMIN')) {
      setIsAdmin(true);
      loadDashboardData();
    } else if (session === null || (session && session.user && session.user.role !== 'ADMIN')) {
      router.replace('/admin');
    }
  }, [router, session]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsRes, lessonsRes, usersRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/lessons'),
        fetch('/api/admin/users')
      ]);

      if (metricsRes.ok && lessonsRes.ok) {
        const metricsData = await metricsRes.json() as Metrics;
        const modulesData = await lessonsRes.json() as ModuleResponse[];

        setMetrics(metricsData);

        let flat: Lesson[] = [];
        modulesData.forEach((mod) => {
          const mapped = mod.lessons.map((les) => ({
            ...les,
            module: { title: mod.title }
          }));
          flat = [...flat, ...mapped];
        });
        setLessons(flat);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json() as User[];
        setUsers(usersData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setTitle(lesson.title);
    setVideoUrl(lesson.videoUrl);
    setDescription(lesson.description || '');
    setNotes(lesson.notes || '');
    setOrderIndex(lesson.orderIndex.toString());
    setModuleTitle(lesson.module.title);
    setFormError('');
    setFormSuccess('');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setVideoUrl('');
    setDescription('');
    setNotes('');
    setOrderIndex('1');
    setModuleTitle('');
    setFormError('');
    setFormSuccess('');
    setUploadProgress(0);
    setUploadProgressMB('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    const payload = {
      title,
      videoUrl,
      description,
      notes,
      orderIndex: parseInt(orderIndex) || 1,
      moduleTitle
    };

    try {
      const url = editingId ? `/api/lessons/${editingId}` : '/api/lessons';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Dars saqlashda xatolik');
      } else {
        setFormSuccess(editingId ? 'Dars muvaffaqiyatli yangilandi' : 'Yangi dars muvaffaqiyatli qo\'shildi');
        handleCancelEdit();
        loadDashboardData();
      }
    } catch {
      setFormError('Serverga yuborishda xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ushbu darsni o\'chirib tashlamoqchimisiz?')) return;

    try {
      const res = await fetch(`/api/lessons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLessons((prev) => prev.filter((l) => l.id !== id));
        loadDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Video upload handler
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadProgressMB(`0.00 MB / ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    setFormError('');
    setFormSuccess('');

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('video', file);

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        const loadedMB = (event.loaded / 1024 / 1024).toFixed(2);
        const totalMB = (event.total / 1024 / 1024).toFixed(2);
        setUploadProgress(percent);
        setUploadProgressMB(`${loadedMB} MB / ${totalMB} MB`);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.videoUrl) {
            setVideoUrl(res.videoUrl);
            setFormSuccess(`Video muvaffaqiyatli yuklandi: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
          } else {
            setFormError('Video URL topilmadi.');
          }
        } catch {
          setFormError('Noma\'lum xatolik yuz berdi.');
        }
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          setFormError(res.error || 'Yuklashda xatolik yuz berdi.');
        } catch {
          setFormError('Fayl yuklashda xatolik.');
        }
      }
      setUploading(false);
    });

    xhr.addEventListener('error', () => {
      setFormError('Tarmoq xatoligi yuz berdi.');
      setUploading(false);
    });

    xhr.open('POST', '/api/admin/upload');
    xhr.send(formData);
  };

  // Toggle user paid or banned status
  const handleToggleUserStatus = async (userId: string, updates: { isPaid?: boolean; isBanned?: boolean }) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  isPaid: updates.isPaid !== undefined ? updates.isPaid : u.isPaid,
                  isBanned: updates.isBanned !== undefined ? updates.isBanned : u.isBanned,
                }
              : u
          )
        );

        // Update metrics
        const metricsRes = await fetch('/api/admin/metrics');
        if (metricsRes.ok) {
          const metricsData = await metricsRes.json() as Metrics;
          setMetrics(metricsData);
        }
      } else {
        const data = await res.json();
        alert(data.error || 'Statusni yangilashda xatolik');
      }
    } catch (err) {
      console.error(err);
      alert('Tizim xatoligi yuz berdi');
    }
  };

  const handleClearChatHistory = async () => {
    if (!confirm('Haqiqatan ham barcha chat xabarlarini va yuklangan fayllarni o\'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo\'lmaydi.')) {
      return;
    }

    setClearingChat(true);
    try {
      const res = await fetch('/api/admin/chat/clear', {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Chat tarixi muvaffaqiyatli tozalandi!');
      } else {
        const data = await res.json();
        alert(data.error || 'Chatni tozalashda xatolik yuz berdi');
      }
    } catch {
      alert('Tarmoq xatoligi yuz berdi');
    } finally {
      setClearingChat(false);
    }
  };

  // Filter users by search query
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = u.name ? u.name.toLowerCase().includes(query) : false;
    const emailMatch = u.email ? u.email.toLowerCase().includes(query) : false;
    return nameMatch || emailMatch;
  });

  if (!isAdmin || (loading && lessons.length === 0 && !metrics)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold tracking-wider text-[#94A3B8]">{`Admin panel yuklanmoqda...`}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white select-none bg-[#050505] flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 main-content md:pt-0 pt-16 justify-between">

      <main className="max-w-7xl w-full mx-auto px-6 py-10 flex flex-col gap-10 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{`Admin Boshqaruv Paneli`}</h1>
            <p className="text-xs text-[#94A3B8] mt-1">{`Platforma ko'rsatkichlari, darslar ro'yxati va talabalarni boshqaring`}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearChatHistory}
              disabled={clearingChat}
              className="px-4 py-2.5 rounded-xl bg-red-950/20 border border-red-500/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 font-bold text-xs transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
              title="Chat tarixini tozalash"
            >
              <Trash2 size={14} />
              {clearingChat ? 'Tozalanmoqda...' : 'Chatni Tozalash'}
            </button>
            <button
              onClick={loadDashboardData}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
              title="Yangilash"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl glass border border-white/5 flex items-center gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-[#D4AF37]/5 blur-[20px]" />
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                <DollarSign size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#94A3B8]">{`Jami daromad`}</span>
                <span className="text-2xl font-extrabold text-white mt-1">${metrics.totalRevenue}</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass border border-white/5 flex items-center gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-[#6366F1]/5 blur-[20px]" />
              <div className="w-12 h-12 rounded-xl bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1]">
                <Users size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#94A3B8]">{`Faol o'quvchilar`}</span>
                <span className="text-2xl font-extrabold text-white mt-1">{metrics.activePaidStudents}</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass border border-white/5 flex items-center gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-white/5 blur-[20px]" />
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white">
                <Award size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#94A3B8]">{`O'rtacha o'zlashtirish`}</span>
                <span className="text-2xl font-extrabold text-white mt-1">{metrics.averageProgress}%</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass border border-white/5 flex items-center gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-green-500/5 blur-[20px]" />
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                <TrendingUp size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#94A3B8]">{`Yangi obunalar (7 kun)`}</span>
                <span className="text-2xl font-extrabold text-white mt-1">+{metrics.recentSignups}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex border-b border-white/10 gap-6">
          <button
            onClick={() => setActiveTabSection('lessons')}
            className={`pb-4 text-xs font-bold tracking-wider uppercase border-b-2 transition-all duration-300 ${
              activeTabSection === 'lessons' ? 'border-[#D4AF37] text-white' : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            {`Darslar boshqaruvi`}
          </button>
          <button
            onClick={() => setActiveTabSection('users')}
            className={`pb-4 text-xs font-bold tracking-wider uppercase border-b-2 transition-all duration-300 ${
              activeTabSection === 'users' ? 'border-[#D4AF37] text-white' : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            {`Foydalanuvchilar boshqaruvi`}
          </button>
        </div>

        {activeTabSection === 'lessons' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            <section className="lg:col-span-5 rounded-2xl glass border border-white/5 p-6 flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold">{editingId ? `Darsni Tahrirlash` : `Yangi Dars Qo'shish`}</h3>
                <p className="text-xs text-[#94A3B8] mt-1">{`Dars materiallari va sozlamalarini kiriting`}</p>
              </div>

              {formError && (
                <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-950/25 text-red-400 text-xs font-semibold animate-slideDown">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="p-3.5 rounded-xl border border-green-500/20 bg-green-950/25 text-green-400 text-xs font-semibold animate-slideDown flex items-center gap-1.5">
                  <Check size={14} />
                  {formSuccess}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#94A3B8] tracking-wider">{`Dars sarlavhasi`}</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="AI Prompt Engineering asoslari"
                    className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase text-[#94A3B8] tracking-wider">{`Modul nomi`}</label>
                    <input
                      type="text"
                      required
                      value={moduleTitle}
                      onChange={(e) => setModuleTitle(e.target.value)}
                      placeholder="AI Prompting"
                      className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase text-[#94A3B8] tracking-wider">{`Tartib raqami (Index)`}</label>
                    <input
                      type="number"
                      required
                      value={orderIndex}
                      onChange={(e) => setOrderIndex(e.target.value)}
                      placeholder="1"
                      className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#94A3B8] tracking-wider">{`Video havolasi (YouTube/MP4 URL)`}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... yoki yuklangan fayl"
                      className="flex-1 px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                </div>

                {/* Local Computer Video Upload Widget */}
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col gap-3">
                  <label className="text-[10px] font-bold uppercase text-[#D4AF37] tracking-wider flex items-center gap-1.5">
                    <Film size={12} />
                    {`Kompyuterdan video yuklash`}
                  </label>
                  
                  {typeof window !== 'undefined' && window.location.hostname !== 'localhost' && (
                    <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-950/15 text-amber-400 text-[10px] leading-relaxed font-medium">
                      ⚠️ <strong>{`Vercel Serverless ogohlantirishi:`}</strong> {`Vercel tizimida katta video fayllarni to'g'ridan-to'g'ri yuklash cheklangan (maksimal 4.5 MB va server diskiga yozish yopiq). Videolarni YouTube (Unlisted/Private qilib) yoki Telegram kanalga MP4 qilib yuklab, tepadagi "Video havolasi" maydoniga linkini yozish tavsiya etiladi.`}
                    </div>
                  )}
                  
                  <div className="relative border border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center bg-black/35 hover:border-[#D4AF37]/50 transition-all duration-300">
                    <UploadCloud size={24} className="text-[#94A3B8] mb-2" />
                    <span className="text-[11px] text-[#94A3B8] text-center mb-1">{`Video faylni tanlang (MP4, WebM)`}</span>
                    <input
                      type="file"
                      accept="video/*"
                      ref={fileInputRef}
                      onChange={handleVideoUpload}
                      disabled={uploading}
                      className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-[#050505]/95 rounded-xl flex flex-col items-center justify-center p-4">
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-2">
                          <div
                            className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] h-full rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-white mb-1">{`Yuklanmoqda: ${uploadProgress}%`}</span>
                        <span className="text-[10px] text-[#94A3B8]">{uploadProgressMB}</span>
                      </div>
                    )}
                  </div>
                  {uploadProgress === 100 && !uploading && videoUrl.startsWith('/uploads') && (
                    <span className="text-[10px] text-green-400 font-semibold text-center mt-1 flex items-center justify-center gap-1">
                      <Check size={12} />
                      {`Video tizimga muvaffaqiyatli saqlandi!`}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#94A3B8] tracking-wider">{`Dars qisqa izohi (Description)`}</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ushbu darsda biz..."
                    className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#94A3B8] tracking-wider">{`Prompt & Ssenariy shablonlari`}</label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="1. Prompt: /imagine prompt...&#10;2. Hook: ..."
                    className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-all font-mono"
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-xs hover:opacity-95 transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] duration-300"
                  >
                    <Save size={14} />
                    {editingId ? 'Yangilash' : 'Saqlash'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all hover:scale-105 active:scale-95 duration-300"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="lg:col-span-7 rounded-2xl glass border border-white/5 p-6 flex flex-col gap-4 overflow-hidden">
              <div>
                <h3 className="text-lg font-bold">{`Mavjud Darslar Ro'yxati`}</h3>
                <p className="text-xs text-[#94A3B8] mt-1">{`Platformadagi barcha darslarni ko'rish va boshqarish`}</p>
              </div>

              {lessons.length === 0 ? (
                <div className="py-12 text-center text-[#94A3B8] text-xs">
                  {`Darslar yuklanmagan. Chapdagi forma orqali darslar kiriting.`}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] font-bold uppercase text-[#94A3B8] tracking-wider">
                        <th className="py-3 px-2">Tartib</th>
                        <th className="py-3 px-2">Dars</th>
                        <th className="py-3 px-2">Modul</th>
                        <th className="py-3 px-2 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-[#94A3B8]">
                      {lessons.map((les) => (
                        <tr key={les.id} className="hover:bg-white/[0.01] transition-all duration-300">
                          <td className="py-3.5 px-2 font-mono text-[11px] text-[#D4AF37]">{les.orderIndex}</td>
                          <td className="py-3.5 px-2 font-semibold text-white">
                            <div className="flex flex-col">
                              <span>{les.title}</span>
                              <span className="text-[10px] text-[#94A3B8] font-normal line-clamp-1 mt-0.5">{les.videoUrl}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-2">{les.module.title}</td>
                          <td className="py-3.5 px-2 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(les)}
                                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all hover:scale-105 active:scale-95 duration-300"
                                title="Tahrirlash"
                              >
                                <Edit size={12} />
                              </button>
                              <button
                                onClick={() => handleDelete(les.id)}
                                className="p-2 rounded-lg bg-red-950/20 border border-red-500/20 hover:bg-red-950/40 text-red-400 transition-all hover:scale-105 active:scale-95 duration-300"
                                title="O'chirish"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        ) : (
          /* User management tab */
          <section className="rounded-2xl glass border border-white/5 p-6 flex flex-col gap-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">{`O'quvchilarni boshqarish`}</h3>
                <p className="text-xs text-[#94A3B8] mt-1">{`Ro'yxatdan o'tgan foydalanuvchilarga obuna berish yoki bloklash`}</p>
              </div>

              <div className="relative max-w-sm w-full">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ism yoki email bo'yicha qidirish..."
                  className="w-full pl-10 pr-4 py-2 bg-[#050505] border border-white/10 rounded-xl text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#D4AF37] transition-all"
                />
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-[#94A3B8] text-xs">
                {`Foydalanuvchilar topilmadi yoki yuklanmadi.`}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-bold uppercase text-[#94A3B8] tracking-wider">
                      <th className="py-3 px-3">Foydalanuvchi</th>
                      <th className="py-3 px-3">Email</th>
                      <th className="py-3 px-3">Sana</th>
                      <th className="py-3 px-3">Obuna</th>
                      <th className="py-3 px-3">Holat</th>
                      <th className="py-3 px-3 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-[#94A3B8]">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.01] transition-all duration-300">
                        <td className="py-3.5 px-3 font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs border border-white/10 uppercase">
                              {u.name ? u.name.slice(0, 2) : 'US'}
                            </div>
                            <span>{u.name || 'Ismsiz foydalanuvchi'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">{u.email}</td>
                        <td className="py-3.5 px-3">{new Date(u.createdAt).toLocaleDateString('uz-UZ')}</td>
                        <td className="py-3.5 px-3">
                          {u.isPaid ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold">
                              <ShieldCheck size={10} />
                              {`Faol Obuna`}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#94A3B8] text-[10px] font-bold">
                              {`Obunasiz`}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          {u.isBanned ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold">
                              <Ban size={10} />
                              {`Banned`}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/5 border border-green-500/10 text-green-500/60 text-[10px]">
                              {`Normal`}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            {/* Toggle Subscription */}
                            <button
                              onClick={() => handleToggleUserStatus(u.id, { isPaid: !u.isPaid })}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${
                                u.isPaid
                                  ? 'bg-red-950/15 border-red-500/15 text-red-400 hover:bg-red-950/30'
                                  : 'bg-green-500/10 border-green-500/10 text-green-400 hover:bg-green-500/20'
                              }`}
                            >
                              {u.isPaid ? 'Obunani olish' : 'Obuna berish'}
                            </button>

                            {/* Toggle Ban */}
                            <button
                              onClick={() => handleToggleUserStatus(u.id, { isBanned: !u.isBanned })}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${
                                u.isBanned
                                  ? 'bg-green-500/10 border-green-500/10 text-green-400 hover:bg-green-500/20'
                                  : 'bg-red-950/15 border-red-500/15 text-red-400 hover:bg-red-950/30'
                              }`}
                            >
                              {u.isBanned ? 'Blokdan ochish' : 'Bloklash'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
      </div>
    </div>
  );
}
