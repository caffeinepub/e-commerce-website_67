import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturedCategories from '../components/FeaturedCategories';
import FeaturedProducts from '../components/FeaturedProducts';
import Footer from '../components/Footer';
import ProfileSetupModal from '../components/ProfileSetupModal';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const showProfileSetup = !!identity && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedCategories />
        <FeaturedProducts />
      </main>
      <Footer />
      <ProfileSetupModal open={showProfileSetup} />
    </div>
  );
}
