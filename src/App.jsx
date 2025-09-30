// src/App.jsx

// React와 관련된 주요 라이브러리들을 가져옵니다.
import React, { Suspense, lazy } from 'react'; // Suspense와 lazy는 코드 스플리팅(Code Splitting)을 위해 사용됩니다.
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; // 페이지 라우팅(경로 설정)을 위한 라이브러리입니다.
import { ToastContainer } from 'react-toastify'; // 사용자에게 알림 메시지를 보여주기 위한 라이브러리입니다.
import 'react-toastify/dist/ReactToastify.css'; // 알림 메시지 스타일을 적용합니다.

// Axios HTTP 클라이언트의 전역 설정을 가져옵니다.
// 이 파일을 통해 API 요청 시 기본 URL, 헤더 등을 설정할 수 있습니다.
import './utils/axiosConfig';

// --- Context Providers ---
// Context는 React 컴포넌트 트리 전체에 걸쳐 전역적인 데이터를 공유할 수 있게 해주는 기능입니다.
// 각 Provider는 특정 데이터나 상태(예: 사용자 인증 정보, UI 상태)를 하위 컴포넌트들에게 제공합니다.
import { AuthProvider } from './context/AuthContext'; // 사용자 인증 관련 상태(로그인 여부, 사용자 정보)를 관리합니다.
import { ProfileProvider } from './context/ProfileContext'; // 사용자 프로필(내 정보, 펫 정보) 관련 상태를 관리합니다.
import { UIProvider } from './contexts/UIContext.jsx'; // UI 관련 상태(로딩 상태, 모달 열림/닫힘 등)를 관리합니다.
import { CartProvider } from './contexts/CartContext'; // 장바구니 관련 상태를 관리합니다.
import { CommunityProvider } from './contexts/CommunityContext'; // 커뮤니티(게시글, 댓글) 관련 상태를 관리합니다.
import AdminAuthProvider from './providers/AdminAuthProvider'; // 관리자 인증 상태를 관리합니다.
import AdminProtectedRoute from './providers/AdminProtectedRoute'; // 관리자 전용 페이지 접근을 제어하는 라우트입니다.
import { MaintenanceProvider, useMaintenance } from './context/MaintenanceContext'; // 서비스 점검 상태를 관리합니다.
import { SearchProvider } from './contexts/SearchContext'; // 검색 관련 상태를 관리합니다.

// --- Layout Components ---
// 앱의 전체적인 레이아웃(구조)을 담당하는 컴포넌트들입니다.
import Layout from './components/layout/Layout'; // Header, Footer, Outlet 등을 포함하는 메인 레이아웃

// --- Common Components ---
// 여러 페이지에서 공통적으로 사용되는 재사용 가능한 컴포넌트들입니다.
import Spinner from './components/ui/Spinner'; // 로딩 상태를 시각적으로 보여주는 스피너(빙글빙글 돌아가는 아이콘)입니다.
import ProtectedRoute from './providers/ProtectedRoute'; // 로그인이 필요한 페이지에 접근을 제어하는 보호된 라우트입니다.

// --- Profile Components (Modals) ---
// 사용자 프로필과 관련된 모달(팝업) 컴포넌트들입니다.

// --- Service Pages (Direct Import) ---
// 코드 스플리팅을 적용하지 않고 직접 가져오는 페이지 컴포넌트들입니다.
// 사용자가 자주 방문하거나 첫 화면에 바로 보여야 하는 중요한 페이지는 직접 가져오는 것이 유리할 수 있습니다.
import GroomingPage from './pages/GroomingPage';
import HospitalPage from './pages/HospitalPage';
import HotelPage from './pages/HotelPage';
import CafePage from './pages/CafePage';

