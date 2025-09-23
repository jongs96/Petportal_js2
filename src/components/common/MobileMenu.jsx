// src/components/common/MobileMenu.jsx

// React 라이브러리와 Link 컴포넌트를 가져옵니다.
import React from 'react';
import { Link } from 'react-router-dom';
// 이 컴포넌트 전용 CSS 모듈을 가져옵니다.
import styles from './MobileMenu.module.css';

/**
 * MobileMenu 컴포넌트
 * 
 * 모바일 화면에서 햄버거 버튼을 클릭했을 때 나타나는 사이드 메뉴입니다.
 * 화면을 덮는 오버레이와 함께 나타나며, 주요 페이지 링크, 검색창, 로그인/회원가입 링크를 포함합니다.
 * 
 * @param {object} props - 컴포넌트에 전달되는 속성(props)
 * @param {boolean} props.isOpen - 메뉴가 열려있는지 여부. 메뉴의 표시 여부를 결정합니다.
 * @param {function} props.onClose - 메뉴를 닫기 위해 호출될 함수입니다.
 * @param {boolean} props.isScrolled - 페이지 스크롤 여부 (현재는 사용되지 않지만, 확장을 위해 유지).
 */
const MobileMenu = ({ isOpen, onClose, isScrolled }) => {

  // 메뉴 안의 링크를 클릭했을 때 호출되는 함수입니다.
  const handleLinkClick = () => {
    onClose(); // 부모로부터 받은 onClose 함수를 호출하여 메뉴를 닫습니다.
  };

  // 메뉴 안의 검색 폼이 제출될 때 호출되는 함수입니다.
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지가 새로고침되는 기본 동작을 막습니다.
    const searchQuery = e.target.search.value.trim(); // 입력된 검색어의 양쪽 공백을 제거합니다.
    if (searchQuery) { // 검색어가 존재한다면
      console.log('모바일 검색어:', searchQuery); // 콘솔에 검색어를 출력합니다. (실제 검색 로직으로 대체 필요)
      onClose(); // 검색 후 메뉴를 닫습니다.
    }
  };

  return (
    // React Fragment(<>...</>)를 사용하여 오버레이와 메뉴를 함께 렌더링합니다.
    <>
      {/* 메뉴가 열렸을 때 화면의 나머지 부분을 덮는 반투명한 오버레이입니다. */}
      <div 
        // `isOpen` 상태에 따라 `open` 클래스를 추가하여 보이거나 숨깁니다.
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        // 오버레이를 클릭하면 메뉴가 닫히도록 `onClose` 함수를 호출합니다.
        onClick={onClose}
      />
      
      {/* 실제 메뉴 콘텐츠가 담긴 사이드바입니다. */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
        {/* 메뉴 상단의 헤더 부분입니다. */}
        <div className={styles.menuHeader}>
          <h3>메뉴</h3>
        </div>
        
        {/* 네비게이션 링크들을 담는 영역입니다. */}
        <nav className={styles.menuNav}>
          {/* 각 Link를 클릭하면 `handleLinkClick` 함수가 호출되어 메뉴가 닫힙니다. */}
          <Link to="/grooming" onClick={handleLinkClick}>미용</Link>
          <Link to="/cafe" onClick={handleLinkClick}>카페</Link>
          <Link to="/products" onClick={handleLinkClick}>반려용품</Link>
          <Link to="/hospital" onClick={handleLinkClick}>병원</Link>
          <Link to="/hotel" onClick={handleLinkClick}>호텔</Link>
          <Link to="/pet-friendly-lodging" onClick={handleLinkClick}>반려동반 숙소</Link>
          <Link to="/community" onClick={handleLinkClick}>커뮤니티</Link>
          <Link to="/cart" onClick={handleLinkClick}>🛒 장바구니</Link>
        </nav>
        
        {/* 검색창 영역입니다. */}
        <div className={styles.menuSearch}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <input
              type="text"
              name="search"
              placeholder="검색..."
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              검색
            </button>
          </form>
        </div>
        
        {/* 로그인/회원가입 링크 영역입니다. */}
        <div className={styles.menuAuth}>
          <Link to="/login" onClick={handleLinkClick} className={styles.loginLink}>
            로그인
          </Link>
          <Link to="/signup" onClick={handleLinkClick} className={styles.signupButton}>
            회원가입
          </Link>
        </div>
      </div>
    </>
  );
};

// MobileMenu 컴포넌트를 다른 파일에서 재사용할 수 있도록 내보냅니다.
export default MobileMenu;
