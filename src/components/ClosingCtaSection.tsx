import { Send } from 'lucide-react';

interface ClosingCtaSectionProps {
  onOpenModal: () => void;
}

export function ClosingCtaSection({ onOpenModal }: ClosingCtaSectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-[#F8FAFC] border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 reveal-up">
        <div className="rounded-3xl bg-gradient-to-br from-[#FFFBEB] via-white to-blue-50/70 border border-amber-200 p-8 sm:p-14 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#B45309]">
            Tempat Terhad Untuk Pengambilan Terkini
          </p>
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#0F294A] mt-3 leading-tight max-w-2xl mx-auto">
            Berminat Mengetahui Lebih Lanjut Untuk Anak Anda?
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
            Klik butang di bawah dan isi 3 maklumat ringkas. Pegawai kaunselor GIS akan menghubungi anda segera untuk penerangan lengkap mengenai program Logistik, TVET dan bantuan kewangan.
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={onOpenModal}
              className="inline-flex items-center justify-center gap-2.5 min-h-[52px] px-8 py-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-base sm:text-lg shadow-sm hover:shadow-md transition-all duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F294A]"
            >
              <Send className="w-5 h-5" aria-hidden="true" />
              <span>Berminat? Klik &amp; Isi Borang Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
