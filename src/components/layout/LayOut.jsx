// src/components/layout/Layout.jsx

import React from 'react';
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

// 공통 컴포넌트 및 레이아웃 요소들을 가져옵니다.
import Header from "./Header";
import Footer from "./Footer";
import UserProfile from "../profile/UserProfile";
import PetProfile from "../profile/PetProfile";
import AddPetForm from "../profile/AddPetForm";
import LoadingOverlay from '../common/LoadingOverlay';
import ScrollToTop from '../common/ScrollToTop';

// UI 상태를 사용하기 위한 훅을 가져옵니다.
import { useUI } from '../../contexts/UIContext.jsx';

/**
 * Layout 컴포넌트
 * 
 * 애플리케이션의 주요 레이아웃(뼈대)을 정의합니다.
 * 모든 페이지에 공통적으로 표시될 Header, Footer, 모달 등을 포함합니다.
 * <Outlet />은 자식 라우트(각 개별 페이지)가 렌더링될 위치를 지정합니다.
 */
export default function Layout() {
    // 로딩 오버레이를 제어하기 위해 useUI 훅을 사용합니다.
    const { isLoading } = useUI();

    return (
        <div className="App main-app-container">
            {/* 알림 메시지 컨테이너 */}
            <ToastContainer position="bottom-right" autoClose={3000} />
            {/* 로딩 오버레이 */}
            <LoadingOverlay isLoading={isLoading} />
            
            {/* 공통 헤더 */}
            <Header />

            {/* 페이지의 메인 콘텐츠 영역 */}
            <main>
                {/* 페이지 이동 시 상단으로 스크롤 */}
                <ScrollToTop />
                {/* 자식 라우트 컴포넌트가 여기에 렌더링됩니다. */}
                <Outlet />
            </main>

            {/* 공통 푸터 */}
            <Footer />

            {/* 프로필 관련 모달들 (화면 전체에 걸쳐 표시될 수 있음) */}
            <UserProfile />
            <PetProfile />
            <AddPetForm />
        </div>
    );
}
