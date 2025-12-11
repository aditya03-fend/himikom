// src/components/portfoliosection/AchievementList.tsx
"use client";
import React, { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Achievement } from "@/types";
import { Trophy, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function AchievementList({ achievements }: { achievements: Achievement[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    if (achievements.length === 0) return;

    const ctx = gsap.context(() => {
      // 1. ENTRANCE ANIMATION (Satu per satu dari bawah)
      gsap.from(rowsRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [achievements]);

  // --- INTERAKSI MOUSE KEREN ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const row = rowsRef.current[index];
    if (!row) return;

    const rect = row.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 1. Gerakkan Glow Emas
    const glow = row.querySelector(".gold-glow") as HTMLElement;
    if (glow) {
      gsap.to(glow, {
        x: x,
        y: y,
        opacity: 0.4,
        duration: 0.2, // Cepat dan responsif
        ease: "power1.out"
      });
    }

    // 2. Parallax Text (Judul gerak dikit ngikutin mouse)
    const title = row.querySelector(".ach-title") as HTMLElement;
    if (title) {
        gsap.to(title, {
            x: (x - rect.width / 2) * 0.02, // Gerak sangat halus
            duration: 0.5
        });
    }
  };

  const handleMouseLeave = (index: number) => {
    const row = rowsRef.current[index];
    if (!row) return;

    // Reset Glow
    const glow = row.querySelector(".gold-glow") as HTMLElement;
    if (glow) gsap.to(glow, { opacity: 0, duration: 0.5 });

    // Reset Title
    const title = row.querySelector(".ach-title") as HTMLElement;
    if (title) gsap.to(title, { x: 0, duration: 0.5 });
  };

  if (achievements.length === 0) return null;

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-20 bg-zinc-950 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-16 border-b border-white/10 pb-6">
            <div className="p-3 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                <Trophy size={24} className="text-yellow-500" />
            </div>
            <div>
                <h2 className="font-heading text-3xl font-bold uppercase tracking-widest text-white">
                    Hall of Fame
                </h2>
                <p className="text-xs text-gray-500 font-mono mt-1">
                    REKOGNISI & PENGHARGAAN
                </p>
            </div>
        </div>

        {/* LIST CONTAINER */}
        <div className="flex flex-col gap-4">
            {achievements.map((item, index) => (
                <div 
                    key={item.id} 
                    ref={(el) => { if(el) rowsRef.current[index] = el; }}
                    onMouseMove={(e) => handleMouseMove(e, index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                    className="group relative flex flex-col md:flex-row md:items-center justify-between p-8 border border-white/10 rounded-2xl bg-zinc-900/50 hover:border-yellow-500/50 transition-colors overflow-hidden cursor-default"
                >
                    {/* 1. MOUSE FOLLOWER GLOW (Efek Senter Emas) */}
                    <div 
                        className="gold-glow absolute w-[300px] h-[300px] bg-yellow-500/20 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 z-0"
                        style={{ top: 0, left: 0 }}
                    ></div>

                    {/* 2. BACKGROUND IMAGE REVEAL */}
                    {/* Gambar muncul samar di belakang saat hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 z-0">
                        <Image 
                            src={item.image} 
                            alt={item.title} 
                            fill 
                            className="object-cover grayscale"
                        />
                    </div>

                    {/* CONTENT (Z-Index tinggi biar di atas glow/gambar) */}
                    <div className="relative z-10 flex items-start md:items-center gap-6 w-full">
                        
                        {/* Number */}
                        <span className="text-xl font-mono text-gray-600 group-hover:text-yellow-500 transition-colors">
                            {String(index + 1).padStart(2, '0')}
                        </span>

                        <div className="flex-1">
                            {/* Event Label */}
                            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 group-hover:text-white transition-colors">
                                {item.event}
                            </span>
                            
                            {/* Title (Magnetic) */}
                            <h3 className="ach-title text-2xl md:text-4xl font-bold text-white mb-1 leading-tight group-hover:text-yellow-100 transition-colors">
                                {item.title}
                            </h3>
                            
                            {/* Mobile Date (Desktop ada di kanan) */}
                            <p className="md:hidden text-gray-400 text-sm mt-2">
                                {new Date(item.createdAt).getFullYear()}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT SIDE ACTIONS */}
                    <div className="relative z-10 hidden md:flex flex-col items-end gap-2 min-w-[100px]">
                        {/* Year Badge */}
                        <div className="px-4 py-1 rounded-full border border-white/10 bg-black/20 text-sm font-bold text-gray-400 group-hover:border-yellow-500 group-hover:text-yellow-500 transition-all group-hover:-translate-y-1 duration-300">
                            {new Date(item.createdAt).getFullYear()}
                        </div>
                        
                        {/* Link Icon (Jika ada link) */}
                        {item.link && (
                            <a 
                                href={item.link} 
                                target="_blank"
                                className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300"
                            >
                                Lihat Sertifikat <ArrowUpRight size={12} />
                            </a>
                        )}
                    </div>

                    {/* Corner Decoration */}
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <Trophy className="text-yellow-500/20 w-24 h-24 -rotate-12" />
                    </div>

                </div>
            ))}
        </div>

      </div>
    </section>
  );
}