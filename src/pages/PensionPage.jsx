import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './PensionPage.module.css';
import Button from '../components/ui/Button';
import PensionCard from '../components/pension/PensionCard';
import GuestPetSelector from '../components/pension/GuestPetSelector';
import { useUI } from '../contexts/UIContext';
import Pagination from '../components/common/Pagination';

// Mock Data for Pensions
export const mockPensions = [
  {
    id: 1,
    name: '댕댕 포레스트',
    type: '펜션',
    location: '경기 가평군',
    price: 180000,
    rating: 4.8,
    images: ['https://picsum.photos/seed/forest_main/1200/800'],
    tags: ['#대형견가능', '#개별운동장', '#수영장', '#독채'],
    maxGuests: 4,
    petsAllowed: true,
    checkInTime: '15:00',
    checkOutTime: '11:00',
  },
  {
    id: 2,
    name: '냥냥 파라다이스',
    type: '감성숙소',
    location: '제주 제주시',
    price: 250000,
    rating: 4.9,
    images: ['https://picsum.photos/seed/paradise_main/1200/800'],
    tags: ['#고양이환영', '#오션뷰', '#캣타워', '#감성숙소'],
    maxGuests: 2,
    petsAllowed: true,
    checkInTime: '16:00',
    checkOutTime: '12:00',
  },
  {
    id: 3,
    name: '해변의 멍뭉이',
    type: '리조트',
    location: '강원 강릉시',
    price: 210000,
    rating: 4.7,
    images: ['https://picsum.photos/seed/beach_main/1200/800'],
    tags: ['#오션뷰', '#바베큐', '#해변인접'],
    maxGuests: 6,
    petsAllowed: true,
    checkInTime: '15:00',
    checkOutTime: '11:00',
  },
  {
    id: 4,
    name: '펫 프렌들리 경주',
    type: '펜션',
    location: '경북 경주시',
    price: 165000,
    rating: 4.6,
    images: ['https://picsum.photos/seed/gyeongju_main/1200/800'],
    tags: ['#한옥', '#소형견', '#조용한'],
    maxGuests: 3,
    petsAllowed: true,
    checkInTime: '15:00',
    checkOutTime: '11:00',
  },
  {
    id: 5,
    name: '마운틴 댕뷰',
    type: '펜션',
    location: '경기 포천시',
    price: 195000,
    rating: 4.5,
    images: ['https://picsum.photos/seed/mountain_main/1200/800'],
    tags: ['#산책로', '#계곡인접', '#바베큐', '#대형견가능'],
    maxGuests: 5,
    petsAllowed: true,
    checkInTime: '14:00',
    checkOutTime: '11:00',
  },
  {
    id: 6,
    name: '제주 돌담길 냥이네',
    type: '감성숙소',
    location: '제주 서귀포시',
    price: 280000,
    rating: 5.0,
    images: ['https://picsum.photos/seed/jeju_cat_main/1200/800'],
    tags: ['#독채', '#돌담집', '#고양이환영', '#한적한'],
    maxGuests: 2,
    petsAllowed: true,
    checkInTime: '16:00',
    checkOutTime: '12:00',
  },
];

