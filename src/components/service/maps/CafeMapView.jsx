// src/components/service/maps/CafeMapView.jsx

// React 라이브러리를 가져옵니다.
import React from 'react';
// 모든 서비스 지도의 기반이 되는 BaseServiceMapView 컴포넌트를 가져옵니다.
import BaseServiceMapView from '../../common/BaseServiceMapView';
// 지도에서 에러 발생 시 처리할 ErrorBoundary 컴포넌트를 가져옵니다.
import ServiceMapErrorBoundary from '../../common/ServiceMapErrorBoundary';
// 서비스별(카페, 미용 등) 설정을 담고 있는 객체를 가져옵니다.
import { SERVICE_CONFIGS } from '../../../config/serviceMapConfig';

/**
 * CafeMapView 컴포넌트
 * 
 * 오직 '카페' 서비스에 특화된 지도 뷰를 렌더링하는 컴포넌트입니다.
 * 공통 기능을 가진 `BaseServiceMapView`를 가져와서, 카페에 필요한 고유한 설정과 데이터를
 * props로 전달하는 '래퍼(Wrapper)' 컴포넌트입니다.
 * 
 * @param {object} props - 부모 컴포넌트(예: CafePage)로부터 받는 속성들
 */
const CafeMapView = ({ 
  userLocation, 
  markers = [], 
  filters = {},
  onMarkerClick,
  className = ''
}) => {
  // 서비스 설정 파일에서 '카페'에 대한 설정을 가져옵니다.
  const cafeConfig = SERVICE_CONFIGS.cafe;

  // 카페 서비스에만 해당하는 필터들을 처리합니다.
  const processedFilters = {
    amenities: filters.amenities || [],
    isOpenOnly: filters.isOpenOnly || false,
    ...filters
  };

  // 카페 마커가 클릭되었을 때 실행될 커스텀 핸들러 함수입니다.
  const handleMarkerClick = (markerData) => {
    console.log('Cafe marker clicked:', markerData);
    
    // 여기에 카페에만 해당하는 특별한 로직을 추가할 수 있습니다.
    // 예를 들어, 마커 데이터에 영업 중이라는 정보가 있으면 콘솔에 출력합니다.
    if (markerData.serviceData?.isOpen) {
      console.log('Cafe is currently open');
    }
    
    // 부모로부터 onMarkerClick 함수를 받았다면, 그대로 실행하여 이벤트를 전달합니다.
    if (onMarkerClick) {
      onMarkerClick(markerData);
    }
  };

  return (
    // ServiceMapErrorBoundary로 감싸서, 이 컴포넌트 내부에서 발생하는 에러를 처리합니다.
    <ServiceMapErrorBoundary
      userLocation={userLocation}
      markers={markers}
      serviceType="cafe"
      serviceConfig={cafeConfig}
      onError={(error, errorInfo) => {
        console.error('CafeMapView Error:', error);
        // 필요하다면 에러 모니터링 서비스에 정보를 보낼 수 있습니다.
      }}
    >
      {/* 
        실제 지도 로직을 담고 있는 BaseServiceMapView를 렌더링합니다.
        이때, serviceType을 'cafe'로 명시하고, 카페 전용 필터와 핸들러, 커스텀 설정 등을
        props로 전달하여 BaseServiceMapView가 '카페 지도'처럼 동작하도록 만듭니다.
      */}
      <BaseServiceMapView
        userLocation={userLocation}
        rawMarkers={markers}
        serviceType="cafe" // 이 지도가 '카페' 지도임을 명시
        filters={processedFilters} // 카페용으로 가공된 필터 전달
        onMarkerClick={handleMarkerClick} // 카페용으로 만들어진 클릭 핸들러 전달
        className={`cafe-map ${className}`}
        customConfig={{
          // 필요한 경우, 기본 설정을 덮어쓰는 커스텀 설정을 전달합니다.
          markerIcon: '☕',
          accentColor: '#4ECDC4',
          backgroundColor: '#F0FDFC',
          statusIndicators: true, // 카페의 영업 상태 표시 여부
        }}
      />
    </ServiceMapErrorBoundary>
  );
};

export default CafeMapView;
