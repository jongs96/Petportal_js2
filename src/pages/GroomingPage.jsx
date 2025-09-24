// React와 훅(hook)들을 가져옵니다.
import React, { useEffect, useMemo, useState, useCallback } from 'react';

// 관련 컴포넌트들을 가져옵니다.
import MapView from '../components/common/MapView'; // 지도 뷰 컴포넌트
import GroomingCardGrid from '../components/grooming/GroomingCardGrid'; // 미용 서비스 카드 그리드
import FilterSection from '../components/common/FilterSection'; // 필터링 섹션

// CSS 모듈들을 가져옵니다.
import pageStyles from './Page.module.css'; // 공통 페이지 스타일
import mapStyles from './MapPage.module.css'; // 지도 관련 페이지 스타일
import styles from './GroomingPage.module.css'; // 미용 페이지 전용 스타일

// 유틸리티 함수를 가져옵니다.
import { getDistance } from '../utils/locationUtils'; // 거리 계산 유틸리티 (현재는 미사용)

// 분리된 목업 데이터 파일을 가져옵니다.
import { mockGroomingServices } from '../data/mockGroomingData.js';

/**
 * GroomingPage 컴포넌트
 * 
 * 펫 미용 서비스 정보를 보여주는 페이지입니다.
 * 지도, 필터, 그리고 미용실 목록을 카드 형태로 제공합니다.
 */
const GroomingPage = () => {
  // `useState` 훅을 사용하여 컴포넌트의 상태를 관리합니다.
  const [userLocation, setUserLocation] = useState(null); // 사용자의 현재 위치
  const [filters, setFilters] = useState({ // 적용된 필터 목록
    location: '',
    date: '',
    time: '',
    groomingTypes: [],
    targetAnimals: []
  });
  const [groomings, setGroomings] = useState([]); // 필터링된 미용실 목록
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // 모바일 화면 여부

  // 화면 크기가 변경될 때 isMobile 상태를 업데이트하는 `useEffect`
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 필터나 사용자 위치가 변경될 때마다 미용실 데이터를 필터링하는 `useEffect`
  useEffect(() => {
    setLoading(true);
    setError(null);
    // 실제 API 호출 대신 `setTimeout`으로 비동기 데이터 로딩을 시뮬레이션합니다.
    setTimeout(() => {
      let result = mockGroomingServices;

      // 위치(지역명/이름) 필터링
      if (filters.location) {
          result = result.filter(grooming =>
              grooming.name.toLowerCase().includes(filters.location.toLowerCase()) ||
              grooming.address.toLowerCase().includes(filters.location.toLowerCase())
          );
      }
      // 미용 종류 필터링
      if (filters.groomingTypes.length > 0) {
          result = result.filter(grooming => filters.groomingTypes.every(type => (grooming.services || []).includes(type)));
      }
      // 대상 동물 필터링
      if (filters.targetAnimals.length > 0) {
          result = result.filter(grooming => filters.targetAnimals.every(animal => (grooming.targetAnimals || []).includes(animal)));
      }

      setGroomings(result); // 필터링된 결과를 상태에 저장
      setLoading(false); // 로딩 상태 종료
    }, 500); // 0.5초 지연
  }, [filters, userLocation]);

  // 컴포넌트가 처음 마운트될 때 사용자의 현재 위치를 가져오는 `useEffect`
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        setError(new Error('위치 정보를 가져올 수 없습니다. 기본 위치로 지도를 표시합니다.'));
        setUserLocation({ lat: 37.5665, lng: 126.9780 }); // 실패 시 기본 위치(서울)로 설정
      }
    );
  }, []);

  // `useMemo` 훅을 사용하여 `groomings` 데이터가 변경될 때만 지도 마커를 새로 계산합니다.
  // 이는 불필요한 재계산을 방지하여 성능을 최적화합니다.
  const markers = useMemo(() => groomings.map(({ id, lat, lng, name }) => ({ id, lat, lng, name })), [groomings]);

  // 텍스트 입력 필터(위치, 날짜, 시간) 값이 변경될 때 호출되는 핸들러
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  // 체크박스 필터(미용 종류, 대상 동물) 값이 변경될 때 호출되는 핸들러
  const handleToggleFilter = (filterType, value) => {
    setFilters((prev) => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value) // 이미 선택된 값이면 배열에서 제거
        : [...currentValues, value]; // 선택되지 않은 값이면 배열에 추가
      return { ...prev, [filterType]: newValues };
    });
  };

  // 로딩 중일 때 표시할 UI
  if (loading) {
    return <div className={pageStyles.pageContainer}>미용 정보를 불러오는 중...</div>;
  }

  // 에러 발생 시 표시할 UI
  if (error) {
    return <div className={pageStyles.pageContainer} style={{ color: 'red' }}>오류: {error.message || '데이터를 불러오는 중 오류가 발생했습니다.'}</div>;
  }

  // 메인 페이지 UI 렌더링
  return (
    <div className={pageStyles.pageContainer}>
      <header className={pageStyles.pageHeader}>
        <h1 className={pageStyles.pageTitle}>펫 미용</h1>
        <p className={pageStyles.pageSubtitle}>전문 그루머가 제공하는 최고의 반려동물 미용 서비스</p>
      </header>

      <div className={mapStyles.mapWrapper}>
        <div className={mapStyles.filterPanel}>
          {/* 필터 섹션 컴포넌트 */}
          <FilterSection
            locationPlaceholder="미용실명이나 지역을 검색해보세요"
            onLocationChange={(value) => handleFilterChange('location', value)}
            isMobile={isMobile}
          >
            {/* 날짜 및 시간 선택 필터 */}
            <div className={mapStyles.filterGroup}>
              {/* ... 날짜 및 시간 입력 UI ... */}
            </div>
            {/* 미용 종류 선택 필터 */}
            <div className={mapStyles.filterGroup}>
              <label className={mapStyles.filterLabel}>미용 종류</label>
              <div className={mapStyles.checkboxContainer}>
                {['목욕', '부분미용', '전체미용', '스타일링', '스파', '마사지', '무마취 미용', '고양이전문', '네일케어'].map(type => (
                  <label key={type} className={mapStyles.checkboxLabel}>
                    <input type="checkbox" value={type}
                      checked={filters.groomingTypes.includes(type)}
                      onChange={() => handleToggleFilter('groomingTypes', type)}
                      className={mapStyles.checkboxInput}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
            {/* 대상 동물 선택 필터 */}
            <div className={mapStyles.filterGroup}>
              <label className={mapStyles.filterLabel}>대상 동물</label>
              <div className={mapStyles.checkboxContainer}>
                {['강아지', '고양이', '특수동물'].map(animal => (
                  <label key={animal} className={mapStyles.checkboxLabel}>
                    <input type="checkbox" value={animal}
                      checked={filters.targetAnimals.includes(animal)}
                      onChange={() => handleToggleFilter('targetAnimals', animal)}
                      className={mapStyles.checkboxInput}
                    />
                    {animal}
                  </label>
                ))}
              </div>
            </div>
          </FilterSection>
        </div>
        <div className={mapStyles.mapContainer}>
          {/* 지도 뷰 컴포넌트. 사용자 위치와 필터링된 마커들을 전달합니다. */}
          <MapView userLocation={userLocation} markers={markers} />
        </div>
      </div>

      {/* 필터링된 미용실 목록을 카드 그리드로 표시합니다. */}
      <GroomingCardGrid items={groomings} />
    </div>
  );
};

export default GroomingPage;
