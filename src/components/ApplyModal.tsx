import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CheckCircle2, Mail, Phone, Send, User, X, AlertCircle } from 'lucide-react';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TARGET_EMAIL = 'awatifosman86@gmail.com';

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; nama: string; telefon: string }
  | { status: 'error'; message: string }
  | { status: 'fallback'; mailtoLink: string };

export function ApplyModal({ isOpen, onClose }: ApplyModalProps) {
  const [nama, setNama] = useState('');
  const [telefon, setTelefon] = useState('');
  const [emel, setEmel] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });
  const firstInputRef = useRef<HTMLInputElement>(null);

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

  const buildMailtoLink = (cleanNama: string, cleanTelefon: string, cleanEmel: string) => {
    const subject = encodeURIComponent(`Permohonan Baru GIS (Logistik & TVET) - ${cleanNama}`);
    const body = encodeURIComponent(
      `Salam Puan Awatif,\n\nBerikut adalah maklumat pendaftaran minat baru daripada laman web GIS:\n\n` +
        `1. Nama Penuh: ${cleanNama}\n` +
        `2. No. Telefon: ${cleanTelefon}\n` +
        `3. Alamat Emel: ${cleanEmel}\n\n` +
        `Mohon hubungi untuk konsultasi pengajian Logistik, TVET & bantuan kewangan.`,
    );
    return `mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanNama = nama.trim();
    const cleanTelefon = telefon.trim();
    const cleanEmel = emel.trim();

    if (!cleanNama || !cleanTelefon || !cleanEmel) {
      setSubmitState({
        status: 'error',
        message: 'Sila lengkapkan ketiga-tiga maklumat sebelum menghantar.',
      });
      return;
    }

    const digitsOnly = cleanTelefon.replace(/\D/g, '');
    if (digitsOnly.length < 8) {
      setSubmitState({
        status: 'error',
        message: 'Sila masukkan nombor telefon yang sah (sekurang-kurangnya 8 digit).',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmel)) {
      setSubmitState({
        status: 'error',
        message: 'Sila masukkan format alamat emel yang sah.',
      });
      return;
    }

    setSubmitState({ status: 'submitting' });
    const mailtoLink = buildMailtoLink(cleanNama, cleanTelefon, cleanEmel);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `Permohonan Baru GIS - ${cleanNama}`,
          _template: 'table',
          Nama: cleanNama,
          'No. Telefon': cleanTelefon,
          Email: cleanEmel,
          Sumber: 'Landing Page GIS (Light Mode Cinematic)',
        }),
      });

      const result = await response.json();

      if (response.ok && (result.success === 'true' || result.success === true)) {
        setSubmitState({
          status: 'success',
          nama: cleanNama,
          telefon: cleanTelefon,
        });
        setNama('');
        setTelefon('');
        setEmel('');
      } else {
        setSubmitState({ status: 'fallback', mailtoLink });
      }
    } catch {
      setSubmitState({ status: 'fallback', mailtoLink });
    }
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
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white text-left shadow-2xl border border-slate-200">
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
              onClick={onClose}
              aria-label="Tutup borang pendaftaran"
              className="w-10 h-10 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-7 bg-white">
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              Lengkapkan <strong className="font-semibold text-[#0F294A]">3 maklumat</strong> di bawah. Permohonan anda akan terus dihantar kepada pegawai kami untuk tindakan segera.
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
                    name="Nama"
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Masukkan nama penuh anda"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] transition"
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
                    name="No_Telefon"
                    type="tel"
                    required
                    value={telefon}
                    onChange={(e) => setTelefon(e.target.value)}
                    placeholder="Contoh: 012-3456789"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] transition"
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
                    name="Email"
                    type="email"
                    required
                    value={emel}
                    onChange={(e) => setEmel(e.target.value)}
                    placeholder="Contoh: nama@gmail.com"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitState.status === 'submitting'}
                  className="w-full min-h-[48px] bg-[#D97706] hover:bg-[#B45309] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-base py-3.5 px-6 rounded-xl shadow-sm transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {submitState.status === 'submitting'
                      ? 'Sedang Menghantar...'
                      : 'Submit Permohonan'}
                  </span>
                </button>
              </div>
            </form>

            {/* Feedback States */}
            {submitState.status === 'error' && (
              <div
                role="alert"
                className="mt-5 rounded-xl p-4 text-sm bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{submitState.message}</span>
              </div>
            )}

            {submitState.status === 'success' && (
              <div
                role="status"
                className="mt-5 rounded-xl p-4 text-sm bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3"
              >
                <CheckCircle2
                  className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-bold">Terima kasih, {submitState.nama}.</p>
                  <p className="text-emerald-800 mt-1 leading-relaxed">
                    Maklumat anda telah dihantar terus ke{' '}
                    <strong className="font-semibold">{TARGET_EMAIL}</strong>. Kami akan menghubungi anda di nombor{' '}
                    <strong className="font-semibold">{submitState.telefon}</strong> sebentar lagi.
                  </p>
                </div>
              </div>
            )}

            {submitState.status === 'fallback' && (
              <div
                role="status"
                className="mt-5 rounded-xl p-4 text-sm bg-[#FFFBEB] border border-amber-200 text-amber-950 space-y-2.5"
              >
                <p className="font-bold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#B45309]" aria-hidden="true" />
                  <span>Sahkan Penghantaran Melalui Emel</span>
                </p>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Klik butang di bawah untuk menghantar maklumat anda terus ke{' '}
                  <strong>{TARGET_EMAIL}</strong> melalui aplikasi emel anda:
                </p>
                <a
                  href={submitState.mailtoLink}
                  className="inline-flex items-center justify-center gap-2 w-full min-h-[42px] bg-[#0F294A] hover:bg-[#1E40AF] text-white font-bold text-xs py-2.5 px-4 rounded-lg transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                  <span>Hantar Terus Ke Gmail Sekarang</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
