// src/components/common/BaseServiceMapView.jsx

// React와 훅(useEffect, useRef, useState, useMemo)을 가져옵니다.
import React, { useEffect, useRef, useState, useMemo } from 'react';
// 카카오맵 스크립트를 동적으로 로드하는 유틸리티 함수를 가져옵니다.
import { loadKakaoMap } from '../../utils/loadKakaoMap';
// 에러 발생 시 보여줄 대체용 단순 지도 컴포넌트를 가져옵니다.
import { SimpleMapView } from './SimpleMapView';
// 지도 관련 설정을 담고 있는 객체를 가져옵니다. (예: 서비스별 색상, 아이콘 등)
import { SERVICE_CONFIGS } from '../../config/serviceMapConfig';
// 서비스별 마커 데이터를 생성하고 필터링하는 유틸리티 함수들을 가져옵니다.
import { generateServiceMarkers, filterServiceMarkers } from '../../utils/serviceMapUtils';
// 지도 관련 에러 처리 및 성능 모니터링을 위한 유틸리티들을 가져옵니다.
import { 
  handleKakaoMapError, 
  handleMarkerError, 
  serviceMapPerformanceMonitor 
} from '../../utils/serviceMapErrorHandler';
// 지도 접근성 관련 CSS를 가져옵니다.
import '../service/maps/ServiceMapAccessibility.css';

