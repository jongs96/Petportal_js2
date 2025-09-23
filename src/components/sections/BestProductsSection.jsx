
// src/components/sections/BestProductsSection.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BestProductsSection.module.css';

// Mock Data for Best Products
const mockBestProducts = [
  {
    id: 1,
    name: '튼튼 관절 저알러지 사료',
    price: 58000,
    imageUrl: 'https://picsum.photos/seed/dogfood1/400/400',
    isBest: true,
    rating: 4.9,
    brand: '헬시펫',
    description: '관절 건강에 좋은 사료',
  },
  {
    id: 2,
    name: '냥냥펀치 치킨맛 스틱 간식',
    price: 12500,
    imageUrl: 'https://picsum.photos/seed/cattreat1/400/400',
    isBest: true,
    rating: 4.8,
    brand: '캣딜라이트',
    description: '고양이들이 좋아하는 스틱 간식',
  },
  {
    id: 3,
    name: '스트레스 해소 바스락볼',
    price: 8900,
    imageUrl: 'https://picsum.photos/seed/toy1/400/400',
    isBest: false,
    rating: 4.7,
    brand: '펫플레이',
    description: '고양이 스트레스 해소 장난감',
  },
  {
    id: 4,
    name: '포근 올인원 강아지 겨울 패딩',
    price: 42000,
    imageUrl: 'https://picsum.photos/seed/cloth1/400/400',
    isBest: false,
    rating: 4.9,
    brand: '리틀테일',
    description: '따뜻하고 편안한 강아지 패딩',
  },
];

const BestProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setProducts(mockBestProducts);
      setLoading(false);
    }, 500);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  const handleProductClick = (productId) => {
    navigate(`/pet-supplies/${productId}`);
  };

  const handleViewAllClick = () => {
    navigate('/pet-supplies');
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>이달의 베스트 상품</h2>
          </div>
          <div className={styles.loading}>상품을 불러오는 중...</div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>이달의 베스트 상품</h2>
          <button onClick={handleViewAllClick} className={styles.viewMore}>
            전체보기 &gt;
          </button>
        </div>
        <div className={styles.grid}>
          {products.map((product) => (
            <div 
              key={product.id} 
              className={styles.card}
              onClick={() => handleProductClick(product.id)}
            >
              <div className={styles.imageWrapper}>
                <img 
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'} 
                  alt={product.name} 
                  className={styles.image} 
                />
                {product.isBest && (
                  <span className={styles.bestBadge}>BEST</span>
                )}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDescription}>{product.description}</p>
                <div className={styles.productInfo}>
                  <p className={styles.productPrice}>{formatPrice(product.price)}</p>
                  {product.rating > 0 && (
                    <div className={styles.rating}>
                      <span className={styles.stars}>⭐</span>
                      <span className={styles.ratingText}>{product.rating}</span>
                    </div>
                  )}
                </div>
                {product.brand && (
                  <p className={styles.brand}>{product.brand}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestProductsSection;
