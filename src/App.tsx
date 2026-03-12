import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import YusraAssistant from './components/YusraAssistant';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

const Home           = lazy(() => import('./pages/Home'));
const Services       = lazy(() => import('./pages/Services'));
const Pricing        = lazy(() => import('./pages/Pricing'));
const Gallery        = lazy(() => import('./pages/Gallery'));
const Booking        = lazy(() => import('./pages/Booking'));
const Contact        = lazy(() => import('./pages/Contact'));
const About          = lazy(() => import('./pages/About'));
const FAQ            = lazy(() => import('./pages/FAQ'));
const Legal          = lazy(() => import('./pages/Legal'));
const PrivacyPolicy  = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const RefundPolicy   = lazy(() => import('./pages/RefundPolicy'));
const AdminLogin     = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function PageSpinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="neon-spinner" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Preloader />
      <div className="flex flex-col min-h-screen" style={{ background: '#050508' }}>
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<PageSpinner />}>
            <Routes>
              <Route path="/"               element={<Home />} />
              <Route path="/services"       element={<Services />} />
              <Route path="/pricing"        element={<Pricing />} />
              <Route path="/gallery"        element={<Gallery />} />
              <Route path="/booking"        element={<Booking />} />
              <Route path="/contact"        element={<Contact />} />
              <Route path="/about"          element={<About />} />
              <Route path="/faq"            element={<FAQ />} />
              <Route path="/legal"          element={<Legal />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms"          element={<TermsOfService />} />
              <Route path="/refund-policy"  element={<RefundPolicy />} />
              <Route path="/admin/login"    element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="*"              element={<Home />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <YusraAssistant />
      </div>
    </ErrorBoundary>
  );
}
