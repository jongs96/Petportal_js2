// src/components/admin/SupportManagement.jsx
import React, { useState, useEffect } from 'react';
import adminStyles from './Admin.module.css';

// Mock Data
const mockInquiries = [
  {
    id: 1,
    category: '서비스 이용',
    title: '로그인 오류 문의',
    user: { username: 'testuser1' },
    status: 'pending',
    createdAt: '2024-01-01T10:00:00Z',
    content: '로그인이 안 돼요.',
    adminResponse: null,
    respondedAt: null,
  },
  {
    id: 2,
    category: '결제/환불',
    title: '환불 요청',
    user: { username: 'testuser2' },
    status: 'answered',
    createdAt: '2024-01-02T11:00:00Z',
    content: '결제 취소해주세요.',
    adminResponse: '환불 처리 완료되었습니다.',
    respondedAt: '2024-01-02T15:00:00Z',
  },
];

const mockFaqs = [
  {
    id: 1,
    category: '일반',
    question: '회원가입은 어떻게 하나요?',
    answer: '이메일과 비밀번호를 입력하여 가입할 수 있습니다.',
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    category: '결제',
    question: '결제 수단은 무엇이 있나요?',
    answer: '신용카드, 계좌이체 등이 있습니다.',
    order: 2,
    isActive: true,
  },
];

const mockNotices = [
  {
    id: 1,
    title: '서비스 점검 안내',
    content: '시스템 점검이 예정되어 있습니다.',
    isImportant: true,
    isActive: true,
    createdAt: '2024-01-01T09:00:00Z',
  },
  {
    id: 2,
    title: '새로운 기능 추가',
    content: '새로운 기능이 추가되었습니다.',
    isImportant: false,
    isActive: true,
    createdAt: '2024-01-05T14:00:00Z',
  },
];

