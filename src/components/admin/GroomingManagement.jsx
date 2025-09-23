import React, { useState, useEffect } from 'react';
import adminStyles from './Admin.module.css';

// Mock Data for Grooming Services
const mockGroomingServices = [
  {
    id: 1,
    name: '기본 미용',
    price: 30000,
    description: '기본적인 미용 서비스입니다.',
    duration: 60,
  },
  {
    id: 2,
    name: '스파 패키지',
    price: 50000,
    description: '아로마 스파와 미용이 포함된 패키지입니다.',
    duration: 90,
  },
];

const GroomingManagement = () => {
  const [groomingServices, setGroomingServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    description: '',
    duration: '',
  });

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setGroomingServices(mockGroomingServices);
      setLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingService) {
      setEditingService({ ...editingService, [name]: value });
    } else {
      setNewService({ ...newService, [name]: value });
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const serviceToAdd = {
        id: groomingServices.length > 0 ? Math.max(...groomingServices.map(s => s.id)) + 1 : 1,
        ...newService,
        price: parseFloat(newService.price),
        duration: parseInt(newService.duration) || null,
      };

      setGroomingServices(prev => [...prev, serviceToAdd]);
      setNewService({
        name: '',
        price: '',
        description: '',
        duration: '',
      });
      alert('미용 서비스가 추가되었습니다.');
    } catch (err) {
      console.error('Failed to add grooming service:', err);
      setError('미용 서비스 추가에 실패했습니다.');
    }
  };

  const handleEditService = async (e) => {
    e.preventDefault();
    setError(null);
    if (!editingService) return;
    try {
      const updatedService = {
        ...editingService,
        price: parseFloat(editingService.price),
        duration: parseInt(editingService.duration) || null,
      };

      setGroomingServices(prev =>
        prev.map(service => (service.id === updatedService.id ? updatedService : service))
      );
      setEditingService(null);
      alert('미용 서비스가 수정되었습니다.');
    } catch (err) {
      console.error('Failed to edit grooming service:', err);
      setError('미용 서비스 수정에 실패했습니다.');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('정말로 이 미용 서비스를 삭제하시겠습니까?')) return;
    setError(null);
    try {
      setGroomingServices(prev => prev.filter(service => service.id !== serviceId));
      alert('미용 서비스가 삭제되었습니다.');
    } catch (err) {
      console.error('Failed to delete grooming service:', err);
      setError('미용 서비스 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className={adminStyles.userManagementContainer}>미용 서비스 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={adminStyles.userManagementContainer} style={{ color: 'red' }}>오류: {error}</div>;
  }

  return (
    <div className={adminStyles.userManagementContainer}>
      <h3>미용 서비스 관리</h3>

      <h4>새 미용 서비스 추가</h4>
      <form onSubmit={handleAddService} className={adminStyles.userForm}>
        <input type="text" name="name" placeholder="서비스명" value={newService.name} onChange={handleInputChange} required />
        <input type="number" name="price" placeholder="가격" value={newService.price} onChange={handleInputChange} required />
        <input type="number" name="duration" placeholder="소요 시간 (분)" value={newService.duration} onChange={handleInputChange} />
        <textarea name="description" placeholder="설명" value={newService.description} onChange={handleInputChange} rows="3"></textarea>
        <button type="submit" className={adminStyles.userFormButton}>추가</button>
      </form>

      <h4>기존 미용 서비스</h4>
      <table className={adminStyles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>서비스명</th>
            <th>가격</th>
            <th>소요 시간</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {groomingServices.map((service) => (
            <tr key={service.id}>
              <td>{service.id}</td>
              <td>
                {editingService?.id === service.id ? (
                  <input type="text" name="name" value={editingService.name} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  service.name
                )}
              </td>
              <td>
                {editingService?.id === service.id ? (
                  <input type="number" name="price" value={editingService.price} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  `₩${service.price}`
                )}
              </td>
              <td>
                {editingService?.id === service.id ? (
                  <input type="number" name="duration" value={editingService.duration} onChange={handleInputChange} className={adminStyles.userEditInput} />
                ) : (
                  service.duration ? `${service.duration}분` : '-'
                )}
              </td>
              <td>
                {editingService?.id === service.id ? (
                  <>
                    <button onClick={handleEditService} className={adminStyles.userActionButton}>저장</button>
                    <button onClick={() => setEditingService(null)} className={adminStyles.userActionButton}>취소</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingService({ ...service })}>수정</button>
                    <button onClick={() => handleDeleteService(service.id)}>삭제</button>
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

export default GroomingManagement;