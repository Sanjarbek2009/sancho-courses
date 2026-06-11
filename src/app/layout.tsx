import type { Metadata } from 'next';
import './globals.css';
import dynamic from 'next/dynamic';

// Disable SSR for the 3D graphics background
const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), {
  ssr: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sancho-courses.vercel.app'),
  title: 'SANCHO.AI | Бесплатная AI Академия — Tekin AI Kursi — Free AI Video Academy',
  description: "SANCHO.AI — bepul AI kurslari, sun'iy intellekt darslari, AI video yaratish, ovoz klonlash, avatar generatsiya. Бесплатные курсы ИИ, создание видео с ИИ, клонирование голоса. Free AI courses, AI video generation, voice cloning, prompt engineering, Midjourney, ChatGPT tutorials.",
  keywords: [
    // ===== ENGLISH KEYWORDS =====
    'AI course', 'free AI course', 'AI video course', 'AI academy', 'AI video academy',
    'artificial intelligence course', 'free artificial intelligence', 'AI tutorial', 'AI tutorials free',
    'AI video generation', 'AI video creation', 'AI video editing', 'how to make AI video',
    'AI video maker', 'AI video generator free', 'AI animation course', 'AI film making',
    'voice cloning AI', 'AI voice cloning free', 'voice clone', 'text to speech AI',
    'AI avatar', 'AI avatar creator', 'AI avatar generator free', 'digital avatar AI',
    'AI image generator', 'AI image creation', 'AI art course', 'AI image generator free',
    'prompt engineering', 'prompt engineering course', 'prompt engineering free',
    'how to write prompts', 'ChatGPT prompts', 'AI prompts', 'best AI prompts',
    'ChatGPT tutorial', 'ChatGPT course free', 'ChatGPT for beginners', 'how to use ChatGPT',
    'Midjourney tutorial', 'Midjourney course', 'Midjourney free', 'Midjourney for beginners',
    'Midjourney prompts', 'Midjourney tips', 'Midjourney v6',
    'Runway ML tutorial', 'Runway AI course', 'Runway video generation',
    'Stable Diffusion tutorial', 'Stable Diffusion free course',
    'AI Reels creation', 'AI Shorts tutorial', 'how to make Reels with AI',
    'YouTube Shorts AI', 'TikTok AI video', 'Instagram Reels AI',
    'AI content creation', 'AI content creator course', 'AI social media content',
    'AI monetization', 'make money with AI', 'AI passive income', 'AI side hustle',
    'AI tools 2024', 'AI tools 2025', 'best AI tools free', 'top AI tools',
    'free AI lessons', 'AI online course free', 'learn AI free', 'AI for beginners',
    'sancho ai', 'sanchoyt', 'sancho courses', 'sancho ai academy',
    'AI video content', 'video content AI', 'create video with AI',
    'AI dubbing', 'AI translation video', 'multilingual AI video',
    'deepfake video AI', 'face swap AI', 'AI face generation',
    'Kling AI', 'Pika AI', 'Sora AI', 'HeyGen tutorial', 'D-ID AI avatar',
    'ElevenLabs voice', 'ElevenLabs tutorial', 'ElevenLabs free',
    'ComfyUI tutorial', 'ComfyUI free course', 'ComfyUI workflow',
    'LoRA training', 'fine tuning AI model', 'custom AI model',
    'AI photography', 'AI portrait', 'AI product photography',
    'AI marketing', 'AI advertising', 'AI brand content',
    'AI copywriting', 'AI writing course', 'AI text generation',
    'GPT-4 tutorial', 'GPT-4o course', 'Claude AI tutorial', 'Gemini AI course',
    'video monetization AI', 'YouTube AI channel', 'faceless YouTube channel AI',
    'AI video script', 'AI voiceover', 'AI subtitles', 'AI captions',
    'AI music generation', 'Suno AI', 'Udio AI music',
    'AI stock video', 'AI stock images', 'AI stock music',
    'free AI courses online', 'free artificial intelligence courses', 'ai video academy',
    'free ai video tools', 'create video with ai free', 'ai video script generator',
    'faceless youtube channel template', 'best ai generators for videos', 'ai video maker free',
    'ai video editor', 'text to video ai', 'image to video ai', 'ai voice generator',
    'text to speech voice clone', 'digital human avatar', 'talking head ai',
    'midjourney prompt tutorial', 'chatgpt guide for beginners', 'prompt engineer course',
    'elevenlabs free voice clone', 'kling ai video editor', 'runway gen-2 tutorials',
    'pika labs free tutorial', 'reels monetization ai', 'shorts with ai generator',
    'passive income tools with ai',
    '#AIcourse', '#FreeAI', '#AIvideo', '#ArtificialIntelligence', '#AItools',
    '#PromptEngineering', '#ChatGPT', '#Midjourney', '#AIart', '#AIcontent',
    '#VoiceCloning', '#AIavatar', '#AIanimation', '#FreeAIcourse', '#LearnAI',
    '#AcademyAI', '#AIeducation', '#AIforBeginners', '#AIvideomaker', '#ContentCreation',
    '#ElevenLabs', '#RunwayML', '#KlingAI', '#HeyGen', '#Sora', '#SunoAI', '#Udio', '#LumaDreamMachine',

    // ===== UZBEK KEYWORDS =====
    "sun'iy intellekt", "sun'iy intellekt kursi", "sun'iy intellekt darslari",
    "bepul sun'iy intellekt kursi", 'ai kursi bepul', 'ai kurslar', 'ai darslari',
    'tekin ai kursi', 'tekin ai darslar', "sun'iy intellekt bepul",
    "suniy intellekt", "suniy intellekt kursi", "suniy intellekt darslari",
    "bepul suniy intellekt kursi", "tekin suniy intellekt", "sun'iy intellekt nima", "suniy intellekt nima",
    'ai video yaratish', 'ai video kurs', 'ai bilan video yaratish',
    "sun'iy intellekt video", "suniy intellekt video", 'ai video montaj', 'ai video tahrirlash',
    'ovoz klonlash', 'ovoz klonlash ai', 'ai ovoz yaratish', 'matndan ovoz',
    'avatar yaratish ai', 'ai avatar', 'raqamli avatar', 'ai avatar bepul',
    'rasm yaratish ai', 'ai rasm generatsiya', 'ai rasm bepul', 'ai art',
    'prompt yozish', 'prompt injiniring', 'ai uchun prompt', 'chatgpt prompts',
    "chatgpt o'zbekcha", "chatgpt ozbekcha", 'chatgpt darslari', 'chatgpt bepul kurs',
    "midjourney o'zbekcha", "midjourney ozbekcha", 'midjourney darslari', 'midjourney bepul',
    'reels yaratish ai', 'shorts yaratish ai', 'ai bilan reels', 'ai bilan shorts',
    'tiktok ai video', 'instagram reels ai', 'youtube shorts ai',
    'ai kontent yaratish', 'ai kontent kreator', 'ai ijtimoiy tarmoq',
    'ai bilan pul ishlash', 'ai monetizatsiya', "ai bilan daromad qilish",
    "sun'iy intellekt asboblar", "suniy intellekt asboblar", 'ai vositalar bepul', 'eng yaxshi ai vositalar',
    'sancho ai', 'sanchoyt', 'sancho kurslar', 'sancho ai akademiya',
    'onlayn ai kursi', "bepul onlayn ta'lim", "bepul onlayn talim", 'ai akademiya',
    "sun'iy intellekt ovoz", "suniy intellekt ovoz", "ovoz o'zgartirish ai", "ovoz ozgartirish ai",
    'elevenlabs darslari', 'elevenlabs bepul', 'ai dublyaj',
    'comfyui darslari', 'comfyui bepul',
    "kling ai o'zbekcha", "kling ai ozbekcha", 'runway ai darslari', 'heygen darslari',
    "yuz o'zgartirish ai", "yuz ozgartirish ai", 'deepfake ai', "ai portret rasm",
    'ai musiqa yaratish', 'suno ai', 'ai video skript',
    'yuzcha kanal youtube ai', 'ai youtube kanal',
    'video monetizatsiya ai', 'passiv daromad ai',
    '#SuniyIntellekt', '#SuniyIntellektKursi', '#AIkursi', '#BepulAI', '#AIvideo', '#PromptYozish',
    '#ChatGPTOzbekcha', '#MidjourneyDarslari', '#AIAvatar', '#OvozKlonlash',
    '#TekinAI', '#AIAkademiya', '#SanchoAI', '#Sanchoyt', '#AIBilan',
    '#ReelsYaratish', '#ShortsAI', '#AIDarslari', '#BepulKurs', '#AIUzbek', '#TekinKurs', '#SuniyIntellektTekin',

    // ===== RUSSIAN KEYWORDS =====
    'искусственный интеллект', 'курс искусственного интеллекта', 'уроки ИИ',
    'бесплатный курс ИИ', 'бесплатные уроки ИИ', 'курс по ИИ бесплатно',
    'ИИ академия', 'академия искусственного интеллекта', 'ИИ онлайн курс',
    'создание видео с ИИ', 'ИИ video курс', 'как создать видео с ИИ',
    'ИИ видео генерация', 'ИИ монтаж видео', 'видео с искусственным интеллектом',
    'нейросети для видео', 'генерация видео нейросетью',
    'клонирование голоса ИИ', 'ИИ голос бесплатно', 'генерация голоса ИИ', 'клонирование голоса нейросетью',
    'ИИ аватар', 'создание аватаров ИИ', 'цифровой аватар ИИ', 'ИИ аватар бесплатно', 'говорящий аватар нейросеть',
    'генерация изображений ИИ', 'ИИ рисунок', 'ИИ арт бесплатно', 'нейросеть рисует', 'генератор картинок бесплатно',
    'написание промптов', 'промпт инжиниринг', 'промпты для ИИ', 'промпты ChatGPT', 'как писать промпты',
    'ChatGPT на русском', 'урок ChatGPT', 'бесплатный курс ChatGPT',
    'Midjourney на русском', 'уроки Midjourney', 'Midjourney бесплатно',
    'Midjourney для начинающих', 'промпты Midjourney',
    'создание Reels с ИИ', 'создание Shorts с ИИ', 'ИИ для Reels', 'ИИ для Shorts',
    'TikTok ИИ видео', 'Instagram Reels ИИ', 'YouTube Shorts ИИ',
    'создание контента с ИИ', 'ИИ контент для соцсетей', 'ИИ контент мейкер',
    'заработок с ИИ', 'монетизация ИИ', 'пассивный доход ИИ', 'как заработать на нейросетях',
    'инструменты ИИ бесплатно', 'лучшие ИИ инструменты', 'ИИ инструменты 2024 2025', 'нейросети 2025 бесплатно',
    'sancho ai', 'sanchoyt', 'санчо ИИ', 'санчо академия',
    'Runway ИИ уроки', 'HeyGen урок', 'ElevenLabs бесплатно',
    'ElevenLabs урок', 'клонирование голоса бесплатно',
    'ComfyUI урок', 'Stable Diffusion урок', 'ИИ дипфейк',
    'Kling AI урок', 'Pika AI урок', 'Sora AI урок',
    'ИИ анимация', 'ИИ мультфильм', 'ИИ фильм',
    'ИИ музыка', 'Suno AI урок', 'генерация музыки ИИ',
    'безликий YouTube канал ИИ', 'YouTube канал с ИИ', 'монетизация видео ИИ',
    '#ИскусственныйИнтеллект', '#БесплатныйКурсИИ', '#УрокиИИ', '#АкадемияИИ',
    '#ИИвидео', '#СозданиеВидеоИИ', '#КлонированиеГолоса', '#ИИаватар',
    '#ChatGPTнаРусском', '#MidjourneyРусский', '#ПромптИнжиниринг',
    '#ИИинструменты', '#СозданиеКонтентаИИ', '#БесплатноИИ', '#SanchoAI',
    '#ЗаработокСИИ', '#ИИонлайн', '#ИИдляНачинающих', '#ИИРилс', '#ИИШортс',
    '#Нейросети', '#ИскусственныйИнтеллектКурс', '#БесплатныеНейросети',
  ],
  authors: [{ name: 'SANCHO.AI Academy', url: 'https://sancho-courses.vercel.app' }],
  creator: 'SANCHO.AI',
  publisher: 'SANCHO.AI Academy',
  category: 'Education, Artificial Intelligence, Technology',
  openGraph: {
    title: 'SANCHO.AI | Бесплатная AI Академия — Tekin AI Kursi — Free AI Video Academy',
    description: "Bepul AI kurslari — sun'iy intellekt, video yaratish, ovoz klonlash. Бесплатные курсы ИИ. Free AI video course, voice cloning, avatar, prompt engineering.",
    url: 'https://sancho-courses.vercel.app',
    siteName: 'SANCHO.AI Academy',
    images: [
      {
        url: '/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'SANCHO.AI — Free AI Video Academy',
      },
    ],
    locale: 'uz_UZ',
    alternateLocale: ['ru_RU', 'en_US'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SANCHO.AI | Free AI Video Academy — Tekin AI Kursi',
    description: "Bepul AI kurslari. AI video, ovoz klonlash, avatar. Бесплатные курсы ИИ. Free AI courses.",
    images: ['/logo.jpg'],
    creator: '@sanchoai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
  verification: {
    google: 'oaGGduOELJRqmZXkZPjuXmTiYICZeYZFLPH1KZyNETI',
  },
  alternates: {
    canonical: 'https://sancho-courses.vercel.app',
    languages: {
      'uz': 'https://sancho-courses.vercel.app',
      'ru': 'https://sancho-courses.vercel.app',
      'en': 'https://sancho-courses.vercel.app',
    },
  },
};

import Providers from '@/components/Providers';
import SecurityGate from '@/components/SecurityGate';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://sancho-courses.vercel.app/#organization',
        name: 'SANCHO.AI Academy',
        url: 'https://sancho-courses.vercel.app',
        logo: 'https://sancho-courses.vercel.app/logo.jpg',
        description: "Bepul AI kurslari, sun'iy intellekt darslari. Бесплатные курсы ИИ. Free AI courses.",
        sameAs: [],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://sancho-courses.vercel.app/#website',
        url: 'https://sancho-courses.vercel.app',
        name: 'SANCHO.AI Academy',
        publisher: { '@id': 'https://sancho-courses.vercel.app/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://sancho-courses.vercel.app/?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Course',
        name: "SANCHO.AI — Sun'iy Intellekt Kursi (Bepul)",
        description:
          "Sun'iy intellekt yordamida AI video yaratish, ovoz klonlash, avatar generatsiya, prompt engineering. Бесплатный курс по ИИ. Free AI video course.",
        provider: {
          '@type': 'Organization',
          name: 'SANCHO.AI Academy',
          sameAs: 'https://sancho-courses.vercel.app',
        },
        url: 'https://sancho-courses.vercel.app/course',
        courseLanguage: ['uz', 'ru', 'en'],
        isAccessibleForFree: true,
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          instructor: { '@type': 'Person', name: 'Sancho AI' },
        },
        keywords:
          "AI course, bepul AI kursi, sun'iy intellekt, искусственный интеллект, free AI, AI video, voice cloning, prompt engineering",
        inLanguage: ['uz', 'ru', 'en'],
        educationalLevel: 'beginner',
        teaches: [
          'AI video generation',
          'Voice cloning',
          'Avatar creation',
          'Prompt engineering',
          'Midjourney',
          'ChatGPT',
          'AI content creation',
        ],
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
      },
    ],
  };

  return (
    <html lang="uz">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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

