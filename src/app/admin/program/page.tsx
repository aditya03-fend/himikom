// src/app/admin/program/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Plus, Pencil, Trash2, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Program } from "@/types";
import { cn } from "@/lib/utils";

export default function AdminProgramPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  // Ambil data & cek role
  const initData = async () => {
    // 1. Cek Role dari Cookie
    const role = Cookies.get("user_role") || "";
    setUserRole(role);

    // 2. Fetch Data
    try {
      const res = await fetch("https://aditya03-fend-himikom-backend.hf.space/api/program", { cache: "no-store" });
      setPrograms(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Publish / Reject
  const handleStatusChange = async (id: string, newStatus: string) => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(`https://aditya03-fend-himikom-backend.hf.space/api/program/${id}`, {
        method: "PATCH", // Kita pakai PATCH untuk update sebagian
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }) // Kirim status baru
      });

      if (res.ok) {
        alert(`Status berhasil diubah ke ${newStatus}`);
        initData(); // Refresh tabel
      }
    } catch (error) {
      alert("Gagal mengubah status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus program ini?")) return;
    const token = Cookies.get("token");
    const res = await fetch(`https://aditya03-fend-himikom-backend.hf.space/api/program/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) initData();
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading">Program Kerja</h1>
          <p className="text-gray-400 text-sm">
             Login sebagai: <span className="text-blue-400 font-bold">{userRole}</span>
          </p>
        </div>
        <Link href="/admin/program/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm">
          <Plus size={18} /> TAMBAH PROGRAM
        </Link>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
        {loading ? <div className="p-8 text-center"><Loader2 className="animate-spin inline" /></div> : (
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase">
              <tr>
                <th className="p-4">Status</th>
                <th className="p-4">Judul Program</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {programs.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  {/* KOLOM STATUS */}
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold border",
                      item.status === "PUBLISHED" 
                        ? "bg-green-500/10 text-green-400 border-green-500/20" 
                        : item.status === "REJECTED"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  
                  <td className="p-4 font-medium">{item.title}</td>
                  <td className="p-4 text-gray-400 text-sm">
                     {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  
                  {/* KOLOM AKSI */}
                  <td className="p-4 text-right flex justify-end gap-2 items-center">
                    
                    {/* HANYA MUNCUL JIKA SUPER ADMIN & STATUS BELUM PUBLISHED */}
                    {userRole === "SUPER_ADMIN" && item.status !== "PUBLISHED" && (
                      <button 
                        onClick={() => handleStatusChange(item.id, "PUBLISHED")}
                        title="Publish Konten"
                        className="p-2 bg-green-900/30 hover:bg-green-600 text-green-400 hover:text-white rounded-lg transition-colors mr-2"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}

                    {/* Tombol Reject (Opsional) */}
                     {userRole === "SUPER_ADMIN" && item.status === "PENDING" && (
                      <button 
                        onClick={() => handleStatusChange(item.id, "REJECTED")}
                        title="Tolak Konten"
                        className="p-2 bg-red-900/30 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors mr-2"
                      >
                        <XCircle size={16} />
                      </button>
                    )}

                    <button className="p-2 bg-gray-800 text-blue-400 rounded-lg hover:bg-gray-700">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-gray-800 text-red-400 rounded-lg hover:bg-red-900/30">
                      <Trash2 size={16} />
                    </button>
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