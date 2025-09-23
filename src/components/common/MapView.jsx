// src/components/common/MapView.jsx

import React, { useEffect, useRef, useState } from 'react';
import { SimpleMapView } from './SimpleMapView';

const MapView = ({ userLocation, markers }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstances = useRef([]);
  const userMarkerRef = useRef(null);
  const [kakaoMaps, setKakaoMaps] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1) 카카오맵 SDK 로드 및 초기화
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      // 스크립트가 이미 로드된 경우
      window.kakao.maps.load(() => {
        setKakaoMaps(window.kakao.maps);
        setIsLoading(false);
      });
    } else {
      // 스크립트가 아직 로드되지 않은 경우
      const script = document.createElement('script');
      script.onload = () => {
        window.kakao.maps.load(() => {
          setKakaoMaps(window.kakao.maps);
          setIsLoading(false);
        });
      };
      script.onerror = () => {
        setError('카카오맵 스크립트를 불러오지 못했습니다. API 키 또는 도메인 설정을 확인해주세요.');
        setIsLoading(false);
      };
      // index.html의 스크립트 태그가 제거되었을 경우를 대비한 안전장치
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${'9da552959cfd8520174d1bc0c5a1d060'}&libraries=services,clusterer,drawing&autoload=false`;
      document.head.appendChild(script);
    }
  }, []);

  // 2) 지도 생성
  useEffect(() => {
    if (!kakaoMaps || !mapRef.current || isLoading) return;

    try {
      const center = userLocation
        ? new kakaoMaps.LatLng(userLocation.lat, userLocation.lng)
        : new kakaoMaps.LatLng(37.5665, 126.9780);

      mapInstance.current = new kakaoMaps.Map(mapRef.current, {
        center,
        level: 5,
      });

      const zoomControl = new kakaoMaps.ZoomControl();
      mapInstance.current.addControl(zoomControl, kakaoMaps.ControlPosition.RIGHT);
    } catch (err) {
      console.error('지도 생성 실패:', err);
      setError(`지도 생성에 실패했습니다: ${err.message}`);
    }
  }, [kakaoMaps, userLocation, isLoading]);

  // 3) 사용자 위치 업데이트 (지도 중심 이동)
  useEffect(() => {
    if (!mapInstance.current || !userLocation || !kakaoMaps) return;
    try {
      const center = new kakaoMaps.LatLng(userLocation.lat, userLocation.lng);
      mapInstance.current.panTo(center);
    } catch (err) {
      console.error('위치 이동 실패:', err);
    }
  }, [userLocation, kakaoMaps]);

  // 4) 사용자 위치 마커 렌더링
  useEffect(() => {
    if (!mapInstance.current || !userLocation || !kakaoMaps) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    try {
      const userPosition = new kakaoMaps.LatLng(userLocation.lat, userLocation.lng);
      const redDotImageSrc = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FF0000" stroke="#FFFFFF" stroke-width="2"/></svg>');
      const imageSize = new kakaoMaps.Size(24, 24);
      const imageOption = { offset: new kakaoMaps.Point(12, 12) };
      const markerImage = new kakaoMaps.MarkerImage(redDotImageSrc, imageSize, imageOption);

      const marker = new kakaoMaps.Marker({
        position: userPosition,
        title: '내위치',
        image: markerImage
      });

      marker.setMap(mapInstance.current);
      userMarkerRef.current = marker;
    } catch (err) {
      console.error('사용자 위치 마커 생성 실패:', err);
    }
  }, [userLocation, kakaoMaps]);

  // 5) 업체 마커 렌더링
  useEffect(() => {
    if (!mapInstance.current || !markers || !kakaoMaps) return;

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

        if (data.icon) {
          const image = new kakaoMaps.MarkerImage(
            data.icon,
            new kakaoMaps.Size(32, 32),
            { offset: new kakaoMaps.Point(16, 32) }
          );
          marker.setImage(image);
        }

        if (data.onClick) {
          kakaoMaps.event.addListener(marker, 'click', () => data.onClick(data));
        }

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
  }, [markers, kakaoMaps]);

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
