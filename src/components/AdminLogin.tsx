import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  ShieldCheck,
  User,
} from 'lucide-react';

interface AdminLoginProps {
  onLogin: (
    username: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  onSwitchToSignup: () => void;
  onBackToLanding: () => void;
  initialUsername?: string;
  successBanner?: string | null;
}

export function AdminLogin({
  onLogin,
  onSwitchToSignup,
  onBackToLanding,
  initialUsername = '',
  successBanner = null,
}: AdminLoginProps) {
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Sila masukkan nama pengguna (username) dan kata laluan.');
      return;
    }

    setIsSubmitting(true);
    const result = await onLogin(username, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error || 'Pengesahan gagal. Sila semak kredensial anda.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-6">
      {/* Top Back Bar */}
      <div className="max-w-7xl w-full mx-auto">
        <button
          type="button"
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0F294A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Kembali ke Halaman Utama</span>
        </button>
      </div>

      {/* Centered Login Card */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#FFFBEB] to-blue-50/70 px-6 py-5 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-10 h-10 rounded-xl bg-[#0F294A] text-amber-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#B45309]">
                  GIS Institusi Pengajian Tinggi
                </p>
                <h1 className="font-heading text-xl font-extrabold text-[#0F294A]">
                  Log Masuk Portal Admin CRM
                </h1>
              </div>
            </div>

            {/* Auth Mode Switcher */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-white/80 border border-slate-200 rounded-xl mt-3">
              <button
                type="button"
                aria-current="page"
                className="py-2 text-xs font-bold rounded-lg bg-[#0F294A] text-white shadow-sm cursor-default"
              >
                Log Masuk
              </button>
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-[#0F294A] transition-colors cursor-pointer"
              >
                Daftar Akaun
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-7 space-y-4">
            {/* Registration Success Banner */}
            {successBanner && (
              <div
                role="status"
                className="rounded-xl p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-2.5"
              >
                <CheckCircle2
                  className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{successBanner}</span>
              </div>
            )}

            {/* Username */}
            <div>
              <label
                htmlFor="admin-username"
                className="block text-sm font-bold text-[#0F294A] mb-1.5"
              >
                Nama Pengguna (Username) atau Emel
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" aria-hidden="true" />
                </span>
                <input
                  id="admin-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  disabled={isSubmitting}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username atau emel"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] disabled:opacity-60 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-bold text-[#0F294A] mb-1.5"
              >
                Kata Laluan (Password)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" aria-hidden="true" />
                </span>
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata laluan"
                  className="w-full h-11 pl-10 pr-11 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] disabled:opacity-60 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Sembunyikan kata laluan' : 'Tunjukkan kata laluan'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div
                role="alert"
                className="rounded-xl p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5"
              >
                <AlertCircle
                  className="w-4 h-4 text-rose-600 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[48px] bg-[#0F294A] hover:bg-[#1E40AF] disabled:opacity-70 text-white font-bold text-sm sm:text-base py-3 px-6 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Mengesahkan...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" aria-hidden="true" />
                  <span>Log Masuk ke Dashboard CRM</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-600 pt-1">
              Belum mempunyai akaun kaunselor?{' '}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="font-bold text-[#B45309] hover:text-[#D97706] hover:underline cursor-pointer"
              >
                Daftar Akaun Baharu
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-slate-500">
        Akses terhad kepada pegawai kaunselor &amp; pentadbir GIS yang dibenarkan.
      </p>
    </div>
  );
}
