import React, { useState, useEffect } from 'react';
import axios from 'axios'; // New: Import axios
import { useParams, useNavigate } from 'react-router-dom';
import styles from './PostView.module.css';
import Button from '../components/ui/Button';
import Comments from '../components/community/Comments';
import { useUI } from '../contexts/UIContext';

const API_URL = 'http://localhost:3001/api/community'; // New: Backend API URL

// 파일 확장자에 따라 아이콘 클래스를 반환하는 헬퍼 함수
const getFileIconClass = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  switch (ext) {
    case 'jpg': case 'jpeg': case 'png': case 'gif': case 'bmp': case 'svg':
      return 'fas fa-image'; // 이미지 아이콘
    case 'pdf':
      return 'fas fa-file-pdf'; // PDF 아이콘
    case 'doc': case 'docx':
      return 'fas fa-file-word'; // Word 아이콘
    case 'xls': case 'xlsx':
      return 'fas fa-file-excel'; // Excel 아이콘
    case 'ppt': case 'pptx':
      return 'fas fa-file-powerpoint'; // PowerPoint 아이콘
    case 'zip': case 'rar': case '7z':
      return 'fas fa-file-archive'; // 압축 파일 아이콘
    case 'mp4': case 'mov': case 'avi':
      return 'fas fa-file-video'; // 비디오 아이콘
    case 'mp3': case 'wav':
      return 'fas fa-file-audio'; // 오디오 아이콘
    default:
      return 'fas fa-file'; // 기본 파일 아이콘
  }
};

const PostView = () => {
  const { boardKey, postId } = useParams();
  const navigate = useNavigate();
  const { setIsLoading } = useUI();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      setIsLoading(true);
      setLoading(true);
      setError(null);
      try {
        // Fetch post details
        const postResponse = await axios.get(`${API_URL}/posts/${postId}`);
        setPost(postResponse.data);

        // Fetch comments for the post
        const commentsResponse = await axios.get(`${API_URL}/posts/${postId}/comments`);
        setComments(commentsResponse.data);

      } catch (err) {
        console.error('Failed to fetch post or comments:', err);
        setError('게시글 또는 댓글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPostAndComments();
    }
  }, [postId]);

  const handleGoBack = () => navigate(-1); // Go back to previous page

  if (loading) {
    return <div className="container">게시글을 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className={styles.notFound}>
          <h2>{error}</h2>
          <Button variant="primary" onClick={handleGoBack}>목록으로 돌아가기</Button>
        </div>
      </div>
    );
  }

  if (!post) { 
    return (
      <div className="container">
        <div className={styles.notFound}>
          <h2>게시글을 찾을 수 없습니다.</h2>
          <Button variant="primary" onClick={handleGoBack}>목록으로 돌아가기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.postViewContainer}>
        <header className={styles.postHeader}>
          <div className={styles.category}>{post.boardKey}</div> {/* Display boardKey for now */}
          <h1>{post.title}</h1>
          <div className={styles.authorInfo}>
            <div className={styles.authorProfile}>
              <div className={styles.authorAvatar}>{post.author.charAt(0)}</div>
              <strong>{post.author}</strong>
            </div>
            <div className={styles.postMeta}>
              <span>{post.createdAt}</span>
              <span>조회 {post.views}</span>
            </div>
          </div>
        </header>

        <div className={styles.postContent}><pre>{post.content}</pre></div>
        
        {/* Attachments section removed for now as backend doesn't support */}

        <div className={styles.actionBar}>
          {/* Like button removed for now as backend doesn't support */}
        </div>
        
        <Comments 
          comments={comments} // Pass fetched comments
          // onAddComment and onLikeComment props removed as backend not implemented for public
        />

        <footer className={styles.postFooter}><Button variant="secondary" onClick={handleGoBack}>목록으로</Button></footer>
      </div>
    </div>
  );
};
export default PostView;