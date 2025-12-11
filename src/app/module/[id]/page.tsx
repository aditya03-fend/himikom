// src/app/module/[id]/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, BookOpen, Clock, User } from "lucide-react";

// --- 1. TYPE DEFINITION ---
// Sesuaikan dengan data dari backend
interface Chapter {
  id: string;
  title: string;
  content: string; // HTML string dari React Quill
}

interface ModuleDetail {
  id: string;
  title: string;
  description: string;
  author: string;
  image: string | null;
  chapters: Chapter[];
  createdAt: string;
}

// --- 2. FETCHER FUNCTION (DENGAN ERROR HANDLING) ---
async function getModuleDetail(id: string): Promise<ModuleDetail | null> {
  try {
    // Pastikan URL backend benar (port 4000)
    const res = await fetch(`https://aditya03-fend-himikom-backend.hf.space/api/module/${id}`, {
      cache: "no-store", // Selalu ambil data terbaru
    });

    if (!res.ok) {
      // Jika 404 atau 500, kembalikan null agar masuk ke halaman notFound()
      return null;
    }

    // Cek apakah response ada isinya sebelum parse JSON
    const text = await res.text();
    if (!text) return null;

    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching module:", error);
    return null;
  }
}

// --- 3. PAGE COMPONENT ---
// Perhatikan tipe params: Promise<{ id: string }> (Khusus Next.js 15+)
export default async function ModuleDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  
  // WAJIB: Await params di Next.js 15+
  const { id } = await params; 

  const modul = await getModuleDetail(id);

  // Jika data tidak ditemukan / error
  if (!modul) {
    notFound(); 
  }

  return (
    <main className="bg-black min-h-screen text-white selection:bg-blue-500 selection:text-white">
      <Navbar />

      {/* HEADER SECTION */}
      <div className="relative pt-32 pb-20 px-6 md:px-20 border-b border-white/10 overflow-hidden">
        {/* Background Blur */}
        {modul.image && (
             <div className="absolute inset-0 z-0 opacity-20">
                <Image src={modul.image} alt="bg" fill className="object-cover blur-3xl" />
            </div>
        )}
        
        <div className="max-w-4xl mx-auto relative z-10">
            <Link href="/learning" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft size={16} /> Kembali ke Modul
            </Link>

            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {modul.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 font-mono">
                <div className="flex items-center gap-2">
                    <User size={16} className="text-blue-500" />
                    <span>{modul.author}</span>
                </div>
                <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-500" />
                    <span>{modul.chapters?.length || 0} BAB</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-500" />
                    <span>{new Date(modul.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
      </div>

      {/* CONTENT & CHAPTERS */}
      <div className="max-w-5xl mx-auto px-6 md:px-20 py-16 flex flex-col lg:flex-row gap-12">
        
        {/* SIDEBAR: DAFTAR ISI (Sticky) */}
        <div className="lg:w-1/3 order-2 lg:order-1">
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 sticky top-32">
                <h3 className="font-bold text-lg mb-4 text-blue-400 uppercase tracking-widest text-xs">
                    Daftar Isi
                </h3>
                <div className="space-y-1">
                    {modul.chapters?.map((chapter, index) => (
                        <a 
                            key={chapter.id} 
                            href={`#chapter-${index}`}
                            className="block p-3 rounded-lg hover:bg-white/5 text-sm text-gray-400 hover:text-white transition-colors truncate"
                        >
                            <span className="font-bold mr-2 text-blue-500">{index + 1}.</span> 
                            {chapter.title}
                        </a>
                    ))}
                </div>
            </div>
        </div>

        {/* MAIN: KONTEN BAB */}
        <div className="lg:w-2/3 order-1 lg:order-2 space-y-16">
            
            {/* Deskripsi Modul */}
            <div className="prose prose-invert max-w-none border-b border-white/10 pb-10">
                <p className="text-lg leading-relaxed text-gray-300">{modul.description}</p>
            </div>

            {/* Loop Chapters */}
            {modul.chapters?.map((chapter, index) => (
                <div key={chapter.id} id={`chapter-${index}`} className="scroll-mt-32">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
                            {index + 1}
                        </span>
                        <h2 className="text-2xl font-bold font-heading">{chapter.title}</h2>
                    </div>

                    {/* RENDER HTML DARI QUILL */}
                    <div 
                        className="prose prose-invert prose-blue max-w-none prose-img:rounded-xl prose-headings:font-heading"
                        dangerouslySetInnerHTML={{ __html: chapter.content }}
                    />
                </div>
            ))}

            {(!modul.chapters || modul.chapters.length === 0) && (
                <div className="p-8 bg-zinc-900 border border-white/10 rounded-xl text-center text-gray-500">
                    Belum ada materi di modul ini.
                </div>
            )}

        </div>

      </div>

      <Footer />
    </main>
  );
}