const PensionPage = () => {
  console.log('PensionPage rendered'); // New: Confirm component rendering
  const { setIsLoading } = useUI() || {};
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [pets, setPets] = useState(0);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [selectedType, setSelectedType] = useState('전체');
  const [selectedPetConditions, setSelectedPetConditions] = useState([]);

  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 디버깅용 로그
  console.log('PensionPage - accommodations:', accommodations);
  console.log('PensionPage - allAccommodations:', accommodations); // allAccommodations 대신 accommodations 사용
  console.log('PensionPage - loading:', loading);

  useEffect(() => {
    // Simulate data fetching and filtering
    setLoading(true);
    setIsLoading(true);
    setTimeout(() => {
      let result = mockPensions;

      if (location.trim() !== '') {
        result = result.filter(pension =>
          pension.location.replace(/\s/g, '').includes(location.replace(/\s/g, ''))
        );
      }
      // 게스트 수 필터 (maxGuests 필드가 없으므로 임시로 제거)
      // result = result.filter(pension => (pension.maxGuests || 10) >= guests);

      // 펫 허용 필터 (petsAllowed 필드가 없으므로 모든 숙소가 펫 허용으로 가정)
      // if (pets > 0) {
      //   result = result.filter(pension => pension.petsAllowed !== false);
      // }

      if (selectedType !== '전체') {
        result = result.filter(pension => pension.type === selectedType);
      }

      // 펫 조건 필터 (tags 필드가 없으므로 임시로 제거)
      // if (selectedPetConditions.length > 0) {
      //   result = result.filter(pension =>
      //     selectedPetConditions.every(condition => (pension.tags || []).includes(condition))
      //   );
      // }
      setAccommodations(result);
      setLoading(false);
      setIsLoading(false);
    }, 500);
  }, [location, guests, pets, selectedType, selectedPetConditions, setIsLoading]);

  const handleSearchAndFilter = () => {
    // Filtering is now handled by the useEffect above
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleTypeChange = (event) => setSelectedType(event.target.value);
  const handlePetConditionChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPetConditions(prev => 
      checked ? [...prev, value] : prev.filter(c => c !== value)
    );
  };
  
  if (loading) {
    return <div className="container">숙소 정보를 불러오는 중...</div>;
  }

  const totalPages = Math.ceil(accommodations.length / itemsPerPage);
  const currentAccommodations = accommodations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container">
      <div className={styles.pensionPageContainer}>
        <header className={styles.pageHeader}>
          <h1>어디로 떠나시나요?</h1>
          {/* 👇 1. "함께 입실"하는 곳임을 강조하는 문구로 수정 */}
          <p>반려동물과 <span className={styles.highlight}>함께 입실</span>하는 숙소만 모아놨어요!</p>
        </header>

        <section className={styles.searchSection}>
          <div className={styles.searchBox}>
            <div className={styles.searchInputGroup}>
              <label htmlFor="checkin">체크인</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="체크인 날짜"
                dateFormat="yyyy년 MM월 dd일"
                minDate={new Date()}
              />
            </div>
            <div className={styles.searchInputGroup}>
              <label htmlFor="checkout">체크아웃</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="체크아웃 날짜"
                dateFormat="yyyy년 MM월 dd일"
              />
            </div>
            <div className={styles.searchInputGroup} style={{ position: 'relative' }}>
              <label htmlFor="guests">인원 및 반려동물</label>
              <input 
                type="text" 
                placeholder={`게스트 ${guests}명, 반려동물 ${pets}마리`}
                onClick={() => setShowGuestSelector(!showGuestSelector)}
                readOnly
              />
              {showGuestSelector && (
                <div className={styles.guestSelectorDropdown}>
                  <GuestPetSelector 
                    guests={guests} 
                    setGuests={setGuests} 
                    pets={pets} 
                    setPets={setPets}
                    maxGuests={10}
                  />
                </div>
              )}
            </div>
            <div className={styles.searchInputGroup}>
              <label htmlFor="location">지역 (선택)</label>
              <input
                type="text"
                id="location"
                placeholder="예: 가평, 제주도 또는 숙소명"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button variant="primary" size="large" className={styles.searchButton} onClick={handleSearchAndFilter}>
              검색
            </Button>
          </div>
        </section>

        <div className={styles.mainContent}>
          <aside className={styles.filters}>
            <h3>상세 필터</h3>
            <div className={styles.filterGroup}>
              <h4>숙소 유형</h4>
              <label>
                <input type="radio" value="전체" name="type" checked={selectedType === '전체'} onChange={handleTypeChange} /> 전체
              </label>
              <label>
                <input type="radio" value="펜션" name="type" checked={selectedType === '펜션'} onChange={handleTypeChange} /> 펜션
              </label>
              <label>
                <input type="radio" value="호텔" name="type" checked={selectedType === '호텔'} onChange={handleTypeChange} /> 호텔
              </label>
              <label>
                <input type="radio" value="리조트" name="type" checked={selectedType === '리조트'} onChange={handleTypeChange} /> 리조트
              </label>
            </div>
             <div className={styles.filterGroup}>
              <h4>반려동물 조건</h4>
              <label>
                <input type="checkbox" value="#대형견가능" onChange={handlePetConditionChange} /> 대형견 가능
              </label>
              <label>
                <input type="checkbox" value="#고양이환영" onChange={handlePetConditionChange} /> 고양이 가능
              </label>
              <label>
                <input type="checkbox" value="#펫스파" onChange={handlePetConditionChange} /> 펫스파/욕조
              </label>
              <label>
                <input type="checkbox" value="#개별운동장" onChange={handlePetConditionChange} /> 펫 운동장
              </label>
            </div>
            <Button variant="secondary" size="large" className={styles.applyFilterButton} onClick={handleSearchAndFilter}>
              상세 조건 적용
            </Button>
          </aside>

          <main className={styles.results}>
            <div className={styles.resultsHeader}>
              <h2>검색 결과 ({accommodations.length}개)</h2>
            </div>
            <div className={styles.resultsGrid}>
              {currentAccommodations.length > 0 ? (
                currentAccommodations.map(pension => (
                  <PensionCard key={pension.id} pension={pension} />
                ))
              ) : (
                <p className={styles.noResults}>아쉽지만, 조건에 맞는 동반 입실 가능 숙소를 찾지 못했어요.</p>
              )}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PensionPage;