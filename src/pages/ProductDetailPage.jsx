import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './ProductDetailPage.module.css';
import Button from '../components/ui/Button';
import { useCart } from '../contexts/CartContext'; 
import { useUI } from '../contexts/UIContext';

// Mock Data for Product Detail
const mockProduct = {
  id: 1,
  name: '튼튼 관절 저알러지 사료 (연어)',
  brand: '헬시펫',
  price: 58000,
  rating: 4.9,
  reviewCount: 1204,
  image: 'https://picsum.photos/seed/dogfood1/600/600',
  category: '사료',
  description: '신선한 노르웨이산 연어와 가수분해 단백질을 사용하여 알러지 반응을 최소화하고, 글루코사민과 콘드로이친 성분이 관절 건강에 도움을 주는 기능성 사료입니다. 오메가-3가 풍부하여 피부와 모질 개선에도 효과적입니다.',
  reviews: [
    { id: 1, author: '멍멍이아빠', rating: 5, content: '벌써 3년째 이것만 먹여요! 슬개골이 안 좋았는데 산책할 때 훨씬 활기차졌어요.' },
    { id: 2, author: '알러지견주', rating: 5, content: '눈물 자국이랑 발 핥는 게 거짓말처럼 줄었네요. 정착합니다!' },
  ],
};

// 1. 탭 컨텐츠를 렌더링하는 컴포넌트
const TabContent = ({ product, activeTab }) => {
  if (!product) return null; // Handle case where product is not yet loaded
  if (activeTab === 'details') {
    return (
      <div className={styles.tabContent}>
        <h3>상품 상세 정보</h3>
        <p>{product.description || '상세 정보가 준비중입니다.'}</p>
        {/* 실제로는 여기에 더 많은 이미지나 설명이 들어갈 수 있습니다. */}
       {/* <img src={`https://picsum.photos/seed/${product.id}_detail/800/1200`} alt="상세 이미지" style={{maxWidth: '100%', marginTop: '20px'}}/> */}
      </div>
    );
  }
  if (activeTab === 'reviews') {
    return (
      <div className={styles.tabContent}>
        <h3>구매 후기 ({product.reviews ? product.reviews.length : 0}개)</h3>
        <div className={styles.reviewList}>
          {(product.reviews && product.reviews.length > 0) ? (
            product.reviews.map(review => (
              <div key={review.id} className={styles.reviewItem}>
                <div className={styles.reviewRating}>{'⭐'.repeat(review.rating)}</div>
                <p className={styles.reviewContent}>{review.content}</p>
                <p className={styles.reviewAuthor}>- {review.author} -</p>
              </div>
            ))
          ) : <p>아직 작성된 후기가 없습니다.</p>}
        </div>
      </div>
    );
  }
  if (activeTab === 'shipping') {
    return (
      <div className={styles.tabContent}>
        <h3>배송/교환 안내</h3>
        <p><strong>배송 안내</strong></p>
        <ul>
          <li>배송사: PETMILY 특송</li>
          <li>배송비: 3,000원 (50,000원 이상 구매 시 무료배송)</li>
          <li>평일 오후 2시 이전 결제 시 당일 출고됩니다.</li>
        </ul>
        <p><strong>교환/반품 안내</strong></p>
        <ul>
          <li>상품 수령 후 7일 이내에 신청 가능합니다.</li>
          <li>단순 변심의 경우 왕복 배송비가 부과될 수 있습니다.</li>
        </ul>
      </div>
    );
  }
  return null;
};


const ProductDetailPage = () => {
  const { actions } = useCart();
  const { productId } = useParams();
  const { setIsLoading } = useUI();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
    
  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      if (String(productId) === String(mockProduct.id)) {
        setProduct(mockProduct);
      } else {
        setError('상품을 찾을 수 없습니다.');
      }
      setIsLoading(false);
    }, 500);
  }, [productId, setIsLoading]);

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };
  const handleAddToCartClick = () => {
    if (product) {
      actions.addToCart(product, quantity);
    }
  };

  // product가 아직 로드되지 않았고 에러도 없다면 로딩 상태로 간주
  if (!product && !error) {
    return null; // 전역 로딩 오버레이가 표시되므로 여기서는 아무것도 렌더링하지 않음
  }

  if (error) {
    return (
      <div className="container">
        <div className={styles.notFound}>
          <h2>{error}</h2>
          <Link to="/products">
            <Button variant="primary">상품 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className={styles.notFound}>
          <h2>해당 상품 정보를 찾을 수 없습니다.</h2>
          <Link to="/products">
            <Button variant="primary">상품 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const formatPrice = (price) => price.toLocaleString();
  const totalPrice = product.price * quantity;
  
  return (
    <div className="container">
      {/* ================================================================== */}
      {/* 👇 이 부분은 사용자께서 보여주신 기존 상품 정보 영역입니다 (그대로 유지) */}
      {/* ================================================================== */}
      <div className={styles.detailLayout}>
        <div className={styles.imageColumn}>
          <img src={product.image} alt={product.name} />
        </div>
        <main className={styles.infoColumn}>
          <p className={styles.brand}>{product.brand}</p>
          <h1>{product.name}</h1>
          <div className={styles.ratingInfo}>
            <span>⭐ {product.rating.toFixed(1)}</span>
            <span>({product.reviewCount.toLocaleString()} 리뷰)</span>
          </div>
          <p className={styles.price}>{formatPrice(product.price)}원</p>
          <div className={styles.quantitySelector}>
            <span>수량</span>
            <div className={styles.controls}>
              <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>
          </div>
          <div className={styles.totalPrice}>
            <span>총 상품 금액</span>
            <p><strong>{formatPrice(totalPrice)}</strong>원</p>
          </div>
          <div className={styles.actionButtons}>
            <Button variant="secondary" size="large" onClick={handleAddToCartClick}>
              장바구니
            </Button>
            <Button variant="primary" size="large">바로 구매</Button>
          </div>
        </main>
      </div>

      {/* ================================================================== */}
      {/* 👇 이 부분이 바로 위 코드 아래에 새로 추가되는 탭 메뉴 영역입니다 */}
      {/* ================================================================== */}
      <div className={styles.tabs}>
        <button onClick={() => setActiveTab('details')} className={activeTab === 'details' ? styles.active : ''}>상세 정보</button>
        <button onClick={() => setActiveTab('reviews')} className={activeTab === 'reviews' ? styles.active : ''}>구매 후기</button>
        <button onClick={() => setActiveTab('shipping')} className={activeTab === 'shipping' ? styles.active : ''}>배송/교환</button>
      </div>
      
      <TabContent product={product} activeTab={activeTab} />
    </div>
  );
};

export default ProductDetailPage;