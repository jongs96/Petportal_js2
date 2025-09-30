// src/components/service/maps/HospitalMapView.jsx

// React 라이브러리를 가져옵니다.
import React from 'react';
// 모든 서비스 지도의 기반이 되는 BaseServiceMapView 컴포넌트를 가져옵니다.
import BaseServiceMapView from '../../common/BaseServiceMapView';
// 지도에서 에러 발생 시 처리할 ErrorBoundary 컴포넌트를 가져옵니다.
import ServiceMapErrorBoundary from '../../common/ServiceMapErrorBoundary';
// 서비스별(카페, 미용 등) 설정을 담고 있는 객체를 가져옵니다.
import { SERVICE_CONFIGS } from '../../../config/serviceMapConfig';

/**
 * HospitalMapView 컴포넌트
 * 
 * 오직 '병원' 서비스에 특화된 지도 뷰를 렌더링하는 컴포넌트입니다.
 * 공통 기능을 가진 `BaseServiceMapView`를 가져와서, 병원에 필요한 고유한 설정과 데이터를
 * props로 전달하는 '래퍼(Wrapper)' 컴포넌트입니다.
 * 
 * @param {object} props - 부모 컴포넌트(예: HospitalPage)로부터 받는 속성들
 */
const HospitalMapView = ({ 
  userLocation, 
  markers = [], 
  filters = {},
  onMarkerClick,
  className = ''
}) => {
  // 서비스 설정 파일에서 '병원'에 대한 설정을 가져옵니다.
  const hospitalConfig = SERVICE_CONFIGS.hospital;

  // 병원 서비스에만 해당하는 필터들을 처리합니다.
  const processedFilters = {
    specialties: filters.specialties || [], // 진료 과목
    emergencyOnly: filters.emergencyOnly || false, // 응급실만 보기
    available24h: filters.available24h || false, // 24시간 운영
    ...filters
  };

  // 병원 마커가 클릭되었을 때 실행될 커스텀 핸들러 함수입니다.
  const handleMarkerClick = (markerData) => {
    console.log('Hospital marker clicked:', markerData);
    
    // 여기에 병원에만 해당하는 특별한 로직을 추가할 수 있습니다.
    if (markerData.serviceData?.isEmergency) {
      console.log('Emergency hospital clicked');
    }
    if (markerData.serviceData?.is24Hours) {
      console.log('24-hour hospital clicked');
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
      serviceType="hospital"
      serviceConfig={hospitalConfig}
      onError={(error, errorInfo) => {
        console.error('HospitalMapView Error:', error);
      }}
    >
      {/* 
        실제 지도 로직을 담고 있는 BaseServiceMapView를 렌더링합니다.
        이때, serviceType을 'hospital'로 명시하고, 병원 전용 필터와 핸들러, 커스텀 설정 등을
        props로 전달하여 BaseServiceMapView가 '병원 지도'처럼 동작하도록 만듭니다.
      */}
      <BaseServiceMapView
        userLocation={userLocation}
        rawMarkers={markers}
        serviceType="hospital" // 이 지도가 '병원' 지도임을 명시
        filters={processedFilters}
        onMarkerClick={handleMarkerClick}
        className={`hospital-map ${className}`}
        customConfig={{
          // 필요한 경우, 기본 설정을 덮어쓰는 커스텀 설정을 전달합니다.
          markerIcon: '🏥',
          accentColor: '#45B7D1',
          backgroundColor: '#F0F9FF',
          emergencyHighlight: true, // 응급실 강조 표시 여부
        }}
      />
    </ServiceMapErrorBoundary>
  );
};

export default HospitalMapView;
