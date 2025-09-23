// src/components/common/CartIcon.jsx

// React 라이브러리와 `useNavigate` 훅, `useCart` 훅을 가져옵니다.
import React from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 사용합니다.
import { useCart } from '../../contexts/CartContext'; // 장바구니 상태에 접근하기 위해 사용합니다.
import styles from './CartIcon.module.css'; // 이 컴포넌트 전용 CSS 모듈입니다.

/**
 * CartIcon 컴포넌트
 * 
 * 헤더에 표시되는 장바구니 아이콘입니다.
 * 장바구니에 담긴 상품의 총 수량을 뱃지(badge) 형태로 보여주며,
 * 클릭 시 장바구니 페이지('/cart')로 이동합니다.
 */
const CartIcon = () => {
  // `useNavigate` 훅을 사용하여 페이지를 이동시키는 함수를 가져옵니다.
  const navigate = useNavigate();
  // `useCart` 훅을 사용하여 장바구니에 담긴 상품 목록(cartItems)을 가져옵니다.
  // `|| { cartItems: [] }` 부분은 CartContext가 아직 준비되지 않았을 때 오류가 발생하는 것을 방지하는 안전장치입니다.
  const { cartItems } = useCart() || { cartItems: [] };
  
  // `reduce` 메소드를 사용하여 장바구니에 있는 모든 상품의 수량(quantity)을 합산합니다.
  // `sum`은 누적값, `item`은 각 상품 객체이며, 초기 누적값은 0입니다.
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // 장바구니 아이콘을 클릭했을 때 호출되는 함수입니다.
  const handleCartClick = () => {
    navigate('/cart'); // 장바구니 페이지로 이동합니다.
  };

  return (
    // 전체 컨테이너를 클릭하면 `handleCartClick` 함수가 호출됩니다.
    <div className={styles.cartContainer} onClick={handleCartClick}>
      {/* SVG(Scalable Vector Graphics)로 장바구니 아이콘을 그립니다. */}
      <div className={styles.cartIcon}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="m1 1 4 4 1 0 13 2-3 7H7l-1.65-5H5L2 2H1"></path>
        </svg>
      </div>
      {/* 조건부 렌더링: 장바구니에 담긴 상품의 총 개수(totalItems)가 0보다 클 때만 뱃지를 표시합니다. */}
      {totalItems > 0 && (
        <div className={styles.badge}>
          {/* 상품 개수가 99개를 초과하면 '99+'로 표시하고, 그렇지 않으면 실제 개수를 표시합니다. */}
          {totalItems > 99 ? '99+' : totalItems}
        </div>
      )}
    </div>
  );
};

// CartIcon 컴포넌트를 다른 파일에서 재사용할 수 있도록 내보냅니다.
export default CartIcon;
