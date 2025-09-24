// src/components/common/FilterSection.jsx

// React와 훅(useState, useEffect)을 가져옵니다.
import React, { useState, useEffect } from 'react';
// 이 컴포넌트 전용 CSS 모듈을 가져옵니다.
import styles from './FilterSection.module.css';
// 검색 아이콘 이미지를 가져옵니다.
import searchIcon from '../../assets/search.png';

/**
 * FilterSection 컴포넌트
 * 
 * 검색 및 필터링 UI를 제공하는 재사용 가능한 컴포넌트입니다.
 * 기본적인 위치 검색창을 포함하며, 추가적인 상세 필터들을 `children`으로 받아 표시할 수 있습니다.
 * 모바일과 데스크톱 환경에 따라 다르게 동작합니다.
 * 
 * @param {object} props - 부모 컴포넌트로부터 받는 속성들
 * @param {React.ReactNode} props.children - 상세 필터 UI 요소들. 이 컴포넌트 내부에 렌더링됩니다.
 * @param {string} props.locationPlaceholder - 위치 검색창에 표시될 안내 문구
 * @param {function} props.onLocationChange - 위치 검색창의 값이 변경될 때 호출될 함수
 * @param {boolean} props.isMobile - 현재 화면이 모바일 크기인지 여부
 */
const FilterSection = ({ children, locationPlaceholder, onLocationChange, isMobile }) => {
    // `useState`를 사용하여 컴포넌트의 상태를 관리합니다.
    // isFilterVisible: 상세 필터 영역의 표시 여부를 결정합니다. 모바일이 아닐 때(데스크톱)는 기본적으로 보이도록 설정합니다.
    const [isFilterVisible, setIsFilterVisible] = useState(!isMobile);
    // location: 위치 검색창의 현재 입력값을 저장합니다.
    const [location, setLocation] = useState('');

    // `useEffect`를 사용하여 `isMobile` prop이 변경될 때마다 side effect를 처리합니다.
    useEffect(() => {
        // 부모로부터 받은 isMobile 값에 따라 상세 필터의 표시 여부를 동기화합니다.
        // 예를 들어, 창 크기가 데스크톱에서 모바일로 바뀌면 상세 필터를 숨깁니다.
        setIsFilterVisible(!isMobile);
    }, [isMobile]); // isMobile 값이 변경될 때마다 이 effect가 실행됩니다.

    // 위치 검색창의 값이 변경될 때 호출되는 함수입니다.
    const handleLocationChange = (e) => {
        const newValue = e.target.value;
        setLocation(newValue); // 내부 상태를 업데이트합니다.
        
        // 부모로부터 `onLocationChange` 함수를 받았다면, 그 함수를 호출하여 변경된 값을 전달합니다.
        if (onLocationChange) {
            onLocationChange(newValue);
        }
    };

    return (
        <div className={styles.filterContainer}>
            <div className={styles.searchAndToggle}>
                {/* 위치 검색창 UI */}
                <div className={styles.filterInputWrapper}>
                    <img src={searchIcon} alt="돋보기 아이콘" className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder={locationPlaceholder}
                        value={location}
                        onChange={handleLocationChange}
                        className={styles.filterInput}
                    />
                </div>
                
                {/* 모바일 화면일 경우에만 "상세 필터" 토글 버튼을 보여줍니다. (조건부 렌더링) */}
                {isMobile && (
                    <button
                        // 클릭 시 isFilterVisible 상태를 반전시킵니다 (true -> false, false -> true).
                        onClick={() => setIsFilterVisible(!isFilterVisible)}
                        className={styles.toggleButton}
                        aria-expanded={isFilterVisible} // 스크린 리더 사용자를 위해 확장/축소 상태를 알려줍니다.
                    >
                        상세 필터 {isFilterVisible ? '▲' : '▼'} {/* 필터 표시 여부에 따라 아이콘 변경 */}
                    </button>
                )}
            </div>
            
            {/* isFilterVisible 상태가 true일 때만 상세 필터 영역을 보여줍니다. */}
            {isFilterVisible && (
                <div className={styles.advancedFilters}>
                    {/* 부모 컴포넌트에서 이 컴포넌트의 자식으로 넣은 모든 요소들이 여기에 렌더링됩니다. */}
                    {children}
                </div>
            )}
        </div>
    );
};

// FilterSection 컴포넌트를 다른 파일에서 재사용할 수 있도록 내보냅니다.
export default FilterSection;
