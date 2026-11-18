import { useEffect, useRef, useState } from 'react';
import { ArrowDown, FileSignature } from 'lucide-react';

interface HeroSectionProps {
  onOpenModal: () => void;
}

const HERO_IMAGE_URL = '/src/assets/images/hero_malay_mother_1794983894482.jpg';

export function HeroSection({ onOpenModal }: HeroSectionProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (parallaxRef.current && scrollY < 960) {
          parallaxRef.current.style.transform = `translate3d(0, ${scrollY * 0.22}px, 0) scale(1.03)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="relative min-h-[82vh] flex items-center overflow-hidden bg-[#F8FAFC] border-b border-slate-200">
      {/* Parallax Widescreen Cinematic Visual Layer */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{ transform: 'translate3d(0, 0, 0) scale(1.03)' }}
      >
        {!imgError ? (
          <img
            src={HERO_IMAGE_URL}
            alt="Ibu moden bertudung tersenyum mesra merancang masa depan pendidikan anak di GIS"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-[78%_20%] lg:object-right-top"
          />
        ) : (
          <div
            aria-hidden="true"
            className="w-full h-full bg-gradient-to-br from-[#FFFBEB] via-white to-slate-100"
          />
        )}
      </div>

      {/* Measured Light Mode Scrims for >= 4.5:1 Text Contrast */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-55% to-white/10 lg:to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent lg:hidden"
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="max-w-2xl space-y-6">
          {/* Clean Unboxed Typographic Eyebrow */}
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#B45309]">
            GIS Institusi Pengajian Tinggi
            <span aria-hidden="true" className="mx-2 text-slate-400">·</span>
            Khas Untuk Ibu Bapa Pelajar 18 Tahun Ke Atas
          </p>

          {/* Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#0F294A] tracking-tight leading-[1.12]">
            Pilihan Bijak Seorang Ibu Untuk{' '}
            <span className="text-[#1E40AF]">Masa Depan Kerjaya Anak</span>{' '}
            Dalam Industri Logistik
          </h1>

          {/* Empathetic Value Proposition */}
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl">
            Usah biarkan kebimbangan mengenai peluang kerjaya, kekangan kewangan, atau fasiliti kolej menghalang kejayaan anak anda. Di{' '}
            <strong className="font-semibold text-[#0F294A]">GIS</strong>, kami menyediakan latihan{' '}
            <strong className="font-semibold text-[#0F294A]">TVET</strong> diiktiraf{' '}
            <strong className="font-semibold text-[#0F294A]">MQA</strong> lengkap dengan pilihan tajaan kewangan demi masa depan yang terjamin.
          </p>

          {/* Primary & Secondary Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              type="button"
              onClick={onOpenModal}
              className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-7 py-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-base shadow-sm hover:shadow-md transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F294A]"
            >
              <FileSignature className="w-5 h-5" aria-hidden="true" />
              <span>Berminat? Klik Untuk Daftar</span>
            </button>

            <a
              href="#kebimbangan"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3.5 rounded-xl bg-white/95 hover:bg-slate-50 border border-slate-300 text-[#0F294A] font-semibold text-sm transition-colors duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
            >
              <span>Lihat Kelebihan GIS</span>
              <ArrowDown className="w-4 h-4 text-[#D97706]" aria-hidden="true" />
            </a>
          </div>

          {/* Crisp Hairline Trust Strip (No nested badge clutter) */}
          <div className="pt-6 border-t border-slate-200/90 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-xl">
            <div>
              <p className="font-heading font-bold text-[#0F294A] text-base">MQA &amp; TVET</p>
              <p className="text-xs text-slate-600 mt-0.5">Kelayakan Sah IPT Malaysia</p>
            </div>
            <div>
              <p className="font-heading font-bold text-[#B45309] text-base">PTPTN, PTPK &amp; Biasiswa</p>
              <p className="text-xs text-slate-600 mt-0.5">Sokongan Pembiayaan Pelajar</p>
            </div>
            <div>
              <p className="font-heading font-bold text-[#0F294A] text-base">Kerjaya Logistik</p>
              <p className="text-xs text-slate-600 mt-0.5">Laluan Industri Berdaya Maju</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
