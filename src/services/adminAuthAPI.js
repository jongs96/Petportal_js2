// src/services/adminAuthAPI.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/admin'; // Backend admin API base URL

const adminLogin = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:3001/api/admin/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
      // Optionally store admin user info if needed
      // localStorage.setItem('adminUser', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Admin login failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || '로그인에 실패했습니다.');
  }
};

const adminLogout = () => {
  localStorage.removeItem('adminToken');
  // localStorage.removeItem('adminUser');
};

const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

const getAdminAuthHeader = () => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export { adminLogin, adminLogout, getAdminToken, getAdminAuthHeader };
