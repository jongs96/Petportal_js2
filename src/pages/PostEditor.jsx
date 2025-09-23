import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CKEditor } from '@ckeditor/ckeditor5-react'; // Add back
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; // Add back
import styles from './PostEditor.module.css';
import Button from '../components/ui/Button';

// Mock Data for Posts
const mockPosts = [
  {
    id: 1,
    boardKey: 'free-talk',
    category_name: '자유게시판',
    title: '저희 집 강아지 미모 좀 보세요!!',
    content: '정말 귀엽지 않나요? 팔불출인거 알지만 너무 예뻐서 올립니다.',
  },
  {
    id: 2,
    boardKey: 'info-share',
    category_name: '정보공유 게시판',
    title: '강아지 발바닥 습진 관리 꿀팁 공유합니다',
    content: '여름철만 되면 고생하는 아이들 발바닥!',
  },
];

// Mock Categories
const mockCategories = [
  { boardKey: 'free-talk', category_name: '자유게시판' },
  { boardKey: 'pet-showcase', category_name: '펫 자랑 게시판' },
  { boardKey: 'info-share', category_name: '정보공유 게시판' },
  { boardKey: 'qna', category_name: 'Q&A 게시판' },
  { boardKey: 'adoption', category_name: '나눔/분양 게시판' },
  { boardKey: 'meetups', category_name: '산책/모임 게시판' },
  { boardKey: 'missing', category_name: '실종/보호 게시판' },
  { boardKey: 'reviews', category_name: '펫 동반 장소 후기' },
];

// --- CKEditor 5 Custom Upload Adapter (Mock) ---
// 실제 업로드 로직은 백엔드에 의존하므로 여기서는 더미 어댑터를 사용합니다.
function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MockUploadAdapter(loader);
  };
}

class MockUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = (e) => {
          // 더미 이미지 URL 반환
          resolve({ default: e.target.result }); 
        };
        reader.readAsDataURL(file);
      });
    });
  }

  abort() {
    // No-op
  }
}

const PostEditor = () => {
  const { boardKey, postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!postId;
  const [categories, setCategories] = useState([]);
  const [selectedBoardKey, setSelectedBoardKey] = useState(boardKey || 'free-talk');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]); // Not used in mock, but kept for compatibility
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    // Simulate fetching categories
    setCategories(mockCategories);

    if (isEditing) {
      // Simulate fetching post data
      const foundPost = mockPosts.find(p => String(p.id) === String(postId));
      if (foundPost) {
        setTitle(foundPost.title);
        setContent(foundPost.content);
        setSelectedBoardKey(foundPost.boardKey);
      } else {
        alert('게시글 정보를 불러오는 데 실패했습니다.');
        navigate('/community');
      }
    }
  }, [isEditing, postId, navigate]);

  const handleCancel = () => {
    if (title.trim() || content.trim() || images.length > 0) {
      if (window.confirm(`${isEditing ? '수정' : '작성'}을 취소하시겠습니까? 변경사항이 저장되지 않습니다.`)) {
        navigate(isEditing ? `/community/posts/${postId}` : '/community');
      }
    } else {
      navigate(isEditing ? `/community/posts/${postId}` : '/community');
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate post submission
      alert(`게시글이 ${isEditing ? '수정' : '등록'}되었습니다. (실제 저장되지 않음)`);
      navigate(isEditing ? `/community/posts/${postId}` : `/community/${selectedBoardKey}`);
    } catch (error) {
      console.error(`게시글 ${isEditing ? '수정' : '등록'} 오류:`, error);
      alert(`게시글 ${isEditing ? '수정' : '등록'} 중 오류가 발생했습니다.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className={styles.loginRequired}>
          <h2>로그인이 필요합니다</h2>
          <p>글쓰기를 하려면 먼저 로그인해주세요.</p>
          <Button variant="primary" onClick={() => navigate('/login')}>
            로그인하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.editorLayout}>
        <header className={styles.editorHeader}>
          <h2>{isEditing ? '글 수정' : '글쓰기'}</h2>
        </header>

        <div className={styles.formGroup}>
          <label className={styles.label}>게시판 선택</label>
          <select
            value={selectedBoardKey}
            onChange={(e) => setSelectedBoardKey(e.target.value)}
            className={styles.boardSelector}
            disabled={isEditing} // 수정 시 게시판 변경 불가
          >
            {categories.map((category) => (
              <option key={category.boardKey} value={category.boardKey}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className={styles.titleInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>내용</label>
          <div className={styles.editorWrapper}>
            <CKEditor // Add back
              editor={ClassicEditor} // Add back
              data={content}
              config={{
                extraPlugins: [CustomUploadAdapterPlugin],
                placeholder: "내용을 입력하세요...",
                // 여기에 추가적인 CKEditor 설정을 할 수 있습니다.
                // 예: toolbar: [ 'heading', '|', 'bold', 'italic', 'link' ]
              }}
              onReady={editor => {
                setEditorInstance(editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setContent(data);
              }}
            />
          </div>
        </div>

        <footer className={styles.editorFooter}>
          <Button
            variant="secondary"
            size="medium"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="medium"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (isEditing ? '수정 중...' : '등록 중...') : (isEditing ? '수정' : '등록')}
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default PostEditor;