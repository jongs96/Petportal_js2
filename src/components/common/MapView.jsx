// src/components/common/MapView.jsx

import React, { useEffect, useRef, useState } from 'react';
import { SimpleMapView } from './SimpleMapView';

const MapView = ({ userLocation, markers }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstances = useRef([]);
  const userMarkerRef = useRef(null); // Ref for user location marker
  const [kakaoMaps, setKakaoMaps] = useState(window.kakao?.maps || null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Assume loaded if window.kakao.maps is available

  // 2) 지도 생성
  useEffect(() => {
    if (!kakaoMaps || !mapRef.current) return;

    try {
      if (typeof kakaoMaps.LatLng !== 'function') {
        throw new Error('LatLng 생성자를 찾을 수 없습니다.');
      }

      const center = userLocation
        ? new kakaoMaps.LatLng(userLocation.lat, userLocation.lng)
        : new kakaoMaps.LatLng(37.5665, 126.9780);

      mapInstance.current = new kakaoMaps.Map(mapRef.current, {
        center,
        level: 5,
      });

      // 줌 컨트롤 추가
      const zoomControl = new kakaoMaps.ZoomControl();
      mapInstance.current.addControl(zoomControl, kakaoMaps.ControlPosition.RIGHT);
    } catch (err) {
      console.error('지도 생성 실패:', err);
      setError(`지도 생성에 실패했습니다: ${err.message}`);
    }
  }, [kakaoMaps, userLocation]);

  // 3) 사용자 위치 업데이트
  useEffect(() => {
    if (!mapInstance.current || !userLocation || !kakaoMaps || isLoading) return;
    try {
      const center = new kakaoMaps.LatLng(userLocation.lat, userLocation.lng);
      mapInstance.current.panTo(center);
    } catch (err) {
      console.error('위치 이동 실패:', err);
    }
  }, [userLocation, kakaoMaps, isLoading]);

  // 5) 사용자 위치 마커 렌더링
  useEffect(() => {
    if (!mapInstance.current || !userLocation || !kakaoMaps) return;

    // 기존 사용자 마커 제거
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    try {
      const userPosition = new kakaoMaps.LatLng(userLocation.lat, userLocation.lng);
      
      // 빨간색 점 마커 이미지 생성 (SVG 데이터 URI 사용)
      const redDotImageSrc = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FF0000" stroke="#FFFFFF" stroke-width="2"/></svg>');
      const imageSize = new kakaoMaps.Size(24, 24);
      const imageOption = { offset: new kakaoMaps.Point(12, 12) };
      const markerImage = new kakaoMaps.MarkerImage(redDotImageSrc, imageSize, imageOption);

      // 사용자 위치 마커 생성
      const marker = new kakaoMaps.Marker({ 
        position: userPosition,
        title: '내위치',
        image: markerImage // 커스텀 아이콘 적용
      });

      marker.setMap(mapInstance.current);
      userMarkerRef.current = marker; // 새 마커를 ref에 저장

    } catch (err) {
      console.error('사용자 위치 마커 생성 실패:', err);
    }

  }, [mapInstance.current, userLocation, kakaoMaps]);

  // 4) 마커 렌더링
  useEffect(() => {
    if (!mapInstance.current || !markers || !kakaoMaps || isLoading) return;

    // 기존 마커 제거
    markerInstances.current.forEach(marker => marker.setMap(null));
    markerInstances.current = [];

    markers.forEach((data, idx) => {
      try {
        if (typeof data.lat !== 'number' || typeof data.lng !== 'number') {
          console.warn(`마커 ${idx} 좌표 유효하지 않음:`, data);
          return;
        }
        const position = new kakaoMaps.LatLng(data.lat, data.lng);
        const marker = new kakaoMaps.Marker({ position, title: data.title });
        marker.setMap(mapInstance.current);

        // 커스텀 아이콘
        if (data.icon) {
          const image = new kakaoMaps.MarkerImage(
            data.icon,
            new kakaoMaps.Size(32, 32),
            { offset: new kakaoMaps.Point(16, 32) }
          );
          marker.setImage(image);
        }

        // 클릭 이벤트
        if (data.onClick) {
          kakaoMaps.event.addListener(marker, 'click', () => data.onClick(data));
        }

        // 정보창
        if (data.info) {
          const infoWindow = new kakaoMaps.InfoWindow({
            content: `<div style="padding:10px;font-size:12px;">${data.info}</div>`,
            removable: true,
          });
          kakaoMaps.event.addListener(marker, 'click', () => {
            infoWindow.open(mapInstance.current, marker);
          });
        }

        markerInstances.current.push(marker);
      } catch (err) {
        console.error(`마커 ${idx} 생성 실패:`, err);
      }
    });
  }, [markers, kakaoMaps, isLoading]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f8f9fa', fontSize: '16px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🗺️</div>
          <div>카카오맵 로딩 중...</div>
        </div>
      </div>
    );
  }

  // 에러 시 대체 지도 표시
  if (error) {
    console.warn('카카오맵 로드 실패, 대체 지도 사용:', error);
    return <SimpleMapView userLocation={userLocation} markers={markers} />;
  }

  // 정상 렌더링
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={mapRef}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#f0f0f0'
        }}
      />
      <div style={{
        padding: 12, fontSize: 14, position: 'absolute',
        bottom: 10, right: 10, background: 'rgba(255,255,255,0.95)',
        borderRadius: 8, zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <div style={{ fontWeight: 'bold' }}>🗺️ 카카오맵</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>
          상태: {kakaoMaps ? '✅ 준비 완료' : '⏳ 초기화 중...'}
        </div>
        <div style={{ fontSize: 12 }}>
          위치: {userLocation
            ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
            : '확인 중...'}
        </div>
        <div style={{ fontSize: 12 }}>
          마커: {markers?.length || 0}개
        </div>
      </div>
    </div>
  );
};

export default MapView;
