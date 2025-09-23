import React, { useState, useEffect } from 'react';
import adminStyles from './Admin.module.css';

// Mock Data for Hospitals
const mockHospitals = [
  {
    id: 1,
    name: '튼튼 동물병원',
    address: '서울 강남구',
    phone: '02-1111-2222',
    description: '24시간 응급 진료',
    specialties: '내과, 외과',
  },
  {
    id: 2,
    name: '행복한 동물병원',
    address: '경기 성남시',
    phone: '031-3333-4444',
    description: '친절한 진료',
    specialties: '피부과, 치과',
  },
];

const HospitalManagement = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingHospital, setEditingHospital] = useState(null);
  const [newHospital, setNewHospital] = useState({
    name: '',
    address: '',
    phone: '',
    description: '',
    specialties: '',
  });

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setHospitals(mockHospitals);
      setLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingHospital) {
      setEditingHospital({ ...editingHospital, [name]: value });
    } else {
      setNewHospital({ ...newHospital, [name]: value });
    }
  };

  const handleAddHospital = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const hospitalToAdd = {
        id: hospitals.length > 0 ? Math.max(...hospitals.map(h => h.id)) + 1 : 1,
        ...newHospital,
      };

      setHospitals(prev => [...prev, hospitalToAdd]);
      setNewHospital({
        name: '',
        address: '',
        phone: '',
        description: '',
        specialties: '',
      });
      alert('병원이 추가되었습니다.');
    } catch (err) {
      console.error('Failed to add hospital:', err);
      setError('병원 추가에 실패했습니다.');
    }
  };

  const handleEditHospital = async (e) => {
    e.preventDefault();
    setError(null);
    if (!editingHospital) return;
    try {
      setHospitals(prev =>
        prev.map(hospital => (hospital.id === editingHospital.id ? editingHospital : hospital))
      );
      setEditingHospital(null);
      alert('병원이 수정되었습니다.');
    } catch (err) {
      console.error('Failed to edit hospital:', err);
      setError('병원 수정에 실패했습니다.');
    }
  };

  const handleDeleteHospital = async (hospitalId) => {
    if (!window.confirm('정말로 이 병원을 삭제하시겠습니까?')) return;
    setError(null);
    try {
      setHospitals(prev => prev.filter(hospital => hospital.id !== hospitalId));
      alert('병원이 삭제되었습니다.');
    } catch (err) {
      console.error('Failed to delete hospital:', err);
      setError('병원 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className={adminStyles.userManagementContainer}>병원 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={adminStyles.userManagementContainer} style={{ color: 'red' }}>오류: {error}</div>;
  }

  return (
    <div className={adminStyles.userManagementContainer}>
      <h3>병원 관리</h3>

      <h4>새 병원 추가</h4>
      <form onSubmit={handleAddHospital} className={adminStyles.userForm}>
        <input type="text" name="name" placeholder="병원명" value={newHospital.name} onChange={handleInputChange} required />
        <input type="text" name="address" placeholder="주소" value={newHospital.address} onChange={handleInputChange} required />
        <input type="text" name="phone" placeholder="전화번호" value={newHospital.phone} onChange={handleInputChange} required />
        <input type="text" name="specialties" placeholder="전문 분야" value={newHospital.specialties} onChange={handleInputChange} />
        <textarea name="description" placeholder="설명" value={newHospital.description} onChange={handleInputChange} rows="3"></textarea>
        <button type="submit" className={adminStyles.userFormButton}>추가</button>
      </form>

      <h4>기존 병원</h4>
      <table className={adminStyles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>병원명</th>
            <th>주소</th>
            <th>전화번호</th>
            <th>전문 분야</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {hospitals.map((hospital) => (
            <tr key={hospital.id}>
              <td>{hospital.id}</td>
              <td>
                {editingHospital?.id === hospital.id ? (
                  <input type="text" name="name" value={editingHospital.name} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  hospital.name
                )}
              </td>
              <td>
                {editingHospital?.id === hospital.id ? (
                  <input type="text" name="address" value={editingHospital.address} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  hospital.address
                )}
              </td>
              <td>
                {editingHospital?.id === hospital.id ? (
                  <input type="text" name="phone" value={editingHospital.phone} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  hospital.phone
                )}
              </td>
              <td>
                {editingHospital?.id === hospital.id ? (
                  <input type="text" name="specialties" value={editingHospital.specialties} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  hospital.specialties
                )}
              </td>
              <td>
                {editingHospital?.id === hospital.id ? (
                  <>
                    <button onClick={handleEditHospital} className={adminStyles.userActionButton}>저장</button>
                    <button onClick={() => setEditingHospital(null)} className={adminStyles.userActionButton}>취소</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingHospital({ ...hospital })}>수정</button>
                    <button onClick={() => handleDeleteHospital(hospital.id)}>삭제</button>
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

export default HospitalManagement;