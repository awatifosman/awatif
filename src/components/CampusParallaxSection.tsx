import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface CampusParallaxSectionProps {
  onOpenModal: () => void;
}

const CAMPUS_IMAGE_URL = '/src/assets/images/parallax_logistics_campus_1794983895241.jpg';

export function CampusParallaxSection({ onOpenModal }: CampusParallaxSectionProps) {
  const bgRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!sectionRef.current || !bgRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const offset = (rect.top / window.innerHeight) * -45;
          bgRef.current.style.transform = `translate3d(0, ${offset}px, 0) scale(1.12)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      id="kampus"
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden border-y border-slate-200 bg-[#F8FAFC]"
    >
      {/* Parallax Background Image Layer */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{ transform: 'translate3d(0, 0, 0) scale(1.12)' }}
      >
        {!imgError ? (
          <img
            src={CAMPUS_IMAGE_URL}
            alt="Suasana kampus moden dan hab latihan simulasi logistik TVET GIS"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div
            aria-hidden="true"
            className="w-full h-full bg-gradient-to-br from-slate-100 via-[#FFFBEB] to-blue-50"
          />
        )}
      </div>

      {/* Light Mode Glass Scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-white/88 backdrop-blur-[2px]"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal-up">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#1E40AF]">
          Pendidikan Berteraskan Industri Sebenar
        </p>

        <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0F294A] mt-4 leading-tight">
          Ketenangan Hati Ibu Bapa Apabila Melihat Anak Berjaya Membina Kerjaya Stabil
        </h2>

        <p className="text-slate-700 text-base sm:text-lg max-w-2xl mx-auto mt-5 leading-relaxed">
          Di GIS, setiap pelajar dibimbing secara dekat oleh tenaga pengajar berpengalaman dalam persekitaran kampus yang selamat, lengkap, profesional, dan berdaya saing.
        </p>

        <div className="mt-8">
          <button
            type="button"
            onClick={onOpenModal}
            className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-8 py-4 rounded-xl bg-[#0F294A] hover:bg-[#1E40AF] text-white font-bold text-base shadow-sm hover:shadow-md transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97706]"
          >
            <span>Dapatkan Maklumat Kursus &amp; Yuran</span>
            <ArrowRight className="w-5 h-5 text-amber-400" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
