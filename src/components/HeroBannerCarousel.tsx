import { useState, useEffect, useCallback, useRef } from 'react';
import type { AniListAnime } from '../types/anime';

export interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
  description?: string;
  anime?: AniListAnime;
}

interface HeroBannerCarouselProps {
  slides: HeroSlide[];
  onReadDescription: (anime: AniListAnime) => void;
}

export function HeroBannerCarousel({ slides, onReadDescription }: HeroBannerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(((index % slides.length) + slides.length) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  const goToNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  // Auto-cycle every 5 seconds, pause on hover
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[activeIndex];

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl bg-zinc-950 mb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Prev Button - outer left edge */}
      <button
        onClick={goToPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-black/50 text-white text-xl hover:bg-black/70 transition-colors backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Next Button - outer right edge */}
      <button
        onClick={goToNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-black/50 text-white text-xl hover:bg-black/70 transition-colors backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Main content area */}
      <div className="relative flex flex-col md:flex-row min-h-[420px] md:min-h-[500px]">
        {/* Left panel - text content */}
        <div className="relative z-10 w-full md:w-[45%] flex flex-col justify-center px-8 md:px-12 py-10 md:py-0">
          {/* Gradient overlay that fades into the image on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/0 md:via-zinc-950/80 md:to-transparent z-0" />

          <div className="relative z-10">
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-zinc-400 text-lg mb-4 max-w-xl">
              {slide.subtitle}
            </p>

            {slide.description && (
              <p className="text-zinc-500 text-base mb-6 max-w-xl">
                {slide.description}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                type="button"
                onClick={() => {
                  if (slide.anime) onReadDescription(slide.anime);
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-full px-7 py-3 shadow-lg shadow-teal-500/25 hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                READ DESCRIPTION
              </button>
              <button
                type="button"
                onClick={() => {
                  if (slide.anime) onReadDescription(slide.anime);
                }}
                className="uppercase text-sm font-semibold text-zinc-300 hover:text-white tracking-wider transition-colors duration-200 cursor-pointer"
              >
                VIEW DETAILS
              </button>
            </div>

            {/* Slide pagination dots */}
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? 'w-8 bg-white'
                      : 'w-2 bg-zinc-600 hover:bg-zinc-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right panel - artwork */}
        <div className="relative w-full md:w-[55%] min-h-[280px] md:min-h-full overflow-hidden">
          {/* Ambient purple glow */}
          <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-violet-600/30 rounded-full blur-3xl z-0" />
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl z-0" />

          {/* Character artwork */}
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-contain object-center p-4"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}