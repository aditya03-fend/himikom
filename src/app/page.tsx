// src/app/page.tsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/home/Hero";
import ProgramSection from "@/components/home/ProgramSection";
import ArticleSection from "@/components/home/ArticleSection";
import AchievementSection from "@/components/home/AchievementSection";
import Footer from "@/components/Footer";
import InteractiveBackground from "@/components/InteractiveBackground";
import { Program, Article, Achievement } from "@/types";

export const dynamic = "force-dynamic";

// Helper Fetch Data
async function getData() {
  try {
    const [programsRes, articlesRes, achievementsRes] = await Promise.all([
      fetch('https://aditya03-fend-himikom-backend.hf.space/api/program', { cache: 'no-store' }),
      fetch('https://aditya03-fend-himikom-backend.hf.space/api/article', { cache: 'no-store' }),
      fetch('https://aditya03-fend-himikom-backend.hf.space/api/achievement', { cache: 'no-store' })
    ]);

    const programs: Program[] = programsRes.ok ? await programsRes.json() : [];
    const articles: Article[] = articlesRes.ok ? await articlesRes.json() : [];
    const achievements: Achievement[] = achievementsRes.ok ? await achievementsRes.json() : [];

    return { programs, articles, achievements };
  } catch (error) {
    console.error("Gagal mengambil data home:", error);
    return { programs: [], articles: [], achievements: [] };
  }
}

export default async function Home() {
  const { programs, articles, achievements } = await getData();

  // FILTER & LIMIT DATA (Hanya 3 Item per kategori)
  // 1. Prestasi: Ambil 3 Terbaru
// ...
const topAchievements = achievements
    .filter(a => a.status === 'PUBLISHED') // <--- FILTER STATUS
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
// ...
  // 2. Program: Ambil 3 yang PUBLISHED
  const topPrograms = programs
    .filter(p => p.status === 'PUBLISHED')
    .slice(0, 3);

  // 3. Artikel: Ambil 3 Terbaru
  const topArticles = articles
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <main className="min-h-screen text-white selection:bg-white selection:text-black">
      <Navbar />
      
      {/* Wrapper Konten Utama */}
      <div className="relative z-10 shadow-2xl mb-[100vh]"> 
        
        {/* Background Dinamis (Sticky) */}
        <div className="absolute inset-0 z-[-1]">
             <InteractiveBackground />
        </div>

        {/* 1. HERO */}
        <Hero />

        {/* 2. PRESTASI (3 ITEM) */}
        {/* Kita taruh Prestasi di atas Program untuk pamer pencapaian dulu */}
        <AchievementSection achievements={topAchievements} />

        {/* 3. PROGRAM KERJA (3 ITEM - Horizontal Scroll) */}
        <ProgramSection programs={topPrograms} />
        
        {/* 4. ARTIKEL (3 ITEM - Hover Reveal) */}
        <ArticleSection articles={topArticles} />
        
        {/* Spacer Penutup */}
        <div className="h-24 bg-black"></div>
      </div>

      {/* FOOTER (Fixed Reveal) */}
      <div className="fixed bottom-0 left-0 w-full h-screen z-0">
        <Footer />
      </div>
    </main>
  );
}