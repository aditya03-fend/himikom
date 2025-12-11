// src/types/index.ts

export interface Program {
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  status: "PENDING" | "PUBLISHED" | "REJECTED"; // Pastikan ini ada
}
// Lakukan hal yang sama untuk Article, Work, Module jika belum.

// Tambahkan ini:
export interface Article {
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  status?: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  // Kita akan generate kategori dan slug secara manual di frontend nanti
}

// ... (Program dan Article yang sudah ada biarkan saja)

// Tambahkan Work (Karya)
export interface Work {
  id: string;
  title: string;
  studentName: string;
  content: string;
  // Jika di database nanti ada image, tambahkan disini.
  // Sementara kita pakai placeholder jika di DB tidak ada image khusus
  createdAt: string;
  status?: 'PENDING' | 'PUBLISHED' | 'REJECTED';
}

// Tambahkan Module & Chapter
export interface Chapter {
  id: string;
  title: string;
  content: string;
  image?: string;
  moduleId: string;
  status?: 'PENDING' | 'PUBLISHED' | 'REJECTED';
}

export interface Module {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[]; // Relasi ke Bab
  createdAt: string;
  status?: 'PENDING' | 'PUBLISHED' | 'REJECTED';
}

// src/types/index.ts

// ... (Biarkan Program, Article, Work, Module, Chapter yang lama)

export interface Achievement {
  id: string;
  title: string;
  event: string;
  image: string;
  link?: string; // Tambahkan ini (pakai tanda tanya)
  createdAt: string;
  status?: 'PENDING' | 'PUBLISHED' | 'REJECTED';
}

export interface Portfolio {
  id: string;
  title: string;
  studentName: string;
  image: string;
  link?: string; // Link ke website personal
  createdAt: string;
  status?: 'PENDING' | 'PUBLISHED' | 'REJECTED';
}
