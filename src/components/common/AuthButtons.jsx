// src/components/common/AuthButtons.jsx

// React와 `useState` 훅을 가져옵니다.
import React, { useState } from 'react';
// `AuthContext`를 사용하여 사용자 인증 상태에 접근합니다.
import { useAuth } from '../../context/AuthContext';
// 로그인 및 회원가입 모달 컴포넌트를 가져옵니다.
import LoginModal from '../modal/LoginModal';
import SignupModal from '../modal/SignupModal';
// CSS 모듈을 가져옵니다.
import styles from './AuthButtons.module.css';

/**
 * AuthButtons 컴포넌트
 * 
 * 사용자의 인증 상태에 따라 다른 버튼들을 보여주는 컴포넌트입니다.
 * - 로그인하지 않은 사용자에게는 '로그인'과 '회원가입' 버튼을 보여줍니다.
 * - 로그인한 사용자에게는 '로그아웃' 버튼을 보여줍니다.
 * 로그인과 회원가입은 모달(팝업) 형태로 제공됩니다.
 * 
 * @param {object} props - 컴포넌트에 전달되는 속성(props)
 * @param {boolean} props.isScrolled - 페이지 스크롤 여부. true이면 스타일이 변경됩니다.
 */
const AuthButtons = ({ isScrolled }) => {
  // `useState`를 사용하여 로그인 및 회원가입 모달의 열림/닫힘 상태를 관리합니다.
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  
  // `useAuth` 훅을 사용하여 전역 인증 상태(사용자 정보, 로그인 여부)와 로그아웃 함수를 가져옵니다.
  const { user, isAuthenticated, logout } = useAuth();

  // 로그인 모달을 여는 함수입니다.
  const openLoginModal = () => {
    setLoginModalOpen(true);
    setSignupModalOpen(false); // 혹시 회원가입 모달이 열려있다면 닫습니다.
  };

  // 회원가입 모달을 여는 함수입니다.
  const openSignupModal = () => {
    setSignupModalOpen(true);
    setLoginModalOpen(false); // 혹시 로그인 모달이 열려있다면 닫습니다.
  };

  // 모든 모달을 닫는 함수입니다.
  const closeModals = () => {
    setLoginModalOpen(false);
    setSignupModalOpen(false);
  };

  // 로그인 모달에서 회원가입 모달로 전환하는 함수입니다.
  const switchToSignup = () => {
    setLoginModalOpen(false);
    setSignupModalOpen(true);
  };

  // 회원가입 모달에서 로그인 모달로 전환하는 함수입니다.
  const switchToLogin = () => {
    setSignupModalOpen(false);
    setLoginModalOpen(true);
  };

  // 로그아웃을 처리하는 함수입니다.
  const handleLogout = () => {
    logout(); // AuthContext에서 제공된 logout 함수를 호출합니다.
  };

  // 만약 사용자가 로그인한 상태(isAuthenticated가 true)라면,
  if (isAuthenticated && user) {
    // 로그아웃 버튼을 렌더링합니다.
    return (
      <div className={`${styles.authContainer} ${isScrolled ? styles.scrolled : ''}`}>
        <button 
          onClick={handleLogout}
          className={`${styles.logoutButton} ${isScrolled ? styles.scrolled : ''}`}
          title="로그아웃" // 마우스를 올렸을 때 "로그아웃" 툴팁이 표시됩니다.
        >
          ⏻ // 로그아웃 아이콘 (전원 기호)
        </button>
      </div>
    );
  }

  // 사용자가 로그인하지 않은 상태라면,
  // 로그인 및 회원가입 버튼과 해당 모달들을 렌더링합니다.
  return (
    // React Fragment(<>...</>)를 사용하여 여러 엘리먼트를 묶어줍니다.
    <>
      <div className={`${styles.authContainer} ${isScrolled ? styles.scrolled : ''}`}>
        {/* 로그인 버튼 */}
        <button 
          onClick={openLoginModal} // 클릭 시 로그인 모달을 엽니다.
          className={`${styles.loginLink} ${isScrolled ? styles.scrolled : ''}`}
        >
          로그인
        </button>
        {/* 회원가입 버튼 */}
        <button 
          onClick={openSignupModal} // 클릭 시 회원가입 모달을 엽니다.
          className={`${styles.signupButton} ${isScrolled ? styles.scrolled : ''}`}
        >
          회원가입
        </button>
      </div>

      {/* 로그인 모달 컴포넌트 */}
      {/* isOpen, onClose 등의 props를 전달하여 모달의 동작을 제어합니다. */}
      <LoginModal 
        isOpen={loginModalOpen} // 모달의 열림/닫힘 상태를 전달합니다.
        onClose={closeModals} // 모달을 닫는 함수를 전달합니다.
        onSwitchToSignup={switchToSignup} // 회원가입 모달로 전환하는 함수를 전달합니다.
      />

      {/* 회원가입 모달 컴포넌트 */}
      <SignupModal 
        isOpen={signupModalOpen} // 모달의 열림/닫힘 상태를 전달합니다.
        onClose={closeModals} // 모달을 닫는 함수를 전달합니다.
        onSwitchToLogin={switchToLogin} // 로그인 모달로 전환하는 함수를 전달합니다.
      />
    </>
  );
};

// AuthButtons 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
export default AuthButtons;
