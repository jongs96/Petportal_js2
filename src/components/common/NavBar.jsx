// src/components/common/NavBar.jsx

// React 라이브러리를 가져옵니다.
import React from 'react';
// react-router-dom의 Link 컴포넌트를 가져옵니다. 페이지 이동을 위해 사용됩니다.
import { Link } from 'react-router-dom';
// 이 컴포넌트 전용 CSS 모듈을 가져옵니다.
import styles from './NavBar.module.css';

/**
 * NavBar 컴포넌트
 * 
 * 웹사이트의 주요 섹션으로 이동할 수 있는 네비게이션 링크들을 포함하는 메뉴입니다.
 * 데스크톱 화면의 헤더에 주로 표시됩니다.
 * 
 * @param {object} props - 컴포넌트에 전달되는 속성(props)
 * @param {boolean} props.isScrolled - 페이지 스크롤 여부. true이면 스크롤된 상태의 스타일이 적용됩니다.
 */
const NavBar = ({ isScrolled }) => {
  return (
    // `<nav>` 태그는 네비게이션 링크들의 그룹임을 시맨틱하게(의미적으로) 나타냅니다.
    // className을 동적으로 설정하여, 스크롤 시(isScrolled가 true) `.scrolled` 스타일을 추가로 적용합니다.
    <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
      {/* 각 Link 컴포넌트는 클릭 시 `to` 속성에 지정된 경로로 사용자를 이동시킵니다. */}
      <Link to="/grooming">미용</Link>
      <Link to="/cafe">카페</Link>
      <Link to="/pet-friendly-lodging">동반숙소</Link>
      <Link to="/hospital">병원</Link>
      <Link to="/hotel">호텔</Link>
      <Link to="/pet-supplies">반려용품</Link>
      <Link to="/community">커뮤니티</Link>
      <Link to="/support">고객센터</Link>
    </nav>
  );
};

// NavBar 컴포넌트를 다른 파일에서 재사용할 수 있도록 내보냅니다.
export default NavBar;
