import { GraduationCap } from 'lucide-react';

interface FooterProps {
  onOpenCrm?: () => void;
}

export function Footer({ onOpenCrm }: FooterProps) {
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

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2 text-xs text-slate-500">
          <span>
            &copy; {new Date().getFullYear()} GIS. Program Pengajian Logistik &amp; TVET Diiktiraf MQA.
          </span>
          {onOpenCrm && (
            <>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={onOpenCrm}
                className="font-semibold text-[#0F294A] hover:text-[#1E40AF] hover:underline underline-offset-4 cursor-pointer"
              >
                Portal Kaunselor (CRM)
              </button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
