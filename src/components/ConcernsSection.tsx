import { Briefcase, Building2, Award, HandCoins } from 'lucide-react';

interface ConcernItem {
  number: string;
  concern: string;
  title: string;
  description: string;
  direction: 'reveal-left' | 'reveal-right';
  icon: typeof Briefcase;
  iconStyle: string;
}

const CONCERNS: ConcernItem[] = [
  {
    number: '01',
    concern: 'Risau anak tiada peluang kerjaya dan masa depan mencabar?',
    title: 'Laluan Kerjaya Cerah Industri Logistik',
    description:
      'Industri logistik dan rantaian bekalan berkembang pesat setiap tahun. Graduan GIS dilatih terus untuk mengisi jawatan penting seperti Logistics Executive, Warehouse Supervisor, dan Planning Supervisor.',
    direction: 'reveal-left',
    icon: Briefcase,
    iconStyle: 'bg-[#FFFBEB] text-[#B45309] border-amber-200',
  },
  {
    number: '02',
    concern: 'Bimbang kolej kekurangan fasiliti dan peralatan latihan?',
    title: 'Fasiliti Lengkap, Moden & Kondusif',
    description:
      'GIS menyediakan kemudahan pembelajaran dan latihan praktikal yang mencukupi serta selesa bagi memastikan pelajar menguasai kemahiran operasi logistik sebenar sebelum melangkah ke alam pekerjaan.',
    direction: 'reveal-right',
    icon: Building2,
    iconStyle: 'bg-blue-50 text-[#1E40AF] border-blue-200',
  },
  {
    number: '03',
    concern: 'Memikirkan kos yuran dan sumber kewangan keluarga?',
    title: 'Pembiayaan PTPTN, PTPK & Biasiswa',
    description:
      'Jangan biarkan faktor kewangan menyekat impian anak anda. Kami menyediakan akses bantuan kewangan menyeluruh termasuk Pinjaman PTPTN, Pinjaman PTPK, serta skim Biasiswa bagi pelajar yang layak.',
    direction: 'reveal-left',
    icon: HandCoins,
    iconStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    number: '04',
    concern: 'Ragui status kelayakan kolej dan pengiktirafan sijil?',
    title: 'Program TVET & Diiktiraf MQA',
    description:
      'GIS adalah Institusi Pengajian Tinggi yang menawarkan program TVET berimpak tinggi serta mendapat kelayakan dan akreditasi rasmi daripada MQA (Agensi Kelayakan Malaysia).',
    direction: 'reveal-right',
    icon: Award,
    iconStyle: 'bg-[#FFFBEB] text-[#B45309] border-amber-200',
  },
];

export function ConcernsSection() {
  return (
    <section id="kebimbangan" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#B45309]">
            Kami Memahami Naluri Ibu Bapa
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0F294A] mt-3 leading-tight">
            Menjawab 4 Kerisauan Utama Anda Tentang Pendidikan Anak Selepas Umur 18 Tahun
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg leading-relaxed">
            Setiap ibu bapa mahukan yang terbaik. Lihat bagaimana ekosistem pendidikan di GIS direka khusus untuk memberi keyakinan penuh kepada keluarga anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CONCERNS.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.number}
                className={`${item.direction} rounded-2xl bg-[#F8FAFC] border border-slate-200 p-7 sm:p-9 hover:bg-white hover:shadow-lg transition-all duration-200`}
              >
                <div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-200/80">
                  <p className="text-xs sm:text-sm font-semibold text-rose-700">
                    {item.concern}
                  </p>
                  <span className="font-heading text-xs font-bold text-slate-400 tabular-nums shrink-0">
                    {item.number}
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${item.iconStyle}`}
                  >
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-[#0F294A]">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
