import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { ApplyModal } from './components/ApplyModal';
import { CampusParallaxSection } from './components/CampusParallaxSection';
import { CareersSection } from './components/CareersSection';
import { ClosingCtaSection } from './components/ClosingCtaSection';
import { ConcernsSection } from './components/ConcernsSection';
import { FinancialAccreditationSection } from './components/FinancialAccreditationSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { SignupView } from './components/SignupView';
import { useAdminAuth, type RegisteredUserProfile } from './hooks/useAdminAuth';
import { useScrollReveal } from './hooks/useScrollReveal';

type ViewMode = 'landing' | 'crm';
type AuthScreen = 'login' | 'signup';

export default function App() {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    window.location.hash === '#crm' || window.location.hash === '#daftar'
      ? 'crm'
      : 'landing',
  );
  const [authScreen, setAuthScreen] = useState<AuthScreen>(() =>
    window.location.hash === '#daftar' ? 'signup' : 'login',
  );
  const [prefilledUsername, setPrefilledUsername] = useState('');
  const [signupSuccessMessage, setSignupSuccessMessage] = useState<string | null>(null);
  const [crmRefreshSignal, setCrmRefreshSignal] = useState(0);

  const {
    isAuthenticated,
    username,
    fullName,
    token,
    isCheckingSession,
    login,
    register,
    logout,
  } = useAdminAuth();

  useScrollReveal(viewMode);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#crm') {
        setViewMode('crm');
        setAuthScreen('login');
      } else if (window.location.hash === '#daftar') {
        setViewMode('crm');
        setAuthScreen('signup');
      } else {
        setViewMode('landing');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openModal = () => setIsApplyModalOpen(true);
  const closeModal = () => setIsApplyModalOpen(false);

  const openCrmView = () => {
    window.location.hash = 'crm';
    setViewMode('crm');
    setAuthScreen('login');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const backToLanding = () => {
    if (window.location.hash === '#crm' || window.location.hash === '#daftar') {
      window.history.replaceState(null, '', window.location.pathname);
    }
    setViewMode('landing');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleRegistrationSuccess = (user: RegisteredUserProfile) => {
    setPrefilledUsername(user.username);
    setSignupSuccessMessage(
      `Pendaftaran akaun untuk ${user.fullName} (@${user.username}) berjaya! Sila masukkan kata laluan anda untuk log masuk ke Dashboard CRM.`,
    );
    setAuthScreen('login');
    window.location.hash = 'crm';
  };

  const renderCrmView = () => {
    if (isCheckingSession) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-[#0F294A]">
            <Loader2 className="w-5 h-5 animate-spin text-[#D97706]" aria-hidden="true" />
            <span>Menyemak sesi pentadbir...</span>
          </div>
        </div>
      );
    }

    // Route Guard: Hanya pengguna sah boleh mengakses AdminDashboard
    if (!isAuthenticated || !token || !username) {
      if (authScreen === 'signup') {
        return (
          <SignupView
            onRegister={register}
            onRegistrationSuccess={handleRegistrationSuccess}
            onSwitchToLogin={() => {
              setAuthScreen('login');
              window.location.hash = 'crm';
            }}
            onBackToLanding={backToLanding}
          />
        );
      }

      return (
        <AdminLogin
          onLogin={login}
          onSwitchToSignup={() => {
            setSignupSuccessMessage(null);
            setAuthScreen('signup');
            window.location.hash = 'daftar';
          }}
          onBackToLanding={backToLanding}
          initialUsername={prefilledUsername}
          successBanner={signupSuccessMessage}
        />
      );
    }

    return (
      <AdminDashboard
        adminUsername={fullName ? `${fullName} (@${username})` : username}
        authToken={token}
        onLogout={() => {
          logout();
          setSignupSuccessMessage(null);
          setAuthScreen('login');
        }}
        onBackToLanding={backToLanding}
        onOpenApplyModal={openModal}
        refreshSignal={crmRefreshSignal}
      />
    );
  };

  return (
    <>
      {viewMode === 'crm' ? (
        renderCrmView()
      ) : (
        <div className="min-h-screen bg-white text-slate-800">
          <Navbar onOpenModal={openModal} />

          <main>
            <HeroSection onOpenModal={openModal} />
            <ConcernsSection />
            <CampusParallaxSection onOpenModal={openModal} />
            <CareersSection onOpenModal={openModal} />
            <FinancialAccreditationSection />
            <ClosingCtaSection onOpenModal={openModal} />
          </main>

          <Footer onOpenCrm={openCrmView} />
        </div>
      )}

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={closeModal}
        onLeadCreated={() => setCrmRefreshSignal((n) => n + 1)}
      />
    </>
  );
}
