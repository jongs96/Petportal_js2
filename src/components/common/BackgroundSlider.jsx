// src/components/common/BackgroundSlider.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // framer-motion import
import styles from './BackgroundSlider.module.css';

// 슬라이드 이미지들 import
import image1 from '../../assets/image/1.jpg';
import image2 from '../../assets/image/2.jpg';
import image3 from '../../assets/image/3.jpg';
import image4 from '../../assets/image/4.png';

const BackgroundSlider = ({ children, autoSlide = true, autoSlideInterval = 5000 }) => {
  const slides = [image1, image2, image3, image4];
  const [currentSlide, setCurrentSlide] = useState(0);
  // isAnimating state는 framer-motion이 애니메이션을 처리하므로 필요 없어집니다.
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Variants for slide animation (e.g., fade in/out)
  const slideVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // 다음 슬라이드로 이동 (isAnimating 로직 제거)
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // 이전 슬라이드로 이동 (isAnimating 로직 제거)
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // 특정 슬라이드로 이동 (isAnimating 로직 제거)
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // 자동 슬라이드
  useEffect(() => {
    if (!autoSlide) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, autoSlideInterval, slides.length]);

  // 터치 스와이프 처리
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // 키보드 이벤트 핸들링
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []); // 의존성 배열에서 prevSlide, nextSlide 제거 (framer-motion으로 애니메이션 처리되므로 isAnimating 불필요)

  return (
    <div
      className={styles.sliderContainer}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* 배경 슬라이드들 */}
      {/* AnimatePresence로 감싸서 컴포넌트가 마운트/언마운트될 때 애니메이션 적용 */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide} // currentSlide가 변경될 때마다 새로운 motion.div로 인식하여 애니메이션 적용
          className={styles.slide}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1 }} // 애니메이션 지속 시간 (1초)
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slides[currentSlide]})`
          }}
        />
      </AnimatePresence>

      {/* 왼쪽 화살표 */}
      <button
        className={`${styles.navButton} ${styles.prevButton}`}
        onClick={prevSlide}
        // disabled={isAnimating} // isAnimating 제거
        aria-label="이전 슬라이드"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 오른쪽 화살표 */}
      <button
        className={`${styles.navButton} ${styles.nextButton}`}
        onClick={nextSlide}
        // disabled={isAnimating} // isAnimating 제거
        aria-label="다음 슬라이드"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 하단 도트 네비게이션 */}
      <div className={styles.dotsContainer}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
            // disabled={isAnimating} // isAnimating 제거
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>

      {/* 슬라이드 위에 표시될 컨텐츠 */}
      <div className={styles.content}>
        {children}
      </div>

      {/* 슬라이드 진행 표시기 (선택사항) */}
      {autoSlide && (
        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{
              animationDuration: `${autoSlideInterval}ms`,
              animationPlayState: 'running' // Always running, no pause on animation
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BackgroundSlider;