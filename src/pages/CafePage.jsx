import React, { useEffect, useMemo, useState, useCallback } from 'react';
import CafeMapView from '../components/service/maps/CafeMapView';
import { Link } from 'react-router-dom'; // react-router-dom에서 Link를 import합니다.
import FilterSection from '../components/common/FilterSection';
import Pagination from '../components/common/Pagination';
import BusinessCardGrid from '../components/common/BusinessCardGrid';
import '../styles/cafe.css';
import { useUI } from '../contexts/UIContext';

// Mock Data for Cafes
export const mockCafes = [
  {
    id: 1,
    name: '멍멍 카페',
    address: '서울 강남구 테헤란로',
    phone: '02-1234-5678',
    description: '강아지들이 뛰어놀기 좋은 넓은 공간',
    image: 'https://picsum.photos/seed/cafe1/400/300',
    lat: 37.5000,
    lng: 127.0365,
    services: ['애견음료', '대형견 가능'],
    operatingHours: { start: '10:00', end: '22:00' },
    requiresReservation: false,
    rating: 4.7,
    reviews: 150,
    distanceKm: 2.5,
  },
  {
    id: 2,
    name: '냥이의 하루',
    address: '서울 마포구 홍대입구',
    phone: '02-9876-5432',
    description: '고양이와 함께하는 아늑한 공간',
    image: 'https://picsum.photos/seed/cafe2/400/300',
    lat: 37.5500,
    lng: 126.9200,
    services: ['고양이 전용 공간', '수제 간식'],
    operatingHours: { start: '11:00', end: '21:00' },
    requiresReservation: true,
    rating: 4.9,
    reviews: 200,
    distanceKm: 5.1,
  },
  {
    id: 3,
    name: '도그 파라다이스',
    address: '경기 가평군',
    phone: '031-5555-1111',
    description: '넓은 야외 공간을 갖춘 애견 카페',
    image: 'https://picsum.photos/seed/cafe3/400/300',
    lat: 37.8300,
    lng: 127.5100,
    services: ['야외 테라스', '대형견 가능', '수영장'],
    operatingHours: { start: '09:00', end: '19:00' },
    requiresReservation: false,
    rating: 4.5,
    reviews: 120,
    distanceKm: 50.0,
  },
  {
    id: 4,
    name: '캣츠 가든',
    address: '부산 해운대구',
    phone: '051-7777-8888',
    description: '다양한 고양이들이 있는 힐링 카페',
    image: 'https://picsum.photos/seed/cafe4/400/300',
    lat: 35.1600,
    lng: 129.1600,
    services: ['고양이 전용 공간', '포토존'],
    operatingHours: { start: '10:00', end: '20:00' },
    requiresReservation: false,
    rating: 4.8,
    reviews: 180,
    distanceKm: 400.0,
  },
];

