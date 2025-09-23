// src/components/profile/ProfileIcons.jsx

// React 라이브러리를 가져옵니다.
import React from 'react';
// `ProfileContext`를 사용하여 프로필 관련 데이터와 함수에 접근합니다.
import { useProfile } from '../../context/ProfileContext';
// 이 컴포넌트 전용 CSS 모듈을 가져옵니다.
import styles from './ProfileIcons.module.css';

/**
 * ProfileIcons 컴포넌트
 * 
 * 로그인한 사용자의 프로필 아이콘들을 헤더에 표시하는 역할을 합니다.
 * 사용자 자신의 프로필, 등록된 반려동물들의 프로필, 그리고 반려동물 추가 버튼을 포함합니다.
 * 각 아이콘 클릭 시 해당하는 프로필 모달이나 폼 모달을 엽니다.
 */
const ProfileIcons = () => {
  // `useProfile` 훅을 통해 ProfileContext로부터 필요한 상태와 함수들을 가져옵니다.
  const { 
    userProfile,        // 현재 로그인한 사용자의 프로필 정보
    pets,               // 등록된 반려동물 목록
    selectedPet,        // 현재 선택된 반려동물 정보
    isAuthenticated,    // 사용자의 로그인 여부
    selectPet,          // 반려동물을 선택하는 함수
    setShowUserProfile, // 사용자 프로필 모달을 여는 함수
    setShowPetProfile,  // 반려동물 프로필 모달을 여는 함수
    setShowAddPetForm   // 반려동물 추가 폼 모달을 여는 함수
  } = useProfile();

  // 사용자가 로그인하지 않았거나, 사용자 프로필 정보가 없으면 아무것도 렌더링하지 않습니다.
  if (!isAuthenticated || !userProfile) {
    return null; // null을 반환하면 화면에 아무것도 그려지지 않습니다.
  }

  // 반려동물 추가 버튼(+)을 클릭했을 때 호출되는 함수입니다.
  const handleAddPetClick = () => {
    setShowAddPetForm(true); // 반려동물 추가 폼 모달을 엽니다.
  };

  // 특정 반려동물 아이콘을 클릭했을 때 호출되는 함수입니다.
  const handlePetClick = (pet) => {
    selectPet(pet); // 클릭된 반려동물을 "선택된" 상태로 만듭니다.
    setShowPetProfile(true); // 반려동물 프로필 모달을 엽니다.
  };

  // 사용자 자신의 프로필 아이콘을 클릭했을 때 호출되는 함수입니다.
  const handleUserProfileClick = () => {
    setShowUserProfile(true); // 사용자 프로필 모달을 엽니다.
  };

  return (
    <div className={styles.profileIcons}>
      {/* 반려동물 추가 버튼 */}
      <button 
        className={styles.addButton}
        onClick={handleAddPetClick}
        title="반려동물 추가" // 마우스를 올렸을 때 표시되는 툴팁입니다.
      >
        <span className={styles.plusIcon}>+</span>
      </button>

      {/* 등록된 반려동물 프로필 아이콘 목록 */}
      {/* `pets` 배열에서 최대 3개까지만 아이콘을 표시합니다. */}
      {pets.slice(0, 3).map((pet) => (
        <button
          key={pet.id} // React가 각 항목을 효율적으로 관리하기 위한 고유 key입니다.
          // 현재 선택된 펫이면 `selected` 클래스를 추가하여 시각적으로 구분합니다.
          className={`${styles.petProfile} ${selectedPet?.id === pet.id ? styles.selected : ''}`}
          onClick={() => handlePetClick(pet)} // 클릭 시 해당 펫 정보를 인자로 전달하여 `handlePetClick`을 호출합니다.
          title={`${pet.name}의 프로필`}
        >
          <img 
            src={pet.profileImage} // 펫의 프로필 이미지 주소
            alt={`${pet.name} 프로필`} // 이미지를 설명하는 대체 텍스트
            className={styles.profileImage}
            // 이미지 로드에 실패했을 경우 기본 이미지를 보여주는 에러 핸들러입니다.
            onError={(e) => {
              e.target.src = pet.type === 'cat' 
                ? '/src/assets/images/profiles/default-cat.svg' // 고양이 기본 이미지
                : '/src/assets/images/profiles/default-dog.svg'; // 강아지 기본 이미지
            }}
          />
          {/* 선택된 펫일 경우, 선택되었음을 나타내는 작은 인디케이터를 표시합니다. */}
          {selectedPet?.id === pet.id && (
            <div className={styles.selectedIndicator} />
          )}
        </button>
      ))}

      {/* 등록된 반려동물이 3마리를 초과하는 경우, "더보기" 버튼을 표시합니다. */}
      {pets.length > 3 && (
        <button 
          className={styles.moreButton}
          onClick={() => setShowPetProfile(true)} // 클릭 시 펫 프로필 모달을 열어 전체 목록을 볼 수 있게 합니다.
          title={`${pets.length - 3}마리 더`}
        >
          <span className={styles.moreText}>+{pets.length - 3}</span>
        </button>
      )}

      {/* 사용자 자신의 프로필 아이콘 */}
      <button 
        className={styles.userProfile}
        onClick={handleUserProfileClick}
        title={`${userProfile.nickname}님의 프로필`}
      >
        <img 
          src={userProfile.profileImage} // 사용자 프로필 이미지 주소
          alt="내 프로필"
          className={styles.profileImage}
          // 이미지 로드 실패 시 기본 사용자 이미지를 보여줍니다.
          onError={(e) => {
            e.target.src = '/src/assets/images/profiles/default-user.svg';
          }}
        />
      </button>
    </div>
  );
};

// ProfileIcons 컴포넌트를 다른 파일에서 재사용할 수 있도록 내보냅니다.
export default ProfileIcons;