// --- Lazy Loaded Page Components ---
// `lazy` 함수를 사용하여 컴포넌트를 동적으로(필요할 때) 불러옵니다.
// 이를 "코드 스플리팅"이라 하며, 앱의 초기 로딩 속도를 향상시키는 데 도움이 됩니다.
// 각 페이지 컴포넌트는 사용자가 해당 페이지에 처음 접근할 때 다운로드됩니다.
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const MainPage = lazy(() => import('./MainPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const SignupPage = lazy(() => import('./pages/SignupPage.jsx'));
const CustomerServicePage = lazy(() => import('./pages/CustomerServicePage.jsx'));
import CommunityPage from './pages/CommunityPage.jsx'; // 디버깅을 위해 직접 import (나중에 lazy로 전환 가능)
const PostEditor = lazy(() => import('./pages/PostEditor.jsx'));
const PostDetail = lazy(() => import('./pages/PostDetail.jsx'));
const SupportPage = lazy(() => import('./pages/SupportPage.jsx'));
const PensionPage = lazy(() => import('./pages/PensionPage.jsx'));
const PensionDetailPage = lazy(() => import('./pages/PensionDetailPage.jsx'));
const ProductsPage = lazy(() => import('./pages/ProductsPage.jsx'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage.jsx'));
const MapTestPage = lazy(() => import('./pages/MapTestPage.jsx'));
const CartPage = lazy(() => import('./pages/CartPage.jsx'));
const CafeDetailPageComponent = lazy(() => import('./pages/CafeDetailPage.jsx'));
const PetSuppliesPage = lazy(() => import('./pages/PetSuppliesPage.jsx'));
const PetSupplyDetailPage = lazy(() => import('./pages/PetSupplyDetailPage.jsx'));

// --- Admin Pages (Lazy Loaded) ---
// 관리자 전용 페이지들도 lazy loading을 적용합니다.
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage.jsx'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage.jsx'));

// --- Maintenance Page ---
// 서비스 점검 페이지도 lazy loading을 적용합니다.
const MaintenancePage = lazy(() => import('./pages/MaintenancePage.jsx'));

/**
 * AppContent 컴포넌트
 * 
 * 이 컴포넌트는 라우팅 및 앱의 주요 콘텐츠 렌더링을 담당합니다.
 * `useLocation` 훅을 사용하기 위해 `BrowserRouter` 내부에 위치해야 합니다.
 * 서비스 점검 모드와 같은 전역 상태에 따라 다른 화면을 보여주는 로직을 포함합니다.
 */
function AppContent() {
  // `useLocation` 훅을 사용하여 현재 URL 경로 정보를 가져옵니다.
  const location = useLocation();
  // `useMaintenance` 커스텀 훅을 사용하여 서비스 점검 상태를 가져옵니다.
  const { isMaintenanceMode } = useMaintenance();

  // 현재 경로가 관리자 페이지인지 확인합니다. (URL이 '/admin'으로 시작하는지)
  const isAdminRoute = location.pathname.startsWith('/admin');

  // 만약 서비스 점검 모드가 활성화되어 있고, 현재 페이지가 관리자 페이지가 아니라면
  // 점검 안내 페이지를 보여줍니다.
  if (isMaintenanceMode && !isAdminRoute) {
    return (
      // Layout을 적용하지 않는 별도의 페이지이므로, Suspense로 직접 감싸줍니다.
      <Suspense fallback={<div className="suspense-fallback"><Spinner /></div>}>
        <MaintenancePage />
      </Suspense>
    );
  }

  // 점검 모드가 아닐 경우, 기본 라우팅 시스템을 렌더링합니다.
  return (
    // lazy loading된 페이지 컴포넌트들을 로드하고, 로딩 중에는 스피너를 보여줍니다.
    <Suspense fallback={<div className="suspense-fallback"><Spinner /></div>}>
      {/* Routes 컴포넌트는 URL 경로에 따라 어떤 컴포넌트를 보여줄지 결정합니다. */}
      <Routes>
        {/* --- 레이아웃을 사용하는 페이지 그룹 --- */}
        {/* element에 Layout 컴포넌트를 지정하면, 이 Route의 모든 자식 라우트들은
         Layout의 <Outlet /> 위치에 렌더링됩니다. */}
        <Route element={<Layout />}>
            {/* 메인 페이지 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/main" element={<MainPage />} />
            
            {/* 주요 서비스 페이지들 */}
            <Route path="/grooming" element={<GroomingPage />} />
            <Route path="/hospital" element={<HospitalPage />} />
            <Route path="/hotel" element={<HotelPage />} />
            <Route path="/cafe" element={<CafePage />} />
            <Route path="/cafe/:cafeId" element={<CafeDetailPageComponent />} />
            
            {/* 고객센터 관련 페이지들 (여러 경로가 하나의 컴포넌트를 공유) */}
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
            
            {/* 커뮤니티 관련 페이지들 */}
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/:boardKey/new" element={<PostEditor />} /> {/* 새 글 작성 */}
            <Route path="/community/edit/:postId" element={<PostEditor />} /> {/* 글 수정 */}
            <Route path="/community/posts/:postId" element={<PostDetail />} /> {/* 글 상세 보기 */}
            <Route path="/community/:boardKey" element={<CommunityPage />} />

            {/* 고객 지원 페이지 */}
            <Route path="/support" element={<SupportPage />} />
            <Route path="/support/:boardKey" element={<SupportPage />} />

            {/* 펜션/숙박 관련 페이지들 */}
            <Route path="/pet-friendly-lodging" element={<PensionPage />} />
            <Route path="/pet-friendly-lodging/:pensionId" element={<PensionDetailPage />} />
            
            {/* 상품 관련 페이지들 */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:productId" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            
            {/* 반려동물 용품 관련 페이지들 */}
            <Route path="/pet-supplies" element={<PetSuppliesPage />} />
            <Route path="/pet-supplies/category/:category" element={<PetSuppliesPage />} />
            <Route path="/pet-supplies/:id" element={<PetSupplyDetailPage />} />
            
            {/* 기타 페이지 및 리다이렉션 */}
            <Route path="/care" element={<Navigate to="/grooming" replace />} />
            <Route path="/bulletin" element={<Navigate to="/pet-friendly-lodging" replace />} />
            <Route path="/map-test" element={<MapTestPage />} />
            
            {/* 보호된 라우트 예시 (현재는 사용되지 않고 /로 리다이렉트) */}
            <Route
              path="/members/*"
              element={
                <ProtectedRoute>
                  <Navigate to="/" replace />
                </ProtectedRoute>
              }
            />
        </Route>

        {/* --- 레이아웃을 사용하지 않는 독립적인 페이지 그룹 --- */}
        {/* 인증 관련 페이지 (로그인, 회원가입) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* 관리자 전용 페이지 */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/*"
          element={
            // AdminProtectedRoute로 감싸서 관리자만 접근할 수 있도록 보호합니다.
            <AdminProtectedRoute>
              <AdminDashboardPage />
            </AdminProtectedRoute>
          }
        />
        
        {/* 404 Not Found 처리: 일치하는 경로가 없으면 메인 페이지로 리다이렉트합니다. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

/**
 * App 컴포넌트 (최상위 컴포넌트)
 * 
 * 이 컴포넌트는 애플리케이션의 진입점(entry point)입니다.
 * 모든 Context Provider들로 `AppContent` 컴포넌트를 감싸서,
 * 앱 전역에서 필요한 상태(인증, UI, 장바구니 등)를 공유할 수 있도록 설정합니다.
 */
function App() {
  return (
    // 각 Provider는 자신의 children(하위 컴포넌트)에게 Context를 제공합니다.
    // Provider들이 중첩되어 있어, 안쪽의 컴포넌트는 바깥쪽 모든 Provider의 데이터에 접근할 수 있습니다.
    <AuthProvider>
      <ProfileProvider>
        <UIProvider>
          <CartProvider>
            <CommunityProvider>
              <AdminAuthProvider>
                <MaintenanceProvider>
                  <SearchProvider>
                    {/* AppContent는 위 모든 Context들의 데이터에 접근할 수 있습니다. */}
                    <AppContent />
                  </SearchProvider>
                </MaintenanceProvider>
              </AdminAuthProvider>
            </CommunityProvider>
          </CartProvider>
        </UIProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

// App 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
export default App;
