import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleHeader from "@/components/article/ArticleHeader"; // Import baru
import ProgramGrid from "@/components/article/ProgramGrid";     // Import baru
import ArticleList from "@/components/article/ArticleList";     // Import baru
import InteractiveBackground from "@/components/InteractiveBackground";

export const dynamic = "force-dynamic";

// Fetch Data
async function getData() {
  const [articles, programs] = await Promise.all([
    fetch('https://aditya03-fend-himikom-backend.hf.space/api/article', { cache: 'no-store' }).then(r => r.ok ? r.json() : []),
    fetch('https://aditya03-fend-himikom-backend.hf.space/api/program', { cache: 'no-store' }).then(r => r.ok ? r.json() : [])
  ]);
  return { articles, programs };
}

export default async function ArticlePage() {
  const { articles, programs } = await getData();

  return (
    <main className="bg-black min-h-screen text-white selection:bg-purple-500 selection:text-white">
      <Navbar />
      
      {/* Wrapper Konten (Z-Index) */}
      <div className="relative z-10 shadow-2xl mb-[100vh] bg-black"> 
         <div className="absolute inset-0 z-[-1] opacity-50"><InteractiveBackground /></div>

         {/* 1. Header Parallax */}
         <ArticleHeader />

         {/* 2. Program Kerja (Grid) */}
         <ProgramGrid programs={programs} />

         {/* 3. Artikel (List) */}
         <ArticleList articles={articles} />

         <div className="h-24 bg-black"></div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 w-full h-screen z-0">
        <Footer />
      </div>
    </main>
  );
}