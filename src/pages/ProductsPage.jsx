import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../contexts/SearchContext';
import productsPageStyles from './ProductsPage.module.css'; // Import ProductsPage.module.css
import layoutStyles from './commonLayout.module.css'; // Import commonLayout.module.css

// Mock Data for Products
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
    description: '관절 건강에 좋은 사료',
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
    description: '고양이들이 좋아하는 스틱 간식',
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
    description: '고양이 스트레스 해소 장난감',
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
    description: '따뜻하고 편안한 강아지 패딩',
  },
];

const ProductsPage = () => {
  const { searchTerm } = useSearch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching products
    setLoading(true);
    setError(null);
    setTimeout(() => {
      let filteredProducts = mockProducts;

      if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setProducts(filteredProducts);
      setLoading(false);
    }, 500);
  }, [searchTerm]);

  if (loading) {
    return <div>제품을 불러오는 중...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>오류: {error.message || '제품 데이터를 불러오는 중 오류가 발생했습니다.'}</div>;
  }

  return (
    <div className={layoutStyles.pageContainer}>
      <main className={layoutStyles.pageLayout}>
        {/* 사이드바 (카테고리 등) - ProductsPage.module.css에 정의된 스타일 사용 */}
        <aside className={layoutStyles.sidebar}>
          <nav className={productsPageStyles.categoryNav}>
            <h3>카테고리</h3>
            <ul>
              <li><button className={productsPageStyles.active}>전체</button></li>
              <li><button>사료</button></li>
              <li><button>간식</button></li>
              <li><button>장난감</button></li>
              <li><button>의류</button></li>
              <li><button>위생/배변</button></li>
              <li><button>급식기/급수기</button></li>
              <li><button>리빙</button></li>
            </ul>
          </nav>
        </aside>

        {/* 메인 컨텐츠 (상품 목록) */}
        <div className={layoutStyles.mainContent}>
          <header className={productsPageStyles.pageHeader}>
            <h1>반려용품</h1>
            <p>다양한 반려동물 용품을 만나보세요.</p>
          </header>

          <div className={productsPageStyles.productGridContainer}>
            <div className={productsPageStyles.contentHeader}>
              총 {products.length}개의 상품이 있습니다.
            </div>
            {products.length > 0 ? (
              <ul className={productsPageStyles.productGrid}>
                {products.map(product => (
                  <li key={product.id}>
                    <Link to={`/products/${product.id}`} className={productsPageStyles.productItemLink}>
                      {/* 상품 이미지 */}
                      <div className={productsPageStyles.productImageWrapper}>
                        <img src={product.imageUrl || 'https://placehold.co/250'} alt={product.name} className={productsPageStyles.productImage} />
                      </div>
                      {/* 상품 정보 */}
                      <div className={productsPageStyles.productInfo}>
                        <h3 className={productsPageStyles.productName}>{product.name}</h3>
                        <p className={productsPageStyles.productCategory}>{product.category}</p>
                        <p className={productsPageStyles.productPrice}>{product.price.toLocaleString()}원</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>검색 결과가 없습니다.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;
