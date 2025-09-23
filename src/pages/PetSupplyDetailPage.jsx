// src/pages/PetSupplyDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './PetSupplyDetailPage.module.css';

// Comprehensive Mock Data for Pet Supplies
const mockProducts = [
  {
    id: 1,
    name: '튼튼 관절 저알러지 사료 (연어)',
    brand: '헬시펫',
    price: 58000,
    rating: 4.9,
    reviewCount: 1204,
    imageUrl: 'https://picsum.photos/seed/dogfood1/600/600',
    category: '사료',
    description: '신선한 노르웨이산 연어와 가수분해 단백질을 사용하여 알러지 반응을 최소화하고, 글루코사민과 콘드로이친 성분이 관절 건강에 도움을 주는 기능성 사료입니다. 오메가-3가 풍부하여 피부와 모질 개선에도 효과적입니다.',
    stockQuantity: 10,
    isBest: true,
    isFeatured: false,
    createdAt: '2023-01-01',
  },
  {
    id: 2,
    name: '냥냥펀치 치킨맛 스틱 간식',
    brand: '캣딜라이트',
    price: 12500,
    rating: 4.8,
    reviewCount: 3450,
    imageUrl: 'https://picsum.photos/seed/cattreat1/600/600',
    category: '간식',
    description: '100% 국내산 무항생제 닭가슴살을 사용하여 만든 프리미엄 스틱 간식입니다. 동결건조 공법으로 영양소 파괴를 최소화했으며, 말랑한 식감으로 어린 고양이부터 노령묘까지 모두 즐길 수 있습니다.',
    stockQuantity: 5,
    isBest: true,
    isFeatured: true,
    createdAt: '2023-01-05',
  },
  {
    id: 3,
    name: '스트레스 해소 바스락볼',
    brand: '펫플레이',
    price: 8900,
    rating: 4.7,
    reviewCount: 890,
    imageUrl: 'https://picsum.photos/seed/toy1/600/600',
    category: '장난감',
    description: '고양이의 호기심을 자극하는 바스락 소리와 천연 캣닙이 내장되어 있어 스트레스 해소 및 사냥 본능 충족에 도움을 줍니다. 가벼운 소재로 만들어져 혼자서도 잘 가지고 놉니다.',
    stockQuantity: 0,
    isBest: false,
    isFeatured: false,
    createdAt: '2023-01-10',
  },
  {
    id: 4,
    name: '포근 올인원 강아지 겨울 패딩',
    brand: '리틀테일',
    price: 42000,
    rating: 4.9,
    reviewCount: 540,
    imageUrl: 'https://picsum.photos/seed/cloth1/600/600',
    category: '의류',
    description: '생활 방수 기능이 있는 겉감과 부드러운 기모 안감으로 제작되어 추운 겨울에도 따뜻하게 산책할 수 있습니다. 등 부분의 지퍼로 하네스와 함께 착용하기 편리합니다.',
    stockQuantity: 20,
    isBest: false,
    isFeatured: false,
    createdAt: '2023-01-15',
  },
  {
    id: 25, // Original mock product ID
    name: '프리미엄 오리젠 사료',
    brand: '오리젠',
    price: 75000,
    rating: 4.9,
    reviewCount: 1500,
    imageUrl: 'https://picsum.photos/seed/orijen/600/600',
    category: '사료',
    description: '고품질 단백질과 신선한 재료로 만든 프리미엄 사료입니다.',
    stockQuantity: 50,
    isBest: true,
    isFeatured: true,
    createdAt: '2023-02-01',
  },
];

const PetSupplyDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions: { addToCart } } = useCart();

  useEffect(() => {
    // Simulate fetching product by ID
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const foundProduct = mockProducts.find(p => String(p.id) === String(id));
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setError('상품을 찾을 수 없습니다.');
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleCategoryClick = () => {
    navigate(`/pet-supplies/category/${product.category}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>상품 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>오류가 발생했습니다</h2>
          <p>{error}</p>
          <button onClick={handleBackClick} className={styles.backButton}>
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <button onClick={() => navigate('/pet-supplies')} className={styles.breadcrumbLink}>
          반려용품
        </button>
        <span className={styles.separator}>&gt;</span>
        <button onClick={handleCategoryClick} className={styles.breadcrumbLink}>
          {product.category}
        </button>
        <span className={styles.separator}>&gt;</span>
        <span className={styles.currentPage}>{product.name}</span>
      </div>

      <div className={styles.productDetail}>
        <div className={styles.imageSection}>
          <div className={styles.mainImageWrapper}>
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600'}
              alt={product.name}
              className={styles.mainImage}
            />
            {product.isBest && (
              <span className={styles.bestBadge}>BEST</span>
            )}
            {product.isFeatured && (
              <span className={styles.featuredBadge}>추천</span>
            )}
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.category}>{product.category}</div>
          <h1 className={styles.productName}>{product.name}</h1>
          
          {product.brand && (
            <div className={styles.brand}>브랜드: {product.brand}</div>
          )}

          <div className={styles.rating}>
            {product.rating > 0 && (
              <>
                <span className={styles.stars}>
                  {'⭐'.repeat(Math.floor(product.rating))}
                </span>
                <span className={styles.ratingText}>{product.rating}</span>
                {product.reviewCount > 0 && (
                  <span className={styles.reviewCount}>({product.reviewCount}개 리뷰)</span>
                )}
              </>
            )}
          </div>

          <div className={styles.price}>
            <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
          </div>

          <div className={styles.description}>
            <h3>상품 설명</h3>
            <p>{product.description}</p>
          </div>

          <div className={styles.stockInfo}>
            <span className={styles.stockLabel}>재고:</span>
            <span className={`${styles.stockStatus} ${product.stockQuantity > 0 ? styles.inStock : styles.outOfStock}`}>
              {product.stockQuantity > 0 ? `${product.stockQuantity}개 남음` : '품절'}
            </span>
          </div>

          <div className={styles.actions}>
            <button 
              className={styles.cartButton}
              disabled={product.stockQuantity === 0}
              onClick={() => addToCart(product, 1)}
            >
              장바구니 담기
            </button>
            <button 
              className={styles.buyButton}
              disabled={product.stockQuantity === 0}
              onClick={() => { addToCart(product, 1); navigate('/cart'); }}
            >
              바로 구매
            </button>
          </div>

          <div className={styles.productInfo}>
            <h3>상품 정보</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>카테고리</span>
                <span className={styles.infoValue}>{product.category}</span>
              </div>
              {product.brand && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>브랜드</span>
                  <span className={styles.infoValue}>{product.brand}</span>
                </div>
              )}
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>등록일</span>
                <span className={styles.infoValue}>
                  {new Date(product.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.backToList}>
        <button onClick={handleBackClick} className={styles.backButton}>
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default PetSupplyDetailPage;