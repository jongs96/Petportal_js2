// server/create-sample-pet-supplies.js
const { PetSupply, syncDatabase } = require('./database-sqlite');

const samplePetSupplies = [
  // 사료 카테고리
  {
    name: '로얄캐닌 독 어덜트',
    description: '성견용 프리미엄 건식사료로 균형잡힌 영양을 제공합니다.',
    price: 58000,
    category: '사료',
    imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
    stockQuantity: 50,
    isFeatured: true,
    isBest: true,
    brand: '로얄캐닌',
    rating: 4.8,
    reviewCount: 127
  },
  {
    name: '힐스 사이언스 다이어트',
    description: '수의사가 추천하는 과학적으로 검증된 반려견 사료입니다.',
    price: 72000,
    category: '사료',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
    stockQuantity: 30,
    isFeatured: false,
    isBest: true,
    brand: '힐스',
    rating: 4.6,
    reviewCount: 89
  },
  {
    name: '오리젠 어덜트 독',
    description: '신선한 육류 85% 함유한 프리미엄 자연식 사료입니다.',
    price: 89000,
    category: '사료',
    imageUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400',
    stockQuantity: 25,
    isFeatured: true,
    isBest: false,
    brand: '오리젠',
    rating: 4.9,
    reviewCount: 156
  },

  // 간식 카테고리
  {
    name: '덴탈껌 멀티팩',
    description: '치아 건강을 위한 천연 덴탈껌으로 구강 관리에 효과적입니다.',
    price: 24000,
    category: '간식',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
    stockQuantity: 80,
    isFeatured: false,
    isBest: true,
    brand: '펫츄럴',
    rating: 4.4,
    reviewCount: 203
  },
  {
    name: '수제 연어 져키',
    description: '100% 자연산 연어로 만든 무첨가 수제 간식입니다.',
    price: 18000,
    category: '간식',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
    stockQuantity: 60,
    isFeatured: true,
    isBest: false,
    brand: '네츄럴코어',
    rating: 4.7,
    reviewCount: 94
  },

  // 장난감 카테고리
  {
    name: '스마트 자동 볼 장난감',
    description: '혼자 있는 시간도 즐겁게! 자동으로 움직이는 스마트 볼입니다.',
    price: 45000,
    category: '장난감',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
    stockQuantity: 35,
    isFeatured: true,
    isBest: true,
    brand: '펫큐브',
    rating: 4.5,
    reviewCount: 78
  },
  {
    name: '로프 터그 장난감',
    description: '튼튼한 면 로프로 만든 터그놀이 전용 장난감입니다.',
    price: 12000,
    category: '장난감',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
    stockQuantity: 100,
    isFeatured: false,
    isBest: false,
    brand: '펫토이',
    rating: 4.2,
    reviewCount: 145
  },
  {
    name: '퍼즐 피딩 토이',
    description: '지능 발달과 식사를 동시에! 두뇌 자극 퍼즐 장난감입니다.',
    price: 28000,
    category: '장난감',
    imageUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400',
    stockQuantity: 45,
    isFeatured: true,
    isBest: false,
    brand: '니나오토슨',
    rating: 4.6,
    reviewCount: 67
  },

  // 미용/목욕 카테고리
  {
    name: '저자극 천연 샴푸',
    description: '민감한 피부를 위한 순한 천연 성분 샴푸입니다.',
    price: 24000,
    category: '미용/목욕',
    imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
    stockQuantity: 70,
    isFeatured: false,
    isBest: true,
    brand: '바이오가드',
    rating: 4.3,
    reviewCount: 112
  },
  {
    name: '프로페셔널 브러시 세트',
    description: '전문 그루머가 사용하는 고급 브러시 3종 세트입니다.',
    price: 35000,
    category: '미용/목욕',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
    stockQuantity: 40,
    isFeatured: true,
    isBest: false,
    brand: '그루밍마스터',
    rating: 4.7,
    reviewCount: 56
  },

  // 의류/악세서리 카테고리
  {
    name: '겨울용 패딩 조끼',
    description: '추운 겨울 산책을 위한 따뜻하고 가벼운 패딩 조끼입니다.',
    price: 32000,
    category: '의류/악세서리',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
    stockQuantity: 55,
    isFeatured: true,
    isBest: false,
    brand: '펫패션',
    rating: 4.4,
    reviewCount: 89
  },
  {
    name: 'LED 안전 목걸이',
    description: '야간 산책 시 안전을 위한 LED 라이트 목걸이입니다.',
    price: 16000,
    category: '의류/악세서리',
    imageUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400',
    stockQuantity: 85,
    isFeatured: false,
    isBest: false,
    brand: '세이프펫',
    rating: 4.1,
    reviewCount: 134
  },

  // 침구/쿠션 카테고리
  {
    name: '푹신한 구름 쿠션',
    description: '반려동물의 편안한 휴식을 위한 메모리폼 쿠션입니다.',
    price: 72000,
    category: '침구/쿠션',
    imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
    stockQuantity: 30,
    isFeatured: true,
    isBest: true,
    brand: '컴포트펫',
    rating: 4.8,
    reviewCount: 167
  },
  {
    name: '사계절 방수 매트',
    description: '사계절 사용 가능한 방수 기능이 있는 편안한 매트입니다.',
    price: 38000,
    category: '침구/쿠션',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
    stockQuantity: 65,
    isFeatured: false,
    isBest: false,
    brand: '올시즌',
    rating: 4.2,
    reviewCount: 98
  },

  // 건강관리 카테고리
  {
    name: '멀티비타민 영양제',
    description: '반려동물 전용 종합 비타민으로 건강한 성장을 도와줍니다.',
    price: 42000,
    category: '건강관리',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
    stockQuantity: 50,
    isFeatured: true,
    isBest: false,
    brand: '뉴트리펫',
    rating: 4.5,
    reviewCount: 76
  },
  {
    name: '관절 건강 보조제',
    description: '노령견의 관절 건강을 위한 글루코사민 함유 보조제입니다.',
    price: 58000,
    category: '건강관리',
    imageUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400',
    stockQuantity: 35,
    isFeatured: false,
    isBest: true,
    brand: '조인트케어',
    rating: 4.6,
    reviewCount: 123
  }
];

const createSamplePetSupplies = async () => {
  try {
    await syncDatabase();
    
    // 기존 데이터 확인
    const existingCount = await PetSupply.count();
    if (existingCount > 0) {
      console.log('반려용품 샘플 데이터가 이미 존재합니다.');
      return;
    }

    // 샘플 데이터 생성
    await PetSupply.bulkCreate(samplePetSupplies);
    console.log('반려용품 샘플 데이터 생성 완료!');
    console.log(`총 ${samplePetSupplies.length}개의 상품이 추가되었습니다.`);
    
  } catch (error) {
    console.error('반려용품 샘플 데이터 생성 실패:', error);
  }
};

// 직접 실행 시
if (require.main === module) {
  createSamplePetSupplies().then(() => {
    process.exit(0);
  });
}

module.exports = createSamplePetSupplies;