// src/components/support/FAQSection.jsx
import React, { useState, useEffect } from 'react';
import styles from './FAQSection.module.css';

// Mock Data for FAQs
const mockFaqs = [
  {
    id: 1,
    category: "회원가입/로그인",
    question: "회원가입은 어떻게 하나요?",
    answer: "홈페이지 우측 상단의 '회원가입' 버튼을 클릭하여 이메일과 비밀번호를 입력하고 약관에 동의하시면 가입이 완료됩니다. 소셜 로그인(구글, 카카오)도 지원합니다.",
    views: 1234
  },
  {
    id: 2,
    category: "서비스 이용",
    question: "반려동물 미용 예약은 어떻게 하나요?",
    answer: "'펫 미용' 서비스 페이지에서 원하는 미용실과 시간을 선택하신 후 예약하실 수 있습니다. 예약 확정 후 SMS로 확인 메시지를 보내드립니다.",
    views: 987
  },
  {
    id: 3,
    category: "결제/환불",
    question: "결제는 어떤 방식으로 이루어지나요?",
    answer: "신용카드, 계좌이체, 간편결제(카카오페이, 토스페이 등) 등 다양한 결제 수단을 지원합니다. 모든 결제는 SSL 보안 시스템으로 안전하게 처리됩니다.",
    views: 756
  },
];

const mockCategories = ['전체', '회원가입/로그인', '서비스 이용', '결제/환불', '고객지원'];

const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setLoading(true);
    setTimeout(() => {
      let filteredFaqs = mockFaqs;
      if (selectedCategory && selectedCategory !== '전체') {
        filteredFaqs = mockFaqs.filter(faq => faq.category === selectedCategory);
      }
      setFaqs(filteredFaqs);
      setLoading(false);
    }, 500);
  }, [selectedCategory]);

  const toggleExpand = (faqId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedItems(newExpanded);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>FAQ를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>자주 묻는 질문</h2>
        <p className={styles.description}>
          자주 묻는 질문들을 확인해보세요. 원하는 답변을 찾지 못하셨다면 1:1 문의를 이용해주세요.
        </p>
      </div>

      {/* 카테고리 필터 */}
      <div className={styles.categoryFilter}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.categoryButton} ${
              (selectedCategory === category ||
               (selectedCategory === '' && category === '전체'))
                ? styles.active : ''
            }`}
            onClick={() => setSelectedCategory(category === '전체' ? '' : category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ 목록 */}
      <div className={styles.faqList}>
        {faqs.length === 0 ? (
          <div className={styles.empty}>
            <p>등록된 FAQ가 없습니다.</p>
          </div>
        ) : (
          faqs.map((faq) => (
            <div key={faq.id} className={styles.faqItem}>
              <button
                className={styles.questionButton}
                onClick={() => toggleExpand(faq.id)}
              >
                <div className={styles.questionHeader}>
                  <span className={styles.questionIcon}>Q</span>
                  <span className={styles.questionText}>{faq.question}</span>
                  <span className={styles.category}>{faq.category}</span>
                </div>
                <span className={`${styles.expandIcon} ${
                  expandedItems.has(faq.id) ? styles.expanded : ''
                }`}>
                  ▼
                </span>
              </button>

              {expandedItems.has(faq.id) && (
                <div className={styles.answer}>
                  <div className={styles.answerHeader}>
                    <span className={styles.answerIcon}>A</span>
                  </div>
                  <div className={styles.answerContent}>
                    {faq.answer.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FAQSection;