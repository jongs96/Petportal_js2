// src/pages/PetSuppliesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './PetSuppliesPage.module.css';

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
    stockQuantity: 10,
    isBest: true,
    isFeatured: false,
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
    stockQuantity: 5,
    isBest: true,
    isFeatured: true,
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
    stockQuantity: 0,
    isBest: false,
    isFeatured: false,
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
    stockQuantity: 20,
    isBest: false,
    isFeatured: false,
  },
];

const mockCategories = ['사료', '간식', '장난감', '의류', '위생/배변', '급식기/급수기', '리빙'];

const PetSuppliesPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { category } = useParams();

  useEffect(() => {
    // Simulate fetching categories
    setCategories(mockCategories);
  }, []);

  useEffect(() => {
    // Simulate fetching products with filters
    setLoading(true);
    setTimeout(() => {
      let filteredProducts = mockProducts;

      if (selectedCategory || category) {
        const currentCategory = selectedCategory || category;
        filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
      }
      if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setProducts(filteredProducts);
      setTotalPages(Math.ceil(filteredProducts.length / 12)); // Assuming 12 items per page
      setLoading(false);
    }, 500);
  }, [currentPage, selectedCategory, searchTerm, category]);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
    setCurrentPage(1);
    navigate(categoryName ? `/pet-supplies/category/${categoryName}` : '/pet-supplies');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleProductClick = (productId) => {
    navigate(`/pet-supplies/${productId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>반려용품</h1>
        <p className={styles.subtitle}>우리 아이를 위한 특별한 용품들을 만나보세요</p>
      </div>

      {/* 검색 및 필터 */}
      <div className={styles.filterSection}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="상품명을 검색하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            검색
          </button>
        </form>

        <div className={styles.categoryFilter}>
          <button
            className={`${styles.categoryButton} ${!selectedCategory ? styles.active : ''}`}
            onClick={() => handleCategoryChange('')}
          >
            전체
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.categoryButton} ${selectedCategory === cat ? styles.active : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 상품 목록 */}
      {loading ? (
        <div className={styles.loading}>상품을 불러오는 중...</div>
      ) : (
        <>
          <div className={styles.productsGrid}>
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className={styles.productCard}
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className={styles.imageWrapper}>
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'}
                      alt={product.name}
                      className={styles.productImage}
                    />
                    {product.isBest && (
                      <span className={styles.bestBadge}>BEST</span>
                    )}
                    {product.isFeatured && (
                      <span className={styles.featuredBadge}>추천</span>
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.category}>{product.category}</div>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productDescription}>{product.description}</p>
                    <div className={styles.productMeta}>
                      <span className={styles.price}>{formatPrice(product.price)}</span>
                      {product.rating > 0 && (
                        <div className={styles.rating}>
                          <span className={styles.stars}>⭐</span>
                          <span className={styles.ratingText}>{product.rating}</span>
                        </div>
                      )}
                    </div>
                    {product.brand && (
                      <div className={styles.brand}>{product.brand}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noProducts}>
                <p>검색 결과가 없습니다.</p>
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageButton}
              >
                이전
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.pageButton}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PetSuppliesPage;