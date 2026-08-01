"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { heroSlides } from "@/data/heroSlides";

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = heroSlides[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveIndex((index) => (index + 1) % heroSlides.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="bg-amber-50 px-5 py-6 sm:py-8">
      <div className="relative mx-auto min-h-[360px] max-w-7xl overflow-hidden rounded-3xl bg-zinc-900 shadow-xl sm:min-h-[420px]">
        <Image
          src={activeSlide.image}
          alt=""
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/70 via-zinc-950/35 to-zinc-950/5" />
        <div className="relative z-10 flex min-h-[360px] max-w-xl flex-col justify-center px-7 py-12 text-white sm:min-h-[420px] sm:px-14">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
            {activeSlide.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
            {activeSlide.title}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-zinc-100">
            {activeSlide.description}
          </p>
          <Link
            href={activeSlide.ctaHref}
            className="mt-8 w-fit rounded-xl bg-red-600 px-6 py-3 font-bold transition hover:bg-red-700"
          >
            {activeSlide.ctaLabel}
          </Link>
        </div>
        <div className="absolute bottom-5 right-5 z-10 flex gap-2">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              aria-label={`Ver banner ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition ${activeIndex === index ? "w-8 bg-amber-300" : "w-2.5 bg-white/60"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

