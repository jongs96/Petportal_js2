// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Axios 설정 import (전역 설정)
import './utils/axiosConfig';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { UIProvider, useUI } from './contexts/UIContext.jsx';
import { CartProvider } from './contexts/CartContext';
import { CommunityProvider } from './contexts/CommunityContext';
import AdminAuthProvider from './providers/AdminAuthProvider'; // New
import AdminProtectedRoute from './providers/AdminProtectedRoute'; // New
import { MaintenanceProvider, useMaintenance } from './context/MaintenanceContext';
import { SearchProvider } from './contexts/SearchContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Common Components
import LoadingOverlay from './components/common/LoadingOverlay';
import Spinner from './components/ui/Spinner';
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './providers/ProtectedRoute';

// Profile Components (모달)
import UserProfile from './components/profile/UserProfile';
import PetProfile from './components/profile/PetProfile';
import AddPetForm from './components/profile/AddPetForm';

// Service Pages (직접 import)
import GroomingPage from './pages/GroomingPage';
import HospitalPage from './pages/HospitalPage';
import HotelPage from './pages/HotelPage';
import CafePage from './pages/CafePage';

// --- Lazy Loaded Page Components ---
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const MainPage = lazy(() => import('./MainPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const SignupPage = lazy(() => import('./pages/SignupPage.jsx'));
const CustomerServicePage = lazy(() => import('./pages/CustomerServicePage.jsx'));
import CommunityPage from './pages/CommunityPage.jsx'; // Direct import for debugging
const PostEditor = lazy(() => import('./pages/PostEditor.jsx'));
const PostDetail = lazy(() => import('./pages/PostDetail.jsx'));
const SupportPage = lazy(() => import('./pages/SupportPage.jsx')); // 고객센터 페이지
const PensionPage = lazy(() => import('./pages/PensionPage.jsx'));
const PensionDetailPage = lazy(() => import('./pages/PensionDetailPage.jsx'));
const ProductsPage = lazy(() => import('./pages/ProductsPage.jsx'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage.jsx'));
const MapTestPage = lazy(() => import('./pages/MapTestPage.jsx'));
const CartPage = lazy(() => import('./pages/CartPage.jsx'));
const CafeDetailPageComponent = lazy(() => import('./pages/CafeDetailPage.jsx'));
const PetSuppliesPage = lazy(() => import('./pages/PetSuppliesPage.jsx'));
const PetSupplyDetailPage = lazy(() => import('./pages/PetSupplyDetailPage.jsx'));

// Admin Pages (Lazy Loaded)
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage.jsx')); // New
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage.jsx')); // New

// Maintenance Page
const MaintenancePage = lazy(() => import('./pages/MaintenancePage.jsx'));

// App Content Component (useLocation을 사용하기 위해 Router 내부에 있어야 함)
function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { isLoading } = useUI();
  const { isMaintenanceMode } = useMaintenance();

  // 관리자 페이지가 아닌 경우에만 점검 모드 확인
  const isAdminRoute = location.pathname.startsWith('/admin');

  // 점검 중이고 관리자 페이지가 아닌 경우 점검 페이지 표시
  if (isMaintenanceMode && !isAdminRoute) {
    return (
      <div className="App main-app-container">
        <Suspense fallback={<div className="suspense-fallback"><Spinner /></div>}>
          <MaintenancePage />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="App main-app-container">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <LoadingOverlay isLoading={isLoading} />
      <Header />
      
      <main>
        <ScrollToTop />
        <Suspense fallback={<div className="suspense-fallback"><Spinner /></div>}>
          <Routes>
            {/* 메인 페이지 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/main" element={<MainPage />} />
            
            {/* 인증 페이지 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* 관리자 페이지 (New) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/*"
              element={
                <AdminProtectedRoute>
                  <AdminDashboardPage />
                </AdminProtectedRoute>
              }
            />
            
            {/* 서비스 페이지들 */}
            <Route path="/grooming" element={<GroomingPage />} />
            <Route path="/hospital" element={<HospitalPage />} />
            <Route path="/hotel" element={<HotelPage />} />
            <Route path="/cafe" element={<CafePage />} />
            <Route path="/cafe/:cafeId" element={<CafeDetailPageComponent />} />
            
            {/* 고객센터 페이지 */}
            <Route path="/customerservice" element={<CustomerServicePage />} />
            <Route path="/about" element={<CustomerServicePage />} />
            <Route path="/notice" element={<CustomerServicePage />} />
            <Route path="/faq" element={<CustomerServicePage />} />
            <Route path="/support" element={<CustomerServicePage />} />
            <Route path="/inquiry" element={<CustomerServicePage />} />
            <Route path="/terms" element={<CustomerServicePage />} />
            <Route path="/privacy" element={<CustomerServicePage />} />
            <Route path="/youth" element={<CustomerServicePage />} />
            <Route path="/policy" element={<CustomerServicePage />} />
            
            {/* 커뮤니티 페이지 */}
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/:boardKey/new" element={<PostEditor />} />
            <Route path="/community/edit/:postId" element={<PostEditor />} />
            <Route path="/community/posts/:postId" element={<PostDetail />} />
            <Route path="/community/:boardKey" element={<CommunityPage />} />

            {/* 고객센터 페이지 */}
            <Route path="/support" element={<SupportPage />} />
            <Route path="/support/:boardKey" element={<SupportPage />} />

            {/* 펜션/숙박 페이지 */}
            <Route path="/pet-friendly-lodging" element={<PensionPage />} />
            <Route path="/pet-friendly-lodging/:pensionId" element={<PensionDetailPage />} />
            
            {/* 상품 페이지 */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:productId" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            
            {/* 반려용품 페이지 */}
            <Route path="/pet-supplies" element={<PetSuppliesPage />} />
            <Route path="/pet-supplies/category/:category" element={<PetSuppliesPage />} />
            <Route path="/pet-supplies/:id" element={<PetSupplyDetailPage />} />
            
            {/* 기타 페이지들 */}
            <Route path="/care" element={<Navigate to="/grooming" replace />} />
            <Route path="/bulletin" element={<Navigate to="/pet-friendly-lodging" replace />} />
            <Route path="/map-test" element={<MapTestPage />} />
            
            {/* 보호된 라우트 */}
            <Route
              path="/members/*"
              element={
                <ProtectedRoute>
                  <Navigate to="/" replace />
                </ProtectedRoute>
              }
            />
            
            {/* 404 처리 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      
      <Footer />
      
      {/* 프로필 관련 모달들 */}
      <UserProfile />
      <PetProfile />
      <AddPetForm />
    </div>
  );
}

// Main App Component
function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <UIProvider>
          <CartProvider>
            <CommunityProvider>
              <AdminAuthProvider>
                <MaintenanceProvider> {/* New */}
                  <SearchProvider>
                    <AppContent />
                  </SearchProvider>
                </MaintenanceProvider> {/* New */}
              </AdminAuthProvider>
            </CommunityProvider>
          </CartProvider>
        </UIProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;