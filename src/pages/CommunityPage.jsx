import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import communityStyles from './CommunityPage.module.css';
import layoutStyles from './commonLayout.module.css';

import BoardNav from '../components/community/BoardNav';
import Board from '../components/community/Board';
import Button from '../components/ui/Button';
import Pagination from '../components/common/Pagination'; // Pagination 컴포넌트를 사용합니다.

// Mock Data for Community Posts
const mockCommunityPosts = {
  'free-talk': {
    posts: [
      { id: 1, title: '저희 집 강아지 미모 좀 보세요!!', author_name: '멍멍이아빠', createdAt: '2025-09-09', views: 123, likes: 108, content: '정말 귀엽지 않나요?' },
      { id: 2, title: '고양이 사료 추천 부탁드립니다.', author_name: '집사일기', createdAt: '2025-09-09', views: 254, likes: 12, content: '1살된 코숏인데 어떤 사료가 좋을까요?' },
    ],
    total_posts: 2,
  },
  'pet-showcase': {
    posts: [
      { id: 3, title: '새로 산 옷 입고 한 컷!', author_name: '패셔니스타', createdAt: '2025-09-10', views: 150, likes: 23, content: '이번에 새로 산 꼬까옷입니다.' },
    ],
    total_posts: 1,
  },
  // Add more mock data for other board keys as needed
};

// Hardcoded board data for navigation (can be fetched from API later if needed)
const boardsMeta = {
  'free-talk': { name: '자유게시판', description: '반려동물에 대한 이야기를 자유롭게 나눠보세요.' },
  'pet-showcase': { name: '펫 자랑 게시판', description: '사랑스러운 반려동물의 사진과 영상을 마음껏 자랑해주세요.' },
  'info-share': { name: '정보공유 게시판', description: '사료, 간식, 병원, 꿀팁 등 유용한 정보를 공유해요.' },
  'qna': { name: 'Q&A 게시판', description: '반려동물을 키우면서 궁금한 점을 물어보세요.' },
  'adoption': { name: '나눔/분양 게시판', description: '따뜻한 마음을 나눠주세요.' },
  'meetups': { name: '산책/모임 게시판', description: '지역별 산책 친구, 정기 모임을 찾아보세요.' },
  'missing': { name: '실종/보호 게시판', description: '소중한 가족을 찾습니다.' },
  'reviews': { name: '펫 동반 장소 후기', description: '함께 갈 수 있는 멋진 장소를 추천해주세요.' },
};

const POSTS_PER_PAGE = 5;

const CommunityPage = () => {
  console.log('CommunityPage rendered'); // New: Confirm component rendering
  const { boardKey: activeBoardKey = 'free-talk' } = useParams();
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 중복 호출 방지를 위한 ref 추가
  const fetchingRef = useRef(false);
  const abortControllerRef = useRef(null);

  // 파라미터를 ref로 관리하여 useCallback 의존성 제거
  const paramsRef = useRef({
    activeBoardKey,
    searchTerm,
    currentPage
  });

  // 파라미터 업데이트
  useEffect(() => {
    paramsRef.current = {
      activeBoardKey,
      searchTerm,
      currentPage
    };
  }, [activeBoardKey, searchTerm, currentPage]);

  const fetchPosts = useCallback(async () => {
    const requestId = Date.now();
    const params = paramsRef.current;
    
    console.log(`[${requestId}] fetchPosts 호출됨:`, params);

    // 이미 요청 중이면 중단
    if (fetchingRef.current) {
      console.log(`[${requestId}] Request already in progress, skipping...`);
      return;
    }

    // 이전 요청이 있으면 취소
    if (abortControllerRef.current) {
      console.log(`[${requestId}] 이전 요청 취소 중...`);
      abortControllerRef.current.abort();
    }

    fetchingRef.current = true;
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      const data = mockCommunityPosts[params.activeBoardKey] || { posts: [], total_posts: 0 };
      
      // Simulate pagination and search
      let filteredPosts = data.posts;
      if (params.searchTerm) {
        filteredPosts = filteredPosts.filter(post => 
          post.title.includes(params.searchTerm) || 
          post.content.includes(params.searchTerm)
        );
      }

      const startIndex = (params.currentPage - 1) * POSTS_PER_PAGE;
      const endIndex = startIndex + POSTS_PER_PAGE;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

      setPosts(paginatedPosts);
      setTotalPosts(filteredPosts.length);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err);
    } finally {
      console.log(`[${requestId}] API 요청 완료, 상태 초기화`);
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []); // 의존성 배열을 비워서 함수 재생성 방지

  useEffect(() => {
    console.log('useEffect 실행됨 - 파라미터 변경:', { activeBoardKey, searchTerm, currentPage });
    
    // 디바운싱: 300ms 후에 실행
    const timeoutId = setTimeout(() => {
      fetchPosts();
    }, 300);
    
    // 클린업 함수
    return () => {
      console.log('useEffect 클린업 실행됨');
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      fetchingRef.current = false;
    };
  }, [activeBoardKey, searchTerm, currentPage, fetchPosts]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchInput = e.target.elements.searchInput.value;
    setSearchTerm(searchInput);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  if (loading) {
    return <div>게시글을 불러오는 중...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>오류: {error.message || '데이터를 불러오는 중 오류가 발생했습니다.'}</div>;
  }
    
  const activeBoardData = boardsMeta[activeBoardKey];
    
  if (!activeBoardData) {
      return <div>게시판을 찾을 수 없습니다.</div>;
  }


  return (
    <div className={layoutStyles.pageContainer}>
      <main className={layoutStyles.pageLayout}>
        <div className={layoutStyles.sidebar}>
          <BoardNav
            boards={boardsMeta}
            activeBoard={activeBoardKey}
          />
        </div>
        <div className={layoutStyles.mainContent}>
          <header className={communityStyles.boardHeader}>
            <h1>{activeBoardData.name}</h1>
            <p>{activeBoardData.description}</p>
          </header>
          <div className={communityStyles.boardControls}>
            <form className={communityStyles.searchBar} onSubmit={handleSearch}>
              <input type="text" name="searchInput" placeholder="궁금한 내용을 검색해보세요." />
              <Button type="submit" variant="secondary" size="medium">검색</Button>
            </form>
            <Link to={`/community/${activeBoardKey}/new`}>
              <Button variant="primary" size="medium">글쓰기</Button>
            </Link>
          </div>
          
          <Board
            notices={[]} // Pass an empty array for notices
            posts={posts}
            boardKey={activeBoardKey}
          />
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </div>
  );
};

export default CommunityPage;