// BaseServiceMapView 컴포넌트
// 모든 서비스(미용, 병원, 카페 등) 지도들의 공통 기반이 되는 컴포넌트입니다.
// 지도 로딩, 마커 생성, 에러 처리 등 공통 로직을 모두 처리하며,
// `serviceType` prop을 받아 각 서비스에 맞는 약간의 다른 설정(색상, 아이콘 등)을 적용합니다.
const BaseServiceMapView = ({ 
  userLocation, 
  rawMarkers = [], 
  serviceType = 'grooming',
  filters = {},
  onMarkerClick,
  className = '',
  customConfig = {}
}) => {
  // --- React 훅(Hook) 선언부 ---
  const mapRef = useRef(null); // 지도가 그려질 div 요소를 참조
  const mapInstance = useRef(null); // 생성된 카카오맵 인스턴스를 저장
  const markerInstances = useRef([]); // 업체 마커 인스턴스들을 저장
  const userMarkerRef = useRef(null); // 사용자 위치 마커 인스턴스를 저장
  const infoWindows = useRef([]); // 정보창 인스턴스들을 저장
  const [kakaoMaps, setKakaoMaps] = useState(null); // 카카오맵 API 객체
  const [error, setError] = useState(null); // 에러 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  // --- 데이터 처리부 ---
  // `useMemo` 훅: 의존성 배열의 값이 변경될 때만 함수를 실행하여 결과를 메모라이징(기억)합니다. 불필요한 재계산을 막아 성능을 최적화합니다.
  // 서비스 설정을 가져옵니다. (기본 설정 + 커스텀 설정)
  const serviceConfig = useMemo(() => ({
    ...SERVICE_CONFIGS[serviceType],
    ...customConfig
  }), [serviceType, customConfig]);

  // 원본 마커 데이터가 변경될 때만 마커를 새로 생성하고 필터링합니다.
  const processedMarkers = useMemo(() => {
    const serviceMarkers = generateServiceMarkers(rawMarkers, serviceType);
    return filterServiceMarkers(serviceMarkers, filters, serviceType);
  }, [rawMarkers, serviceType, filters]);

  // --- useEffect 훅: Side Effect 처리부 ---

  // 1) 카카오맵 스크립트를 로드하는 effect
  useEffect(() => {
    const loadTimer = serviceMapPerformanceMonitor.startTiming('kakao_map_load');
    const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY; // .env 파일에서 API 키 가져오기
    
    if (!apiKey) {
      const errorMsg = '카카오맵 API 키가 설정되지 않았습니다.';
      handleKakaoMapError(new Error(errorMsg), { serviceType });
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    loadKakaoMap(apiKey)
      .then(() => {
        window.kakao.maps.load(() => {
          setKakaoMaps(window.kakao.maps);
          setIsLoading(false);
          serviceMapPerformanceMonitor.endTiming(loadTimer);
        });
      })
      .catch(err => {
        handleKakaoMapError(err, { serviceType });
        setError(err.message);
        setIsLoading(false);
        serviceMapPerformanceMonitor.endTiming(loadTimer);
      });
  }, [serviceType, rawMarkers.length]); // serviceType이나 마커 개수가 바뀔 때 다시 로드 시도 (일반적으론 한 번만 실행)

  // 2) 지도 인스턴스를 생성하는 effect
  useEffect(() => {
    if (!kakaoMaps || !mapRef.current || isLoading) return;

    try {
      const center = userLocation
        ? new kakaoMaps.LatLng(userLocation.lat, userLocation.lng)
        : new kakaoMaps.LatLng(37.5665, 126.9780); // 기본 위치: 서울시청

      mapInstance.current = new kakaoMaps.Map(mapRef.current, {
        center,
        level: serviceConfig.defaultZoom || 5,
      });

      // 줌 컨트롤과 지도 타입 컨트롤을 추가합니다.
      const zoomControl = new kakaoMaps.ZoomControl();
      mapInstance.current.addControl(zoomControl, kakaoMaps.ControlPosition.RIGHT);
      const mapTypeControl = new kakaoMaps.MapTypeControl();
      mapInstance.current.addControl(mapTypeControl, kakaoMaps.ControlPosition.TOPRIGHT);

    } catch (err) {
      handleKakaoMapError(err, { serviceType, operation: 'map_creation' });
      setError(`지도 생성에 실패했습니다: ${err.message}`);
    }
  }, [kakaoMaps, isLoading, userLocation, serviceConfig]);

  // 3) 사용자 위치 마커를 렌더링하는 effect
  useEffect(() => {
    if (!mapInstance.current || !userLocation || !kakaoMaps) return;

    if (userMarkerRef.current) userMarkerRef.current.setMap(null); // 기존 마커 제거

    try {
      const userPosition = new kakaoMaps.LatLng(userLocation.lat, userLocation.lng);
      const redDotImageSrc = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FF0000" stroke="#FFFFFF" stroke-width="2"/></svg>');
      const imageSize = new kakaoMaps.Size(24, 24);
      const markerImage = new kakaoMaps.MarkerImage(redDotImageSrc, imageSize, { offset: new kakaoMaps.Point(12, 12) });

      const marker = new kakaoMaps.Marker({ position: userPosition, title: '내위치', image: markerImage });
      marker.setMap(mapInstance.current);
      userMarkerRef.current = marker;

    } catch (err) {
      handleKakaoMapError(err, { serviceType, operation: 'user_marker_creation' });
    }
  }, [userLocation, kakaoMaps, serviceType]); // userLocation이 바뀔 때마다 실행

  // 4) 서비스 업체 마커들을 렌더링하는 effect
  useEffect(() => {
    if (!mapInstance.current || !processedMarkers || !kakaoMaps || isLoading) return;

    // 기존 마커와 정보창들을 모두 제거합니다.
    markerInstances.current.forEach(marker => marker.setMap(null));
    infoWindows.current.forEach(infoWindow => infoWindow.close());
    markerInstances.current = [];
    infoWindows.current = [];

    // 필터링된 마커들을 순회하며 지도에 표시합니다.
    processedMarkers.forEach((markerData, idx) => {
      try {
        const position = new kakaoMaps.LatLng(markerData.lat, markerData.lng);
        const marker = new kakaoMaps.Marker({ position, title: markerData.name });
        marker.setMap(mapInstance.current);

        // 마커 클릭 이벤트를 추가합니다.
        kakaoMaps.event.addListener(marker, 'click', () => {
          infoWindows.current.forEach(infoWindow => infoWindow.close()); // 다른 정보창 닫기

          const infoWindow = createServiceInfoWindow(kakaoMaps, markerData, serviceConfig);
          infoWindow.open(mapInstance.current, marker);
          infoWindows.current.push(infoWindow);

          if (onMarkerClick) onMarkerClick(markerData); // 부모에게 클릭 이벤트 전달
        });

        markerInstances.current.push(marker);
      } catch (err) {
        handleMarkerError(err, { serviceType, markerIndex: idx, markerData });
      }
    });
  }, [processedMarkers, kakaoMaps, isLoading, serviceConfig, onMarkerClick]); // 마커 데이터나 설정이 바뀔 때마다 실행

  // --- 렌더링(Rendering) 부 ---

  // 로딩 중일 때 UI
  if (isLoading) {
    return (
      <div 
        className="service-map-loading"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: serviceConfig.backgroundColor || '#f8f9fa',
          fontSize: '16px',
          '--service-bg-color': serviceConfig.backgroundColor || '#f8f9fa'
        }}
        role="status"
        aria-live="polite"
        aria-label={`${serviceConfig.name} 지도 로딩 중`}
      >
        <div style={{ textAlign: 'center', color: serviceConfig.accentColor }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }} aria-hidden="true">
            {serviceConfig.markerIcon}
          </div>
          <div>{serviceConfig.name} 지도 로딩 중...</div>
        </div>
      </div>
    );
  }

  // 에러 발생 시 UI (대체 지도)
  if (error) {
    console.warn('카카오맵 로드 실패, 대체 지도 사용:', error);
    return (
      <SimpleMapView 
        userLocation={userLocation} 
        markers={processedMarkers}
        serviceType={serviceType}
        serviceConfig={serviceConfig}
      />
    );
  }

  // 정상 렌더링 UI
  return (
    <div 
      className={`service-map-container ${serviceType}-map ${className}`} 
      style={{ position: 'relative', width: '100%', height: '100%' }}
      role="application"
      aria-label={`${serviceConfig.name} 지도`}
      tabIndex={0}
    >
      {/* 접근성을 위한 스킵 링크 및 스크린 리더 안내 문구 */}
      <a href="#map-content" className="skip-to-map sr-only">
        지도로 건너뛰기
      </a>
      <div 
        className="map-announcements" 
        aria-live="polite" 
        aria-atomic="true"
        id="map-announcements"
      >
        {processedMarkers?.length || 0}개의 {serviceConfig.name} 위치가 표시됩니다.
      </div>
      
      {/* 실제 지도가 그려지는 div */}
      <div
        id="map-content"
        ref={mapRef}
        style={{
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          backgroundColor: '#f0f0f0'
        }}
        aria-label="지도 영역"
      />
      
      {/* 지도 상태 정보 패널 */}
      <div 
        className="map-info-panel"
        style={{
          padding: 12, 
          fontSize: 14, 
          position: 'absolute',
          bottom: 10, 
          right: 10, 
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 8, 
          zIndex: 1000, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          borderLeft: `4px solid ${serviceConfig.accentColor}`
        }}
        role="status"
        aria-label="지도 상태 정보"
      >
        <div style={{ fontWeight: 'bold', color: serviceConfig.accentColor }}>
          {serviceConfig.markerIcon} {serviceConfig.name} 지도
        </div>
        <div style={{ fontSize: 12, marginTop: 4 }}>
          상태: {kakaoMaps ? '✅ 준비 완료' : '⏳ 초기화 중...'}
        </div>
        <div style={{ fontSize: 12 }}>
          위치: {userLocation
            ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
            : '확인 중...'}
        </div>
        <div style={{ fontSize: 12 }}>
          {serviceConfig.name}: {processedMarkers?.length || 0}개
        </div>
      </div>
    </div>
  );
};

// 서비스별 정보창(Infowindow) HTML을 생성하는 헬퍼 함수
const createServiceInfoWindow = (kakaoMaps, markerData, serviceConfig) => {
  const popupContent = markerData.popupContent || { title: markerData.name, content: [] };
  
  const contentHTML = `
    <div style="
      padding: 15px; 
      min-width: 200px; 
      max-width: 300px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${serviceConfig.backgroundColor || '#fff'};
      border-left: 4px solid ${serviceConfig.accentColor};
    ">
      <div style="
        font-weight: bold; 
        font-size: 16px; 
        margin-bottom: 8px;
        color: ${serviceConfig.accentColor};
      ">
        ${popupContent.title}
      </div>
      ${popupContent.subtitle ? `
        <div style="
          font-size: 14px; 
          color: #666; 
          margin-bottom: 10px;
        ">
          ${popupContent.subtitle}
        </div>
      ` : ''}
      ${popupContent.content.map(item => `
        <div style="
          font-size: 13px; 
          margin-bottom: 4px;
          color: #333;
        ">
          ${item}
        </div>
      `).join('')}
    </div>
  `;

  return new kakaoMaps.InfoWindow({
    content: contentHTML,
    removable: true,
  });
};

export default BaseServiceMapView;
