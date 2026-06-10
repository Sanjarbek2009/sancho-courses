'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import { 
  Send, Image as ImageIcon, Video as VideoIcon, Mic, Square, Trash2, 
  Sparkles, User as UserIcon, X, CornerUpLeft
} from 'lucide-react';

interface ChatUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isPaid: boolean;
}

interface Message {
  id: string;
  userId: string;
  user: ChatUser;
  content: string | null;
  type: string; // 'text' | 'image' | 'video' | 'audio'
  fileUrl: string | null;
  createdAt: string;
  replyToId?: string | null;
  replyTo?: Message | null;
}

export default function ChatPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Media upload & recording states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadedSizeMB, setLoadedSizeMB] = useState('0.00');
  const [totalSizeMB, setTotalSizeMB] = useState('0.00');
  
  // Selected file preview states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<'image' | 'video' | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  // Reply states
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);

  // Lightbox states
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxType, setLightboxType] = useState<'image' | 'video' | null>(null);

  // Voice recording states
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordDuration, setRecordDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // 1. Auth check
  useEffect(() => {
    if (status === 'loading') return;

    if (!session || !user) {
      router.replace('/login?redirect=/course/chat');
      return;
    }

    const isPremium = user.isPaid || user.role === 'ADMIN';
    if (!isPremium) {
      router.replace('/buy');
      return;
    }

    // Load initial 50 messages
    fetchMessages();
  }, [session, status, router, user]);

  // 2. EventSource setup for real-time messages
  useEffect(() => {
    if (status === 'loading' || !session || !(user?.isPaid || user?.role === 'ADMIN')) return;

    const eventSource = new EventSource('/api/chat/stream');

    eventSource.onmessage = (event) => {
      try {
        const newMessage = JSON.parse(event.data);
        // Avoid duplicate messages
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      } catch (err) {
        console.error('Error parsing real-time message:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource connection failed, retrying...', err);
    };

    return () => {
      eventSource.close();
    };
  }, [session, status, user?.isPaid, user?.role]);

  // 3. Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch initial messages
  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/chat');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear selected file helper
  const clearSelectedFile = () => {
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    setSelectedFile(null);
    setSelectedFileType(null);
    setFilePreviewUrl(null);
    setUploadProgress(0);
    setLoadedSizeMB('0.00');
    setTotalSizeMB('0.00');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  // 4. File selection handler (only sets preview, doesn't upload)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }

    setSelectedFile(file);
    setSelectedFileType(fileType);
    setFilePreviewUrl(URL.createObjectURL(file));
  };

  // Custom XHR Upload helper to track progress
  const uploadFileXHR = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          const loadedMB = (event.loaded / (1024 * 1024)).toFixed(2);
          const totalMB = (event.total / (1024 * 1024)).toFixed(2);
          setUploadProgress(percent);
          setLoadedSizeMB(loadedMB);
          setTotalSizeMB(totalMB);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);
            resolve(res.fileUrl);
          } catch {
            reject(new Error('Format error'));
          }
        } else {
          reject(new Error(`Upload status error: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Network error')));
      xhr.addEventListener('abort', () => reject(new Error('Aborted')));

      xhr.open('POST', '/api/chat/upload');
      xhr.send(formData);
    });
  };

  // 5. Send Message Handler (Sends text and media together if file exists)
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (uploading) return;
    if (!inputText.trim() && !selectedFile) return;

    setUploading(true);
    let uploadedFileUrl: string | null = null;
    const typeToSend = selectedFileType || 'text';
    const textToSend = inputText;

    try {
      // Step 1: Upload file if exists
      if (selectedFile) {
        setUploadProgress(0);
        uploadedFileUrl = await uploadFileXHR(selectedFile);
      }

      // Step 2: Send message payload
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: textToSend.trim() || null,
          type: typeToSend,
          fileUrl: uploadedFileUrl,
          replyToId: replyingToMessage?.id || null
        }),
      });

      if (res.ok) {
        setInputText('');
        clearSelectedFile();
        setReplyingToMessage(null);
      } else {
        throw new Error('Message sending failed');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Xabar yuborishda xatolik yuz berdi!');
    } finally {
      setUploading(false);
    }
  };

  // 6. Voice Recording Handlers (Sends directly for now as per voice flow)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        if (audioBlob.size < 1000) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', audioBlob, 'voice_message.wav');

        try {
          const uploadRes = await fetch('/api/chat/upload', {
            method: 'POST',
            body: formData,
          });

          if (!uploadRes.ok) throw new Error('Voice upload failed');
          const uploadData = await uploadRes.json();

          await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'audio',
              fileUrl: uploadData.fileUrl,
              content: null,
              replyToId: replyingToMessage?.id || null
            }),
          });
          setReplyingToMessage(null);
        } catch (err) {
          console.error('Audio send failed:', err);
        } finally {
          setUploading(false);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
      setRecordDuration(0);

      timerRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Mikrofonga ruxsat berilmadi!');
    }
  };

  const stopRecording = (shouldSend = true) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      if (shouldSend) {
        mediaRecorder.stop();
      } else {
        mediaRecorder.onstop = () => {
          mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        };
        mediaRecorder.stop();
      }
    }
    setRecording(false);
    setMediaRecorder(null);
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold tracking-wider text-[#94A3B8]">Guruh chati yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen text-white select-none bg-transparent flex flex-col md:flex-row">
      <Sidebar />
      
      {/* Glow animations style */}
      <style>{`
        @keyframes messageGlow {
          0% {
            background-color: rgba(212, 175, 55, 0.25);
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
          }
          100% {
            background-color: transparent;
            box-shadow: none;
          }
        }
        .highlight-message {
          animation: messageGlow 2.5s ease-out;
        }
      `}</style>
      
      <div className="flex-1 flex flex-col min-w-0 main-content md:pt-0 pt-16 justify-between h-screen h-[100dvh] max-h-screen max-h-[100dvh] overflow-hidden">
        <main className="max-w-6xl w-full mx-auto px-4 md:px-6 py-6 flex flex-col flex-1 h-full max-h-full min-h-0">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-white/5 flex-shrink-0">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center gap-2">
                <Sparkles size={20} className="text-[#D4AF37]" /> Guruh Chati
              </h1>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Premium o&apos;quvchilar va adminlar uchun yopiq onlayn muloqot xonasi
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37]">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Onlayn</span>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-4 min-h-0 pr-1 md:pr-2 scrollbar-premium">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-[#94A3B8]">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <UserIcon size={20} />
                </div>
                <p className="text-sm">Hozircha xabarlar yo&apos;q. Birinchi bo&apos;lib yozing!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.userId === user.id;
                const isAdmin = msg.user.role === 'ADMIN';
                
                return (
                  <div 
                    key={msg.id}
                    id={`msg-${msg.id}`}
                    className={`flex flex-col max-w-[85%] sm:max-w-[70%] gap-1.5 animate-fadeIn group ${
                      isMe ? 'self-end items-end' : 'self-start items-start'
                    }`}
                  >
                    {/* Sender Header */}
                    <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8] px-1">
                      <span className="font-bold text-white/80">
                        {msg.user.name || msg.user.email.split('@')[0]}
                      </span>
                      {isAdmin && (
                        <span className="text-[8px] font-extrabold uppercase bg-red-500/10 border border-red-500/25 px-1.5 py-0.5 rounded text-red-400">
                          Admin
                        </span>
                      )}
                      {!isAdmin && msg.user.isPaid && (
                        <span className="text-[8px] font-extrabold uppercase bg-[#D4AF37]/10 border border-[#D4AF37]/25 px-1.5 py-0.5 rounded text-[#D4AF37]">
                          VIP
                        </span>
                      )}
                      <span>•</span>
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* Message Bubble + Action Row */}
                    <div className={`flex items-center gap-2 max-w-full ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Bubble */}
                      <div 
                        className={`p-3.5 rounded-2xl border text-sm relative overflow-hidden shadow-md transition-all duration-300 highlight-message-bubble ${
                          isMe 
                            ? 'bg-[#D4AF37]/10 border-[#D4AF37]/25 text-white rounded-tr-none' 
                            : 'bg-white/[0.03] border-white/5 text-white rounded-tl-none'
                        }`}
                      >
                        {/* Reply block inside bubble */}
                        {msg.replyTo && (
                          <div 
                            onClick={() => {
                              const parentEl = document.getElementById(`msg-${msg.replyTo?.id}`);
                              if (parentEl) {
                                parentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                const bubble = parentEl.querySelector('.highlight-message-bubble');
                                if (bubble) {
                                  bubble.classList.add('highlight-message');
                                  setTimeout(() => {
                                    bubble.classList.remove('highlight-message');
                                  }, 2500);
                                }
                              }
                            }}
                            className="mb-2 p-2.5 rounded-xl bg-white/5 border-l-2 border-[#D4AF37] text-xs text-[#94A3B8] cursor-pointer hover:bg-white/10 transition-all text-left max-w-full"
                          >
                            <div className="font-extrabold text-[#D4AF37] text-[10px] truncate mb-0.5">
                              {msg.replyTo.user.name || msg.replyTo.user.email.split('@')[0]}
                            </div>
                            <div className="truncate text-white/60 text-[11px]">
                              {msg.replyTo.type === 'text' && msg.replyTo.content}
                              {msg.replyTo.type === 'image' && '📷 Rasm'}
                              {msg.replyTo.type === 'video' && '🎥 Video'}
                              {msg.replyTo.type === 'audio' && '🎤 Ovozli xabar'}
                            </div>
                          </div>
                        )}

                        {/* Text Content */}
                        {msg.content && msg.type !== 'audio' && (
                          <p className="whitespace-pre-wrap leading-relaxed select-text mb-2 last:mb-0">{msg.content}</p>
                        )}

                        {/* Image Message */}
                        {msg.type === 'image' && msg.fileUrl && (
                          <div className="rounded-xl overflow-hidden max-w-full max-h-72 border border-white/5 cursor-pointer">
                            <img 
                              src={msg.fileUrl} 
                              alt="Chat image" 
                              className="w-full h-full object-contain hover:scale-[1.01] transition-transform"
                              onClick={() => {
                                setLightboxUrl(msg.fileUrl);
                                setLightboxType('image');
                              }}
                            />
                          </div>
                        )}

                        {/* Video Message */}
                        {msg.type === 'video' && msg.fileUrl && (
                          <div 
                            className="rounded-xl overflow-hidden max-w-full max-h-80 border border-white/5 cursor-pointer relative group/video"
                            onClick={() => {
                              setLightboxUrl(msg.fileUrl);
                              setLightboxType('video');
                            }}
                          >
                            <video 
                              src={msg.fileUrl} 
                              className="max-h-72 w-auto object-contain"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity">
                              <span className="text-[10px] bg-black/60 px-2.5 py-1.5 rounded-full border border-white/20 font-bold uppercase tracking-wider text-white">
                                Ko&apos;rish
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Audio Message */}
                        {msg.type === 'audio' && msg.fileUrl && (
                          <div className="flex flex-col gap-2">
                            {msg.content && (
                              <p className="whitespace-pre-wrap leading-relaxed select-text">{msg.content}</p>
                            )}
                            <div className="flex items-center gap-3 py-1">
                              <Mic size={18} className="text-[#D4AF37]" />
                              <audio 
                                src={msg.fileUrl} 
                                controls 
                                className="max-w-[200px] sm:max-w-[240px] h-8 accent-[#D4AF37]"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Reply Button next to Bubble */}
                      <button
                        type="button"
                        onClick={() => setReplyingToMessage(msg)}
                        title="Javob berish"
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-[#D4AF37]/30 hover:bg-white/10 flex items-center justify-center text-[#94A3B8] hover:text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all duration-200 active:scale-95 flex-shrink-0"
                      >
                        <CornerUpLeft size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Hidden inputs for uploads */}
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={(e) => handleFileChange(e, 'image')} 
          />
          <input 
            type="file" 
            accept="video/*" 
            ref={videoInputRef} 
            className="hidden" 
            onChange={(e) => handleFileChange(e, 'video')} 
          />

          {/* Chat Input Bar */}
          <div className="border-t border-white/5 pt-4 pb-2 flex-shrink-0 relative z-20">
            {/* 1. Reply Quote Banner */}
            {replyingToMessage && (
              <div className="mb-3 p-3 bg-[#D4AF37]/5 border-l-2 border-[#D4AF37] rounded-r-xl flex items-center justify-between gap-3 animate-fadeIn">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#D4AF37] font-bold">
                    <CornerUpLeft size={10} />
                    <span>{replyingToMessage.user.name || replyingToMessage.user.email.split('@')[0]} ga javob</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] truncate mt-0.5">
                    {replyingToMessage.type === 'text' && replyingToMessage.content}
                    {replyingToMessage.type === 'image' && '📷 Rasm'}
                    {replyingToMessage.type === 'video' && '🎥 Video'}
                    {replyingToMessage.type === 'audio' && '🎤 Ovozli xabar'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReplyingToMessage(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-all flex-shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* 2. Selected File Preview */}
            {selectedFile && (
              <div className="mb-3 p-3 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-3 min-w-0">
                  {selectedFileType === 'image' && filePreviewUrl && (
                    <img 
                      src={filePreviewUrl} 
                      className="w-12 h-12 rounded-lg object-cover border border-white/10" 
                      alt="Preview" 
                    />
                  )}
                  {selectedFileType === 'video' && filePreviewUrl && (
                    <video 
                      src={filePreviewUrl} 
                      className="w-12 h-12 rounded-lg object-cover border border-white/10" 
                      muted 
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate text-white">{selectedFile.name}</p>
                    <p className="text-[10px] text-[#94A3B8]">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearSelectedFile}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* 3. Upload Progress Indicator */}
            {uploading && selectedFile && (
              <div className="mb-3 p-3 bg-white/[0.03] border border-[#D4AF37]/20 rounded-xl flex flex-col gap-2 animate-fadeIn">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#D4AF37] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                    Yuklanmoqda...
                  </span>
                  <span className="text-[#94A3B8]">{uploadProgress}% ({loadedSizeMB} MB / {totalSizeMB} MB)</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {recording ? (
              // Voice Recording Interface
              <div className="flex items-center justify-between p-4 bg-red-950/20 border border-red-500/20 rounded-2xl animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-bold text-red-400">Ovoz yozilmoqda: {formatDuration(recordDuration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => stopRecording(false)} 
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Trash2 size={14} /> Bekor qilish
                  </button>
                  <button 
                    onClick={() => stopRecording(true)}
                    className="p-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Square size={12} fill="white" /> To&apos;xtatish & yuborish
                  </button>
                </div>
              </div>
            ) : (
              // Normal Input Form
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {/* Media buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    title="Rasm tanlash"
                    className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#D4AF37]/35 flex items-center justify-center text-[#94A3B8] hover:text-white transition-all active:scale-95 disabled:opacity-40"
                  >
                    <ImageIcon size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    disabled={uploading}
                    title="Video tanlash"
                    className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#D4AF37]/35 flex items-center justify-center text-[#94A3B8] hover:text-white transition-all active:scale-95 disabled:opacity-40"
                  >
                    <VideoIcon size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={uploading || !!selectedFile}
                    title="Ovozli xabar yozish"
                    className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#D4AF37]/35 flex items-center justify-center text-[#94A3B8] hover:text-white transition-all active:scale-95 disabled:opacity-40"
                  >
                    <Mic size={18} />
                  </button>
                </div>

                {/* Text input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    required={!selectedFile}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={uploading}
                    placeholder={uploading ? "Fayl yuklanmoqda, kuting..." : "Xabar yozing..."}
                    className="w-full h-11 pl-4 pr-12 bg-white/5 border border-white/10 focus:border-[#D4AF37]/35 rounded-xl text-sm text-white focus:outline-none transition-all placeholder-white/25"
                  />
                  <button
                    type="submit"
                    disabled={(!inputText.trim() && !selectedFile) || uploading}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:opacity-90 flex items-center justify-center text-black disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>

      {/* Lightbox / Popup Overlay */}
      {lightboxUrl && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10 animate-fadeIn"
          onClick={() => {
            setLightboxUrl(null);
            setLightboxType(null);
          }}
        >
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-50"
            onClick={() => {
              setLightboxUrl(null);
              setLightboxType(null);
            }}
          >
            <X size={24} />
          </button>
          
          {/* Content Wrapper */}
          <div 
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxType === 'image' && (
              <img 
                src={lightboxUrl} 
                alt="Lightbox view" 
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/10" 
              />
            )}
            {lightboxType === 'video' && (
              <video 
                src={lightboxUrl} 
                controls 
                autoPlay 
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/10" 
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
