"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Plus, Trash2, Loader2, Trophy, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { Achievement } from "@/types";
import { cn } from "@/lib/utils";

export default function AdminAchievementPage() {
  const [data, setData] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  const fetchData = async () => {
    setUserRole(Cookies.get("user_role") || "");
    try {
      const res = await fetch("http://https://aditya03-fend-himikom-backend.hf.space/api/achievement", { cache: "no-store" });
      setData(await res.json());
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  // FUNGSI UPDATE STATUS
  const handleStatusChange = async (id: string, newStatus: string) => {
    const token = Cookies.get("token");
    try {
      await fetch(`https://aditya03-fend-himikom-backend.hf.space/api/achievement/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      fetchData();
    } catch (e) { alert("Gagal update status"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus?")) return;
    const token = Cookies.get("token");
    const res = await fetch(`https://aditya03-fend-himikom-backend.hf.space/api/achievement/${id}`, {
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
          <h1 className="text-3xl font-bold font-heading">Prestasi</h1>
          <p className="text-gray-400 text-sm">Role: <span className="text-blue-500 font-bold">{userRole}</span></p>
        </div>
        <Link href="/admin/achievement/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm">
          <Plus size={18} /> TAMBAH
        </Link>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
        {loading ? <div className="p-8 text-center"><Loader2 className="animate-spin inline" /></div> : (
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase">
              <tr>
                <th className="p-4">Status</th>
                <th className="p-4">Judul</th>
                <th className="p-4">Link</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-white/5">
                  <td className="p-4">
                    <span className={cn("px-2 py-1 rounded text-[10px] font-bold border", 
                      item.status === "PUBLISHED" ? "bg-green-500/10 text-green-400 border-green-500/20" : 
                      item.status === "REJECTED" ? "bg-red-500/10 text-red-400 border-red-500/20" : 
                      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20")}>
                      {item.status || "PENDING"}
                    </span>
                  </td>
                  <td className="p-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-yellow-500/20 text-yellow-500 flex items-center justify-center"><Trophy size={16} /></div>
                    {item.title}
                  </td>
                  <td className="p-4 text-sm">{item.link ? <a href={item.link} target="_blank" className="text-blue-400 flex items-center gap-1">Link <ExternalLink size={12}/></a> : "-"}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    {/* TOMBOL APPROVAL */}
                    {userRole === "SUPER_ADMIN" && item.status !== "PUBLISHED" && (
                      <button onClick={() => handleStatusChange(item.id, "PUBLISHED")} className="p-2 bg-green-900/30 text-green-400 rounded-lg hover:bg-green-600 hover:text-white"><CheckCircle size={16} /></button>
                    )}
                    {userRole === "SUPER_ADMIN" && item.status === "PENDING" && (
                      <button onClick={() => handleStatusChange(item.id, "REJECTED")} className="p-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-600 hover:text-white"><XCircle size={16} /></button>
                    )}
                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-gray-800 text-red-400 rounded-lg hover:bg-red-900/30"><Trash2 size={16} /></button>
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