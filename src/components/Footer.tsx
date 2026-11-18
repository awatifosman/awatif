import { GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-10 text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-[#0F294A] text-amber-400 flex items-center justify-center">
            <GraduationCap className="w-4 h-4" aria-hidden="true" />
          </span>
          <span className="font-heading font-bold text-[#0F294A]">
            GIS Institusi Pengajian Tinggi
          </span>
        </div>

        <p className="text-xs text-center sm:text-right text-slate-500">
          &copy; {new Date().getFullYear()} GIS. Program Pengajian Logistik &amp; TVET Diiktiraf MQA.
        </p>
      </div>
    </footer>
  );
}
