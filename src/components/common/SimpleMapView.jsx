// src/components/common/SimpleMapView.jsx
import React, { useEffect, useRef, useState } from 'react';

export const SimpleMapView = ({ userLocation, markers = [], serviceType = 'grooming', serviceConfig = {} }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [kakaoMaps, setKakaoMaps] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load Kakao Maps API
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        setKakaoMaps(window.kakao.maps);
        setIsLoading(false);
      });
    } else {
      // Handle case where script might not be loaded yet, though autoload=false should prevent this
      console.error("Kakao Maps script not found.");
      setIsLoading(false);
    }
  }, []);

  // Initialize map and markers
  useEffect(() => {
    if (!kakaoMaps || !userLocation || !mapRef.current || isLoading) return;

    // 카카오맵 초기화
    const container = mapRef.current;
    const options = {
      center: new kakaoMaps.LatLng(userLocation.lat, userLocation.lng),
      level: 5
    };

    mapInstance.current = new kakaoMaps.Map(container, options);

    // 사용자 위치 마커 추가
    const userMarkerPosition = new kakaoMaps.LatLng(userLocation.lat, userLocation.lng);
    const userMarker = new kakaoMaps.Marker({
      position: userMarkerPosition,
      map: mapInstance.current
    });

    // 사용자 위치 인포윈도우
    const userInfoWindow = new kakaoMaps.InfoWindow({
      content: '<div style="padding:5px;">현재 위치</div>'
    });
    userInfoWindow.open(mapInstance.current, userMarker);

    // 마커들 추가
    markers.forEach((marker, index) => {
      if (marker.lat && marker.lng) {
        const markerPosition = new kakaoMaps.LatLng(marker.lat, marker.lng);
        const kakaoMarker = new kakaoMaps.Marker({
          position: markerPosition,
          map: mapInstance.current
        });

        // 마커 클릭 이벤트
        const infoWindow = new kakaoMaps.InfoWindow({
          content: `<div style="padding:5px; min-width:150px;">
            <strong>${marker.title || marker.name || '장소'}</strong><br/>
            ${marker.info || ''}
          </div>`
        });

        kakaoMaps.event.addListener(kakaoMarker, 'click', () => {
          infoWindow.open(mapInstance.current, kakaoMarker);
        });
      }
    });

  }, [kakaoMaps, userLocation, markers, isLoading]);

  if (isLoading) {
    return <div style={{ width: '100%', height: '100%', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>지도 로딩 중...</div>;
  }

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px'
      }}
    />
  );
};