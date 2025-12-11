// src/components/home/ProgramSection.tsx
"use client";
import React, { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Program } from "@/types";
import { ArrowRight, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ProgramSection({ programs }: { programs: Program[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    if (programs.length === 0) return;

    const ctx = gsap.context(() => {
      // Animasi Scale untuk efek tumpukan
      cardsRef.current.forEach((card, index) => {
        // Jangan animasikan kartu terakhir karena dia paling atas
        if (index === programs.length - 1) return;

        gsap.to(card, {
          scale: 0.9, // Kartu belakang mengecil
          opacity: 0.4, // Kartu belakang meredup
          scrollTrigger: {
            trigger: card,
            start: "top top", // Mulai saat kartu kena atas layar
            end: "bottom top", // Selesai saat kartu lewat
            scrub: true, // Animasi terikat scroll bar
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [programs]);

  if (programs.length === 0) return null;

  return (
    <section ref={containerRef} className="bg-black py-24 px-4 md:px-10 relative">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6">
          <Sparkles size={14} className="text-blue-400" />
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            Flagship Programs
          </span>
        </div>
        <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-4">
          Agenda Unggulan.
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Program kerja strategis yang dirancang untuk meningkatkan kompetensi anggota.
        </p>
      </div>

      {/* STACKED CARDS CONTAINER */}
      <div className="max-w-5xl mx-auto flex flex-col gap-10 pb-20">
        {programs.map((program, index) => {
          // Menghitung posisi 'top' agar kartu menumpuk rapi (Cascade)
          // Kartu 1 di top: 100px, Kartu 2 di top: 140px, dst.
          const stickyTop = 100 + index * 40; 

          return (
            <div
              key={program.id}
              ref={(el) => { if (el) cardsRef.current[index] = el; }}
              className="sticky"
              style={{ 
                top: `${stickyTop}px`, // Kunci posisi sticky
                zIndex: index + 1      // Pastikan urutan tumpukan benar
              }}
            >
              <div className="relative bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-h-[500px] flex flex-col md:flex-row">
                
                {/* 1. CONTENT (KIRI) */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between relative z-10 bg-zinc-900">
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <span className="text-6xl font-heading font-bold text-white/10">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="h-[1px] flex-1 bg-white/10"></div>
                    </div>

                    <h3 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                      {program.title}
                    </h3>
                    
                    <p className="text-gray-400 text-lg leading-relaxed line-clamp-4 mb-8">
                      {program.content}
                    </p>
                  </div>

                  <Link 
                    href="/article" 
                    className="group inline-flex items-center gap-3 text-white font-bold hover:text-blue-400 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                        <ArrowRight size={20} />
                    </div>
                    <span className="text-sm uppercase tracking-widest">Pelajari Program</span>
                  </Link>
                </div>

                {/* 2. IMAGE (KANAN) */}
                <div className="w-full md:w-1/2 relative h-[300px] md:h-auto overflow-hidden">
                    <Image
                        src={program.image}
                        alt={program.title}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                    {/* Gradient agar teks terbaca jika di mobile */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent md:bg-gradient-to-r md:from-zinc-900 md:to-transparent opacity-80 md:opacity-100"></div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}