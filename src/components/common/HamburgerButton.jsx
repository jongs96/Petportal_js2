// src/components/common/HamburgerButton.jsx

// React 라이브러리를 가져옵니다.
import React from 'react';
// 이 컴포넌트 전용 CSS 모듈을 가져옵니다.
import styles from './HamburgerButton.module.css';

/**
 * HamburgerButton 컴포넌트
 * 
 * 모바일 화면에서 메뉴를 열고 닫는 데 사용되는 햄버거 아이콘 모양의 버튼입니다.
 * 세 개의 `<span>` 태그가 CSS에 의해 세 줄의 "햄버거" 모양으로 스타일링됩니다.
 * 메뉴가 열리면(isOpen=true) X 모양으로 바뀝니다.
 * 
 * @param {object} props - 컴포넌트에 전달되는 속성(props)
 * @param {boolean} props.isOpen - 모바일 메뉴가 열려있는지 여부. 버튼의 모양을 결정합니다.
 * @param {function} props.onClick - 버튼이 클릭될 때 호출될 함수입니다.
 * @param {boolean} props.isScrolled - 페이지 스크롤 여부. 버튼의 색상 등을 변경하는 데 사용됩니다.
 */
const HamburgerButton = ({ isOpen, onClick, isScrolled }) => {
  return (
    // `<button>` 태그로 버튼을 만듭니다.
    <button 
      // className을 동적으로 설정합니다.
      // - `styles.hamburgerButton`: 기본 스타일
      // - `isScrolled ? styles.scrolled : ''`: 스크롤 시 `scrolled` 스타일 추가
      // - `isOpen ? styles.open : ''`: 메뉴가 열렸을 때 `open` 스타일 추가 (X 모양으로 변경)
      className={`${styles.hamburgerButton} ${isScrolled ? styles.scrolled : ''} ${isOpen ? styles.open : ''}`}
      onClick={onClick} // 클릭 이벤트가 발생하면 부모로부터 받은 onClick 함수를 실행합니다.
      aria-label="메뉴 열기/닫기" // 스크린 리더 사용자를 위한 접근성 속성입니다.
    >
      {/* 이 세 개의 span 태그가 CSS를 통해 햄버거 메뉴의 세 줄을 형성합니다. */}
      <span className={styles.line}></span>
      <span className={styles.line}></span>
      <span className={styles.line}></span>
    </button>
  );
};

// HamburgerButton 컴포넌트를 다른 파일에서 재사용할 수 있도록 내보냅니다.
export default HamburgerButton;
