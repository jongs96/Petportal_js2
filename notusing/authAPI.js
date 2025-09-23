// src/services/authAPI.js
// API 대응 준비 코드 - 실제 API와 연동 시 사용할 함수들

// API Base URL (환경에 따라 변경)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// API 요청 헬퍼 함수
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // 인증 토큰이 있다면 헤더에 추가
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '요청에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// 인증 관련 API 함수들
export const authAPI = {
  // 일반 로그인
  login: async (credentials) => {
    // 실제 API 호출 (현재는 임시 구현)
    if (process.env.NODE_ENV === 'development') {
      return mockLogin(credentials);
    }
    
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // 회원가입
  register: async (userData) => {
    // 실제 API 호출 (현재는 임시 구현)
    if (process.env.NODE_ENV === 'development') {
      return mockRegister(userData);
    }
    
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // 로그아웃
  logout: async () => {
    if (process.env.NODE_ENV === 'development') {
      return mockLogout();
    }
    
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  // 토큰 갱신
  refreshToken: async () => {
    if (process.env.NODE_ENV === 'development') {
      return mockRefreshToken();
    }
    
    return apiRequest('/auth/refresh', {
      method: 'POST',
    });
  },

  // 사용자 정보 조회
  getUserInfo: async () => {
    if (process.env.NODE_ENV === 'development') {
      return mockGetUserInfo();
    }
    
    return apiRequest('/auth/me');
  }
};

// 소셜 로그인 API 함수들
export const socialAuthAPI = {
  // 구글 로그인
  googleLogin: async () => {
    if (process.env.NODE_ENV === 'development') {
      return mockSocialLogin('google');
    }
    
    // 실제 구글 OAuth 구현
    // return new Promise((resolve, reject) => {
    //   window.gapi.load('auth2', () => {
    //     const auth2 = window.gapi.auth2.init({
    //       client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID
    //     });
    //     
    //     auth2.signIn()
    //       .then(googleUser => {
    //         const profile = googleUser.getBasicProfile();
    //         const idToken = googleUser.getAuthResponse().id_token;
    //         
    //         return apiRequest('/auth/google', {
    //           method: 'POST',
    //           body: JSON.stringify({ token: idToken })
    //         });
    //       })
    //       .then(resolve)
    //       .catch(reject);
    //   });
    // });
  },

  // 네이버 로그인
  naverLogin: async () => {
    if (process.env.NODE_ENV === 'development') {
      return mockSocialLogin('naver');
    }
    
    // 실제 네이버 OAuth 구현
    // const naverLogin = new naver.LoginWithNaverId({
    //   clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
    //   callbackUrl: `${window.location.origin}/auth/naver/callback`,
    //   isPopup: true
    // });
    // naverLogin.init();
    // return naverLogin.login();
  },

  // 카카오 로그인
  kakaoLogin: async () => {
    if (process.env.NODE_ENV === 'development') {
      return mockSocialLogin('kakao');
    }
    
    // 실제 카카오 OAuth 구현
    // return new Promise((resolve, reject) => {
    //   window.Kakao.Auth.login({
    //     success: function(response) {
    //       return apiRequest('/auth/kakao', {
    //         method: 'POST',
    //         body: JSON.stringify({ token: response.access_token })
    //       });
    //     },
    //     fail: function(error) {
    //       reject(error);
    //     }
    //   });
    // });
  }
};

// Mock 함수들 (개발 환경에서 사용)
const mockLogin = async (credentials) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 등록된 사용자 확인
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
  
  const user = registeredUsers.find(u => u.email === credentials.email);
  const storedPassword = userPasswords[credentials.email];
  
  if (!user || !storedPassword) {
    throw new Error('등록되지 않은 이메일입니다.');
  }
  
  if (atob(storedPassword) !== credentials.password) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }
  
  // 성공 응답
  const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
  localStorage.setItem('authToken', token);
  
  return {
    success: true,
    user,
    token
  };
};

const mockRegister = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  
  if (existingUsers.some(user => user.email === userData.email)) {
    throw new Error('이미 가입된 이메일입니다.');
  }
  
  const newUser = {
    id: Date.now(),
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    agreeToAds: userData.agreeToAds, // Added agreeToAds
    joinDate: new Date().toISOString(),
    loginType: 'email'
  };
  
  existingUsers.push(newUser);
  localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
  
  const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
  userPasswords[userData.email] = btoa(userData.password);
  localStorage.setItem('userPasswords', JSON.stringify(userPasswords));
  
  console.log('New user registered with ad agreement:', newUser.agreeToAds); // Log for verification
  
  return {
    success: true,
    user: newUser
  };
};

const mockLogout = async () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userInfo');
  return { success: true };
};

const mockRefreshToken = async () => {
  const currentToken = localStorage.getItem('authToken');
  if (!currentToken) {
    throw new Error('인증 토큰이 없습니다.');
  }
  
  // 새 토큰 생성 (임시)
  const newToken = currentToken + '_refreshed';
  localStorage.setItem('authToken', newToken);
  
  return {
    success: true,
    token: newToken
  };
};

const mockGetUserInfo = async () => {
  const userInfo = localStorage.getItem('userInfo');
  if (!userInfo) {
    throw new Error('로그인이 필요합니다.');
  }
  
  return {
    success: true,
    user: JSON.parse(userInfo)
  };
};

const mockSocialLogin = async (provider) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const userData = {
    id: Date.now(),
    email: `user@${provider}.com`,
    name: `${provider} 사용자`,
    loginType: provider,
    joinDate: new Date().toISOString()
  };
  
  const token = btoa(JSON.stringify({ userId: userData.id, email: userData.email }));
  
  localStorage.setItem('authToken', token);
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userInfo', JSON.stringify(userData));
  
  return {
    success: true,
    user: userData,
    token
  };
};

export default authAPI;