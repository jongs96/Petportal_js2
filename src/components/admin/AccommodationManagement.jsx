import React, { useState, useEffect } from 'react';
import adminStyles from './Admin.module.css';

// Mock Data for Accommodation
const mockAccommodations = [
  {
    id: 1,
    name: '댕댕 포레스트',
    type: '펜션',
    location: '경기 가평군',
    price: 180000,
    rating: 4.8,
    images: ['https://picsum.photos/seed/forest_main/1200/800'],
    tags: ['#대형견가능', '#개별운동장'],
    maxGuests: 4,
    petsAllowed: true,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    description: '숲속의 힐링 펜션',
  },
  {
    id: 2,
    name: '냥냥 파라다이스',
    type: '감성숙소',
    location: '제주 제주시',
    price: 250000,
    rating: 4.9,
    images: ['https://picsum.photos/seed/paradise_main/1200/800'],
    tags: ['#고양이환영', '#오션뷰'],
    maxGuests: 2,
    petsAllowed: true,
    checkInTime: '16:00',
    checkOutTime: '12:00',
    description: '고양이를 위한 특별한 공간',
  },
];

const AccommodationManagement = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAccommodation, setEditingAccommodation] = useState(null);
  const [newAccommodation, setNewAccommodation] = useState({
    name: '',
    type: '펜션',
    location: '',
    price: '',
    rating: 4.5,
    images: [''],
    tags: [''],
    maxGuests: 2,
    petsAllowed: true,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    description: '',
  });

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setAccommodations(mockAccommodations);
      setLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const actualValue = type === 'checkbox' ? checked : 
                       type === 'number' ? parseFloat(value) || 0 : value;
    
    if (editingAccommodation) {
      setEditingAccommodation({ ...editingAccommodation, [name]: actualValue });
    } else {
      setNewAccommodation({ ...newAccommodation, [name]: actualValue });
    }
  };

  const handleArrayInputChange = (e, index, arrayName) => {
    const { value } = e.target;
    const currentData = editingAccommodation || newAccommodation;
    const newArray = [...currentData[arrayName]];
    newArray[index] = value;
    
    if (editingAccommodation) {
      setEditingAccommodation({ ...editingAccommodation, [arrayName]: newArray });
    } else {
      setNewAccommodation({ ...newAccommodation, [arrayName]: newArray });
    }
  };

  const addArrayItem = (arrayName) => {
    const currentData = editingAccommodation || newAccommodation;
    const newArray = [...currentData[arrayName], ''];
    
    if (editingAccommodation) {
      setEditingAccommodation({ ...editingAccommodation, [arrayName]: newArray });
    } else {
      setNewAccommodation({ ...newAccommodation, [arrayName]: newArray });
    }
  };

  const removeArrayItem = (index, arrayName) => {
    const currentData = editingAccommodation || newAccommodation;
    const newArray = currentData[arrayName].filter((_, i) => i !== index);
    
    if (editingAccommodation) {
      setEditingAccommodation({ ...editingAccommodation, [arrayName]: newArray });
    } else {
      setNewAccommodation({ ...newAccommodation, [arrayName]: newArray });
    }
  };

  const handleAddAccommodation = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const accommodationToAdd = {
        id: accommodations.length > 0 ? Math.max(...accommodations.map(acc => acc.id)) + 1 : 1,
        ...newAccommodation,
        price: parseFloat(newAccommodation.price) || 0,
        rating: parseFloat(newAccommodation.rating) || 4.5,
        maxGuests: parseInt(newAccommodation.maxGuests) || 2,
        images: newAccommodation.images.filter(img => img.trim() !== ''),
        tags: newAccommodation.tags.filter(tag => tag.trim() !== ''),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAccommodations(prev => [...prev, accommodationToAdd]);
      
      setNewAccommodation({
        name: '',
        type: '펜션',
        location: '',
        price: '',
        rating: 4.5,
        images: [''],
        tags: [''],
        maxGuests: 2,
        petsAllowed: true,
        checkInTime: '15:00',
        checkOutTime: '11:00',
        description: '',
      });
      alert('숙박 시설이 추가되었습니다.');
    } catch (err) {
      console.error('Failed to add accommodation:', err);
      setError('숙박 시설 추가에 실패했습니다.');
    }
  };

  const handleEditAccommodation = async (e) => {
    e.preventDefault();
    setError(null);
    if (!editingAccommodation) return;
    try {
      const updatedAccommodation = {
        ...editingAccommodation,
        price: parseFloat(editingAccommodation.price) || 0,
        rating: parseFloat(editingAccommodation.rating) || 4.5,
        maxGuests: parseInt(editingAccommodation.maxGuests) || 2,
        images: editingAccommodation.images.filter(img => img.trim() !== ''),
        tags: editingAccommodation.tags.filter(tag => tag.trim() !== ''),
        updatedAt: new Date().toISOString(),
      };

      setAccommodations(prev =>
        prev.map(acc => (acc.id === updatedAccommodation.id ? updatedAccommodation : acc))
      );
      setEditingAccommodation(null);
      alert('숙박 시설이 수정되었습니다.');
    } catch (err) {
      console.error('Failed to edit accommodation:', err);
      setError('숙박 시설 수정에 실패했습니다.');
    }
  };

  const handleDeleteAccommodation = async (accommodationId) => {
    if (!window.confirm('정말로 이 숙박 시설을 삭제하시겠습니까?')) return;
    setError(null);
    try {
      setAccommodations(prev => prev.filter(acc => acc.id !== accommodationId));
      alert('숙박 시설이 삭제되었습니다.');
    } catch (err) {
      console.error('Failed to delete accommodation:', err);
      setError('숙박 시설 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className={adminStyles.userManagementContainer}>숙박 시설 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={adminStyles.userManagementContainer} style={{ color: 'red' }}>오류: {error}</div>;
  }

  return (
    <div className={adminStyles.userManagementContainer}>
      <h3>숙박 시설 관리</h3>

      <h4>새 숙박 시설 추가</h4>
      <form onSubmit={handleAddAccommodation} className={adminStyles.userForm}>
        <input type="text" name="name" placeholder="시설명" value={newAccommodation.name} onChange={handleInputChange} required />
        
        <select name="type" value={newAccommodation.type} onChange={handleInputChange} required>
          <option value="펜션">펜션</option>
          <option value="호텔">호텔</option>
          <option value="리조트">리조트</option>
          <option value="감성숙소">감성숙소</option>
          <option value="모텔">모텔</option>
        </select>
        
        <input type="text" name="location" placeholder="위치 (예: 경기 가평군)" value={newAccommodation.location} onChange={handleInputChange} required />
        <input type="number" name="price" placeholder="가격 (원)" value={newAccommodation.price} onChange={handleInputChange} required />
        <input type="number" name="rating" placeholder="평점 (1-5)" min="1" max="5" step="0.1" value={newAccommodation.rating} onChange={handleInputChange} />
        <input type="number" name="maxGuests" placeholder="최대 인원" min="1" value={newAccommodation.maxGuests} onChange={handleInputChange} />
        
        <label>
          <input type="checkbox" name="petsAllowed" checked={newAccommodation.petsAllowed} onChange={handleInputChange} />
          반려동물 허용
        </label>
        
        <input type="time" name="checkInTime" placeholder="체크인 시간" value={newAccommodation.checkInTime} onChange={handleInputChange} />
        <input type="time" name="checkOutTime" placeholder="체크아웃 시간" value={newAccommodation.checkOutTime} onChange={handleInputChange} />
        
        <div style={{ gridColumn: 'span 2' }}>
          <h5>이미지 URL</h5>
          {newAccommodation.images.map((image, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: '5px' }}>
              <input 
                type="url" 
                placeholder="이미지 URL" 
                value={image} 
                onChange={(e) => handleArrayInputChange(e, index, 'images')}
                style={{ flex: 1, marginRight: '5px' }}
              />
              <button type="button" onClick={() => removeArrayItem(index, 'images')}>삭제</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('images')}>이미지 추가</button>
        </div>
        
        <div style={{ gridColumn: 'span 2' }}>
          <h5>태그</h5>
          {newAccommodation.tags.map((tag, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: '5px' }}>
              <input 
                type="text" 
                placeholder="태그 (예: #대형견가능)" 
                value={tag} 
                onChange={(e) => handleArrayInputChange(e, index, 'tags')}
                style={{ flex: 1, marginRight: '5px' }}
              />
              <button type="button" onClick={() => removeArrayItem(index, 'tags')}>삭제</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('tags')}>태그 추가</button>
        </div>
        
        <textarea name="description" placeholder="설명" value={newAccommodation.description} onChange={handleInputChange} rows="3" style={{ gridColumn: 'span 2' }}></textarea>
        <button type="submit" className={adminStyles.userFormButton} style={{ gridColumn: 'span 2' }}>추가</button>
      </form>

      <h4>기존 숙박 시설</h4>
      <table className={adminStyles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>시설명</th>
            <th>타입</th>
            <th>위치</th>
            <th>가격</th>
            <th>평점</th>
            <th>최대인원</th>
            <th>반려동물</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {accommodations.map((accommodation) => {
            // JSON 문자열 파싱
            let parsedImages = [];
            let parsedTags = [];
            try {
              if (accommodation.images && typeof accommodation.images === 'string') {
                parsedImages = JSON.parse(accommodation.images);
              } else if (Array.isArray(accommodation.images)) {
                parsedImages = accommodation.images;
              }
              if (accommodation.tags && typeof accommodation.tags === 'string') {
                parsedTags = JSON.parse(accommodation.tags);
              } else if (Array.isArray(accommodation.tags)) {
                parsedTags = accommodation.tags;
              }
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }

            return (
              <tr key={accommodation.id}>
                <td>{accommodation.id}</td>
                <td>
                  {editingAccommodation?.id === accommodation.id ? (
                    <input type="text" name="name" value={editingAccommodation.name || ''} onChange={handleInputChange} className={adminStyles.userEditInput} />
                  ) : (
                    accommodation.name
                  )}
                </td>
                <td>
                  {editingAccommodation?.id === accommodation.id ? (
                    <select name="type" value={editingAccommodation.type || ''} onChange={handleInputChange} className={adminStyles.userEditInput}>
                      <option value="펜션">펜션</option>
                      <option value="호텔">호텔</option>
                      <option value="리조트">리조트</option>
                      <option value="감성숙소">감성숙소</option>
                      <option value="모텔">모텔</option>
                    </select>
                  ) : (
                    accommodation.type
                  )}
                </td>
                <td>
                  {editingAccommodation?.id === accommodation.id ? (
                    <input type="text" name="location" value={editingAccommodation.location || ''} onChange={handleInputChange} className={adminStyles.userEditInput} />
                  ) : (
                    accommodation.location
                  )}
                </td>
                <td>
                  {editingAccommodation?.id === accommodation.id ? (
                    <input type="number" name="price" value={editingAccommodation.price || ''} onChange={handleInputChange} className={adminStyles.userEditInput} />
                  ) : (
                    `₩${accommodation.price?.toLocaleString() || 0}`
                  )}
                </td>
                <td>
                  {editingAccommodation?.id === accommodation.id ? (
                    <input type="number" name="rating" min="1" max="5" step="0.1" value={editingAccommodation.rating || ''} onChange={handleInputChange} className={adminStyles.userEditInput} />
                  ) : (
                    `⭐ ${accommodation.rating || 0}`
                  )}
                </td>
                <td>
                  {editingAccommodation?.id === accommodation.id ? (
                    <input type="number" name="maxGuests" min="1" value={editingAccommodation.maxGuests || ''} onChange={handleInputChange} className={adminStyles.userEditInput} />
                  ) : (
                    `${accommodation.maxGuests || 0}명`
                  )}
                </td>
                <td>
                  {editingAccommodation?.id === accommodation.id ? (
                    <input type="checkbox" name="petsAllowed" checked={editingAccommodation.petsAllowed || false} onChange={handleInputChange} />
                  ) : (
                    accommodation.petsAllowed ? '✅' : '❌'
                  )}
                </td>
                <td>
                  {editingAccommodation?.id === accommodation.id ? (
                    <>
                      <button onClick={handleEditAccommodation} className={adminStyles.userActionButton}>저장</button>
                      <button onClick={() => setEditingAccommodation(null)} className={adminStyles.userActionButton}>취소</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => {
                        const editData = { 
                          ...accommodation,
                          images: parsedImages,
                          tags: parsedTags
                        };
                        setEditingAccommodation(editData);
                      }} className={adminStyles.userActionButton}>수정</button>
                      <button onClick={() => handleDeleteAccommodation(accommodation.id)} className={adminStyles.userActionButton}>삭제</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AccommodationManagement;