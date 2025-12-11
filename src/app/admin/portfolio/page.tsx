// src/app/admin/portfolio/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Plus, Trash2, Loader2, Globe, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { Portfolio } from "@/types";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function AdminPortfolioPage() {
  const [data, setData] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  const fetchData = async () => {
    // Ambil Role dari Cookies
    setUserRole(Cookies.get("user_role") || "");
    
    try {
      const res = await fetch("https://aditya03-fend-himikom-backend.hf.space/api/portfolio", { cache: "no-store" });
      setData(await res.json());
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  // --- FUNGSI UPDATE STATUS (PUBLISH / REJECT) ---
  const handleStatusChange = async (id: string, newStatus: string) => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(`https://aditya03-fend-himikom-backend.hf.space/api/portfolio/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        fetchData(); // Refresh data jika sukses
      } else {
        alert("Gagal mengupdate status.");
      }
    } catch (e) { alert("Terjadi kesalahan koneksi."); }
  };

  // --- FUNGSI DELETE ---
  const handleDelete = async (id: string) => {
    if (!confirm("Hapus portfolio ini permanen?")) return;
    const token = Cookies.get("token");
    const res = await fetch(`https://aditya03-fend-himikom-backend.hf.space/api/portfolio/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) fetchData();
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading">Web Portfolio</h1>
          <p className="text-gray-400 text-sm">
            Role Anda: <span className={cn("font-bold", userRole === "SUPER_ADMIN" ? "text-red-500" : "text-blue-500")}>{userRole || "USER"}</span>
          </p>
        </div>
        <Link href="/admin/portfolio/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm transition-colors">
          <Plus size={18} /> TAMBAH PORTFOLIO
        </Link>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
        {loading ? <div className="p-8 text-center"><Loader2 className="animate-spin inline" /></div> : (
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase">
              <tr>
                <th className="p-4">Status</th>
                <th className="p-4">Preview</th>
                <th className="p-4">Project & Mahasiswa</th>
                <th className="p-4">Link Website</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  
                  {/* KOLOM STATUS */}
                  <td className="p-4">
                    <span className={cn("px-2 py-1 rounded text-[10px] font-bold border", 
                      item.status === "PUBLISHED" ? "bg-green-500/10 text-green-400 border-green-500/20" : 
                      item.status === "REJECTED" ? "bg-red-500/10 text-red-400 border-red-500/20" : 
                      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20")}>
                      {item.status || "PENDING"}
                    </span>
                  </td>

                  <td className="p-4 w-32">
                    <div className="relative w-24 h-16 rounded overflow-hidden bg-black border border-white/20">
                         <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white">{item.title}</div>
                    <div className="text-sm text-gray-400">{item.studentName}</div>
                  </td>
                  <td className="p-4">
                    <a href={item.link} target="_blank" className="text-blue-400 hover:underline flex items-center gap-1 text-sm">
                        <Globe size={14} /> Kunjungi <ExternalLink size={12} />
                    </a>
                  </td>
                  
                  {/* KOLOM AKSI (Super Admin Logic) */}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                        
                        {/* Tombol Approve (Hanya Super Admin & Belum Published) */}
                        {userRole === "SUPER_ADMIN" && item.status !== "PUBLISHED" && (
                            <button 
                                onClick={() => handleStatusChange(item.id, "PUBLISHED")} 
                                className="p-2 bg-green-900/30 text-green-400 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
                                title="Approve / Publish"
                            >
                                <CheckCircle size={16} />
                            </button>
                        )}

                        {/* Tombol Reject (Hanya Super Admin & Masih Pending) */}
                        {userRole === "SUPER_ADMIN" && item.status === "PENDING" && (
                            <button 
                                onClick={() => handleStatusChange(item.id, "REJECTED")} 
                                className="p-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                                title="Reject"
                            >
                                <XCircle size={16} />
                            </button>
                        )}

                        {/* Tombol Delete (Semua Admin bisa) */}
                        <button 
                            onClick={() => handleDelete(item.id)} 
                            className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-red-900/50 hover:text-red-400 transition-colors"
                            title="Hapus Permanen"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}