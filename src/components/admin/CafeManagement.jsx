import React, { useState, useEffect } from 'react';
import adminStyles from './Admin.module.css';

// Mock Data for Cafe
const mockCafes = [
  {
    id: 1,
    name: '멍멍 카페',
    address: '서울 강남구 테헤란로',
    phone: '02-1234-5678',
    description: '강아지들이 뛰어놀기 좋은 넓은 공간',
    image: 'https://picsum.photos/seed/cafe1/400/300',
  },
  {
    id: 2,
    name: '냥이의 하루',
    address: '서울 마포구 홍대입구',
    phone: '02-9876-5432',
    description: '고양이와 함께하는 아늑한 공간',
    image: 'https://picsum.photos/seed/cafe2/400/300',
  },
];

const CafeManagement = () => {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCafe, setEditingCafe] = useState(null);
  const [newCafe, setNewCafe] = useState({
    name: '',
    address: '',
    phone: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setCafes(mockCafes);
      setLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingCafe) {
      setEditingCafe({ ...editingCafe, [name]: value });
    } else {
      setNewCafe({ ...newCafe, [name]: value });
    }
  };

  const handleAddCafe = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const cafeToAdd = {
        id: cafes.length > 0 ? Math.max(...cafes.map(c => c.id)) + 1 : 1,
        ...newCafe,
      };

      setCafes(prev => [...prev, cafeToAdd]);
      
      setNewCafe({
        name: '',
        address: '',
        phone: '',
        description: '',
        image: '',
      });
      alert('카페가 추가되었습니다.');
    } catch (err) {
      console.error('Failed to add cafe:', err);
      setError('카페 추가에 실패했습니다.');
    }
  };

  const handleEditCafe = async (e) => {
    e.preventDefault();
    setError(null);
    if (!editingCafe) return;
    try {
      setCafes(prev =>
        prev.map(cafe => (cafe.id === editingCafe.id ? editingCafe : cafe))
      );
      setEditingCafe(null);
      alert('카페가 수정되었습니다.');
    } catch (err) {
      console.error('Failed to edit cafe:', err);
      setError('카페 수정에 실패했습니다.');
    }
  };

  const handleDeleteCafe = async (cafeId) => {
    if (!window.confirm('정말로 이 카페를 삭제하시겠습니까?')) return;
    setError(null);
    try {
      setCafes(prev => prev.filter(cafe => cafe.id !== cafeId));
      alert('카페가 삭제되었습니다.');
    } catch (err) {
      console.error('Failed to delete cafe:', err);
      setError('카페 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className={adminStyles.userManagementContainer}>카페 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={adminStyles.userManagementContainer} style={{ color: 'red' }}>오류: {error}</div>;
  }

  return (
    <div className={adminStyles.userManagementContainer}>
      <h3>카페 관리</h3>

      <h4>새 카페 추가</h4>
      <form onSubmit={handleAddCafe} className={adminStyles.userForm}>
        <input type="text" name="name" placeholder="카페명" value={newCafe.name} onChange={handleInputChange} required />
        <input type="text" name="address" placeholder="주소" value={newCafe.address} onChange={handleInputChange} required />
        <input type="text" name="phone" placeholder="전화번호" value={newCafe.phone} onChange={handleInputChange} />
        <input type="text" name="image" placeholder="이미지 URL" value={newCafe.image} onChange={handleInputChange} />
        <textarea name="description" placeholder="설명" value={newCafe.description} onChange={handleInputChange} rows="3"></textarea>
        <button type="submit" className={adminStyles.userFormButton}>추가</button>
      </form>

      <h4>기존 카페</h4>
      <table className={adminStyles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>카페명</th>
            <th>주소</th>
            <th>전화번호</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {cafes.map((cafe) => (
            <tr key={cafe.id}>
              <td>{cafe.id}</td>
              <td>
                {editingCafe?.id === cafe.id ? (
                  <input type="text" name="name" value={editingCafe.name} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  cafe.name
                )}
              </td>
              <td>
                {editingCafe?.id === cafe.id ? (
                  <input type="text" name="address" value={editingCafe.address} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  cafe.address
                )}
              </td>
              <td>
                {editingCafe?.id === cafe.id ? (
                  <input type="text" name="phone" value={editingCafe.phone} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  cafe.phone
                )}
              </td>
              <td>
                {editingCafe?.id === cafe.id ? (
                  <>
                    <button onClick={handleEditCafe} className={adminStyles.userActionButton}>저장</button>
                    <button onClick={() => setEditingCafe(null)} className={adminStyles.userActionButton}>취소</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingCafe({ ...cafe })}>수정</button>
                    <button onClick={() => handleDeleteCafe(cafe.id)}>삭제</button>
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

export default CafeManagement;