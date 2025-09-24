// src/components/grooming/GroomingCardGrid.jsx

// React와 react-router-dom의 Link 컴포넌트를 가져옵니다.
import React from 'react';
import { Link } from 'react-router-dom';
// 이 컴포넌트 전용 CSS 모듈을 가져옵니다.
import styles from './GroomingCardGrid.module.css';

/**
 * GroomingCardGrid 컴포넌트
 * 
 * 여러 개의 미용실 정보를 카드 형태로 격자(Grid) 레이아웃에 표시하는 역할을 합니다.
 * 부모 컴포넌트로부터 미용실 목록(`items`)을 받아와 화면에 렌더링합니다.
 * 각 카드는 클릭 가능한 링크로, 클릭 시 해당 업체의 상세 페이지로 이동합니다.
 * 
 * @param {object} props - 부모 컴포넌트로부터 받는 속성들
 * @param {Array} props.items - 화면에 표시할 미용실 데이터 배열. 기본값은 빈 배열입니다.
 */
const GroomingCardGrid = ({ items = [] }) => {
  // 만약 `items` 배열의 길이가 0이라면 (즉, 표시할 아이템이 없다면)
  if (!items.length) {
    // "검색 결과가 없습니다"와 같은 메시지를 사용자에게 보여줍니다.
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>✂️</div>
        <h3>검색 결과가 없습니다</h3>
        <p>다른 조건으로 검색해보세요.</p>
      </div>
    );
  }

  // 표시할 아이템이 있는 경우, 그리드 컨테이너를 렌더링합니다.
  return (
    <div className={styles.gridContainer}>
      <div className={styles.grid}>
        {/* `items` 배열을 `map` 함수로 순회하면서 각 `item`에 대한 카드 UI를 생성합니다. */}
        {items.map(item => (
          // Link 컴포넌트로 카드 전체를 감싸서 클릭 가능한 링크로 만듭니다.
          // `to` prop은 이동할 경로를 지정하며, 동적으로 각 아이템의 id를 포함한 URL을 생성합니다.
          // `key` prop은 React가 리스트의 각 항목을 효율적으로 식별하고 업데이트하기 위해 반드시 필요합니다.
          <Link to={`/grooming/${item.id}`} key={item.id} className={styles.cardLink}>
            <div className={styles.card}>
              {/* 카드 상단의 이미지 영역 */}
              <div className={styles.cardImage}>
                <img
                  // item.imageUrl이 있으면 그 값을, 없으면 임시 이미지 주소를 사용합니다.
                  src={item.imageUrl || '/api/placeholder/300/200'}
                  alt={item.name} // 이미지를 설명하는 대체 텍스트
                  // 이미지 로딩에 실패했을 경우, 임시 이미지로 대체합니다.
                  onError={(e) => {
                    e.target.src = '/api/placeholder/300/200';
                  }}
                />
                {/* 평점(rating) 정보가 있을 경우에만 평점을 표시합니다. (조건부 렌더링) */}
                {item.rating && (
                  <div className={styles.rating}>
                    <span className={styles.star}>⭐</span>
                    {item.rating}
                  </div>
                )}
              </div>

              {/* 카드 하단의 콘텐츠 영역 */}
              <div className={styles.cardContent}>
                <h3 className={styles.name}>{item.name}</h3>
                <p className={styles.address}>{item.address}</p>

                {/* 제공 서비스(services) 정보가 있고, 1개 이상일 경우에만 서비스 태그를 표시합니다. */}
                {item.services && item.services.length > 0 && (
                  <div className={styles.services}>
                    {/* 서비스 목록 중 최대 3개까지만 태그로 보여줍니다. */}
                    {item.services.slice(0, 3).map((service, index) => (
                      <span key={index} className={styles.serviceTag}>
                        {service}
                      </span>
                    ))}
                    {/* 서비스가 3개를 초과하면, "+n개" 형식으로 추가 서비스가 있음을 알려줍니다. */}
                    {item.services.length > 3 && (
                      <span className={styles.moreServices}>
                        +{item.services.length - 3}개
                      </span>
                    )}
                  </div>
                )}

                {/* 카드 맨 아래의 추가 정보(전화번호, 가격대 등) 영역 */}
                <div className={styles.cardFooter}>
                  {/* 전화번호가 있을 경우에만 표시 */}
                  {item.phone && (
                    <div className={styles.phone}>
                      📞 {item.phone}
                    </div>
                  )}
                  {/* 가격대 정보가 있을 경우에만 표시 */}
                  {item.priceRange && (
                    <div className={styles.priceRange}>
                      {/* 가격대에 따라 다른 아이콘을 보여줍니다. */}
                      {item.priceRange === 'low' ? '💰' :
                       item.priceRange === 'medium' ? '💰💰' : '💰💰💰'}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// GroomingCardGrid 컴포넌트를 다른 파일에서 재사용할 수 있도록 내보냅니다.
export default GroomingCardGrid;
