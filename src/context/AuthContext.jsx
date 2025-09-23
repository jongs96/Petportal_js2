import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial auth check
  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // 회원가입 (Mock)
  const signup = async (userData) => {
    // 실제 회원가입 로직 대신 로컬 스토리지에 저장
    const newUser = {
      id: Date.now(),
      email: userData.email,
      nickname: userData.nickname,
      role: 'user',
      profileImage: '/src/assets/images/profiles/default-user.svg',
      joinDate: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('mockUser', JSON.stringify(newUser));
    setUser(newUser);
    return { success: true, user: newUser };
  };

  // 로그인 (Mock)
  const login = async (email, password) => {
    // 실제 로그인 로직 대신 하드코딩된 사용자 또는 로컬 스토리지 사용자 확인
    const storedUser = JSON.parse(localStorage.getItem('mockUser'));
    if (storedUser && storedUser.email === email && password === 'password') { // 비밀번호는 'password'로 가정
      setUser(storedUser);
      return { success: true, user: storedUser };
    } else if (email === 'test@example.com' && password === 'password') {
      const testUser = {
        id: 999,
        email: 'test@example.com',
        nickname: '테스트유저',
        role: 'user',
        profileImage: '/src/assets/images/profiles/default-user.svg',
        joinDate: new Date().toISOString().split('T')[0]
      };
      localStorage.setItem('mockUser', JSON.stringify(testUser));
      setUser(testUser);
      return { success: true, user: testUser };
    } else {
      return { success: false, error: '잘못된 이메일 또는 비밀번호입니다.' };
    }
  };

  // 로그아웃 (Mock)
  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  // 사용자 정보 업데이트 (Mock)
  const updateUser = async (userData) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    }
    return { success: false, error: '사용자를 찾을 수 없습니다.' };
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};