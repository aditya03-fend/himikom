import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Article } from "@/types";
import { notFound } from "next/navigation";

// Fetch Data Spesifik berdasarkan ID
async function getArticleDetail(id: string): Promise<Article | null> {
  try {
    const res = await fetch(`https://aditya03-fend-himikom-backend.hf.space/api/article/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

// Props 'params' otomatis dikirim oleh Next.js untuk Dynamic Route
export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = await getArticleDetail(params.id);

  // Jika artikel tidak ditemukan, tampilkan halaman 404 bawaan Next.js
  if (!article) {
    notFound();
  }

  return (
    <main className="bg-black min-h-screen text-white selection:bg-white selection:text-black">
      <Navbar />
      
      {/* 1. HERO HEADER (Parallax Image) */}
      <div className="relative w-full h-[60vh] md:h-[80vh]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        {/* Judul di atas gambar */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-20 max-w-5xl">
            <div className="flex items-center gap-4 mb-4 text-sm font-bold tracking-widest uppercase text-gray-400">
                <span className="bg-blue-600 text-white px-2 py-1 rounded">Teknologi</span>
                <span>•</span>
                <span>{new Date(article.createdAt).toLocaleDateString("id-ID", { dateStyle: 'full' })}</span>
            </div>
            <h1 className="font-heading text-4xl md:text-7xl font-bold leading-tight mb-4">
                {article.title}
            </h1>
        </div>
      </div>

      {/* 2. KONTEN ARTIKEL */}
      <div className="px-6 md:px-0 py-20">
        <article className="max-w-3xl mx-auto prose prose-invert prose-lg text-gray-300 leading-relaxed">
            {/* Karena konten kita di DB masih plain text, kita render biasa.
               Jika nanti pakai Rich Text Editor (HTML), gunakan dangerouslySetInnerHTML
            */}
            <p className="whitespace-pre-line">
                {article.content}
            </p>
        </article>

        {/* Tombol Back */}
        <div className="max-w-3xl mx-auto mt-20 border-t border-white/10 pt-10">
            <a href="/article" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                ← Kembali ke Arsip Artikel
            </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}