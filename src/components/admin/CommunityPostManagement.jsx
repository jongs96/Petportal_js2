// src/components/admin/CommunityPostManagement.jsx
import React, { useState, useEffect } from 'react';
import adminStyles from './Admin.module.css';

// Mock Data for Community Posts
const mockPosts = [
  {
    id: 1,
    title: '첫 번째 게시글',
    content: '이것은 첫 번째 게시글의 내용입니다.',
    author_name: '작성자1',
    createdAt: '2024-01-01',
    views: 10,
    likes: 5,
  },
  {
    id: 2,
    title: '두 번째 게시글',
    content: '이것은 두 번째 게시글의 내용입니다.',
    author_name: '작성자2',
    createdAt: '2024-01-02',
    views: 20,
    likes: 10,
  },
];

const CommunityPostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    authorId: '',
  });

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingPost) {
      setEditingPost({ ...editingPost, [name]: value });
    } else {
      setNewPost({ ...newPost, [name]: value });
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { title, content, authorId } = newPost;
      if (!title || !content || !authorId) {
        setError('제목, 내용, 작성자 ID는 모두 필수입니다.');
        return;
      }

      const postToAdd = {
        id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
        title,
        content,
        author_name: `작성자${authorId}`,
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0,
      };

      setPosts(prev => [...prev, postToAdd]);
      setNewPost({ title: '', content: '', authorId: '' });
      alert('게시글이 추가되었습니다.');
    } catch (err) {
      console.error('Failed to add post:', err);
      setError('게시글 추가에 실패했습니다.');
    }
  };

  const handleEditPost = async (e) => {
    e.preventDefault();
    setError(null);
    if (!editingPost) return;
    try {
      setPosts(prev =>
        prev.map(post => (post.id === editingPost.id ? editingPost : post))
      );
      setEditingPost(null);
      alert('게시글이 수정되었습니다.');
    } catch (err) {
      console.error('Failed to edit post:', err);
      setError('게시글 수정에 실패했습니다.');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;
    setError(null);
    try {
      setPosts(prev => prev.filter(post => post.id !== postId));
      alert('게시글이 삭제되었습니다.');
    } catch (err) {
      console.error('Failed to delete post:', err);
      setError('게시글 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className={adminStyles.userManagementContainer}>게시글 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={adminStyles.userManagementContainer} style={{ color: 'red' }}>오류: {error}</div>;
  }

  return (
    <div className={adminStyles.userManagementContainer}>
      <h3>커뮤니티 게시글 관리</h3>

      {/* Add New Post Form */}
      <h4>새 게시글 추가</h4>
      <form onSubmit={handleAddPost} className={adminStyles.userForm}>
        <input type="text" name="title" placeholder="제목" value={newPost.title} onChange={handleInputChange} required />
        <textarea name="content" placeholder="내용" value={newPost.content} onChange={handleInputChange} rows="5" required></textarea>
        <input type="number" name="authorId" placeholder="작성자 ID" value={newPost.authorId} onChange={handleInputChange} required />
        <button type="submit" className={adminStyles.userFormButton}>추가</button>
      </form>

      {/* Post List */}
      <h4>기존 게시글</h4>
      <table className={adminStyles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
            <th>좋아요</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>
                {editingPost?.id === post.id ? (
                  <input type="text" name="title" value={editingPost.title} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  post.title
                )}
              </td>
              <td>
                {post.author_name || 'N/A'}
              </td>
              <td>{post.createdAt}</td>
              <td>{post.views}</td>
              <td>{post.likes}</td>
              <td>
                {editingPost?.id === post.id ? (
                  <>
                    <button onClick={handleEditPost} className={adminStyles.userActionButton}>저장</button>
                    <button onClick={() => setEditingPost(null)} className={adminStyles.userActionButton}>취소</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingPost({ ...post })}>수정</button>
                    <button onClick={() => handleDeletePost(post.id)}>삭제</button>
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

export default CommunityPostManagement;
