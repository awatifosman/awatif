import { useState } from 'react';
import { ApplyModal } from './components/ApplyModal';
import { CampusParallaxSection } from './components/CampusParallaxSection';
import { CareersSection } from './components/CareersSection';
import { ClosingCtaSection } from './components/ClosingCtaSection';
import { ConcernsSection } from './components/ConcernsSection';
import { FinancialAccreditationSection } from './components/FinancialAccreditationSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { useScrollReveal } from './hooks/useScrollReveal';

export default function App() {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useScrollReveal();

  const openModal = () => setIsApplyModalOpen(true);
  const closeModal = () => setIsApplyModalOpen(false);

  return (
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

      <Footer />

      <ApplyModal isOpen={isApplyModalOpen} onClose={closeModal} />
    </div>
  );
}
