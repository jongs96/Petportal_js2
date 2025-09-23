// src/pages/HotelPage.jsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import HotelMapView from '../components/service/maps/HotelMapView';
import BusinessCardGrid from '../components/common/BusinessCardGrid';
import FilterSection from '../components/common/FilterSection';
import '../styles/hotel.css';
import Pagination from '../components/common/Pagination';

// Mock Data for Hotels
const mockHotels = [
  {
    id: 1,
    name: '펫 스위트 호텔',
    address: '서울 강남구',
    pricePerNight: 150000,
    description: '반려동물과 함께 편안한 휴식',
    image: 'https://picsum.photos/seed/hotel1/400/300',
    lat: 37.5000,
    lng: 127.0365,
    petFriendly: true,
    petFee: 0,
    petAmenities: ['펫 침대', '펫 식기'],
    roomTypes: ['스탠다드'],
    rating: 4.8,
  },
  {
    id: 2,
    name: '도그 리조트',
    address: '경기 가평',
    pricePerNight: 200000,
    description: '넓은 운동장',
    image: 'https://picsum.photos/seed/hotel2/400/300',
    lat: 37.8300,
    lng: 127.5100,
    petFriendly: true,
    petFee: 20000,
    petAmenities: ['펫 운동장', '펫 스파'],
    roomTypes: ['디럭스', '스위트'],
    rating: 4.9,
  },
  {
    id: 3,
    name: '냥이 호텔',
    address: '부산 해운대구',
    pricePerNight: 120000,
    description: '고양이 전용 호텔',
    image: 'https://picsum.photos/seed/hotel3/400/300',
    lat: 35.1600,
    lng: 129.1600,
    petFriendly: true,
    petFee: 0,
    petAmenities: ['캣타워', '스크래쳐'],
    roomTypes: ['스탠다드'],
    rating: 4.7,
  },
];

const HotelPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    startDate: '',
    endDate: '',
    priceRange: { min: 0, max: 1000000 }, // Increased max price for mock
    hotelServices: [],
    targetAnimals: []
  });

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // Simulate data fetching and filtering
    setLoading(true);
    setTimeout(() => {
      let result = mockHotels;

      if (filters.location) {
        result = result.filter(hotel => 
            hotel.name.toLowerCase().includes(filters.location.toLowerCase()) ||
            hotel.address.toLowerCase().includes(filters.location.toLowerCase()));
      }
      result = result.filter(hotel => (hotel.pricePerNight ?? 0) >= filters.priceRange.min && (hotel.pricePerNight ?? 0) <= filters.priceRange.max);
      if (filters.hotelServices.length > 0) {
          result = result.filter(hotel => filters.hotelServices.every(service => (hotel.petAmenities || []).includes(service)));
      }
      if (filters.targetAnimals.length > 0) {
          result = result.filter(hotel => filters.targetAnimals.every(animal => (hotel.targetAnimals || []).includes(animal)));
      }

      setHotels(result);
      setLoading(false);
    }, 500);
  }, [filters]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        setError(new Error('위치 정보를 가져올 수 없습니다. 기본 위치로 지도를 표시합니다.'));
        setUserLocation({ lat: 37.5665, lng: 126.9780 }); // Default to Seoul
      }
    );
  }, []);

  const markers = useMemo(() => hotels.map(hotel => ({
    id: hotel.id,
    lat: hotel.lat,
    lng: hotel.lng,
    name: hotel.name,
    petPolicy: {
      allowed: hotel.petFriendly || false,
      fee: hotel.petFee || 0,
      restrictions: hotel.petRestrictions || []
    },
    petAmenities: hotel.petAmenities || [],
    roomTypes: hotel.roomTypes || ['standard'],
    priceRange: hotel.pricePerNight > 200000 ? 'luxury' :
                hotel.pricePerNight > 100000 ? 'mid-range' : 'budget',
    rating: hotel.rating || 4.0,
    phone: hotel.phone || '',
    address: hotel.address || '',
  })), [hotels]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Pagination logic
  const totalPages = Math.ceil(hotels.length / itemsPerPage);
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const currentHotels = hotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div className="pageContainer">호텔 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="pageContainer" style={{ color: 'red' }}>오류: {error.message || '데이터를 불러오는 중 오류가 발생했습니다.'}</div>;
  }

  return (
    <div className="hotel-container">
      <header className="pageHeader">
        <h1 className="pageTitle">펫 호텔</h1>
        <p className="pageSubtitle">반려동물과 편안하게 머무를 수 있는 호텔을 찾아보세요</p>
      </header>
      <div className="mapWrapper">
        <HotelMapView 
          userLocation={userLocation} 
          markers={markers}
          filters={{
            petFriendly: filters.targetAnimals.length > 0,
            petAmenities: filters.hotelServices,
            priceRanges: []
          }}
          onMarkerClick={(markerData) => {
            console.log('Hotel marker clicked:', markerData);
            // Could show detailed popup or navigate to detail page
          }}
        />
        <div className="filtersOnMap">
          <FilterSection
            locationPlaceholder="호텔명이나 지역을 검색해보세요"
            onLocationChange={(value) => handleFilterChange('location', value)}>
            <div className="filterGroup">
              <label className="filterLabel">체크인/아웃</label>
              <div className="filterInputWrapper">
                <input 
                  type="date" 
                  value={filters.startDate} 
                  onChange={(e) => handleFilterChange('startDate', e.target.value)} 
                  className="filterInput" 
                />
              </div>
              <div className="filterInputWrapper">
                <input 
                  type="date" 
                  value={filters.endDate} 
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="filterInput"
                />
              </div>
            </div>
          </FilterSection>
        </div>
      </div>
      <div className="hotel-grid">
        <BusinessCardGrid items={currentHotels.map(h => ({ ...h, type: 'hotel' }))} />
      </div>

      {hotels.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
};

export default HotelPage;