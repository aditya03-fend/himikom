// src/app/portfolio/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// Pastikan path import ini sesuai dengan lokasi komponenmu
// Sebelumnya kita buat di folder src/components/portfoliosection/
import PersonalWebGallery from "@/components/portfolio/PersonalWebGallery";
import WorksGrid from "@/components/portfolio/WorksGrid";
import AchievementList from "@/components/portfolio/AchievementList";
import { Work, Achievement, Portfolio } from "@/types";

export const dynamic = "force-dynamic";

// Fetch Semua Data Sekaligus
async function getData() {
  try {
    const [worksRes, achievementsRes, portfoliosRes] = await Promise.all([
      fetch('https://aditya03-fend-himikom-backend.hf.space/api/work', { cache: 'no-store' }),
      fetch('https://aditya03-fend-himikom-backend.hf.space/api/achievement', { cache: 'no-store' }),
      fetch('https://aditya03-fend-himikom-backend.hf.space/api/portfolio', { cache: 'no-store' })
    ]);

    // PERBAIKAN: Ganti 'any' dengan tipe data yang spesifik
    const rawWorks = worksRes.ok ? await worksRes.json() : [];
    const works: Work[] = rawWorks.filter((w: Work) => w.status === 'PUBLISHED');

    const rawAchievements = achievementsRes.ok ? await achievementsRes.json() : [];
    const achievements: Achievement[] = rawAchievements.filter((a: Achievement) => a.status === 'PUBLISHED');

    const rawPortfolios = portfoliosRes.ok ? await portfoliosRes.json() : [];
    const portfolios: Portfolio[] = rawPortfolios.filter((p: Portfolio) => p.status === 'PUBLISHED');

    return { works, achievements, portfolios };
  } catch (error) {
    console.error("Gagal mengambil data portfolio:", error);
    return { works: [], achievements: [], portfolios: [] };
  }
}

export default async function PortfolioPage() {
  const { works, achievements, portfolios } = await getData();

  return (
    <main className="bg-black min-h-screen text-white selection:bg-yellow-500 selection:text-black">
      <Navbar />
      
      {/* 1. PERSONAL WEB (Horizontal Scroll Pinned) */}
      <PersonalWebGallery portfolios={portfolios} />

      <div className="relative z-10 bg-zinc-950">
          
          {/* 2. KARYA (Grid 3D) */}
          <WorksGrid works={works} />

          {/* 3. PRESTASI (List Reveal) */}
          <AchievementList achievements={achievements} />
          
          <div className="h-20"></div>
      </div>

      <Footer />
    </main>
  );
}