// src/context/ProfileContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { DEFAULT_PET } from '../utils/petData';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const { user, isAuthenticated, updateUser } = useAuth();
  
  // 사용자 프로필 상태
  const [userProfile, setUserProfile] = useState(null);

  // 반려동물 프로필 목록 상태
  const [pets, setPets] = useState([]);

  // 현재 선택된 반려동물
  const [selectedPet, setSelectedPet] = useState(null);

  // 모달 상태들
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showPetProfile, setShowPetProfile] = useState(false);
  const [showAddPetForm, setShowAddPetForm] = useState(false);

  // 사용자 로그인 시 프로필 데이터 로드
  useEffect(() => {
    console.log('ProfileContext: Auth state changed', { isAuthenticated, user });
    if (isAuthenticated && user) {
      setUserProfile(user);
      loadUserPets(user.id);
    } else {
      setUserProfile(null);
      setPets([]);
      setSelectedPet(null);
    }
  }, [isAuthenticated, user]);

  // 사용자별 반려동물 데이터 로드
  const loadUserPets = (userId) => {
    try {
      // 전체 프로필 데이터에서 해당 사용자 데이터 가져오기
      const allProfileData = JSON.parse(localStorage.getItem('allProfileData') || '{}');
      const userData = allProfileData[userId];
      
      if (userData && userData.pets) {
        setPets(userData.pets);
        setSelectedPet(userData.selectedPet || userData.pets[0] || null);
      } else {
        // 기본 반려동물 생성
        const defaultPet = {
          ...DEFAULT_PET,
          id: Date.now()
        };
        setPets([defaultPet]);
        setSelectedPet(defaultPet);
        saveUserData(userId, [defaultPet], defaultPet);
      }
    } catch (error) {
      console.error('Failed to load user pets:', error);
      const defaultPet = {
        ...DEFAULT_PET,
        id: Date.now()
      };
      setPets([defaultPet]);
      setSelectedPet(defaultPet);
    }
  };

  // 사용자 데이터 저장
  const saveUserData = (userId, petsData, selectedPetData) => {
    try {
      const allProfileData = JSON.parse(localStorage.getItem('allProfileData') || '{}');
      allProfileData[userId] = {
        pets: petsData,
        selectedPet: selectedPetData,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('allProfileData', JSON.stringify(allProfileData));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  // 데이터 변경 시 자동 저장
  useEffect(() => {
    if (isAuthenticated && user && pets.length > 0) {
      saveUserData(user.id, pets, selectedPet);
    }
  }, [pets, selectedPet, isAuthenticated, user]);

  // 사용자 프로필 업데이트
  const updateUserProfile = (newProfile) => {
    const updatedProfile = { ...userProfile, ...newProfile };
    setUserProfile(updatedProfile);
    updateUser(newProfile); // AuthContext의 updateUser 호출
  };

  // 반려동물 추가
  const addPet = (newPet) => {
    const petWithId = {
      ...newPet,
      id: pets.length + 1
    };
    setPets(prev => [...prev, petWithId]);
    return petWithId;
  };

  // 반려동물 업데이트
  const updatePet = (petId, updatedPet) => {
    setPets(prev => 
      prev.map(pet => 
        pet.id === petId ? { ...pet, ...updatedPet } : pet
      )
    );
    
    // 현재 선택된 반려동물이 업데이트된 경우 selectedPet도 업데이트
    if (selectedPet?.id === petId) {
      setSelectedPet(prev => ({ ...prev, ...updatedPet }));
    }
  };

  // 반려동물 삭제
  const deletePet = (petId) => {
    if (pets.length <= 1) {
      alert('최소 하나의 반려동물 프로필은 유지되어야 합니다.');
      return;
    }
    
    setPets(prev => prev.filter(pet => pet.id !== petId));
    
    // 삭제된 반려동물이 현재 선택된 경우, 첫 번째 반려동물로 변경
    if (selectedPet?.id === petId) {
      const remainingPets = pets.filter(pet => pet.id !== petId);
      setSelectedPet(remainingPets[0] || null);
    }
  };

  // 선택된 반려동물 변경
  const selectPet = (pet) => {
    setSelectedPet(pet);
  };

  // 프로필 이미지 업로드 핸들러
  const handleImageUpload = (file, type, targetId = null) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        
        if (type === 'user') {
          updateUserProfile({ profileImage: imageDataUrl });
        } else if (type === 'pet' && targetId) {
          updatePet(targetId, { profileImage: imageDataUrl });
        }
        
        resolve(imageDataUrl);
      };
      reader.readAsDataURL(file);
    });
  };

  const value = {
    // 상태
    userProfile,
    pets,
    selectedPet,
    showUserProfile,
    showPetProfile,
    showAddPetForm,
    
    // 인증 상태
    isAuthenticated,
    
    // 사용자 관련 액션
    updateUserProfile,
    setShowUserProfile,
    
    // 반려동물 관련 액션
    addPet,
    updatePet,
    deletePet,
    selectPet,
    setShowPetProfile,
    setShowAddPetForm,
    
    // 유틸리티
    handleImageUpload
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};