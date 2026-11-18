import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  AtSign,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  User,
  UserPlus,
} from 'lucide-react';
import type { RegisterPayload, RegisteredUserProfile } from '../hooks/useAdminAuth';

interface SignupViewProps {
  onRegister: (
    payload: RegisterPayload,
  ) => Promise<{ ok: boolean; user?: RegisteredUserProfile; error?: string }>;
  onRegistrationSuccess: (user: RegisteredUserProfile) => void;
  onSwitchToLogin: () => void;
  onBackToLanding: () => void;
}

export function SignupView({
  onRegister,
  onRegistrationSuccess,
  onSwitchToLogin,
  onBackToLanding,
}: SignupViewProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateClientForm = (): string | null => {
    const cleanName = fullName.trim();
    const cleanEmail = email.trim();
    const cleanUsername = username.trim();

    if (!cleanName || !cleanEmail || !cleanUsername || !password || !confirmPassword) {
      return 'Sila lengkapkan semua medan pendaftaran yang diperlukan.';
    }
    if (cleanName.length < 2) {
      return 'Nama penuh mestilah sekurang-kurangnya 2 aksara.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return 'Sila masukkan format alamat emel yang sah.';
    }
    if (!/^[a-zA-Z0-9._-]{3,32}$/.test(cleanUsername)) {
      return 'Username mestilah 3–32 aksara (huruf, nombor, titik, atau garis bawah tanpa ruang).';
    }
    if (password.length < 6) {
      return 'Kata laluan mestilah sekurang-kurangnya 6 aksara.';
    }
    if (password !== confirmPassword) {
      return 'Kata laluan dan pengesahan kata laluan tidak sepadan.';
    }
    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const validationError = validateClientForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    const result = await onRegister({
      fullName,
      email,
      username,
      password,
      confirmPassword,
    });
    setIsSubmitting(false);

    if (!result.ok || !result.user) {
      setError(result.error || 'Pendaftaran gagal. Sila semak maklumat anda.');
      return;
    }

    onRegistrationSuccess(result.user);
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

      {/* Centered Sign Up Card */}
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
                  Daftar Akaun CRM Baharu
                </h1>
              </div>
            </div>

            {/* Auth Mode Switcher */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-white/80 border border-slate-200 rounded-xl mt-3">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-[#0F294A] transition-colors cursor-pointer"
              >
                Log Masuk
              </button>
              <button
                type="button"
                aria-current="page"
                className="py-2 text-xs font-bold rounded-lg bg-[#0F294A] text-white shadow-sm cursor-default"
              >
                Daftar Akaun
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-7 space-y-4">
            {/* Nama Penuh */}
            <div>
              <label
                htmlFor="signup-fullname"
                className="block text-sm font-bold text-[#0F294A] mb-1.5"
              >
                Nama Penuh <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" aria-hidden="true" />
                </span>
                <input
                  id="signup-fullname"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  disabled={isSubmitting}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Nurul Aini binti Ahmad"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] disabled:opacity-60 transition"
                />
              </div>
            </div>

            {/* Emel */}
            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-bold text-[#0F294A] mb-1.5"
              >
                Alamat Emel <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                </span>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: kaunselor@gis.edu.my"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] disabled:opacity-60 transition"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="signup-username"
                className="block text-sm font-bold text-[#0F294A] mb-1.5"
              >
                Username <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <AtSign className="w-4 h-4" aria-hidden="true" />
                </span>
                <input
                  id="signup-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  disabled={isSubmitting}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: nurul_kaunselor"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] disabled:opacity-60 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="signup-password"
                className="block text-sm font-bold text-[#0F294A] mb-1.5"
              >
                Kata Laluan (Minimum 6 aksara) <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" aria-hidden="true" />
                </span>
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  disabled={isSubmitting}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Cipta kata laluan"
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="signup-confirm-password"
                className="block text-sm font-bold text-[#0F294A] mb-1.5"
              >
                Sahkan Kata Laluan <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" aria-hidden="true" />
                </span>
                <input
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  disabled={isSubmitting}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Masukkan semula kata laluan"
                  className="w-full h-11 pl-10 pr-11 rounded-xl bg-[#F8FAFC] border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] disabled:opacity-60 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword
                      ? 'Sembunyikan pengesahan kata laluan'
                      : 'Tunjukkan pengesahan kata laluan'
                  }
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Feedback */}
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
              className="w-full min-h-[48px] bg-[#D97706] hover:bg-[#B45309] disabled:opacity-70 text-white font-bold text-sm sm:text-base py-3 px-6 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Mendaftarkan Akaun...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" aria-hidden="true" />
                  <span>Daftar Akaun Sekarang</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-600 pt-1">
              Sudah mempunyai akaun?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-bold text-[#0F294A] hover:text-[#1E40AF] hover:underline cursor-pointer"
              >
                Log Masuk di sini
              </button>
            </p>
          </form>
        </div>
      </div>

      <p className="text-center text-xs text-slate-500">
        Pendaftaran khusus untuk kaunselor dan kakitangan pengurusan GIS.
      </p>
    </div>
  );
}
