import type { Metadata } from 'next';
import './globals.css';
import dynamic from 'next/dynamic';

// Disable SSR for the 3D graphics background
const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'SANCHO.AI | High-End AI Video Academy',
  description: "Sun'iy Intellekt yordamida dunyo darajasidagi qisqa (Shorts/Reels) va uzun videolar yaratishni, monetizatsiya qilishni o'rganing.",
  keywords: ['AI Video', 'Shorts', 'Reels', 'TikTok', 'Sancho.ai', 'Suniy intellekt', 'Video montaj'],
  icons: {
    icon: '/logo.jpg',
  },
};

import Providers from '@/components/Providers';
import SecurityGate from '@/components/SecurityGate';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body className="antialiased bg-[#050505] selection:bg-[#D4AF37]/30 selection:text-white relative min-h-screen overflow-x-hidden">
        <ThreeBackground />
        <Providers>
          <SecurityGate />
          <div className="relative z-10 w-full min-h-screen flex flex-col justify-between">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
