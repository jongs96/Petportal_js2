// src/components/common/SimpleMapView.jsx

// React와 훅(useEffect, useRef, useState)을 가져옵니다.
import React, { useEffect, useRef, useState } from 'react';

/**
 * SimpleMapView 컴포넌트
 * 
 * 다른 고급 지도 컴포넌트(MapView, BaseServiceMapView 등)에서 에러가 발생했을 때
 * 최소한의 기능으로 지도를 보여주기 위한 대체(Fallback) 컴포넌트입니다.
 * 기본적인 마커와 정보창(Infowindow) 표시 기능을 가집니다.
 * 
 * @param {object} props - 부모 컴포넌트로부터 받는 속성들
 * @param {object} props.userLocation - 사용자의 위치 정보 ({ lat: 위도, lng: 경도 })
 * @param {Array} props.markers - 지도에 표시할 마커들의 배열
 * @param {string} props.serviceType - 서비스 종류 (현재는 미사용, 확장성 위해 존재)
 * @param {object} props.serviceConfig - 서비스 설정 객체 (현재는 미사용, 확장성 위해 존재)
 */
export const SimpleMapView = ({ userLocation, markers = [], serviceType = 'grooming', serviceConfig = {} }) => {
  // useRef: DOM 요소나 특정 값을 리렌더링 사이클 동안 유지하기 위해 사용합니다.
  const mapRef = useRef(null); // 지도가 그려질 div 요소를 참조합니다.
  const mapInstance = useRef(null); // 생성된 카카오맵 인스턴스를 저장합니다.

  // useState: 컴포넌트의 상태를 관리합니다.
  const [kakaoMaps, setKakaoMaps] = useState(null); // 카카오맵 API 객체를 저장합니다.
  const [isLoading, setIsLoading] = useState(true); // 지도 로딩 상태를 관리합니다.

  // useEffect: 컴포넌트 렌더링 후 부수 효과(side effect)를 실행합니다.
  // 카카오맵 API 스크립트를 로드하는 effect
  useEffect(() => {
    // window 객체에 카카오맵 API가 이미 로드되어 있는지 확인합니다.
    if (window.kakao && window.kakao.maps) {
      // 이미 로드되었다면, API를 사용할 준비를 합니다.
      window.kakao.maps.load(() => {
        setKakaoMaps(window.kakao.maps); // API 객체를 상태에 저장
        setIsLoading(false); // 로딩 상태를 false로 변경
      });
    } else {
      // 스크립트가 없다면 에러를 콘솔에 출력합니다.
      // 이 컴포넌트는 대체용이므로, 스스로 스크립트를 로드하지는 않습니다.
      console.error("Kakao Maps script not found.");
      setIsLoading(false);
    }
  }, []); // 의존성 배열이 비어있으므로, 컴포넌트가 처음 마운트될 때 한 번만 실행됩니다.

  // 지도와 마커를 초기화하는 effect
  useEffect(() => {
    // API가 로드되지 않았거나, 사용자 위치가 없거나, 지도 div가 준비되지 않았거나, 로딩 중이면 실행하지 않습니다.
    if (!kakaoMaps || !userLocation || !mapRef.current || isLoading) return;

    // --- 카카오맵 초기화 --- 
    const container = mapRef.current; // 지도를 담을 영역의 DOM 레퍼런스
    const options = {
      center: new kakaoMaps.LatLng(userLocation.lat, userLocation.lng), // 지도의 중심좌표
      level: 5 // 지도의 확대 레벨
    };
    mapInstance.current = new kakaoMaps.Map(container, options); // 지도 생성 및 인스턴스 저장

    // --- 사용자 위치 마커 추가 --- 
    const userMarkerPosition = new kakaoMaps.LatLng(userLocation.lat, userLocation.lng);
    const userMarker = new kakaoMaps.Marker({
      position: userMarkerPosition,
      map: mapInstance.current // 마커를 지도에 표시
    });

    // --- 사용자 위치 정보창(Infowindow) 추가 ---
    const userInfoWindow = new kakaoMaps.InfoWindow({
      content: '<div style="padding:5px;">현재 위치</div>' // 정보창에 표시될 내용
    });
    // 지도에 정보창을 열고, 마커를 기준으로 표시합니다.
    userInfoWindow.open(mapInstance.current, userMarker);

    // --- 부모로부터 받은 `markers` 배열을 지도에 추가 --- 
    markers.forEach((marker, index) => {
      // 마커의 위도, 경도 값이 유효한지 확인합니다.
      if (marker.lat && marker.lng) {
        const markerPosition = new kakaoMaps.LatLng(marker.lat, marker.lng);
        const kakaoMarker = new kakaoMaps.Marker({
          position: markerPosition,
          map: mapInstance.current
        });

        // --- 각 마커에 대한 정보창 추가 ---
        const infoWindow = new kakaoMaps.InfoWindow({
          content: `<div style="padding:5px; min-width:150px;">
            <strong>${marker.title || marker.name || '장소'}</strong><br/>
            ${marker.info || ''}
          </div>`
        });

        // 마커에 'click' 이벤트를 등록합니다.
        kakaoMaps.event.addListener(kakaoMarker, 'click', () => {
          // 클릭 시 해당 마커에 대한 정보창을 엽니다.
          infoWindow.open(mapInstance.current, kakaoMarker);
        });
      }
    });

  }, [kakaoMaps, userLocation, markers, isLoading]); // 의존성 배열: 배열 안의 값이 변경될 때마다 이 effect가 다시 실행됩니다.

  // 로딩 중일 때 표시할 UI
  if (isLoading) {
    return <div style={{ width: '100%', height: '100%', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>지도 로딩 중...</div>;
  }

  // 최종적으로 지도가 그려질 div 요소를 렌더링합니다.
  return (
    <div
      ref={mapRef} // useRef로 만든 mapRef를 연결하여, 이 div를 JavaScript 코드에서 참조할 수 있게 합니다.
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px'
      }}
    />
  );
};
