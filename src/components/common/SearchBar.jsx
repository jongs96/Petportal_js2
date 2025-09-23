// src/components/common/SearchBar.jsx

// React의 `useState` 훅과 `useNavigate` 훅을 가져옵니다.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 프로그래매틱하게 처리하기 위해 사용합니다.

// CSS 모듈과 SearchContext를 가져옵니다.
import styles from './SearchBar.module.css';
import { useSearch } from '../../contexts/SearchContext'; // 전역 검색 상태를 사용하기 위함입니다.

/**
 * SearchBar 컴포넌트
 * 
 * 사용자가 키워드를 입력하여 웹사이트 내의 콘텐츠를 검색할 수 있는 검색창입니다.
 * 자동 완성 제안 기능을 포함하고 있으며, 검색어에 따라 관련 페이지로 이동시킵니다.
 * 
 * @param {object} props - 컴포넌트에 전달되는 속성(props)
 * @param {boolean} props.isScrolled - 페이지 스크롤 여부. true이면 스타일이 변경됩니다.
 */
const SearchBar = ({ isScrolled }) => {
  // `useSearch` 커스텀 훅을 통해 전역 검색어 상태(searchTerm)와 상태 변경 함수(setSearchTerm)를 가져옵니다.
  const { searchTerm, setSearchTerm } = useSearch();
  // `useState`를 사용하여 이 컴포넌트 내부의 상태들을 관리합니다.
  const [suggestions, setSuggestions] = useState([]); // 검색어 제안 목록을 저장하는 상태
  const [showSuggestions, setShowSuggestions] = useState(false); // 제안 목록을 보여줄지 여부를 결정하는 상태
  
  // `useNavigate` 훅을 사용하여 페이지 이동 함수를 초기화합니다.
  const navigate = useNavigate();

  // 특정 검색 키워드와 해당 키워드에 매핑되는 페이지 경로를 정의한 객체입니다.
  const searchMappings = {
    // 서비스 관련
    '미용': '/grooming', '그루밍': '/grooming', '목욕': '/grooming',
    '병원': '/hospital', '동물병원': '/hospital', '수의사': '/hospital', '치료': '/hospital',
    '카페': '/cafe', '펫카페': '/cafe',
    '호텔': '/hotel', '숙박': '/hotel',
    '펜션': '/pet-friendly-lodging',
    
    // 반려용품 관련
    '사료': '/pet-supplies/category/사료', '간식': '/pet-supplies/category/간식', '장난감': '/pet-supplies/category/장난감',
    '용품': '/pet-supplies', '반려용품': '/pet-supplies',
    '쿠션': '/pet-supplies/category/침구/쿠션', '침구': '/pet-supplies/category/침구/쿠션',
    '의류': '/pet-supplies/category/의류/악세서리', '목줄': '/pet-supplies/category/의류/악세서리',
    '샴푸': '/pet-supplies/category/미용/목욕', '미용용품': '/pet-supplies/category/미용/목욕',
    
    // 커뮤니티 관련
    '커뮤니티': '/community', '게시판': '/community',
    '자유게시판': '/community/free-talk', '자유': '/community/free-talk',
    '펫자랑': '/community/pet-showcase', '자랑': '/community/pet-showcase',
    '정보공유': '/community/info-share', '정보': '/community/info-share',
    'qna': '/community/qna', '질문': '/community/qna',
    '분양': '/community/adoption', '나눔': '/community/adoption',
    '산책': '/community/walk', '모임': '/community/walk',
    '실종': '/community/missing', '보호': '/community/missing',
    '후기': '/community/review', '리뷰': '/community/review',
    
    // 기타
    '고객센터': '/customerservice', '문의': '/customerservice', '공지': '/notice', 'faq': '/faq'
  };

  // 검색창의 입력값이 변경될 때마다 호출되는 함수입니다.
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value); // 전역 검색어 상태를 업데이트합니다.
    
    if (value.trim()) { // 입력값의 양쪽 공백을 제거한 후, 값이 존재한다면
      // `searchMappings`의 키(keyword)들 중에서 현재 입력값과 관련된 제안을 찾습니다.
      const matchedSuggestions = Object.keys(searchMappings)
        .filter(keyword => keyword.includes(value.toLowerCase()) || value.toLowerCase().includes(keyword))
        .slice(0, 5); // 최대 5개까지만 보여줍니다.
      
      setSuggestions(matchedSuggestions); // 찾은 제안 목록으로 상태를 업데이트합니다.
      setShowSuggestions(true); // 제안 목록을 보여주도록 설정합니다.
    } else {
      setSuggestions([]); // 입력값이 없으면 제안 목록을 비웁니다.
      setShowSuggestions(false); // 제안 목록을 숨깁니다.
    }
  };

  // 검색 폼(form)이 제출될 때(Enter 키를 누르거나 검색 버튼 클릭 시) 호출되는 함수입니다.
  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 제출 시 발생하는 기본 동작(페이지 새로고침)을 막습니다.
    if (searchTerm.trim()) { // 검색어가 비어있지 않다면
      performSearch(searchTerm.trim()); // 검색을 수행합니다.
    }
  };

  // 실제 검색 로직을 수행하는 함수입니다.
  const performSearch = (query) => {
    const lowerQuery = query.toLowerCase(); // 검색어를 소문자로 변환하여 일관성을 유지합니다.
    
    // `searchMappings`에 정의된 키워드와 정확히 일치하는지 확인합니다.
    for (const [keyword, path] of Object.entries(searchMappings)) {
      if (lowerQuery.includes(keyword) || keyword.includes(lowerQuery)) {
        navigate(path); // 일치하는 키워드가 있으면 해당 경로로 페이지를 이동합니다.
        setShowSuggestions(false); // 제안 목록을 숨깁니다.
        return; // 함수 실행을 종료합니다.
      }
    }
    
    // 만약 `searchMappings`에서 일치하는 키워드를 찾지 못했다면,
    // 기본적으로 반려용품 검색 페이지로 이동하여 검색을 수행합니다.
    navigate(`/pet-supplies?search=${encodeURIComponent(query)}`);
    setShowSuggestions(false); // 제안 목록을 숨깁니다.
  };

  // 제안 목록의 항목을 클릭했을 때 호출되는 함수입니다.
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion); // 클릭한 제안으로 검색어를 설정합니다.
    performSearch(suggestion); // 해당 제안으로 검색을 바로 수행합니다.
  };

  return (
    // `<form>` 태그로 검색창과 버튼을 감싸서 Enter 키로 제출이 가능하게 합니다.
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <div className={`${styles.searchContainer} ${isScrolled ? styles.scrolled : ''}`}>
        {/* 검색어를 입력하는 input 요소입니다. */}
        <input
          type="text"
          placeholder="미용, 병원, 카페, 용품 등 검색..."
          value={searchTerm} // input의 값은 전역 searchTerm 상태와 동기화됩니다.
          onChange={handleInputChange} // 값이 변경될 때마다 handleInputChange 함수를 호출합니다.
          onFocus={() => searchTerm && setShowSuggestions(true)} // input에 포커스가 가면 제안 목록을 보여줍니다.
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // 포커스를 잃으면 약간의 딜레이 후 제안 목록을 숨깁니다. (제안 클릭을 위해)
          className={styles.searchInput}
        />
        {/* 검색 실행 버튼입니다. */}
        <button type="submit" className={styles.searchButton}>
          검색
        </button>
        
        {/* 검색 제안 목록을 조건부로 렌더링합니다. */}
        {/* showSuggestions가 true이고 suggestions 배열에 항목이 1개 이상 있을 때만 보여줍니다. */}
        {showSuggestions && suggestions.length > 0 && (
          <div className={styles.suggestions}>
            {/* suggestions 배열을 순회하며 각 제안 항목을 렌더링합니다. */}
            {suggestions.map((suggestion, index) => (
              <div
                key={index} // React가 각 항목을 식별하기 위한 고유한 key입니다.
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(suggestion)} // 클릭 시 handleSuggestionClick 함수를 호출합니다.
              >
                <span className={styles.suggestionIcon}>🔍</span>
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};

// SearchBar 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
export default SearchBar;