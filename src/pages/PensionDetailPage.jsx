import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import styles from './PensionDetailPage.module.css';
import Button from '../components/ui/Button';
import GuestPetSelector from '../components/pension/GuestPetSelector';
import { useUI } from '../contexts/UIContext';
import { mockPensions } from './PensionPage'; // Import the mock data

const PensionDetailPage = () => {
  const { pensionId } = useParams();
  const { setIsLoading } = useUI() || {};
  const [pension, setPension] = useState(null);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [pets, setPets] = useState(0);
  const [showGuestSelector, setShowGuestSelector] = useState(false);

  useEffect(() => {
    // Simulate API call
    if (setIsLoading) setIsLoading(true);
    setError(null);
    setTimeout(() => {
      const foundPension = mockPensions.find(p => p.id === parseInt(pensionId, 10));

      if (foundPension) {
        setPension(foundPension);
      } else {
        setError('숙소 정보를 찾을 수 없습니다.');
      }
      if (setIsLoading) setIsLoading(false);
    }, 500);
  }, [pensionId, setIsLoading]); // setIsLoading을 의존성 배열에 유지

  const calculateNights = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const numberOfNights = calculateNights();
  const totalPrice = pension ? pension.price * numberOfNights : 0;
  const formatPrice = (price) => (typeof price === 'number' ? price.toLocaleString() : '0');

  if (!pension && !error) { // 데이터도 없고 에러도 없는 초기 로딩 상태
    return <div className="container">숙소 정보를 불러오는 중...</div>;
  }

  if (error) { // 에러가 발생한 경우
    return (
      <div className="container">
        <div className={styles.notFound}>
          <h2>{error}</h2>
          <Link to="/pet-friendly-lodging">
            <Button variant="primary">숙소 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!pension) { // 로딩이 끝났지만 pension 데이터가 없는 경우
    return (
      <div>
        <div className={styles.notFound}>
          <h2>해당 숙소 정보를 찾을 수 없습니다.</h2>
          <p>주소가 올바른지 확인해주세요.</p>
          <Link to="/pet-friendly-lodging">
            <Button variant="primary">숙소 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailPageContainer}>
      <section className={styles.carouselSection}>
        <Carousel
          showThumbs={false} // 썸네일 이미지 숨기기
          infiniteLoop={true} // 무한 루프
          autoPlay={true} // 자동 재생
          interval={5000} // 5초 간격
          showStatus={false} // 상태 표시(1/3) 숨기기
        >
          {(pension.images || []).map((img, index) => (
            <div key={index}>
              <img src={img} alt={`${pension.name} 이미지 ${index + 1}`} />
            </div>
          ))}
        </Carousel>
        <div className={styles.heroContent}>
          <p className={styles.pensionType}>{pension.type}</p>
          <h1>{pension.name}</h1>
          <p className={styles.pensionLocation}>{pension.location}</p>
        </div>
      </section>

      {/* 👇 3. mainContent의 레이아웃이 캐러셀과 겹치지 않도록 container 클래스를 제거합니다. */}
      <div className={styles.mainContent}>
        <div className={styles.infoColumn}>
          {/* 👇 왼쪽 정보란에서는 '기본 정보' 블록을 제거합니다. */}
          <div className={styles.infoBlock}>
            <h3>숙소 특징</h3>
            <div className={styles.tags}>
              {(pension.tags || []).map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
            </div>
          </div>
          
          <div className={styles.infoBlock}>
            <h3>숙소 소개</h3>
            <p className={styles.description}>
              {pension.name}에 오신 것을 환영합니다! 저희 숙소는 반려동물과 함께 편안한 휴식을 취할 수 있는 최적의 공간입니다. 
              넓은 개별 운동장과 펫 전용 어메니티가 준비되어 있어 아이들이 마음껏 뛰어놀 수 있습니다.
              (이 부분은 각 숙소의 실제 상세 설명으로 대체됩니다.)
            </p>
          </div>
        </div>

        <aside className={styles.bookingColumn}>
          <div className={styles.bookingBox}>
            {/* 👇 1. 예약 위젯 상단에 핵심 정보를 다시 배치합니다. */}
            <div className={styles.bookingSummary}>
              <p className={styles.price}><strong>₩{formatPrice(pension.price)}</strong> / 1박</p>
              <ul className={styles.summaryList}>
                <li><strong>최대 인원:</strong> {pension.maxGuests}명</li>
                <li><strong>체크인:</strong> {pension.checkInTime} / <strong>체크아웃:</strong> {pension.checkOutTime}</li>
              </ul>
            </div>
            
            {/* 2. 예약 입력 UI */}
            <div className={styles.bookingInputs}>
              <div className={styles.datePickers}>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                  placeholderText="체크인 날짜"
                  className={styles.dateInput}
                  dateFormat="yyyy/MM/dd"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate || new Date()}
                  placeholderText="체크아웃 날짜"
                  className={styles.dateInput}
                  dateFormat="yyyy/MM/dd"
                />
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  readOnly
                  className={styles.guestInput}
                  onClick={() => setShowGuestSelector(!showGuestSelector)}
                  value={`게스트 ${guests}명${pets > 0 ? `, 펫 ${pets}마리` : ''}`}
                />
                {showGuestSelector && (
                  <GuestPetSelector
                    guests={guests}
                    setGuests={setGuests}
                    pets={pets}
                    setPets={setPets}
                    maxGuests={pension.maxGuests}
                  />
                )}
              </div>
            </div>
            
            {numberOfNights > 0 && (
              <div className={styles.totalPrice}>
                <span>총 {numberOfNights}박</span>
                <span>₩{formatPrice(totalPrice)}</span>
              </div>
            )}
            
            <div className={styles.bookingActions}>
              <Button variant="primary" size="large" className={styles.bookingButton}>
                예약하기
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PensionDetailPage;