"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Module } from "@/types";

export default function AdminModulePage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModules = async () => {
    try {
      const res = await fetch("https://aditya03-fend-himikom-backend.hf.space/api/module", { cache: "no-store" });
      setModules(await res.json());
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus modul ini?")) return;
    const token = Cookies.get("token");
    const res = await fetch(`https://aditya03-fend-himikom-backend.hf.space/api/module/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) fetchModules();
  };

  useEffect(() => { fetchModules(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold font-heading">Modul Pembelajaran</h1></div>
        <Link href="/admin/module/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm"><Plus size={18} /> BUAT MODUL</Link>
      </div>
      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
        {loading ? <div className="p-8 text-center"><Loader2 className="animate-spin inline" /></div> : (
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase">
              <tr><th className="p-4">Nama Modul</th><th className="p-4">Deskripsi</th><th className="p-4 text-right">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {modules.map((item) => (
                <tr key={item.id} className="hover:bg-white/5">
                  <td className="p-4 font-medium">{item.title}</td>
                  <td className="p-4 text-gray-400 text-sm line-clamp-1">{item.description}</td>
                  <td className="p-4 text-right"><button onClick={() => handleDelete(item.id)} className="p-2 bg-gray-800 text-red-400 rounded-lg hover:bg-red-900/30"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}