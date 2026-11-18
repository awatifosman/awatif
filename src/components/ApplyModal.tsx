import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Coins,
  Loader2,
  Mail,
  Phone,
  Send,
  User,
  X,
} from 'lucide-react';
import {
  NOTIFY_EMAIL,
  useLeadSubmission,
} from '../hooks/useLeadSubmission';
import {
  FUNDING_OPTIONS,
  PROGRAM_OPTIONS,
  type CrmLeadRecord,
  type FundingInterest,
  type ProgramChoice,
} from '../types/crm';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadCreated?: (lead: CrmLeadRecord) => void;
}

export function ApplyModal({ isOpen, onClose, onLeadCreated }: ApplyModalProps) {
  const [nama, setNama] = useState('');
  const [telefon, setTelefon] = useState('');
  const [emel, setEmel] = useState('');
  const [programPilihan, setProgramPilihan] = useState<ProgramChoice>(
    'Diploma Pengurusan Logistik',
  );
  const [minatPembiayaan, setMinatPembiayaan] = useState<FundingInterest>('Belum Pasti');

  const firstInputRef = useRef<HTMLInputElement>(null);
  const { state, submitLead, reset, isLoading } = useLeadSubmission((savedLead) => {
    setNama('');
    setTelefon('');
    setEmel('');
    onLeadCreated?.(savedLead);
  });

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = window.setTimeout(() => {
      firstInputRef.current?.focus();
    }, 60);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitLead({
      nama,
      telefon,
      emel,
      programPilihan,
      minatPembiayaan,
      sumber: 'Landing Page GIS (Modal Daftar Minat)',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gis-modal-title"
    >
      {/* Light-mode blurred backdrop */}
      <div
        onClick={handleClose}
        aria-hidden="true"
        className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white text-left shadow-2xl border border-slate-200">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-[#FFFBEB] to-blue-50/70 px-6 py-5 border-b border-slate-200 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#B45309]">
                Pendaftaran Minat GIS
              </p>
              <h3
                id="gis-modal-title"
                className="font-heading text-xl font-extrabold text-[#0F294A] mt-0.5"
              >
                Sila Isi Maklumat Anda
              </h3>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Tutup borang pendaftaran"
              className="w-10 h-10 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-7 bg-white">
            {state.status === 'success' ? (
              <div className="space-y-5" role="status">
                <div className="rounded-xl p-5 bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3.5">
                  <CheckCircle2
                    className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div className="space-y-1.5">
                    <p className="font-heading font-bold text-base">
                      Pendaftaran Berjaya Direkodkan!
                    </p>
                    <p className="text-sm text-emerald-900 leading-relaxed">
                      Terima kasih, <strong>{state.lead.nama}</strong>. Maklumat anda untuk program{' '}
                      <strong>{state.lead.programPilihan}</strong> telah disimpan dalam sistem CRM GIS.
                      {state.emailNotified
                        ? ` Notifikasi turut dihantar ke ${NOTIFY_EMAIL}.`
                        : ''}
                    </p>
                    <p className="text-xs text-emerald-800 pt-1">
                      Pegawai kaunselor kami akan menghubungi nombor{' '}
                      <strong className="tabular-nums">{state.lead.telefon}</strong> dalam masa terdekat.
                    </p>
                  </div>
                </div>

                {!state.emailNotified && (
                  <div className="rounded-xl p-4 bg-[#FFFBEB] border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span>Mahu hantar salinan terus melalui aplikasi emel anda?</span>
                    <a
                      href={state.mailtoLink}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0F294A] hover:bg-[#1E40AF] text-white font-semibold whitespace-nowrap shrink-0 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                      <span>Hantar Ke Gmail</span>
                    </a>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="button"
                    onClick={reset}
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-[#0F294A] font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Daftar Prospek Lain
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0F294A] hover:bg-[#1E40AF] text-white font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Selesai &amp; Tutup
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                  Lengkapkan maklumat di bawah. Rekod anda akan terus disimpan ke dalam sistem{' '}
                  <strong className="font-semibold text-[#0F294A]">CRM Kaunselor GIS</strong> untuk tindakan susulan segera.
                </p>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* 1. Nama Penuh */}
                  <div>
                    <label
                      htmlFor="gis-full-name"
                      className="block text-sm font-bold text-[#0F294A] mb-1.5"
                    >
                      1. Nama Penuh <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                        <User className="w-4 h-4" aria-hidden="true" />
                      </span>
                      <input
                        ref={firstInputRef}
                        id="gis-full-name"
                        name="nama"
                        type="text"
                        required
                        disabled={isLoading}
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        placeholder="Masukkan nama penuh ibu bapa / pelajar"
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] disabled:opacity-60 transition"
                      />
                    </div>
                  </div>

                  {/* 2. No. Telefon */}
                  <div>
                    <label
                      htmlFor="gis-phone"
                      className="block text-sm font-bold text-[#0F294A] mb-1.5"
                    >
                      2. No. Telefon <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                        <Phone className="w-4 h-4" aria-hidden="true" />
                      </span>
                      <input
                        id="gis-phone"
                        name="telefon"
                        type="tel"
                        required
                        disabled={isLoading}
                        value={telefon}
                        onChange={(e) => setTelefon(e.target.value)}
                        placeholder="Contoh: 012-3456789"
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] disabled:opacity-60 transition"
                      />
                    </div>
                  </div>

                  {/* 3. Alamat Emel */}
                  <div>
                    <label
                      htmlFor="gis-email"
                      className="block text-sm font-bold text-[#0F294A] mb-1.5"
                    >
                      3. Alamat Emel <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                        <Mail className="w-4 h-4" aria-hidden="true" />
                      </span>
                      <input
                        id="gis-email"
                        name="emel"
                        type="email"
                        required
                        disabled={isLoading}
                        value={emel}
                        onChange={(e) => setEmel(e.target.value)}
                        placeholder="Contoh: nama@gmail.com"
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] disabled:opacity-60 transition"
                      />
                    </div>
                  </div>

                  {/* 4 & 5. Program Pilihan & Minat Pembiayaan (untuk CRM) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="gis-program"
                        className="block text-xs font-bold text-[#0F294A] mb-1.5"
                      >
                        4. Program Pilihan
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                          <BookOpen className="w-4 h-4" aria-hidden="true" />
                        </span>
                        <select
                          id="gis-program"
                          name="programPilihan"
                          disabled={isLoading}
                          value={programPilihan}
                          onChange={(e) =>
                            setProgramPilihan(e.target.value as ProgramChoice)
                          }
                          className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] disabled:opacity-60 transition"
                        >
                          {PROGRAM_OPTIONS.map((prog) => (
                            <option key={prog} value={prog}>
                              {prog}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="gis-funding"
                        className="block text-xs font-bold text-[#0F294A] mb-1.5"
                      >
                        5. Minat Pembiayaan
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                          <Coins className="w-4 h-4" aria-hidden="true" />
                        </span>
                        <select
                          id="gis-funding"
                          name="minatPembiayaan"
                          disabled={isLoading}
                          value={minatPembiayaan}
                          onChange={(e) =>
                            setMinatPembiayaan(e.target.value as FundingInterest)
                          }
                          className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] disabled:opacity-60 transition"
                        >
                          {FUNDING_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Error State Feedback */}
                  {state.status === 'error' && (
                    <div
                      role="alert"
                      className="rounded-xl p-3.5 text-sm bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5"
                    >
                      <AlertCircle
                        className="w-4 h-4 text-rose-600 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{state.message}</span>
                    </div>
                  )}

                  {/* Submit Button with Loading State */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full min-h-[48px] bg-[#D97706] hover:bg-[#B45309] disabled:opacity-75 disabled:cursor-not-allowed text-white font-bold text-base py-3.5 px-6 rounded-xl shadow-sm transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                          <span>Menyimpan Ke CRM...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" aria-hidden="true" />
                          <span>Submit Permohonan</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
