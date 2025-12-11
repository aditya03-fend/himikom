// src/app/admin/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
      <p className="text-gray-400 mb-8">Selamat datang kembali, Admin.</p>

      {/* Statistik Card Dummy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="p-6 bg-zinc-900 border border-white/10 rounded-xl">
           <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Program</h3>
           <p className="text-4xl font-bold text-white">12</p>
        </div>
        {/* Card 2 */}
        <div className="p-6 bg-zinc-900 border border-white/10 rounded-xl">
           <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Artikel</h3>
           <p className="text-4xl font-bold text-white">45</p>
        </div>
        {/* Card 3 */}
        <div className="p-6 bg-zinc-900 border border-white/10 rounded-xl">
           <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Karya</h3>
           <p className="text-4xl font-bold text-white">8</p>
        </div>
      </div>
    </div>
  );
}