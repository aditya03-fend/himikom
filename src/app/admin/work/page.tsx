// src/app/admin/work/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Plus, Trash2, Loader2, Code2, CheckCircle, XCircle } from "lucide-react";
import { Work } from "@/types";
import { cn } from "@/lib/utils";

export default function AdminWorkPage() {
  const [data, setData] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  const fetchData = async () => {
    // 1. Ambil Role user saat ini
    setUserRole(Cookies.get("user_role") || "");

    try {
      const res = await fetch("https://aditya03-fend-himikom-backend.hf.space/api/work", { cache: "no-store" });
      setData(await res.json());
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  // --- LOGIC APPROVAL (SUPER ADMIN) ---
  const handleStatusChange = async (id: string, newStatus: string) => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(`http://localhost:https://aditya03-fend-himikom-backend.hf.space/api/work/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        fetchData(); // Refresh data
      } else {
        alert("Gagal update status");
      }
    } catch (e) { alert("Error koneksi"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus karya ini permanen?")) return;
    const token = Cookies.get("token");
    const res = await fetch(`https://aditya03-fend-himikom-backend.hf.space/api/work/${id}`, {
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
          <h1 className="text-3xl font-bold font-heading">Karya Mahasiswa</h1>
          <p className="text-gray-400 text-sm">
             Role Anda: <span className={cn("font-bold", userRole === "SUPER_ADMIN" ? "text-red-500" : "text-blue-500")}>{userRole || "USER"}</span>
          </p>
        </div>
        <Link href="/admin/work/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm transition-colors">
          <Plus size={18} /> UPLOAD PROJECT
        </Link>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
        {loading ? <div className="p-8 text-center"><Loader2 className="animate-spin inline" /></div> : (
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase">
              <tr>
                <th className="p-4">Status</th>
                <th className="p-4">Judul Project</th>
                <th className="p-4">Mahasiswa</th>
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

                  <td className="p-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-600/20 text-blue-500 flex items-center justify-center border border-blue-500/20">
                        <Code2 size={16} />
                    </div>
                    {item.title}
                  </td>
                  
                  <td className="p-4 text-gray-400 text-sm">{item.studentName}</td>
                  
                  {/* KOLOM AKSI */}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                        
                        {/* Tombol Approve (Hanya Super Admin & Belum Publish) */}
                        {userRole === "SUPER_ADMIN" && item.status !== "PUBLISHED" && (
                            <button 
                                onClick={() => handleStatusChange(item.id, "PUBLISHED")} 
                                className="p-2 bg-green-900/30 text-green-400 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
                                title="Approve Project"
                            >
                                <CheckCircle size={16} />
                            </button>
                        )}

                        {/* Tombol Reject (Hanya Super Admin & Masih Pending) */}
                        {userRole === "SUPER_ADMIN" && item.status === "PENDING" && (
                            <button 
                                onClick={() => handleStatusChange(item.id, "REJECTED")} 
                                className="p-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                                title="Reject Project"
                            >
                                <XCircle size={16} />
                            </button>
                        )}

                        {/* Tombol Hapus (Semua Admin) */}
                        <button 
                            onClick={() => handleDelete(item.id)} 
                            className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-red-900/50 hover:text-red-400 transition-colors"
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