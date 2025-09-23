import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CartPage.module.css';
import Button from '../components/ui/Button';
import { useCart } from '../contexts/CartContext'; 

const SHIPPING_FEE = 3000;
const FREE_SHIPPING_THRESHOLD = 50000;

const CartPage = () => {
  const { cartItems, actions } = useCart();
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const formatPrice = (price) => price.toLocaleString();

  return (
    // 👇 cartPageContainer 클래스를 제거하고 container 클래스만 남깁니다.
    <div className="container">
      <header className={styles.pageHeader}>
        <h1>장바구니</h1>
      </header>
      
      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>장바구니에 담긴 상품이 없습니다.</p>
          <Link to="/products">
            <Button variant="primary" size="large">쇼핑 계속하기</Button>
          </Link>
        </div>
      ) : (
        <div className={styles.cartLayout}>
          <div className={styles.itemList}>
            {cartItems.map(item => (
              <div key={item.id} className={styles.item}>
                <img src={item.image} alt={item.name} />
                <div className={styles.itemInfo}>
                  <p className={styles.brand}>{item.brand}</p>
                  <p className={styles.name}>{item.name}</p>
                  <p className={styles.price}>{formatPrice(item.price)}원</p>
                </div>
                <div className={styles.itemControls}>
                <div className={styles.quantitySelector}>
                  {/* 👇 actions.updateCartQuantity로 함수 호출 수정 */}
                  <button onClick={() => actions.updateCartQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => actions.updateCartQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                  <p className={styles.itemTotal}>{formatPrice(item.price * item.quantity)}원</p>
                  <button onClick={() => actions.removeFromCart(item.id)} className={styles.removeButton}>×</button>
                  </div>
              </div>
            ))}
          </div>

          <aside className={styles.summary}>
            <h2>결제 예상 금액</h2>
            <div className={styles.summaryRow}>
              <span>상품 금액</span>
              <span>{formatPrice(subtotal)}원</span>
            </div>
            <div className={styles.summaryRow}>
              <span>배송비</span>
              <span>{shippingFee > 0 ? `${formatPrice(shippingFee)}원` : '무료'}</span>
            </div>
            {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD &&
              <p className={styles.shippingInfo}>
                {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}원 추가 주문 시 무료배송
              </p>
            }
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>총 결제 예상 금액</span>
              <span>{formatPrice(total)}원</span>
            </div>
            <Button variant="primary" size="large" className={styles.orderButton}>주문하기</Button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartPage;