// src/components/common/Logo.jsx

// React 라이브러리를 가져옵니다.
import React from 'react';
// react-router-dom의 Link 컴포넌트를 가져옵니다. 이 컴포넌트는 페이지를 새로고침하지 않고 다른 경로로 이동할 수 있게 해줍니다.
import { Link } from 'react-router-dom';
// CSS 모듈을 가져옵니다. 이 컴포넌트만의 독립적인 스타일을 적용하기 위함입니다.
import styles from './Logo.module.css';
// 로고 이미지를 가져옵니다. src 폴더 내의 자산(asset)은 이렇게 직접 가져와 사용할 수 있습니다.
import logoImage from '../../assets/image/logo3.png';

/**
 * Logo 컴포넌트
 * 
 * 웹사이트의 로고를 표시하는 역할을 합니다.
 * 로고는 이미지와 텍스트로 구성되어 있으며, 클릭 시 메인 페이지('/')로 이동합니다.
 * 부모 컴포넌트로부터 스크롤 상태(`isScrolled`)를 전달받아 스타일을 변경할 수 있습니다.
 * 
 * @param {object} props - 컴포넌트에 전달되는 속성(props)
 * @param {boolean} props.isScrolled - 페이지 스크롤 여부. true이면 스크롤된 상태의 스타일이 적용됩니다.
 */
const Logo = ({ isScrolled }) => {
  return (
    // Link 컴포넌트를 사용하여 로고 전체를 클릭 가능한 링크로 만듭니다.
    // `to="/"`는 클릭 시 홈페이지로 이동하도록 설정합니다.
    // className은 기본 스타일(styles.logoContainer)과 스크롤 상태에 따른 추가 스타일(styles.scrolled)을 동적으로 적용합니다.
    <Link to="/" className={`${styles.logoContainer} ${isScrolled ? styles.scrolled : ''}`}>
      {/* 로고 이미지를 감싸는 div 입니다. */}
      <div className={styles.logoImage}>
        {/* img 태그를 사용하여 실제 로고 이미지를 표시합니다. */}
        {/* src에는 import한 이미지 변수를, alt에는 이미지를 설명하는 대체 텍스트를 넣습니다. */}
        <img src={logoImage} alt="삐삐 PetPotal Logo" className={styles.logoImg} />
      </div>
      {/* 로고 텍스트를 표시하는 span 태그입니다. */}
      <span className={styles.logoText}>삐삐 PetPortal</span>
    </Link>
  );
};

// Logo 컴포넌트를 다른 파일에서 재사용할 수 있도록 내보냅니다.
export default Logo;
