// src/pages/GroomingDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import styles from './GroomingDetailPage.module.css'; // Use the new CSS module
import Button from '../components/ui/Button';
import { useUI } from '../contexts/UIContext';
import { mockGroomingServices } from '../data/mockGroomingData.js'; // Import the new mock data

const GroomingDetailPage = () => {
  const { groomingId } = useParams(); // Get groomingId from URL
  const { setIsLoading } = useUI();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const foundService = mockGroomingServices.find(s => s.id === parseInt(groomingId, 10));
      
      if (foundService) {
        const detailedService = {
          ...foundService,
          images: [
            `https://picsum.photos/seed/grooming_detail${foundService.id}_1/1200/800`,
            `https://picsum.photos/seed/grooming_detail${foundService.id}_2/1200/800`,
            `https://picsum.photos/seed/grooming_detail${foundService.id}_3/1200/800`,
          ],
          type: '펫 미용',
          location: foundService.address,
        };
        setService(detailedService);
      } else {
        setError('미용실 정보를 찾을 수 없습니다.');
      }
      setLoading(false);
      setIsLoading(false);
    }, 500);
  }, [groomingId, setIsLoading]);

  if (loading) {
    return <div className="container">미용실 정보를 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className={styles.notFound}>
          <h2>{error}</h2>
          <Link to="/grooming">
            <Button variant="primary">미용실 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div>
        <div className={styles.notFound}>
          <h2>해당 미용실 정보를 찾을 수 없습니다.</h2>
          <p>주소가 올바른지 확인해주세요.</p>
          <Link to="/grooming">
            <Button variant="primary">미용실 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailPageContainer}>
      <section className={styles.carouselSection}>
        <Carousel
          showThumbs={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
          showStatus={false}
        >
          {service.images.map((img, index) => (
            <div key={index}>
              <img src={img} alt={`${service.name} 이미지 ${index + 1}`} />
            </div>
          ))}
        </Carousel>
        <div className={styles.heroContent}>
          <p className={styles.pageType}>{service.type}</p>
          <h1>{service.name}</h1>
          <p className={styles.pageLocation}>{service.location}</p>
        </div>
      </section>

      <div className={styles.mainContent}>
        <div className={styles.infoColumn}>
          <div className={styles.infoBlock}>
            <h3>제공 서비스</h3>
            <div className={styles.tags}>
              {service.services?.map(s => <span key={s} className={styles.tag}>{s}</span>)}
            </div>
          </div>
          
          <div className={styles.infoBlock}>
            <h3>미용실 소개</h3>
            <p className={styles.description}>
              {service.description || '상세 정보가 준비중입니다.'}
            </p>
          </div>
          
          <div className={styles.infoBlock}>
            <h3>운영 정보</h3>
            <p><strong>주소:</strong> {service.address}</p>
            <p><strong>전화번호:</strong> {service.phone || '정보 없음'}</p>
            <p><strong>대상 동물:</strong> {service.targetAnimals?.join(', ') || '정보 없음'}</p>
          </div>
        </div>

        <aside className={styles.bookingColumn}>
          <div className={styles.bookingBox}>
            <div className={styles.bookingSummary}>
              <p className={styles.rating}><strong>⭐ {service.rating || '-'}</strong></p>
            </div>
            
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

export default GroomingDetailPage;