const SupportManagement = () => {
  const [activeTab, setActiveTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      switch (activeTab) {
        case 'inquiries':
          setInquiries(mockInquiries);
          break;
        case 'faqs':
          setFaqs(mockFaqs);
          break;
        case 'notices':
          setNotices(mockNotices);
          break;
      }
      setLoading(false);
    }, 500);
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (activeTab === 'inquiries') {
        // Inquiries are only responded to, not added/edited directly via form
        setInquiries(prev => prev.map(inq => inq.id === editingItem.id ? { ...inq, adminResponse: formData.adminResponse, status: formData.status, respondedAt: new Date().toISOString() } : inq));
      } else if (activeTab === 'faqs') {
        if (editingItem) {
          setFaqs(prev => prev.map(faq => faq.id === editingItem.id ? { ...faq, ...formData } : faq));
        } else {
          const newId = faqs.length > 0 ? Math.max(...faqs.map(f => f.id)) + 1 : 1;
          setFaqs(prev => [...prev, { ...formData, id: newId }]);
        }
      } else if (activeTab === 'notices') {
        if (editingItem) {
          setNotices(prev => prev.map(notice => notice.id === editingItem.id ? { ...notice, ...formData } : notice));
        } else {
          const newId = notices.length > 0 ? Math.max(...notices.map(n => n.id)) + 1 : 1;
          setNotices(prev => [...prev, { ...formData, id: newId, createdAt: new Date().toISOString() }]);
        }
      }
      setEditingItem(null);
      setFormData({});
      alert(editingItem ? '수정되었습니다.' : '등록되었습니다.');
    } catch (error) {
      console.error('저장 오류:', error);
      alert('오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      if (activeTab === 'faqs') {
        setFaqs(prev => prev.filter(faq => faq.id !== id));
      } else if (activeTab === 'notices') {
        setNotices(prev => prev.filter(notice => notice.id !== id));
      }
      alert('삭제되었습니다.');
    } catch (error) {
      console.error('삭제 오류:', error);
      alert('오류가 발생했습니다.');
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderInquiries = () => (
    <div>
      <h3>1:1 문의 관리</h3>
      {loading ? (
        <div className={adminStyles.loading}>로딩 중...</div>
      ) : (
        <div className={adminStyles.tableContainer}>
          <table className={adminStyles.table}>
            <thead>
              <tr>
                <th>카테고리</th>
                <th>제목</th>
                <th>작성자</th>
                <th>상태</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(inquiry => (
                <tr key={inquiry.id}>
                  <td>{inquiry.category}</td>
                  <td>{inquiry.title}</td>
                  <td>{inquiry.user?.username || '알 수 없음'}</td>
                  <td>
                    <span className={`${adminStyles.badge} ${
                      inquiry.status === 'pending' ? adminStyles.badgePending :
                      inquiry.status === 'answered' ? adminStyles.badgeAnswered :
                      adminStyles.badgeClosed
                    }`}>
                      {inquiry.status === 'pending' ? '답변대기' :
                       inquiry.status === 'answered' ? '답변완료' : '문의종료'}
                    </span>
                  </td>
                  <td>{formatDate(inquiry.createdAt)}</td>
                  <td>
                    <button
                      onClick={() => startEdit(inquiry)}
                      className={adminStyles.editButton}
                    >
                      {inquiry.status === 'pending' ? '답변하기' : '수정하기'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingItem && (
        <div className={adminStyles.modal}>
          <div className={adminStyles.modalContent}>
            <h4>문의 답변</h4>
            <div className={adminStyles.modalSection}>
              <strong>문의 내용:</strong>
              <p>{editingItem.content}</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={adminStyles.formGroup}>
                <label>답변 내용:</label>
                <textarea
                  value={formData.adminResponse || ''}
                  onChange={(e) => setFormData({...formData, adminResponse: e.target.value})}
                  required
                  rows={6}
                />
              </div>
              <div className={adminStyles.formGroup}>
                <label>상태:</label>
                <select
                  value={formData.status || 'answered'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="answered">답변완료</option>
                  <option value="closed">문의종료</option>
                </select>
              </div>
              <div className={adminStyles.modalButtons}>
                <button type="submit" className={adminStyles.submitButton}>저장</button>
                <button type="button" onClick={() => setEditingItem(null)} className={adminStyles.cancelButton}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderFAQs = () => (
    <div>
      <div className={adminStyles.sectionHeader}>
        <h3>FAQ 관리</h3>
        <button
          onClick={() => {
            setEditingItem(null);
            setFormData({ category: '일반', question: '', answer: '', order: 0, isActive: true });
          }}
          className={adminStyles.addButton}
        >
          FAQ 추가
        </button>
      </div>

      {loading ? (
        <div className={adminStyles.loading}>로딩 중...</div>
      ) : (
        <div className={adminStyles.tableContainer}>
          <table className={adminStyles.table}>
            <thead>
              <tr>
                <th>카테고리</th>
                <th>질문</th>
                <th>순서</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map(faq => (
                <tr key={faq.id}>
                  <td>{faq.category}</td>
                  <td>{faq.question}</td>
                  <td>{faq.order}</td>
                  <td>
                    <span className={`${adminStyles.badge} ${faq.isActive ? adminStyles.badgeActive : adminStyles.badgeInactive}`}>
                      {faq.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => startEdit(faq)} className={adminStyles.editButton}>수정</button>
                    <button onClick={() => handleDelete(faq.id)} className={adminStyles.deleteButton}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(editingItem || formData.question !== undefined) && (
        <div className={adminStyles.modal}>
          <div className={adminStyles.modalContent}>
            <h4>{editingItem ? 'FAQ 수정' : 'FAQ 추가'}</h4>
            <form onSubmit={handleSubmit}>
              <div className={adminStyles.formGroup}>
                <label>카테고리:</label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="일반">일반</option>
                  <option value="이용방법">이용방법</option>
                  <option value="결제">결제</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div className={adminStyles.formGroup}>
                <label>질문:</label>
                <input
                  type="text"
                  value={formData.question || ''}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  required
                />
              </div>
              <div className={adminStyles.formGroup}>
                <label>답변:</label>
                <textarea
                  value={formData.answer || ''}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  required
                  rows={4}
                />
              </div>
              <div className={adminStyles.formGroup}>
                <label>순서:</label>
                <input
                  type="number"
                  value={formData.order || 0}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                />
              </div>
              <div className={adminStyles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive !== false}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  활성화
                </label>
              </div>
              <div className={adminStyles.modalButtons}>
                <button type="submit" className={adminStyles.submitButton}>저장</button>
                <button type="button" onClick={() => {setEditingItem(null); setFormData({});}} className={adminStyles.cancelButton}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderNotices = () => (
    <div>
      <div className={adminStyles.sectionHeader}>
        <h3>공지사항 관리</h3>
        <button
          onClick={() => {
            setEditingItem(null);
            setFormData({ title: '', content: '', isImportant: false, isActive: true });
          }}
          className={adminStyles.addButton}
        >
          공지 추가
        </button>
      </div>

      {loading ? (
        <div className={adminStyles.loading}>로딩 중...</div>
      ) : (
        <div className={adminStyles.tableContainer}>
          <table className={adminStyles.table}>
            <thead>
              <tr>
                <th>제목</th>
                <th>중요</th>
                <th>상태</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {notices.map(notice => (
                <tr key={notice.id}>
                  <td>{notice.title}</td>
                  <td>
                    <span className={`${adminStyles.badge} ${notice.isImportant ? adminStyles.badgeImportant : adminStyles.badgeNormal}`}>
                      {notice.isImportant ? '중요' : '일반'}
                    </span>
                  </td>
                  <td>
                    <span className={`${adminStyles.badge} ${notice.isActive ? adminStyles.badgeActive : adminStyles.badgeInactive}`}>
                      {notice.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td>{formatDate(notice.createdAt)}</td>
                  <td>
                    <button onClick={() => startEdit(notice)} className={adminStyles.editButton}>수정</button>
                    <button onClick={() => handleDelete(notice.id)} className={adminStyles.deleteButton}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(editingItem || formData.title !== undefined) && (
        <div className={adminStyles.modal}>
          <div className={adminStyles.modalContent}>
            <h4>{editingItem ? '공지사항 수정' : '공지사항 추가'}</h4>
            <form onSubmit={handleSubmit}>
              <div className={adminStyles.formGroup}>
                <label>제목:</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className={adminStyles.formGroup}>
                <label>내용:</label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                  rows={6}
                />
              </div>
              <div className={adminStyles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isImportant || false}
                    onChange={(e) => setFormData({...formData, isImportant: e.target.checked})}
                  />
                  중요 공지
                </label>
              </div>
              <div className={adminStyles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive !== false}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  활성화
                </label>
              </div>
              <div className={adminStyles.modalButtons}>
                <button type="submit" className={adminStyles.submitButton}>저장</button>
                <button type="button" onClick={() => {setEditingItem(null); setFormData({});}} className={adminStyles.cancelButton}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={adminStyles.managementContainer}>
      <div className={adminStyles.tabContainer}>
        <button
          className={`${adminStyles.tab} ${activeTab === 'inquiries' ? adminStyles.activeTab : ''}`}
          onClick={() => setActiveTab('inquiries')}
        >
          1:1 문의
        </button>
        <button
          className={`${adminStyles.tab} ${activeTab === 'faqs' ? adminStyles.activeTab : ''}`}
          onClick={() => setActiveTab('faqs')}
        >
          FAQ
        </button>
        <button
          className={`${adminStyles.tab} ${activeTab === 'notices' ? adminStyles.activeTab : ''}`}
          onClick={() => setActiveTab('notices')}
        >
          공지사항
        </button>
      </div>

      <div className={adminStyles.tabContent}>
        {activeTab === 'inquiries' && renderInquiries()}
        {activeTab === 'faqs' && renderFAQs()}
        {activeTab === 'notices' && renderNotices()}
      </div>
    </div>
  );
};

export default SupportManagement;