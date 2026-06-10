'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Sparkles, Home, BookOpen, User as UserIcon, HelpCircle, 
  ShieldAlert, Award, LogOut, LogIn, UserPlus, Menu, X, 
  ChevronLeft, ChevronRight, MessageSquare
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, update } = useSession();
  const user = session?.user;
  
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('sidebar-open');
    if (stored !== null) {
      setIsOpen(stored === 'true');
    } else {
      setIsOpen(true);
    }
  }, []);

  const toggleSidebar = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    localStorage.setItem('sidebar-open', String(nextState));
  };

  useEffect(() => {
    const html = document.documentElement;
    if (isOpen) {
      html.classList.add('sidebar-open');
      html.classList.remove('sidebar-closed');
    } else {
      html.classList.add('sidebar-closed');
      html.classList.remove('sidebar-open');
    }
  }, [isOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.location.search.includes('session_id') || window.location.search.includes('payment'))) {
      update();
    }
  }, [pathname, update]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.refresh();
    router.push('/');
  };

  const isPaid = user?.isPaid || user?.role === 'ADMIN';

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '');
      if (pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', href);
        }
      }
    }
  };

  const sidebarWidth = isOpen ? 'w-72' : 'w-20';

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-40">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6366F1] to-[#D4AF37] flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.3)]">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-widest text-white">
            SANCHO<span className="text-[#D4AF37]">.AI</span>
          </span>
        </Link>
        <button 
          onClick={() => setMobileOpen(true)}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Desktop 3D Sidebar */}
      <aside 
        className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 h-screen bg-[#070708]/95 border-r border-white/5 z-40 transition-all duration-500 ease-out backdrop-blur-xl ${sidebarWidth} 
        [transform-style:preserve-3d] [perspective:1000px]
        ${!isOpen ? '[transform:rotateY(-15deg)_translateZ(-20px)] hover:[transform:rotateY(0deg)_translateZ(0px)]' : ''}`}
        style={{
          boxShadow: isOpen ? '10px 0 30px rgba(0,0,0,0.5)' : '5px 0 15px rgba(0,0,0,0.3)',
          transformOrigin: 'left center'
        }}
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-6 -right-3.5 w-7 h-7 rounded-full bg-[#121214] border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white hover:border-[#D4AF37]/50 transition-all shadow-md z-50"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 overflow-hidden flex-shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#D4AF37] flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-all duration-300 flex-shrink-0">
              <Sparkles size={18} className="text-white animate-pulse" />
            </div>
            {isOpen && (
              <span className="text-lg font-bold tracking-widest bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent group-hover:text-[#D4AF37] transition-all whitespace-nowrap">
                SANCHO<span className="text-[#D4AF37]">.AI</span>
              </span>
            )}
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex-1 py-8 px-4 flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden">
          <SidebarLink href="/#home" icon={<Home size={20} />} label="Asosiy" active={pathname === '/' && !pathname.includes('#')} compact={!isOpen} onClick={(e) => handleLinkClick(e, '/#home')} />
          <SidebarLink href="/#syllabus" icon={<BookOpen size={20} />} label="Kurs Dasturi" active={pathname.includes('#syllabus')} compact={!isOpen} onClick={(e) => handleLinkClick(e, '/#syllabus')} />
          <SidebarLink href="/#about-me" icon={<UserIcon size={20} />} label="Men Haqimda" active={pathname.includes('#about-me')} compact={!isOpen} onClick={(e) => handleLinkClick(e, '/#about-me')} />
          <SidebarLink href="/#faq" icon={<HelpCircle size={20} />} label="FAQ" active={pathname.includes('#faq')} compact={!isOpen} onClick={(e) => handleLinkClick(e, '/#faq')} />
          
          <hr className="border-white/5 my-4" />

          {/* User Auth controls */}
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <SidebarLink 
                  href="/admin/dashboard" 
                  icon={<ShieldAlert size={20} className="text-red-400" />} 
                  label="Admin Panel" 
                  active={pathname.startsWith('/admin')} 
                  compact={!isOpen}
                  className="bg-red-950/20 border border-red-500/10 hover:bg-red-950/40 text-red-400 hover:text-red-300"
                />
              )}
              
              <SidebarLink 
                href={isPaid ? "/course" : "/buy"} 
                icon={<Award size={20} className="text-black" />} 
                label={isPaid ? "Darslar (Dashboard)" : "Kursni Sotib Olish"} 
                active={(pathname.startsWith('/course') && pathname !== '/course/chat') || pathname === '/buy'} 
                compact={!isOpen}
                className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:opacity-90"
              />
              {isPaid && (
                <SidebarLink 
                  href="/course/chat" 
                  icon={<MessageSquare size={20} className="text-[#D4AF37]" />} 
                  label="Guruh Chati" 
                  active={pathname === '/course/chat'} 
                  compact={!isOpen}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                />
              )}

              <div className="relative animate-fadeIn" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 select-none cursor-pointer group
                  ${!isOpen ? 'justify-center' : ''}
                  ${isProfileOpen ? 'bg-white/10 text-white border-l-2 border-[#D4AF37] font-semibold' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}
                >
                  <div className="flex-shrink-0 transition-transform group-hover:scale-110 duration-300">
                    <UserIcon size={20} />
                  </div>
                  {isOpen && (
                    <span className="text-sm font-medium transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
                      Profil
                    </span>
                  )}
                </button>

                {/* Floating Profile Card */}
                {isProfileOpen && (
                  <div 
                    className="fixed z-50 p-6 rounded-2xl glass-premium border border-[#D4AF37]/35 shadow-2xl flex flex-col gap-4 w-72 animate-fadeIn"
                    style={{
                      left: isOpen ? '18.5rem' : '5.5rem',
                      bottom: '5rem',
                      boxShadow: '0 10px 40px rgba(212,175,55,0.2)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#D4AF37] flex items-center justify-center text-white text-sm font-bold border border-white/10 shrink-0">
                        {user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-white truncate">{user.name || 'Ismsiz'}</span>
                        <span className="text-[10px] text-[#94A3B8] truncate">{user.email}</span>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3 flex flex-col gap-2.5 text-xs text-[#94A3B8]">
                      <div className="flex items-center justify-between">
                        <span>Obuna holati:</span>
                        {isPaid ? (
                          <span className="text-[10px] font-bold text-[#FFD700] uppercase bg-[#D4AF37]/10 px-2.5 py-0.5 rounded border border-[#D4AF37]/35 tracking-wide">Premium</span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#94A3B8] uppercase bg-white/5 px-2.5 py-0.5 rounded border border-white/10 tracking-wide">Bepul</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Hisob roli:</span>
                        <span className="text-[10px] uppercase font-semibold text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">{user.role === 'ADMIN' ? 'Admin' : 'Foydalanuvchi'}</span>
                      </div>
                    </div>

                    {!isPaid && (
                      <Link
                        href="/buy"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-[10px] uppercase text-center hover:opacity-90 transition-all shadow-md tracking-wider"
                      >
                        Premium sotib olish
                      </Link>
                    )}

                    <div className="border-t border-white/5 pt-2 flex flex-col gap-1">
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full text-left py-2 px-3 rounded-lg hover:bg-white/5 text-red-400 text-xs font-semibold flex items-center gap-2"
                        >
                          <ShieldAlert size={14} /> Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left py-2 px-3 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-2 transition-all"
                      >
                        <LogOut size={14} /> Tizimdan Chiqish
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <SidebarLink href="/login" icon={<LogIn size={20} />} label="Kirish" active={pathname === '/login'} compact={!isOpen} />
              <SidebarLink 
                href="/register" 
                icon={<UserPlus size={20} className="text-black" />} 
                label="Kursni Boshlash" 
                active={pathname === '/register'} 
                compact={!isOpen}
                className="bg-white text-black font-bold hover:bg-white/90"
              />
            </>
          )}
        </div>

        {/* Footer Info / Logout */}
        <div className="p-4 border-t border-white/5 flex-shrink-0">
          {user ? (
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[#94A3B8] hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 ${!isOpen ? 'justify-center' : ''}`}
              title="Tizimdan chiqish"
            >
              <LogOut size={20} />
              {isOpen && <span className="text-sm font-semibold">Tizimdan Chiqish</span>}
            </button>
          ) : (
            isOpen && (
              <div className="text-center text-[10px] text-[#94A3B8]/60">
                &copy; 2026 SANCHO.AI
              </div>
            )
          )}
        </div>
      </aside>

      {/* Mobile Sidebar overlay & Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileOpen(false)}
          />

          <div 
            className="relative w-80 max-w-[85vw] h-full bg-[#070708]/98 border-r border-white/5 flex flex-col p-6 shadow-2xl transition-all duration-300 z-10 
            [transform-style:preserve-3d] [perspective:1000px] animate-fadeIn"
          >
            <div className="flex items-center justify-between pb-6 border-b border-white/5 flex-shrink-0">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6366F1] to-[#D4AF37] flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
                <span className="text-sm font-bold tracking-widest text-white">
                  SANCHO<span className="text-[#D4AF37]">.AI</span>
                </span>
              </Link>
              <button 
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 py-6 flex flex-col gap-1.5 overflow-y-auto">
              <SidebarLink href="/#home" icon={<Home size={18} />} label="Asosiy" active={pathname === '/'} onClick={(e) => { setMobileOpen(false); handleLinkClick(e, '/#home'); }} />
              <SidebarLink href="/#syllabus" icon={<BookOpen size={18} />} label="Kurs Dasturi" active={pathname.includes('#syllabus')} onClick={(e) => { setMobileOpen(false); handleLinkClick(e, '/#syllabus'); }} />
              <SidebarLink href="/#about-me" icon={<UserIcon size={18} />} label="Men Haqimda" active={pathname.includes('#about-me')} onClick={(e) => { setMobileOpen(false); handleLinkClick(e, '/#about-me'); }} />
              <SidebarLink href="/#faq" icon={<HelpCircle size={18} />} label="FAQ" active={pathname.includes('#faq')} onClick={(e) => { setMobileOpen(false); handleLinkClick(e, '/#faq'); }} />
              
              <hr className="border-white/5 my-4" />

              {user ? (
                <>
                  {user.role === 'ADMIN' && (
                    <SidebarLink 
                      href="/admin/dashboard" 
                      icon={<ShieldAlert size={18} className="text-red-400" />} 
                      label="Admin Panel" 
                      active={pathname.startsWith('/admin')}
                      onClick={() => setMobileOpen(false)}
                      className="bg-red-950/20 border border-red-500/10 text-red-400"
                    />
                  )}
                  <SidebarLink 
                    href={isPaid ? "/course" : "/buy"} 
                    icon={<Award size={18} className="text-black" />} 
                    label={isPaid ? "Dashboard" : "Kursni Sotib Olish"} 
                    active={(pathname.startsWith('/course') && pathname !== '/course/chat') || pathname === '/buy'}
                    onClick={() => setMobileOpen(false)}
                    className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold"
                  />
                  {isPaid && (
                    <SidebarLink 
                      href="/course/chat" 
                      icon={<MessageSquare size={18} className="text-[#D4AF37]" />} 
                      label="Guruh Chati" 
                      active={pathname === '/course/chat'}
                      onClick={() => setMobileOpen(false)}
                      className="bg-white/5 border border-white/10 text-white"
                    />
                  )}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300
                      ${isProfileOpen ? 'bg-white/10 text-white font-semibold' : 'text-[#94A3B8] hover:text-white hover:bg-white/5'}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <UserIcon size={18} />
                        <span className="text-sm font-medium">Profil</span>
                      </div>
                      <ChevronRight size={14} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-90 text-[#D4AF37]' : ''}`} />
                    </button>

                    {isProfileOpen && (
                      <div className="ml-6 pl-4 border-l border-white/5 flex flex-col gap-3 py-2 text-xs text-[#94A3B8] animate-fadeIn">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-white text-xs">{user.name || 'Ismsiz'}</span>
                          <span className="text-[10px]">{user.email}</span>
                        </div>
                        
                        <div className="flex items-center justify-between pr-4 mt-1">
                          <span>Obuna:</span>
                          {isPaid ? (
                            <span className="text-[9px] font-bold text-[#FFD700] uppercase bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">Premium</span>
                          ) : (
                            <span className="text-[9px] font-bold text-[#94A3B8] uppercase bg-white/5 px-2 py-0.5 rounded border border-white/10">Bepul</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pr-4">
                          <span>Rol:</span>
                          <span className="text-[9px] uppercase font-semibold text-white">{user.role === 'ADMIN' ? 'Admin' : 'Foydalanuvchi'}</span>
                        </div>

                        {!isPaid && (
                          <Link
                            href="/buy"
                            onClick={() => { setMobileOpen(false); setIsProfileOpen(false); }}
                            className="mr-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-extrabold text-[9px] text-center uppercase tracking-wider mt-1"
                          >
                            Premium sotib olish
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <SidebarLink href="/login" icon={<LogIn size={18} />} label="Kirish" active={pathname === '/login'} onClick={() => setMobileOpen(false)} />
                  <SidebarLink 
                    href="/register" 
                    icon={<UserPlus size={18} className="text-black" />} 
                    label="Kursni Boshlash" 
                    active={pathname === '/register'}
                    onClick={() => setMobileOpen(false)}
                    className="bg-white text-black font-bold"
                  />
                </>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 flex-shrink-0">
              {user ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 bg-red-950/20 text-red-400 text-sm font-semibold"
                >
                  <LogOut size={16} />
                  Tizimdan Chiqish
                </button>
              ) : (
                <div className="text-center text-[10px] text-[#94A3B8]/60">
                  &copy; 2026 SANCHO.AI
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// SidebarLink Component
interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  compact?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

function SidebarLink({ href, icon, label, active, compact = false, onClick, className = '' }: SidebarLinkProps) {
  const isCustomClass = className.length > 0;
  
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 select-none cursor-pointer group
      ${compact ? 'justify-center' : ''}
      ${isCustomClass ? className : 
        active 
          ? 'bg-white/10 text-white border-l-2 border-[#D4AF37] font-semibold' 
          : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
      }`}
    >
      <div className="flex-shrink-0 transition-transform group-hover:scale-110 duration-300">
        {icon}
      </div>
      {!compact && (
        <span className="text-sm font-medium transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
          {label}
        </span>
      )}
    </Link>
  );
}
