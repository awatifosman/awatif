import { BadgeCheck, Coins, GraduationCap, Landmark, Wrench } from 'lucide-react';

const PILLARS = [
  {
    title: 'Kelayakan MQA',
    subtitle: 'Diiktiraf Agensi Kelayakan Malaysia',
    icon: BadgeCheck,
  },
  {
    title: 'Program TVET',
    subtitle: 'Latihan Kemahiran Berfokus Kerjaya',
    icon: Wrench,
  },
  {
    title: 'Pinjaman PTPTN',
    subtitle: 'Pembiayaan Pengajian Tinggi',
    icon: Landmark,
  },
  {
    title: 'Pinjaman PTPK',
    subtitle: 'Tabung Pembangunan Kemahiran',
    icon: Coins,
  },
  {
    title: 'Biasiswa',
    subtitle: 'Insentif Pelajar Yang Layak',
    icon: GraduationCap,
  },
];

export function FinancialAccreditationSection() {
  return (
    <section id="kewangan" className="py-20 sm:py-28 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 reveal-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0F294A]">
            Akreditasi &amp; Sokongan Kewangan Pelajar
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0F294A] mt-3">
            Diiktiraf Sepenuhnya &amp; Kemudahan Pembiayaan Lengkap
          </h2>
          <p className="text-slate-600 mt-3 text-base sm:text-lg leading-relaxed">
            GIS komited memastikan pendidikan berkualiti tinggi dapat diakses oleh semua pelajar tanpa membebankan kewangan ibu bapa.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 reveal-up">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            const spanLastOnMobile = index === PILLARS.length - 1 ? 'col-span-2 sm:col-span-1' : '';
            return (
              <div
                key={pillar.title}
                className={`${spanLastOnMobile} rounded-2xl bg-[#F8FAFC] border border-slate-200 p-6 text-center hover:border-[#D97706] hover:bg-[#FFFBEB]/50 transition-colors duration-200`}
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-[#0F294A] text-amber-400 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="font-heading font-bold text-[#0F294A] text-base">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {pillar.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
