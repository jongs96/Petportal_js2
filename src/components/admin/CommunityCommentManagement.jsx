// src/components/admin/CommunityCommentManagement.jsx
import React, { useState, useEffect } from 'react';
import adminStyles from './Admin.module.css';

// Mock Data for Community Comments
const mockComments = [
  {
    id: 1,
    postId: 101,
    content: '첫 번째 댓글입니다.',
    author_name: '사용자1',
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    postId: 101,
    content: '두 번째 댓글입니다.',
    author_name: '사용자2',
    createdAt: '2024-01-02',
  },
];

const CommunityCommentManagement = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [newComment, setNewComment] = useState({
    postId: '',
    content: '',
    authorId: '',
    parentCommentId: '',
  });

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setComments(mockComments);
      setLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingComment) {
      setEditingComment({ ...editingComment, [name]: value });
    } else {
      setNewComment({ ...newComment, [name]: value });
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { postId, content, authorId, parentCommentId } = newComment;
      if (!postId || !content || !authorId) {
        setError('게시글 ID, 내용, 작성자 ID는 모두 필수입니다.');
        return;
      }

      const commentToAdd = {
        id: comments.length > 0 ? Math.max(...comments.map(c => c.id)) + 1 : 1,
        postId: parseInt(postId, 10),
        content,
        author_name: `사용자${authorId}`,
        createdAt: new Date().toISOString(),
        parentCommentId: parentCommentId ? parseInt(parentCommentId, 10) : null,
      };

      setComments(prev => [...prev, commentToAdd]);
      setNewComment({ postId: '', content: '', authorId: '', parentCommentId: '' });
      alert('댓글이 추가되었습니다.');
    } catch (err) {
      console.error('Failed to add comment:', err);
      setError('댓글 추가에 실패했습니다.');
    }
  };

  const handleEditComment = async (e) => {
    e.preventDefault();
    setError(null);
    if (!editingComment) return;
    try {
      setComments(prev =>
        prev.map(comment => (comment.id === editingComment.id ? editingComment : comment))
      );
      setEditingComment(null);
      alert('댓글이 수정되었습니다.');
    } catch (err) {
      console.error('Failed to edit comment:', err);
      setError('댓글 수정에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;
    setError(null);
    try {
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      alert('댓글이 삭제되었습니다.');
    } catch (err) {
      console.error('Failed to delete comment:', err);
      setError('댓글 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className={adminStyles.userManagementContainer}>댓글 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={adminStyles.userManagementContainer} style={{ color: 'red' }}>오류: {error}</div>;
  }

  return (
    <div className={adminStyles.userManagementContainer}>
      <h3>커뮤니티 댓글 관리</h3>

      {/* Add New Comment Form */}
      <h4>새 댓글 추가</h4>
      <form onSubmit={handleAddComment} className={adminStyles.userForm}>
        <input type="number" name="postId" placeholder="게시글 ID" value={newComment.postId} onChange={handleInputChange} required />
        <textarea name="content" placeholder="내용" value={newComment.content} onChange={handleInputChange} rows="3" required></textarea>
        <input type="number" name="authorId" placeholder="작성자 ID" value={newComment.authorId} onChange={handleInputChange} required />
        <input type="number" name="parentCommentId" placeholder="부모 댓글 ID (선택 사항)" value={newComment.parentCommentId} onChange={handleInputChange} />
        <button type="submit" className={adminStyles.userFormButton}>추가</button>
      </form>

      {/* Comment List */}
      <h4>기존 댓글</h4>
      <table className={adminStyles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>게시글 ID</th>
            <th>내용</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td>{comment.id}</td>
              <td>{comment.postId}</td>
              <td>
                {editingComment?.id === comment.id ? (
                  <textarea name="content" value={editingComment.content} onChange={handleInputChange} className={adminStyles.userEditInput} rows="2"></textarea>
                ) : (
                  comment.content
                )}
              </td>
              <td>{comment.author_name || 'N/A'}</td>
              <td>{comment.createdAt}</td>
              <td>
                {editingComment?.id === comment.id ? (
                  <>
                    <button onClick={handleEditComment} className={adminStyles.userActionButton}>저장</button>
                    <button onClick={() => setEditingComment(null)} className={adminStyles.userActionButton}>취소</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingComment({ ...comment })}>수정</button>
                    <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommunityCommentManagement;
