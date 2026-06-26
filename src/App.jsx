import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Qualifications from './components/Qualifications';
import Awards from './components/Awards';
import Patents from './components/Patents';
import Research from './components/Research';
import Publications from './components/Publications';
import Workshops from './components/Workshops';
import SectionNavigator from './components/sections/SectionNavigator';
import AllActivities from './components/sections/AllActivities';
import Gallery from './components/sections/Gallery';
import CertificatesSection from './components/sections/CertificatesSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/admin/AdminPanel';
import UniversalAddButton from './components/admin/UniversalAddModal';
import Toast from './components/ui/Toast';
import { ActivitiesProvider } from './context/ActivitiesContext';

function App() {
  return (
    <ActivitiesProvider>
      <Navbar />
      <AdminPanel />
      <UniversalAddButton />
      <Toast />
      <main>
        <Hero />
        <About />
        <Qualifications />
        <Awards />
        <Patents />
        <Research />
        <Publications />
        <Workshops />
        <SectionNavigator />
        <AllActivities />
        <Gallery />
        <CertificatesSection />
        <Contact />
      </main>
      <Footer />
    </ActivitiesProvider>
  );
}

export default App;
