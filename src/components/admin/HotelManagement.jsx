import React, { useState, useEffect } from 'react';
import adminStyles from './Admin.module.css';

// Mock Data for Hotels
const mockHotels = [
  {
    id: 1,
    name: '펫 스위트 호텔',
    address: '서울 강남구',
    price: 150000,
    description: '반려동물과 함께 편안한 휴식',
    image: 'https://picsum.photos/seed/hotel1/400/300',
  },
  {
    id: 2,
    name: '도그 리조트',
    address: '경기 가평',
    price: 200000,
    description: '넓은 운동장',
    image: 'https://picsum.photos/seed/hotel2/400/300',
  },
];

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingHotel, setEditingHotel] = useState(null);
  const [newHotel, setNewHotel] = useState({
    name: '',
    address: '',
    price: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setHotels(mockHotels);
      setLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingHotel) {
      setEditingHotel({ ...editingHotel, [name]: value });
    } else {
      setNewHotel({ ...newHotel, [name]: value });
    }
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const hotelToAdd = {
        id: hotels.length > 0 ? Math.max(...hotels.map(h => h.id)) + 1 : 1,
        ...newHotel,
        price: parseFloat(newHotel.price),
      };

      setHotels(prev => [...prev, hotelToAdd]);
      setNewHotel({
        name: '',
        address: '',
        price: '',
        description: '',
        image: '',
      });
      alert('호텔이 추가되었습니다.');
    } catch (err) {
      console.error('Failed to add hotel:', err);
      setError('호텔 추가에 실패했습니다.');
    }
  };

  const handleEditHotel = async (e) => {
    e.preventDefault();
    setError(null);
    if (!editingHotel) return;
    try {
      const updatedHotel = {
        ...editingHotel,
        price: parseFloat(editingHotel.price),
      };

      setHotels(prev =>
        prev.map(hotel => (hotel.id === updatedHotel.id ? updatedHotel : hotel))
      );
      setEditingHotel(null);
      alert('호텔이 수정되었습니다.');
    } catch (err) {
      console.error('Failed to edit hotel:', err);
      setError('호텔 수정에 실패했습니다.');
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm('정말로 이 호텔을 삭제하시겠습니까?')) return;
    setError(null);
    try {
      setHotels(prev => prev.filter(hotel => hotel.id !== hotelId));
      alert('호텔이 삭제되었습니다.');
    } catch (err) {
      console.error('Failed to delete hotel:', err);
      setError('호텔 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className={adminStyles.userManagementContainer}>호텔 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={adminStyles.userManagementContainer} style={{ color: 'red' }}>오류: {error}</div>;
  }

  return (
    <div className={adminStyles.userManagementContainer}>
      <h3>호텔 관리</h3>

      <h4>새 호텔 추가</h4>
      <form onSubmit={handleAddHotel} className={adminStyles.userForm}>
        <input type="text" name="name" placeholder="호텔명" value={newHotel.name} onChange={handleInputChange} required />
        <input type="text" name="address" placeholder="주소" value={newHotel.address} onChange={handleInputChange} required />
        <input type="number" name="price" placeholder="가격" value={newHotel.price} onChange={handleInputChange} required />
        <input type="text" name="image" placeholder="이미지 URL" value={newHotel.image} onChange={handleInputChange} />
        <textarea name="description" placeholder="설명" value={newHotel.description} onChange={handleInputChange} rows="3"></textarea>
        <button type="submit" className={adminStyles.userFormButton}>추가</button>
      </form>

      <h4>기존 호텔</h4>
      <table className={adminStyles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>호텔명</th>
            <th>주소</th>
            <th>가격</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel.id}>
              <td>{hotel.id}</td>
              <td>
                {editingHotel?.id === hotel.id ? (
                  <input type="text" name="name" value={editingHotel.name} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  hotel.name
                )}
              </td>
              <td>
                {editingHotel?.id === hotel.id ? (
                  <input type="text" name="address" value={editingHotel.address} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  hotel.address
                )}
              </td>
              <td>
                {editingHotel?.id === hotel.id ? (
                  <input type="number" name="price" value={editingHotel.price} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  `₩${hotel.price}`
                )}
              </td>
              <td>
                {editingHotel?.id === hotel.id ? (
                  <>
                    <button onClick={handleEditHotel} className={adminStyles.userActionButton}>저장</button>
                    <button onClick={() => setEditingHotel(null)} className={adminStyles.userActionButton}>취소</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingHotel({ ...hotel })}>수정</button>
                    <button onClick={() => handleDeleteHotel(hotel.id)}>삭제</button>
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

export default HotelManagement;