const CafePage = () => {
  const { setIsLoading } = useUI();
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    startTime: '',
    endTime: '',
    services: [],
    requiresReservation: null
  });

  const [filteredCafes, setFilteredCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // Simulate data fetching and filtering
    setLoading(true);
    setIsLoading(true);
    setTimeout(() => {
      let result = mockCafes;

      if (filters.location) {
        result = result.filter(cafe =>
          cafe.name.toLowerCase().includes(filters.location.toLowerCase()) ||
          cafe.address.toLowerCase().includes(filters.location.toLowerCase()));
      }
      if (filters.startTime && filters.endTime) {
        result = result.filter(cafe => {
          const cafeStart = parseInt((cafe.operatingHours?.start || '0').split(':')[0]);
          const cafeEnd = parseInt((cafe.operatingHours?.end || '0').split(':')[0]);
          const filterStart = parseInt(filters.startTime.split(':')[0]);
          const filterEnd = parseInt(filters.endTime.split(':')[0]);
          return cafeStart <= filterStart && cafeEnd >= filterEnd;
        });
      }
      if (filters.services.length > 0) {
        result = result.filter(cafe => filters.services.every(service => (cafe.services || []).includes(service)));
      }
      if (filters.requiresReservation !== null) {
        result = result.filter(cafe => cafe.requiresReservation === filters.requiresReservation);
      }

      setFilteredCafes(result);
      setLoading(false);
      setIsLoading(false);
    }, 500);
  }, [filters, setIsLoading]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        setError(new Error('위치 정보를 가져올 수 없습니다. 기본 위치로 지도를 표시합니다.'));
        setUserLocation({ lat: 37.5665, lng: 126.9780 }); // Default to Seoul
      }
    );
  }, []);

  const totalPages = Math.ceil(filteredCafes.length / itemsPerPage);
  const currentCafes = filteredCafes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const markers = useMemo(() => filteredCafes.map(cafe => ({
    id: cafe.id,
    lat: cafe.lat,
    lng: cafe.lng,
    name: cafe.name,
    amenities: cafe.services || ['wifi'],
    specialties: cafe.specialties || ['coffee'],
    isOpen: cafe.isOpen !== undefined ? cafe.isOpen : true,
    openingHours: cafe.operatingHours ? `${cafe.operatingHours.start}-${cafe.operatingHours.end}` : '09:00-22:00',
    rating: cafe.rating || 4.0,
    phone: cafe.phone || '',
    address: cafe.address || '',
  })), [filteredCafes]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="pageContainer">카페 정보를 불러오는 중...</div>;
  }
  if (error) {
    return <div className="pageContainer" style={{ color: 'red' }}>오류: {error.message || '데이터를 불러오는 중 오류가 발생했습니다.'}</div>;
  }

  return (
    <div className="cafe-container">
      <header className="pageHeader">
        <h1 className="pageTitle">펫 카페</h1>
        <p className="pageSubtitle">반려동물과 함께 즐기는 특별한 카페 경험</p>
      </header>
      <div className="mapWrapper">
        <CafeMapView 
          userLocation={userLocation} 
          markers={markers}
          filters={{
            amenities: filters.services,
            isOpenOnly: false
          }}
          onMarkerClick={(markerData) => {
            console.log('Cafe marker clicked:', markerData);
            // Could show detailed popup or navigate to detail page
          }}
        />
        <div className="filtersOnMap">
          <FilterSection
            locationPlaceholder="카페명이나 지역을 검색해보세요"
            onLocationChange={(value) => handleFilterChange('location', value)}>
            <div className="filterGroup">
              <label className="filterLabel">운영 시간</label>
              <div className="filterInputWrapper timeInputWrapper">
                <span className="timeIcon">⏰</span>
                <select value={filters.startTime} onChange={(e) => handleFilterChange('startTime', e.target.value)} className="filterInput">
                  <option value="">시작 시간</option>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return <option key={hour} value={`${hour}:00`}>{hour}:00</option>;
                  })}
                </select>
                <span>~</span>
                <select value={filters.endTime} onChange={(e) => handleFilterChange('endTime', e.target.value)} className="filterInput">
                  <option value="">종료 시간</option>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return <option key={hour} value={`${hour}:00`}>{hour}:00</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="filterGroup">
              <label className="filterLabel">서비스</label>
              <div className="pillButtonContainer">
                {['애견음료', '대형견 가능', '야외 테라스', '고양이 전용 공간', '실내놀이터', '포토존', '굿즈', '보드게임', '수제 간식'].map(service => (
                  <button
                    key={service}
                    className={`pillButton ${filters.services.includes(service) ? 'active' : ''}`}
                    onClick={() => {
                      const newServices = filters.services.includes(service)
                        ? filters.services.filter(s => s !== service)
                        : [...filters.services, service];
                      handleFilterChange('services', newServices);
                    }}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
            <div className="filterGroup">
              <label className="filterLabel">예약</label>
              <div className="pillButtonContainer">
                <button
                  className={`pillButton ${filters.requiresReservation === false ? 'active' : ''}`}
                  onClick={() => handleFilterChange('requiresReservation', filters.requiresReservation === false ? null : false)}
                >
                  예약 불필요
                </button>
                <button
                  className={`pillButton ${filters.requiresReservation === true ? 'active' : ''}`}
                  onClick={() => handleFilterChange('requiresReservation', filters.requiresReservation === true ? null : true)}
                >
                  예약 필수
                </button>
              </div>
            </div>
          </FilterSection>
        </div>
      </div>

      {/* BusinessCardGrid 대신 직접 4열 그리드 구성 */}
      <div className="cafe-grid">
        <BusinessCardGrid items={currentCafes.map(c => ({ ...c, type: 'cafe' }))} />
      </div>

      {/* 페이징 */}
      {filteredCafes.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
};

export default CafePage;
