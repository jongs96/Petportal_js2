import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/community/CommentSection';
import Button from '../components/ui/Button';
import styles from './PostDetail.module.css';

// Mock Data for Posts
const mockPosts = [
  {
    id: 1,
    boardKey: 'free-talk',
    category_name: '자유게시판',
    category_icon: '🐾',
    title: '저희 집 강아지 미모 좀 보세요!!',
    content: '정말 귀엽지 않나요? 팔불출인거 알지만 너무 예뻐서 올립니다.',
    author_name: '멍멍이아빠',
    author_image: '/src/assets/images/profiles/default-user.svg',
    created_at: '2025-09-09T10:00:00Z',
    updated_at: '2025-09-09T10:00:00Z',
    views: 123,
    likes: 108,
    author_id: 1,
    images: ['https://picsum.photos/seed/dog_post/800/600'],
  },
  {
    id: 2,
    boardKey: 'info-share',
    category_name: '정보공유 게시판',
    category_icon: '💡',
    title: '강아지 발바닥 습진 관리 꿀팁 공유합니다',
    content: '여름철만 되면 고생하는 아이들 발바닥! 이렇게 관리해보세요.',
    author_name: '알쓸신잡',
    author_image: '/src/assets/images/profiles/default-user.svg',
    created_at: '2025-09-10T11:00:00Z',
    updated_at: '2025-09-10T11:00:00Z',
    views: 188,
    likes: 40,
    author_id: 2,
    images: [],
  },
];

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLiked, setUserLiked] = useState(false);

  useEffect(() => {
    // Simulate fetching post
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      const foundPost = mockPosts.find(p => String(p.id) === String(postId));
      if (foundPost) {
        setPost(foundPost);
        // Simulate user liked status
        setUserLiked(localStorage.getItem(`post-${postId}-liked`) === 'true');
      } else {
        setError('게시글을 찾을 수 없습니다.');
      }
      setIsLoading(false);
    }, 500);
  }, [postId]);

  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    // Simulate like toggle
    setPost(prev => {
      if (!prev) return prev;
      const newLikes = userLiked ? prev.likes - 1 : prev.likes + 1;
      setUserLiked(!userLiked);
      localStorage.setItem(`post-${postId}-liked`, !userLiked);
      return { ...prev, likes: newLikes };
    });
  };

  const handleEdit = () => {
    navigate(`/community/edit/${postId}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    // Simulate delete
    alert('게시글이 삭제되었습니다. (실제 삭제는 되지 않습니다.)');
    navigate('/community');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className={styles.loading}>게시글을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className={styles.error}>
          <p>{error}</p>
          <Button variant="primary" onClick={() => navigate('/community')}>
            커뮤니티로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container">
        <div className={styles.error}>
          <p>게시글을 찾을 수 없습니다.</p>
          <Button variant="primary" onClick={() => navigate('/community')}>
            커뮤니티로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.postDetail}>
        {/* 게시글 헤더 */}
        <header className={styles.postHeader}>
          <div className={styles.breadcrumb}>
            <span onClick={() => navigate('/community')} className={styles.breadcrumbLink}>
              커뮤니티
            </span>
            <span className={styles.breadcrumbSeparator}>›</span> 
            <span onClick={() => navigate(`/community/${post.boardKey}`)} className={styles.breadcrumbLink}>
              {post.category_name}
            </span>
          </div>

          <div className={styles.categoryBadge}>
            <span className={styles.categoryIcon}>{post.category_icon}</span>
            {post.category_name}
          </div>

          <h1 className={styles.postTitle}>{post.title}</h1>

          <div className={styles.postMeta}>
            <div className={styles.authorInfo}>
              {post.author_image && (
                <img src={post.author_image} alt={post.author_name} className={styles.authorImage} />
              )}
              <div className={styles.authorDetails}>
                <span className={styles.authorName}>{post.author_name}</span>
                <div className={styles.postStats}>
                  <span>작성: {formatDate(post.created_at)}</span>
                  {post.updated_at !== post.created_at && (
                    <span>수정: {formatDate(post.updated_at)}</span>
                  )}
                  <span>조회: {post.views}</span>
                  <span>좋아요: {post.likes}</span>
                </div>
              </div>
            </div>

            {user && user.id === post.author_id && (
              <div className={styles.postActions}>
                <Button variant="secondary" size="small" onClick={handleEdit}>
                  수정
                </Button>
                <Button variant="danger" size="small" onClick={handleDelete}>
                  삭제
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* 게시글 내용 */}
        <div className={styles.postContent}>
          {/* 에디터로 작성된 HTML을 렌더링합니다. */}
          <div className={styles.contentText} dangerouslySetInnerHTML={{ __html: post.content }} />
          {post.images && post.images.length > 0 && (
            <div className={styles.postImages}>
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:3001${image}`}
                  alt={`게시글 이미지 ${index + 1}`}
                  className={styles.postImage}
                  onClick={(e) => {
                    // 이미지 클릭 시 새 창에서 크게 보기
                    window.open(e.target.src, '_blank');
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 게시글 푸터 */}
        <footer className={styles.postFooter}>
          <div className={styles.postInteractions}>
            <Button
              variant={userLiked ? "primary" : "secondary"}
              size="medium"
              onClick={handleLike}
              className={styles.likeButton}
            >
              👍 좋아요 {post.likes}
            </Button>
          </div>

          <div className={styles.postNavigation}>
            <Button
              variant="secondary" 
              onClick={() => navigate(`/community/${post.boardKey}`)}
            >
              목록으로
            </Button>
          </div>
        </footer>

        {/* 댓글 섹션 */}
        <CommentSection postId={postId} />
      </div>
    </div>
  );
};

export default PostDetail;