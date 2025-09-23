// src/components/sections/PopularContentSection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PopularContentSection.module.css';

// 랜덤 펫 이미지 URL 배열
const petImages = [
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
  'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400',
  'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
  'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400',
  'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400'
];

// Mock Data for Popular Content
const mockPopularContent = [
  {
    id: 1,
    title: '[꿀팁] 강아지 산책 필수템 총정리!',
    author: '멍멍이아빠',
    createdAt: '2025-09-08',
    views: 1234,
    likes: 567,
    category: '정보공유',
    image: petImages[0],
  },
  {
    id: 2,
    title: '[자랑] 우리 집 고양이 미모 보고 가세요',
    author: '집사일기',
    createdAt: '2025-09-07',
    views: 987,
    likes: 456,
    category: '펫자랑',
    image: petImages[1],
  },
  {
    id: 3,
    title: '[추천] 반려동물 동반 카페 리스트 (서울)',
    author: '여행가자',
    createdAt: '2025-09-06',
    views: 876,
    likes: 345,
    category: '정보공유',
    image: petImages[2],
  },
  {
    id: 4,
    title: '[Q&A] 고양이가 자꾸 화장실 말고 다른 곳에 소변을 봐요 ㅠㅠ',
    author: '초보집사',
    createdAt: '2025-09-05',
    views: 765,
    likes: 234,
    category: 'Q&A',
    image: petImages[3],
  },
];

const PopularContentSection = () => {
  const [popularContent, setPopularContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setPopularContent(mockPopularContent);
      setLoading(false);
    }, 500);
  }, []);

  const handleContentClick = (postId) => {
    navigate(`/community/info/${postId}`);
  };

  const handleViewAllClick = () => {
    navigate('/community/info');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>이달의 인기 콘텐츠</h2>
          </div>
          <div className={styles.loading}>콘텐츠를 불러오는 중...</div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>이달의 인기 콘텐츠</h2>
          <button onClick={handleViewAllClick} className={styles.viewMore}>
            전체보기 &gt;
          </button>
        </div>
        <div className={styles.grid}>
          {popularContent.length > 0 ? (
            popularContent.map((content) => (
              <div 
                key={content.id} 
                className={styles.card}
                onClick={() => handleContentClick(content.id)}
              >
                <div className={styles.imageWrapper}>
                  <img src={content.image} alt={content.title} className={styles.image} />
                  <span className={styles.category}>{content.category}</span>
                  <div className={styles.stats}>
                    <span className={styles.views}>👁 {content.views}</span>
                    <span className={styles.likes}>❤ {content.likes}</span>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{content.title}</h3>
                  <div className={styles.meta}>
                    <p className={styles.author}>by {content.author}</p>
                    <p className={styles.date}>{formatDate(content.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noContent}>
              <p>아직 등록된 인기 콘텐츠가 없습니다.</p>
              <button onClick={handleViewAllClick} className={styles.createButton}>
                정보공유 게시판 보기
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularContentSection;