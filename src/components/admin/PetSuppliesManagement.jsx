// src/components/admin/PetSuppliesManagement.jsx
import React, { useState, useEffect } from 'react';
import styles from './PetSuppliesManagement.module.css';

// Mock Data for Pet Supplies
const mockProducts = [
  {
    id: 1,
    name: '튼튼 관절 저알러지 사료',
    description: '연어 베이스의 관절 건강 사료',
    price: 58000,
    category: '사료',
    imageUrl: 'https://picsum.photos/seed/dogfood1/600/600',
    stockQuantity: 100,
    isFeatured: true,
    isBest: true,
    brand: '헬시펫',
    rating: 4.9,
    reviewCount: 1204,
  },
  {
    id: 2,
    name: '냥냥펀치 치킨맛 스틱 간식',
    description: '고양이용 치킨맛 스틱 간식',
    price: 12500,
    category: '간식',
    imageUrl: 'https://picsum.photos/seed/cattreat1/600/600',
    stockQuantity: 50,
    isFeatured: false,
    isBest: true,
    brand: '캣딜라이트',
    rating: 4.8,
    reviewCount: 3450,
  },
];

const mockCategories = ['사료', '간식', '장난감', '의류', '위생/배변', '급식기/급수기', '리빙'];

const PetSuppliesManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    stockQuantity: '',
    isFeatured: false,
    isBest: false,
    brand: '',
    rating: '',
    reviewCount: ''
  });

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setProducts(mockProducts);
      setCategories(mockCategories);
      setTotalPages(1); // Mock data has only one page
      setLoading(false);
    }, 500);
  }, [currentPage, selectedCategory, searchTerm]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/pet-supplies/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('카테고리 조회 실패:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        // Edit existing product
        setProducts(prev => prev.map(p => 
          p.id === editingProduct.id 
            ? { 
                ...p, 
                ...formData, 
                price: parseInt(formData.price), 
                stockQuantity: parseInt(formData.stockQuantity) || 0, 
                rating: parseFloat(formData.rating) || 0, 
                reviewCount: parseInt(formData.reviewCount) || 0 
              }
            : p
        ));
        alert('상품이 수정되었습니다.');
      } else {
        // Add new product
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = {
          id: newId,
          ...formData,
          price: parseInt(formData.price),
          stockQuantity: parseInt(formData.stockQuantity) || 0,
          rating: parseFloat(formData.rating) || 0,
          reviewCount: parseInt(formData.reviewCount) || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setProducts(prev => [...prev, newProduct]);
        alert('상품이 추가되었습니다.');
      }
      resetForm();
    } catch (error) {
      console.error('상품 저장 실패:', error);
      alert('상품 저장 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      imageUrl: product.imageUrl || '',
      stockQuantity: product.stockQuantity.toString(),
      isFeatured: product.isFeatured || false,
      isBest: product.isBest || false,
      brand: product.brand || '',
      rating: product.rating ? product.rating.toString() : '',
      reviewCount: product.reviewCount ? product.reviewCount.toString() : ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setProducts(prev => prev.filter(product => product.id !== productId));
      alert('상품이 삭제되었습니다.');
    } catch (error) {
      console.error('상품 삭제 실패:', error);
      alert('상품 삭제 중 오류가 발생했습니다.');
    }
  };

  const toggleBestProduct = async (productId) => {
    try {
      setProducts(prev => prev.map(product => 
        product.id === productId ? { ...product, isBest: !product.isBest } : product
      ));
    } catch (error) {
      console.error('베스트 상품 설정 실패:', error);
    }
  };

  const toggleFeaturedProduct = async (productId) => {
    try {
      setProducts(prev => prev.map(product => 
        product.id === productId ? { ...product, isFeatured: !product.isFeatured } : product
      ));
    } catch (error) {
      console.error('추천 상품 설정 실패:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: '',
      stockQuantity: '',
      isFeatured: false,
      isBest: false,
      brand: '',
      rating: '',
      reviewCount: ''
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>반려용품 관리</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className={styles.addButton}
        >
          상품 추가
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className={styles.filterSection}>
        <input
          type="text"
          placeholder="상품명 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.categorySelect}
        >
          <option value="">전체 카테고리</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* 상품 목록 */}
      {loading ? (
        <div className={styles.loading}>로딩 중...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>이미지</th>
                <th>상품명</th>
                <th>카테고리</th>
                <th>가격</th>
                <th>재고</th>
                <th>평점</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=100'}
                      alt={product.name}
                      className={styles.productImage}
                    />
                  </td>
                  <td>
                    <div className={styles.productInfo}>
                      <div className={styles.productName}>{product.name}</div>
                      {product.brand && (
                        <div className={styles.productBrand}>{product.brand}</div>
                      )}
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>
                    <span className={`${styles.stock} ${product.stockQuantity > 0 ? styles.inStock : styles.outOfStock}`}>
                      {product.stockQuantity}개
                    </span>
                  </td>
                  <td>
                    {product.rating > 0 && (
                      <div className={styles.rating}>
                        ⭐ {product.rating} ({product.reviewCount})
                      </div>
                    )}
                  </td>
                  <td>
                    <div className={styles.badges}>
                      {product.isBest && <span className={styles.bestBadge}>BEST</span>}
                      {product.isFeatured && <span className={styles.featuredBadge}>추천</span>}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleEdit(product)}
                        className={styles.editButton}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => toggleBestProduct(product.id)}
                        className={`${styles.toggleButton} ${product.isBest ? styles.active : ''}`}
                      >
                        BEST
                      </button>
                      <button
                        onClick={() => toggleFeaturedProduct(product.id)}
                        className={`${styles.toggleButton} ${product.isFeatured ? styles.active : ''}`}
                      >
                        추천
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className={styles.deleteButton}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* 상품 추가/수정 모달 */}
      {showAddForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editingProduct ? '상품 수정' : '상품 추가'}</h3>
              <button onClick={resetForm} className={styles.closeButton}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>상품명 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>브랜드</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>가격 *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>카테고리 *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="">카테고리 선택</option>
                    <option value="사료">사료</option>
                    <option value="간식">간식</option>
                    <option value="장난감">장난감</option>
                    <option value="미용/목욕">미용/목욕</option>
                    <option value="의류/악세서리">의류/악세서리</option>
                    <option value="침구/쿠션">침구/쿠션</option>
                    <option value="건강관리">건강관리</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>이미지 URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>재고 수량</label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                    min="0"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>평점</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>리뷰 수</label>
                <input
                  type="number"
                  value={formData.reviewCount}
                  onChange={(e) => setFormData({...formData, reviewCount: e.target.value})}
                  min="0"
                />
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={formData.isBest}
                    onChange={(e) => setFormData({...formData, isBest: e.target.checked})}
                  />
                  베스트 상품
                </label>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                  />
                  추천 상품
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={resetForm} className={styles.cancelButton}>
                  취소
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingProduct ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetSuppliesManagement;