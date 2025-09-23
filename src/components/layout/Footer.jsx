// src/components/layout/Footer.jsx

// React 라이브러리와 Link 컴포넌트를 가져옵니다.
import React from 'react';
import { Link } from 'react-router-dom';
// 이 컴포넌트 전용 CSS 모듈을 가져옵니다.
import styles from './Footer.module.css';

// 소셜 미디어 링크 데이터를 배열로 정의합니다. 아이콘은 SVG로 직접 작성되었습니다.
const socialLinksData = [
  {
    name: 'Facebook',
    href: 'https://www.instagram.com/ohsh2', // 실제 페이스북 주소로 변경해야 합니다.
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/ohsh2',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
      </svg>
    ),
  },
  // 다른 소셜 링크들도 유사하게 추가... 
];

/**
 * Footer 컴포넌트
 * 
 * 웹사이트의 가장 하단에 위치하는 푸터(꼬리말) 영역입니다.
 * 사이트맵, 회사 정보, 약관, 소셜 미디어 링크 등 부가적인 정보들을 포함합니다.
 */
const Footer = () => {
  return (
    // `<footer>` 태그는 시맨틱 웹을 위해 푸터 영역임을 명시적으로 나타냅니다.
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          {/* 푸터의 각 섹션들 */}
          
          {/* 로고 및 설명 섹션 */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>삐삐 PetPotal</h3>
            <p className={styles.footerDescription}>
              반려동물과 함께하는 모든 소중한 순간을<br />
              더욱 특별하게 만들어드립니다.
            </p>
            {/* 소셜 미디어 링크 목록 */}
            <div className={styles.socialLinks}>
              {socialLinksData.map((link, index) => (
                <a 
                  key={index} // 각 링크를 식별하기 위한 고유 key
                  href={link.href} // 이동할 URL
                  className={styles.socialLink}
                  aria-label={link.name} // 스크린 리더를 위한 링크 설명
                  target="_blank" // 링크를 새 탭에서 열도록 설정
                  rel="noopener noreferrer" // 보안 및 성능상의 이유로 추가
                >
                  {link.icon} {/* SVG 아이콘 */}
                </a>
              ))}
            </div>
          </div>

          {/* 서비스 바로가기 섹션 */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>서비스</h4>
            <ul className={styles.footerLinks}>
              <li><Link to="/grooming">펫 미용</Link></li>
              <li><Link to="/cafe">펫 카페</Link></li>
              <li><Link to="/products">펫 용품</Link></li>
              <li><Link to="/hospital">동물병원</Link></li>
              <li><Link to="/hotel">펫 호텔</Link></li>
              <li><Link to="/community">커뮤니티</Link></li>
            </ul>
          </div>

          {/* 정보 바로가기 섹션 */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>정보</h4>
            <ul className={styles.footerLinks}>
              <li><Link to="/about">회사소개</Link></li>
              <li><Link to="/notice">공지사항</Link></li>
              <li><Link to="/faq">자주묻는질문</Link></li>
              <li><Link to="/support">고객지원</Link></li>
              <li><Link to="/inquiry">1:1문의</Link></li>
            </ul>
          </div>

          {/* 약관 및 정책 섹션 */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>약관 및 정책</h4>
            <ul className={styles.footerLinks}>
              <li><Link to="/terms">이용약관</Link></li>
              <li><Link to="/privacy">개인정보처리방침</Link></li>
              <li><Link to="/youth">청소년보호정책</Link></li>
              <li><Link to="/policy">운영정책</Link></li>
            </ul>
          </div>

          {/* 고객센터 정보 섹션 */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>고객센터</h4>
            <div className={styles.contactInfo}>
              <p className={styles.phone}>📞 1588-1234</p>
              <p className={styles.email}>📧 help@petpotal.com</p>
              <p className={styles.hours}>
                평일 09:00 - 18:00<br />
                (주말, 공휴일 휴무)
              </p>
            </div>
          </div>
        </div>

        {/* 푸터 하단 영역 (회사 정보 및 저작권) */}
        <div className={styles.footerBottom}>
          <div className={styles.companyInfo}>
            <p>
              (주)펫포탈 | 대표: 홍길동 | 사업자등록번호: 123-45-67890<br />
              주소: 서울특별시 강남구 삼성동 143-42 | 통신판매업신고: 2024-서울강남-1234
            </p>
          </div>
          <div className={styles.copyright}>
            <p>&copy; 2024 PetPotal. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Footer 컴포넌트를 다른 파일에서 재사용할 수 있도록 내보냅니다.
export default Footer;