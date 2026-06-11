'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function SecurityGate() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Localhost yoki Admin bo'lsa xavfsizlik cheklovlarini qo'llamaymiz
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost || isAdmin) {
      return;
    }

    // 1. Sichqonchaning o'ng tugmasini (Kontekst menyu) o'chirish
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. DevTools klaviatura kombinatsiyalarini o'chirish (F12, Ctrl+Shift+I/J/C, Ctrl+U)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // 3. Konsol orqali ma'lumotlarni chop etishni taqiqlash
    if (window.console) {
      window.console.log = () => {};
      window.console.error = () => {};
      window.console.warn = () => {};
      window.console.info = () => {};
      window.console.debug = () => {};
    }

    // Agressiv buzib kirish choralarini ishga tushirish
    const triggerSecurityBlock = () => {
      try {
        // Sahifani butunlay yo'q qilish
        if (document && document.body) {
          document.body.innerHTML = `
            <div style="background-color: #050505; color: #D4AF37; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; width: 100vw; position: fixed; top: 0; left: 0; z-index: 9999999; text-align: center; padding: 20px;">
              <h1 style="font-size: 24px; margin-bottom: 16px;">XAVFSIZLIK TIZIMI FAOLLASHDI</h1>
              <p style="font-size: 14px; color: #94A3B8;">Tizimda shubhali faoliyat (DevTools) aniqlandi. Sahifa xavfsizlik sababli bloklandi.</p>
            </div>
          `;
        }
      } catch {}
      
      // about:blank ga yo'naltirish
      window.location.replace('about:blank');

      // Tabni muzlatish va cheksiz debugger ishga tushirish
      while (true) {
        // eslint-disable-next-line no-debugger
        debugger;
      }
    };

    // 4. Detektorlar majmuasi
    const runDetectors = () => {
      // Usul A: Oyna o'lchamlarini solishtirish (Desktop brauzerlar uchun)
      const isDesktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isDesktop && window.outerWidth && window.outerHeight) {
        const threshold = 160;
        const widthDev = window.outerWidth - window.innerWidth > threshold;
        const heightDev = window.outerHeight - window.innerHeight > threshold;
        if (widthDev || heightDev) {
          triggerSecurityBlock();
          return;
        }
      }

      // Usul B: Timing check (Debugger bilan tekshirish)
      const t0 = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const t1 = performance.now();
      if (t1 - t0 > 100) {
        triggerSecurityBlock();
        return;
      }

      // Usul C: Console format getter trap
      let devtoolsOpen = false;
      const element = new Image();
      Object.defineProperty(element, 'id', {
        get: () => {
          devtoolsOpen = true;
          return 'trap';
        }
      });
      // eslint-disable-next-line no-console
      console.dir(element);
      if (devtoolsOpen) {
        triggerSecurityBlock();
        return;
      }
    };

    // Har 500 millisekundda devtools detektorlarini ishga tushirish
    const interval = setInterval(runDetectors, 500);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [isAdmin]);

  return null;
}
