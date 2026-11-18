import { useState } from 'react';
import { ChevronRight, LineChart, Truck, Warehouse } from 'lucide-react';

interface CareersSectionProps {
  onOpenModal: () => void;
}

const CAREER_IMAGE_URL = '/src/assets/images/career_logistics_ops_1794983894503.jpg';

const CAREERS = [
  {
    code: '01',
    category: 'Pengurusan & Operasi',
    sector: 'Sektor Pelabuhan, Kurier & Multinasional',
    title: 'Logistics Executive',
    description:
      'Menyelaras penghantaran kargo domestik dan antarabangsa, pengurusan dokumentasi kastam, serta memastikan aliran rantaian bekalan syarikat berjalan lancar.',
    icon: Truck,
    accent: 'text-[#B45309] bg-[#FFFBEB] border-amber-200',
  },
  {
    code: '02',
    category: 'Penyeliaan Gudang',
    sector: 'Pusat Pengedaran & Hab E-Dagang',
    title: 'Warehouse Supervisor',
    description:
      'Mengetuai operasi gudang berteknologi tinggi, mengawal selia sistem inventori stok, keselamatan penyimpanan, dan pengagihan barangan berskala besar.',
    icon: Warehouse,
    accent: 'text-[#1E40AF] bg-blue-50 border-blue-200',
  },
  {
    code: '03',
    category: 'Perancangan Strategik',
    sector: 'Kilang Pembuatan & Rantaian Bekalan',
    title: 'Planning Supervisor',
    description:
      'Merancang jadual bekalan bahan mentah, menganalisis permintaan pasaran, dan mengoptimumkan kos pengeluaran bagi syarikat pembuatan bertaraf global.',
    icon: LineChart,
    accent: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
];

export function CareersSection({ onOpenModal }: CareersSectionProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="kerjaya" className="py-20 sm:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 reveal-up">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1E40AF]">
              Jaminan Masa Depan Graduan
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0F294A] mt-3">
              Peluang Kerjaya Menanti Anak Anda Selepas Tamat Pengajian
            </h2>
            <p className="text-slate-600 mt-3 text-base leading-relaxed">
              Sektor perdagangan dan e-dagang memerlukan pakar logistik bertauliah setiap tahun. Antara kerjaya utama graduan GIS termasuklah:
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenModal}
            className="self-start md:self-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm shadow-sm transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F294A]"
          >
            <span>Semak Kelayakan Anak</span>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Asymmetric 2-Column Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: High-Impact Operational Showcase */}
          <div className="lg:col-span-5 reveal-left flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200">
            <div className="relative flex-1 min-h-[280px] lg:min-h-0 overflow-hidden bg-slate-100">
              {!imgError ? (
                <img
                  src={CAREER_IMAGE_URL}
                  alt="Operasi pusat logistik moden dan sistem pengurusan gudang berteknologi"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="w-full h-full bg-gradient-to-br from-slate-100 via-white to-[#FFFBEB] flex items-center justify-center p-8"
                >
                  <Truck className="w-14 h-14 text-[#0F294A]/30" />
                </div>
              )}
            </div>

            <div className="p-7 border-t border-slate-200 bg-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#B45309]">
                Permintaan Tinggi Industri
              </p>
              <h3 className="font-heading text-xl font-bold text-[#0F294A] mt-1.5">
                Kemahiran Praktikal Bersedia Untuk Dunia Pekerjaan Sebenar
              </h3>
              <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                Pelajar GIS didedahkan dengan pengurusan inventori digital, koordinasi pengangkutan kargo, dan perancangan rantaian bekalan yang diiktiraf majikan.
              </p>
            </div>
          </div>

          {/* Right Column: 3 Key Career Tracks */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-5">
            {CAREERS.map((career) => {
              const Icon = career.icon;
              return (
                <article
                  key={career.code}
                  className="reveal-right flex-1 rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-start gap-5"
                >
                  <div
                    className={`w-13 h-13 rounded-xl border flex items-center justify-center shrink-0 ${career.accent}`}
                  >
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 font-medium">
                      <span className="font-semibold text-[#0F294A]">{career.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{career.sector}</span>
                    </div>

                    <h3 className="font-heading text-xl font-extrabold text-[#0F294A] mt-1.5">
                      {career.title}
                    </h3>

                    <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
                      {career.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
