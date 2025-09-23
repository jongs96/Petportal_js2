// src/components/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import adminStyles from './Admin.module.css'; // New: Admin specific styles

// Mock Data for Users
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    role: 'user',
  },
  {
    id: 3,
    username: 'user2',
    email: 'user2@example.com',
    role: 'user',
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]); // 체크박스 선택된 사용자들
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user',
  });

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userToAdd = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        ...newUser,
        createdAt: new Date().toISOString(),
      };

      setUsers(prev => [...prev, userToAdd]);
      setNewUser({ username: '', password: '', email: '', role: 'user' });
      alert('사용자가 추가되었습니다.');
    } catch (err) {
      console.error('Failed to add user:', err);
      setError('사용자 추가에 실패했습니다.');
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    setError(null);
    if (!editingUser) return;
    try {
      setUsers(prev =>
        prev.map(user => (user.id === editingUser.id ? editingUser : user))
      );
      setEditingUser(null);
      alert('사용자 정보가 수정되었습니다.');
    } catch (err) {
      console.error('Failed to edit user:', err);
      setError('사용자 수정에 실패했습니다.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) return;
    setError(null);
    try {
      setUsers(prev => prev.filter(user => user.id !== userId));
      alert('사용자가 삭제되었습니다.');
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('사용자 삭제에 실패했습니다.');
    }
  };

  // 체크박스 선택 처리
  const handleUserSelect = (userId, isChecked) => {
    if (isChecked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  // 전체 선택/해제
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // 비밀번호 초기화
  const handleResetPasswords = async () => {
    if (selectedUsers.length === 0) {
      alert('비밀번호를 초기화할 사용자를 선택해주세요.');
      return;
    }

    if (!window.confirm(`선택된 ${selectedUsers.length}명의 사용자 비밀번호를 '123123'으로 초기화하시겠습니까?`)) {
      return;
    }

    setError(null);
    try {
      setUsers(prev => prev.map(user => 
        selectedUsers.includes(user.id) ? { ...user, password: '123123' } : user
      ));
      
      alert(`${selectedUsers.length}명의 사용자 비밀번호가 '123123'으로 초기화되었습니다.`);
      setSelectedUsers([]);
    } catch (err) {
      console.error('Failed to reset passwords:', err);
      setError('비밀번호 초기화에 실패했습니다.');
    }
  };

  if (loading) {
    return <div>사용자 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>오류: {error}</div>;
  }

  return (
    <div className={adminStyles.userManagementContainer}>
      <h3>사용자 관리</h3>

      {/* Add New User Form */}
      <h4>새 사용자 추가</h4>
      <form onSubmit={handleAddUser} className={adminStyles.userForm}>
        <input
          type="text"
          name="username"
          placeholder="아이디"
          value={newUser.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={newUser.password}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={newUser.email}
          onChange={handleInputChange}
          required
        />
        <select name="role" value={newUser.role} onChange={handleInputChange} className={adminStyles.userRoleSelect}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className={adminStyles.userFormButton}>추가</button>
      </form>

      {/* User List */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h4>기존 사용자</h4>
        <div>
          <button 
            onClick={handleResetPasswords}
            className={adminStyles.userFormButton}
            style={{ 
              backgroundColor: '#f56565', 
              marginRight: '10px',
              opacity: selectedUsers.length === 0 ? 0.5 : 1,
              cursor: selectedUsers.length === 0 ? 'not-allowed' : 'pointer'
            }}
            disabled={selectedUsers.length === 0}
          >
            선택된 사용자 비밀번호 초기화 ({selectedUsers.length})
          </button>
        </div>
      </div>
      
      <table className={adminStyles.userTable}>
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                onChange={(e) => handleSelectAll(e.target.checked)}
                checked={selectedUsers.length === users.length && users.length > 0}
              />
            </th>
            <th>ID</th>
            <th>아이디</th>
            <th>이메일</th>
            <th>역할</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <input 
                  type="checkbox" 
                  checked={selectedUsers.includes(user.id)}
                  onChange={(e) => handleUserSelect(user.id, e.target.checked)}
                />
              </td>
              <td>{user.id}</td>
              <td>
                {editingUser?.id === user.id ? (
                  <input
                    type="text"
                    name="username"
                    value={editingUser.username}
                    onChange={handleInputChange}
                    className={adminStyles.userEditInput}
                  />
                ) : (
                  user.username
                )}
              </td>
              <td>
                {editingUser?.id === user.id ? (
                  <input
                    type="email"
                    name="email"
                    value={editingUser.email}
                    onChange={handleInputChange}
                    className={adminStyles.userEditInput}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingUser?.id === user.id ? (
                  <select name="role" value={editingUser.role} onChange={handleInputChange} className={adminStyles.userRoleSelect}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editingUser?.id === user.id ? (
                  <>
                    <button onClick={handleEditUser} className={adminStyles.userActionButton}>저장</button>
                    <button onClick={() => setEditingUser(null)} className={adminStyles.userActionButton}>취소</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingUser({ ...user, password: '' })} className={adminStyles.userActionButton}>수정</button>
                    <button onClick={() => handleDeleteUser(user.id)} className={adminStyles.userActionButton}>삭제</button>
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

export default UserManagement;
