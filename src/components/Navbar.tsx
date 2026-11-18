import { useState } from 'react';
import { ArrowRight, GraduationCap, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenModal: () => void;
}

const NAV_LINKS = [
  { href: '#kebimbangan', label: 'Penyelesaian' },
  { href: '#kampus', label: 'Kampus' },
  { href: '#kerjaya', label: 'Peluang Kerjaya' },
  { href: '#kewangan', label: 'Kewangan & MQA' },
];

export function Navbar({ onOpenModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Clean single-line brand wordmark */}
        <a
          href="#"
          className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E40AF] rounded-lg"
        >
          <span className="w-9 h-9 rounded-lg bg-[#0F294A] text-amber-400 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" aria-hidden="true" />
          </span>
          <span className="font-heading font-extrabold text-xl tracking-tight text-[#0F294A]">
            GIS
          </span>
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 py-1 hover:text-[#0F294A] hover:underline underline-offset-4 decoration-[#D97706] decoration-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E40AF] rounded"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action + mobile drawer trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenModal}
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-[#0F294A] hover:bg-[#1E40AF] text-white text-sm font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97706]"
          >
            <span>Daftar Minat</span>
            <ArrowRight className="w-4 h-4 text-amber-400" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 text-[#0F294A] hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 shadow-sm">
          <nav aria-label="Navigasi Mudah Alih" className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0F294A] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
