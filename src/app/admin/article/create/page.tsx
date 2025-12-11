// src/app/admin/article/create/page.tsx
"use client";
import React, { useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
// Menambahkan ikon yang dibutuhkan untuk fitur upload
import { ArrowLeft, Save, Loader2, UploadCloud, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";

// Import ReactQuill-New secara dinamis (No SSR)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CreateArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // --- STATE UNTUK IMAGE UPLOAD ---
  const [imageInputMode, setImageInputMode] = useState<'file' | 'url'>('file');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State Form
  const [formData, setFormData] = useState({
    title: "",
    image: "", // Bisa URL string atau Base64 string
    author: "",
    content: "", 
  });

  // --- LOGIC IMAGE UPLOAD (Sama dengan Program page) ---
  
  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Mohon upload file gambar untuk cover artikel!");
      return;
    }
    // Convert File to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
    };
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  // --- END LOGIC IMAGE ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = Cookies.get("token");

    // Validasi Manual
    if (!formData.title || !formData.content || !formData.author || !formData.image) {
        alert("Judul, Author, Konten, dan Cover Image wajib diisi!");
        setLoading(false);
        return;
    }

    try {
      // Catatan: Mengirim Base64 via JSON body. Pastikan backend siap menerima string panjang.
      const res = await fetch("https://aditya03-fend-himikom-backend.hf.space/api/article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan artikel");

      alert("Artikel berhasil dibuat!");
      router.push("/admin/article");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  // Konfigurasi Toolbar Quill
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  return (
    <div className="pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-black z-20 py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/admin/article" className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
             <h1 className="text-2xl font-bold font-heading">Tulis Artikel Baru</h1>
             <p className="text-gray-400 text-sm">Bagikan wawasan dan berita terbaru.</p>
          </div>
        </div>
        
        <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
        >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            PUBLISH
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* --- KOLOM KIRI: EDITOR KONTEN --- */}
        <div className="lg:w-2/3 order-2 lg:order-1">
            <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden min-h-[500px] flex flex-col">
                <ReactQuill 
                    theme="snow"
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    modules={modules}
                    placeholder="Mulai menulis cerita inspiratif di sini..."
                    className="flex-1 text-white bg-black/30"
                />
            </div>
        </div>

        {/* --- KOLOM KANAN: META DATA (Sidebar) --- */}
        <div className="lg:w-1/3 order-1 lg:order-2 space-y-6">
           <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl sticky top-32">
              <h3 className="text-lg font-bold mb-4 text-purple-400">Detail Artikel</h3>
              
              <div className="space-y-6">
                {/* Judul */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Judul Artikel</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 mt-1 focus:border-blue-500 transition-all outline-none text-white font-bold text-lg"
                    placeholder="Judul yang menarik..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Penulis / Author</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 mt-1 focus:border-blue-500 transition-all outline-none"
                    placeholder="Nama Penulis"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>

                {/* --- IMAGE UPLOAD SECTION --- */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Cover Image</label>
                        {/* Toggle Button */}
                        <div className="flex bg-black/50 p-1 rounded-lg border border-white/5">
                            <button 
                                onClick={() => setImageInputMode('file')}
                                className={`p-1 px-2 rounded text-[10px] font-bold transition-all flex items-center gap-1 ${imageInputMode === 'file' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                <ImageIcon size={12} /> Upload
                            </button>
                            <button 
                                onClick={() => setImageInputMode('url')}
                                className={`p-1 px-2 rounded text-[10px] font-bold transition-all flex items-center gap-1 ${imageInputMode === 'url' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                <LinkIcon size={12} /> URL
                            </button>
                        </div>
                    </div>

                    {/* PREVIEW IMAGE (Jika sudah ada data gambar) */}
                    {formData.image ? (
                        <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-black h-36 mb-4">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover opacity-90" />
                            <button 
                                onClick={() => setFormData({ ...formData, image: "" })}
                                className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-600 text-white p-1.5 rounded-full transition-all"
                                title="Hapus Gambar"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        // INPUT AREA (Jika belum ada gambar)
                        <>
                            {imageInputMode === 'file' ? (
                                // MODE 1: DRAG & DROP
                                <div 
                                    className={`relative w-full h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                                        dragActive ? "border-blue-500 bg-blue-500/10" : "border-white/10 bg-black/30 hover:bg-black/50 hover:border-white/20"
                                    }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input 
                                        ref={fileInputRef}
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleChangeFile}
                                    />
                                    <UploadCloud size={32} className={`mb-2 ${dragActive ? "text-blue-400" : "text-gray-500"}`} />
                                    <p className="text-sm text-gray-400 font-medium">
                                        Klik atau drop cover di sini
                                    </p>
                                    <p className="text-[10px] text-gray-600 mt-1">Max 2MB (JPG/PNG)</p>
                                </div>
                            ) : (
                                // MODE 2: URL INPUT
                                <input
                                    type="url"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-blue-500 transition-all outline-none text-sm"
                                    placeholder="https://example.com/cover-image.jpg"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                            )}
                        </>
                    )}
                </div>

              </div>
           </div>
        </div>

      </div>

      {/* Override CSS untuk Quill Dark Mode */}
      <style jsx global>{`
        .ql-toolbar {
            background-color: #18181b; /* zinc-900 */
            border-color: #27272a !important;
            border-top-left-radius: 0.75rem;
            border-top-right-radius: 0.75rem;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        .ql-container {
            border-color: #27272a !important;
            border-bottom-left-radius: 0.75rem;
            border-bottom-right-radius: 0.75rem;
            font-size: 16px;
            min-height: 400px;
        }
        .ql-editor {
            min-height: 400px;
        }
        .ql-stroke { stroke: #a1a1aa !important; }
        .ql-fill { fill: #a1a1aa !important; }
        .ql-picker { color: #a1a1aa !important; }
        .ql-editor.ql-blank::before { color: #52525b !important; font-style: normal; }
      `}</style>
    </div>
  );
}