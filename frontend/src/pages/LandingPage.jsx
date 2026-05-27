import HeroSection from "../components/landing/HeroSection.jsx";
import FeatureCards from "../components/landing/FeatureCards.jsx";
import HowItWorks from "../components/landing/HowItWorks.jsx";
import PricingCard from "../components/landing/PricingCard.jsx";

export default function LandingPage({ onNavigate }) {
  return (
    <main className="page">
      <HeroSection onNavigate={onNavigate} />
      <FeatureCards />
      <HowItWorks />
      <PricingCard onNavigate={onNavigate} />
    </main>
  );
}
