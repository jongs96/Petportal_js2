import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import styles from './CommentSection.module.css';

// Mock Data for Comments
const mockComments = [
  {
    id: 1,
    postId: 1,
    content: '첫 번째 댓글입니다.',
    author_name: '사용자1',
    author_image: '/src/assets/images/profiles/default-user.svg',
    created_at: '2024-01-01T10:00:00Z',
    likes: 5,
    author_id: 1,
  },
  {
    id: 2,
    postId: 1,
    content: '두 번째 댓글입니다.',
    author_name: '사용자2',
    author_image: '/src/assets/images/profiles/default-user.svg',
    created_at: '2024-01-01T11:00:00Z',
    likes: 3,
    author_id: 2,
  },
  {
    id: 3,
    postId: 1,
    content: '첫 번째 댓글의 답글입니다.',
    author_name: '사용자3',
    author_image: '/src/assets/images/profiles/default-user.svg',
    created_at: '2024-01-01T12:00:00Z',
    likes: 1,
    parent_id: 1,
    author_id: 3,
  },
];

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate fetching comments
    setComments(mockComments.filter(comment => comment.postId === postId));
  }, [postId]);

  const handleSubmitComment = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const commentToAdd = {
        id: comments.length > 0 ? Math.max(...comments.map(c => c.id)) + 1 : 1,
        postId: parseInt(postId),
        content: newComment.trim(),
        author_name: user.nickname || user.email,
        author_image: user.profileImage,
        created_at: new Date().toISOString(),
        likes: 0,
        author_id: user.id,
      };
      setComments(prev => [...prev, commentToAdd]);
      setNewComment('');
      alert('댓글이 작성되었습니다.');
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      alert('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReply = async (parentId) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!replyContent.trim()) {
      alert('답글 내용을 입력해주세요.');
      return;
    }

    try {
      const replyToAdd = {
        id: comments.length > 0 ? Math.max(...comments.map(c => c.id)) + 1 : 1,
        postId: parseInt(postId),
        content: replyContent.trim(),
        author_name: user.nickname || user.email,
        author_image: user.profileImage,
        created_at: new Date().toISOString(),
        likes: 0,
        parent_id: parentId,
        author_id: user.id,
      };
      setComments(prev => [...prev, replyToAdd]);
      setReplyContent('');
      setReplyingTo(null);
      alert('답글이 작성되었습니다.');
    } catch (error) {
      console.error('답글 작성 오류:', error);
      alert('답글 작성 중 오류가 발생했습니다.');
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setComments(prev => prev.map(comment => 
        comment.id === commentId ? { ...comment, content: editContent.trim(), created_at: new Date().toISOString() } : comment
      ));
      setEditingComment(null);
      setEditContent('');
      alert('댓글이 수정되었습니다.');
    } catch (error) {
      console.error('댓글 수정 오류:', error);
      alert('댓글 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setComments(prev => prev.filter(comment => comment.id !== commentId && comment.parent_id !== commentId));
      alert('댓글이 삭제되었습니다.');
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
      alert('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      setComments(prev => prev.map(comment => 
        comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
      ));
    } catch (error) {
      console.error('댓글 좋아요 오류:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return '오늘';
    } else if (diffDays === 2) {
      return '어제';
    } else if (diffDays <= 7) {
      return `${diffDays - 1}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  const renderComment = (comment, isReply = false) => (
    <div key={comment.id} className={`${styles.comment} ${isReply ? styles.reply : ''}`}>
      <div className={styles.commentHeader}>
        <div className={styles.commentAuthor}>
          {comment.author_image && (
            <img src={comment.author_image} alt={comment.author_name} className={styles.authorImage} />
          )}
          <span className={styles.authorName}>{comment.author_name}</span>
          <span className={styles.commentDate}>{formatDate(comment.created_at)}</span>
        </div>

        {user && user.id === comment.author_id && (
          <div className={styles.commentActions}>
            <button
              onClick={() => {
                setEditingComment(comment.id);
                setEditContent(comment.content);
              }}
              className={styles.actionButton}
            >
              수정
            </button>
            <button
              onClick={() => handleDeleteComment(comment.id)}
              className={styles.actionButton}
            >
              삭제
            </button>
          </div>
        )}
      </div>

      <div className={styles.commentContent}>
        {editingComment === comment.id ? (
          <div className={styles.editForm}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className={styles.editTextarea}
              rows={3}
            />
            <div className={styles.editButtons}>
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  setEditingComment(null);
                  setEditContent('');
                }}
              >
                취소
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={() => handleEditComment(comment.id)}
              >
                수정
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p>{comment.content}</p>
            <div className={styles.commentFooter}>
              <button
                onClick={() => handleLikeComment(comment.id)}
                className={styles.likeButton}
              >
                👍 {comment.likes}
              </button>

              {!isReply && user && (
                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className={styles.replyButton}
                >
                  답글
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {replyingTo === comment.id && (
        <div className={styles.replyForm}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 입력하세요..."
            className={styles.replyTextarea}
            rows={3}
          />
          <div className={styles.replyButtons}>
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                setReplyingTo(null);
                setReplyContent('');
              }}
            >
              취소
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={() => handleSubmitReply(comment.id)}
            >
              답글 작성
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const parentComments = comments.filter(comment => !comment.parent_id);
  const childComments = comments.filter(comment => comment.parent_id);

  return (
    <div className={styles.commentSection}>
      <h3 className={styles.commentTitle}>댓글 {comments.length}개</h3>

      {user && (
        <div className={styles.commentForm}>
          <div className={styles.commentInput}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className={styles.commentTextarea}
              rows={4}
            />
          </div>
          <div className={styles.commentSubmit}>
            <Button
              variant="primary"
              onClick={handleSubmitComment}
              disabled={isLoading || !newComment.trim()}
            >
              {isLoading ? '작성 중...' : '댓글 작성'}
            </Button>
          </div>
        </div>
      )}

      <div className={styles.commentList}>
        {parentComments.map(comment => (
          <div key={comment.id}>
            {renderComment(comment)}
            {childComments
              .filter(reply => reply.parent_id === comment.id)
              .map(reply => renderComment(reply, true))
            }
          </div>
        ))}
      </div>

      {!user && (
        <div className={styles.loginPrompt}>
          <p>댓글을 작성하려면 로그인이 필요합니다.</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;