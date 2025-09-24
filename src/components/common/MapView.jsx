// src/components/common/MapView.jsx

// React와 리액트 훅(useEffect, useRef, useState)을 가져옵니다.
import React, { useEffect, useRef, useState } from 'react';
// 지도 로딩 실패 시 보여줄 대체 지도 컴포넌트를 가져옵니다.
import { SimpleMapView } from './SimpleMapView';

/**
 * MapView 컴포넌트
 * 
 * 카카오맵 API를 사용하여 지도를 화면에 표시하는 핵심 컴포넌트입니다.
 * 사용자의 현재 위치, 주변 업체 마커 등을 지도 위에 렌더링합니다.
 * 
 * @param {object} props - 부모 컴포넌트로부터 받는 속성들
 * @param {object} props.userLocation - 사용자의 위치 정보 ({ lat: 위도, lng: 경도 })
 * @param {Array} props.markers - 지도에 표시할 마커들의 배열
 */
const MapView = ({ userLocation, markers }) => {
  // --- React 훅(Hook) 선언부 ---

  // useRef: 특정 DOM 요소를 직접 참조하거나, 리렌더링되어도 값이 변하지 않는 저장 공간으로 사용됩니다.
  const mapRef = useRef(null); // 지도가 그려질 div 요소를 참조하기 위한 ref
  const mapInstance = useRef(null); // 생성된 카카오맵 인스턴스를 저장하기 위한 ref
  const markerInstances = useRef([]); // 지도에 표시된 마커 인스턴스들을 저장하기 위한 ref
  const userMarkerRef = useRef(null); // 사용자 위치 마커 인스턴스를 저장하기 위한 ref

  // useState: 컴포넌트의 상태를 관리합니다. 상태가 변경되면 컴포넌트가 리렌더링됩니다.
  const [kakaoMaps, setKakaoMaps] = useState(null); // 카카오맵 API 객체를 저장할 상태
  const [error, setError] = useState(null); // 에러 발생 시 에러 메시지를 저장할 상태
  const [isLoading, setIsLoading] = useState(true); // 지도 로딩 상태를 저장할 상태

  // --- useEffect 훅: Side Effect 처리부 ---
  // useEffect는 컴포넌트가 렌더링된 후 특정 작업을 수행(Side Effect)하고 싶을 때 사용합니다.

  // 1) 카카오맵 SDK 스크립트를 로드하고 초기화하는 useEffect
  useEffect(() => {
    // 컴포넌트가 처음 렌더링될 때 딱 한 번만 실행됩니다. (의존성 배열: [])
    
    if (window.kakao && window.kakao.maps) {
      // 만약 스크립트가 이미 로드되어 있다면, 바로 API 객체를 상태에 저장합니다.
      window.kakao.maps.load(() => {
        setKakaoMaps(window.kakao.maps);
        setIsLoading(false); // 로딩 완료
      });
    } else {
      // 스크립트가 로드되지 않았다면, 동적으로 스크립트 태그를 생성하여 페이지에 추가합니다.
      const script = document.createElement('script');
      script.onload = () => {
        // 스크립트 로딩이 성공하면, 카카오맵 API를 초기화하고 상태에 저장합니다.
        window.kakao.maps.load(() => {
          setKakaoMaps(window.kakao.maps);
          setIsLoading(false); // 로딩 완료
        });
      };
      script.onerror = () => {
        // 스크립트 로딩이 실패하면, 에러 상태를 설정합니다.
        setError('카카오맵 스크립트를 불러오지 못했습니다. API 키 또는 도메인 설정을 확인해주세요.');
        setIsLoading(false);
      };
      // .env 파일에서 API 키를 가져와 스크립트의 src 속성을 설정합니다.
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&libraries=services,clusterer,drawing&autoload=false`;
      document.head.appendChild(script); // 생성된 스크립트 태그를 HTML의 <head>에 추가합니다.
    }
  }, []); // 빈 배열은 이 effect가 마운트 시 한 번만 실행되도록 합니다.

  // 2) 카카오맵 인스턴스를 생성하는 useEffect
  useEffect(() => {
    // kakaoMaps API가 준비되거나, 로딩이 끝나거나, userLocation이 변경될 때 실행됩니다.
    if (!kakaoMaps || !mapRef.current || isLoading) return; // 조건이 안 맞으면 아무것도 안 함

    try {
      // 사용자 위치가 있으면 그 위치를, 없으면 서울 시청을 기본 중심으로 설정합니다.
      const center = userLocation
        ? new kakaoMaps.LatLng(userLocation.lat, userLocation.lng)
        : new kakaoMaps.LatLng(37.5665, 126.9780);

      // mapRef가 참조하는 div에 지도를 생성합니다.
      mapInstance.current = new kakaoMaps.Map(mapRef.current, {
        center, // 지도의 중심 좌표
        level: 5, // 지도의 확대 레벨
      });

      // 지도에 줌 컨트롤(확대/축소 버튼)을 추가합니다.
      const zoomControl = new kakaoMaps.ZoomControl();
      mapInstance.current.addControl(zoomControl, kakaoMaps.ControlPosition.RIGHT);
    } catch (err) {
      console.error('지도 생성 실패:', err);
      setError(`지도 생성에 실패했습니다: ${err.message}`);
    }
  }, [kakaoMaps, userLocation, isLoading]);

  // 3) 사용자 위치가 변경되면 지도 중심을 부드럽게 이동시키는 useEffect
  useEffect(() => {
    if (!mapInstance.current || !userLocation || !kakaoMaps) return;
    try {
      const center = new kakaoMaps.LatLng(userLocation.lat, userLocation.lng);
      mapInstance.current.panTo(center); // 현재 지도의 중심을 부드럽게 이동
    } catch (err) {
      console.error('위치 이동 실패:', err);
    }
  }, [userLocation, kakaoMaps]);

  // 4) 사용자 위치에 마커를 표시하는 useEffect
  useEffect(() => {
    if (!mapInstance.current || !userLocation || !kakaoMaps) return;

    // 기존에 있던 사용자 마커가 있다면 지도에서 제거합니다.
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    try {
      const userPosition = new kakaoMaps.LatLng(userLocation.lat, userLocation.lng);
      
      // SVG를 이용해 직접 만든 빨간 점 모양의 커스텀 마커 이미지를 생성합니다.
      const redDotImageSrc = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FF0000" stroke="#FFFFFF" stroke-width="2"/></svg>');
      const imageSize = new kakaoMaps.Size(24, 24);
      const imageOption = { offset: new kakaoMaps.Point(12, 12) };
      const markerImage = new kakaoMaps.MarkerImage(redDotImageSrc, imageSize, imageOption);

      // 새로운 마커를 생성합니다.
      const marker = new kakaoMaps.Marker({ 
        position: userPosition,
        title: '내위치',
        image: markerImage // 커스텀 이미지 적용
      });

      marker.setMap(mapInstance.current); // 마커를 지도에 표시
      userMarkerRef.current = marker; // 생성된 마커 인스턴스를 ref에 저장
    } catch (err) {
      console.error('사용자 위치 마커 생성 실패:', err);
    }
  }, [userLocation, kakaoMaps]);

  // 5) 부모로부터 받은 `markers` 배열을 지도에 표시하는 useEffect
  useEffect(() => {
    if (!mapInstance.current || !markers || !kakaoMaps) return;

    // 기존에 있던 업체 마커들을 모두 지도에서 제거합니다.
    markerInstances.current.forEach(marker => marker.setMap(null));
    markerInstances.current = []; // 마커 인스턴스 배열도 비웁니다.

    // `markers` 배열을 순회하며 각 위치에 마커를 생성합니다.
    markers.forEach((data, idx) => {
      try {
        if (typeof data.lat !== 'number' || typeof data.lng !== 'number') {
          console.warn(`마커 ${idx} 좌표 유효하지 않음:`, data);
          return; // 위도, 경도 값이 없으면 건너뜁니다.
        }
        const position = new kakaoMaps.LatLng(data.lat, data.lng);
        const marker = new kakaoMaps.Marker({ position, title: data.title });
        marker.setMap(mapInstance.current);

        // 마커 클릭 시 정보창(인포윈도우)을 표시하는 로직 (현재는 주석 처리됨)
        // if (data.info) { ... }

        markerInstances.current.push(marker); // 생성된 마커를 ref 배열에 추가
      } catch (err) {
        console.error(`마커 ${idx} 생성 실패:`, err);
      }
    });
  }, [markers, kakaoMaps]);

  // --- 렌더링(Rendering) 부 ---

  // 로딩 중일 때 보여줄 화면
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

  // 에러가 발생했을 때 보여줄 화면 (대체 지도)
  if (error) {
    console.warn('카카오맵 로드 실패, 대체 지도 사용:', error);
    return <SimpleMapView userLocation={userLocation} markers={markers} />;
  }

  // 정상적으로 로딩되었을 때 보여줄 지도 화면
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 이 div가 실제 지도가 그려지는 캔버스 역할을 합니다. */}
      <div
        ref={mapRef}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#f0f0f0' }}
      />
      {/* 지도 우측 하단에 현재 상태를 보여주는 정보 패널 */}
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