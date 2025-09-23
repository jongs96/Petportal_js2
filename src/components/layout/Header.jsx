// src/components/layout/Header.jsx

// React의 useState와 useEffect 훅을 가져옵니다.
import React, { useState, useEffect } from 'react';

// 헤더를 구성하는 각 부분에 해당하는 컴포넌트들을 가져옵니다.
import Logo from '../common/Logo'; // 웹사이트 로고
import NavBar from '../common/NavBar'; // 네비게이션 메뉴
import SearchBar from '../common/SearchBar'; // 검색창
import AuthButtons from '../common/AuthButtons'; // 로그인/회원가입 버튼
import HamburgerButton from '../common/HamburgerButton'; // 모바일 화면용 햄버거 메뉴 버튼
import MobileMenu from '../common/MobileMenu'; // 모바일 화면용 메뉴
import ProfileIcons from '../profile/ProfileIcons'; // 사용자 프로필 관련 아이콘
import CartIcon from '../common/CartIcon'; // 장바구니 아이콘

// CSS 모듈을 가져옵니다. 이를 통해 이 컴포넌트 내에서만 유효한 스타일을 정의할 수 있습니다.
import styles from './Header.module.css';

/**
 * Header 컴포넌트
 * 
 * 웹사이트의 최상단에 위치하는 헤더 영역을 담당합니다.
 * 로고, 네비게이션, 검색창, 사용자 관련 아이콘 등을 포함하며,
 * 화면 스크롤 및 모바일 환경에 따라 동적으로 변화합니다.
 */
const Header = () => {
  // `useState` 훅을 사용하여 두 가지 상태를 관리합니다.
  // 1. isScrolled: 사용자가 페이지를 스크롤했는지 여부를 저장합니다. (초기값: false)
  const [isScrolled, setIsScrolled] = useState(false);
  // 2. isMobileMenuOpen: 모바일 메뉴가 열려있는지 여부를 저장합니다. (초기값: false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // `useEffect` 훅을 사용하여 컴포넌트가 렌더링된 후 특정 작업을 수행합니다.
  // 이 경우, 스크롤 이벤트를 감지하여 isScrolled 상태를 업데이트합니다.
  useEffect(() => {
    // 스크롤 위치를 확인하는 함수입니다.
    const handleScroll = () => {
      const scrollTop = window.scrollY; // 현재 스크롤된 Y축 위치를 가져옵니다.
      // 스크롤 위치가 10px보다 크면 isScrolled를 true로, 아니면 false로 설정합니다.
      setIsScrolled(scrollTop > 10);
    };
    
    // window 객체에 스크롤 이벤트 리스너를 추가합니다.
    window.addEventListener('scroll', handleScroll);
    
    // 컴포넌트가 언마운트(사라질 때)될 때 이벤트 리스너를 정리(제거)합니다.
    // 이는 메모리 누수를 방지하는 중요한 작업입니다.
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // 빈 배열 `[]`을 전달하여 이 effect가 컴포넌트가 처음 마운트될 때 한 번만 실행되도록 합니다.

  // 모바일 메뉴의 열림/닫힘 상태를 토글(반전)하는 함수입니다.
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 모바일 메뉴를 닫는 함수입니다.
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // 모바일 메뉴가 열렸을 때, 뒷 배경(body)의 스크롤을 막기 위한 `useEffect` 입니다.
  useEffect(() => {
    if (isMobileMenuOpen) {
      // 메뉴가 열리면 body의 overflow 스타일을 'hidden'으로 설정하여 스크롤을 막습니다.
      document.body.style.overflow = 'hidden';
    } else {
      // 메뉴가 닫히면 body의 overflow 스타일을 'unset'으로 되돌려 스크롤을 허용합니다.
      document.body.style.overflow = 'unset';
    }
    
    // 컴포넌트가 언마운트될 때 정리 함수를 실행하여 스크롤을 다시 허용합니다.
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]); // isMobileMenuOpen 상태가 변경될 때마다 이 effect가 실행됩니다.

  return (
    // React Fragment(<>... </>)를 사용하여 여러 개의 최상위 엘리먼트를 묶어줍니다.
    <>
      {/* 헤더의 메인 영역입니다. */}
      {/* className을 동적으로 설정합니다: 기본적으로 styles.header를 적용하고, isScrolled가 true이면 styles.scrolled를 추가로 적용합니다. */}
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          {/* 로고 컴포넌트. isScrolled 상태를 prop으로 전달하여 스크롤 시 로고 스타일이 변경될 수 있도록 합니다. */}
          <Logo isScrolled={isScrolled} />
          
          {/* 데스크톱 화면에서 보여질 컴포넌트들입니다. */}
          <NavBar isScrolled={isScrolled} />
          <SearchBar isScrolled={isScrolled} />
          <CartIcon />
          <ProfileIcons />
          <AuthButtons isScrolled={isScrolled} />
          
          {/* 모바일 화면에서 보여질 햄버거 버튼입니다. */}
          <HamburgerButton 
            isOpen={isMobileMenuOpen} // 현재 메뉴의 열림 상태를 전달합니다.
            onClick={toggleMobileMenu} // 클릭 시 메뉴 상태를 토글하는 함수를 전달합니다.
            isScrolled={isScrolled} // 스크롤 상태를 전달합니다.
          />
        </div>
      </header>
      
      {/* 모바일 메뉴 컴포넌트입니다. 데스크톱에서는 보이지 않습니다. */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} // 메뉴의 열림 상태를 전달하여 보일지 말지 결정합니다.
        onClose={closeMobileMenu} // 메뉴를 닫는 함수를 전달합니다.
        isScrolled={isScrolled} // 스크롤 상태를 전달합니다.
      />
    </>
  );
};

// Header 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
export default Header;
