// server/create-basic-data.js
const { 
    testConnection, 
    syncDatabase, 
    User, 
    Product, 
    Cafe, 
    Hospital, 
    Hotel, 
    GroomingService,
    Accommodation,
    PetSupply
} = require('./database-sqlite');
const bcrypt = require('bcryptjs');

const createBasicData = async () => {
    try {
        console.log('데이터베이스 연결 및 동기화 중...');
        await testConnection();
        await syncDatabase();
        
        // 기본 사용자 생성
        console.log('기본 사용자 생성 중...');
        const existingUsers = await User.findAll();
        if (existingUsers.length === 0) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            await User.bulkCreate([
                {
                    username: 'testuser1',
                    email: 'test1@example.com',
                    password: hashedPassword,
                    role: 'user'
                },
                {
                    username: 'testuser2',
                    email: 'test2@example.com',
                    password: hashedPassword,
                    role: 'user'
                }
            ]);
            console.log('기본 사용자 2명 생성 완료');
        }

        // 기본 상품 생성
        console.log('기본 상품 생성 중...');
        const existingProducts = await Product.findAll();
        if (existingProducts.length === 0) {
            await Product.bulkCreate([
                {
                    name: '프리미엄 강아지 사료',
                    description: '영양가 높은 프리미엄 강아지 사료입니다.',
                    price: 45000,
                    category: '사료',
                    brand: 'PetCare',
                    imageUrl: '/images/dog-food.jpg',
                    stock: 100
                },
                {
                    name: '고양이 장난감 세트',
                    description: '고양이가 좋아하는 다양한 장난감 세트입니다.',
                    price: 25000,
                    category: '장난감',
                    brand: 'CatToy',
                    imageUrl: '/images/cat-toys.jpg',
                    stock: 50
                },
                {
                    name: '반려동물 목줄',
                    description: '편안하고 안전한 반려동물 목줄입니다.',
                    price: 15000,
                    category: '용품',
                    brand: 'PetGear',
                    imageUrl: '/images/pet-leash.jpg',
                    stock: 75
                }
            ]);
            console.log('기본 상품 3개 생성 완료');
        }

        // 기본 카페 데이터 생성
        console.log('기본 카페 데이터 생성 중...');
        const existingCafes = await Cafe.findAll();
        if (existingCafes.length === 0) {
            await Cafe.bulkCreate([
                {
                    name: '펫카페 몽이네',
                    address: '서울시 강남구 테헤란로 123',
                    phone: '02-1234-5678',
                    description: '강아지와 함께 즐길 수 있는 따뜻한 카페입니다.',
                    lat: 37.5665,
                    lng: 126.9780,
                    rating: 4.5,
                    imageUrl: '/images/cafe1.jpg'
                },
                {
                    name: '고양이 카페 나비',
                    address: '서울시 홍대 와우산로 456',
                    phone: '02-2345-6789',
                    description: '귀여운 고양이들과 함께하는 힐링 카페입니다.',
                    lat: 37.5563,
                    lng: 126.9236,
                    rating: 4.3,
                    imageUrl: '/images/cafe2.jpg'
                }
            ]);
            console.log('기본 카페 2개 생성 완료');
        }

        // 기본 병원 데이터 생성
        console.log('기본 병원 데이터 생성 중...');
        const existingHospitals = await Hospital.findAll();
        if (existingHospitals.length === 0) {
            await Hospital.bulkCreate([
                {
                    name: '24시 동물병원',
                    address: '서울시 서초구 서초대로 789',
                    phone: '02-3456-7890',
                    description: '24시간 응급진료 가능한 동물병원입니다.',
                    lat: 37.4979,
                    lng: 127.0276,
                    rating: 4.7,
                    imageUrl: '/images/hospital1.jpg'
                },
                {
                    name: '우리동물병원',
                    address: '서울시 마포구 마포대로 321',
                    phone: '02-4567-8901',
                    description: '전문의가 진료하는 신뢰할 수 있는 동물병원입니다.',
                    lat: 37.5447,
                    lng: 126.9525,
                    rating: 4.4,
                    imageUrl: '/images/hospital2.jpg'
                }
            ]);
            console.log('기본 병원 2개 생성 완료');
        }

        // 기본 호텔 데이터 생성
        console.log('기본 호텔 데이터 생성 중...');
        const existingHotels = await Hotel.findAll();
        if (existingHotels.length === 0) {
            await Hotel.bulkCreate([
                {
                    name: '펫호텔 행복이네',
                    address: '서울시 송파구 올림픽로 654',
                    phone: '02-5678-9012',
                    description: '반려동물이 편안하게 지낼 수 있는 펫호텔입니다.',
                    lat: 37.5145,
                    lng: 127.1059,
                    rating: 4.6,
                    imageUrl: '/images/hotel1.jpg'
                },
                {
                    name: '도그호텔 사랑이네',
                    address: '서울시 용산구 한강대로 987',
                    phone: '02-6789-0123',
                    description: '강아지 전문 호텔로 최고의 서비스를 제공합니다.',
                    lat: 37.5326,
                    lng: 126.9652,
                    rating: 4.5,
                    imageUrl: '/images/hotel2.jpg'
                }
            ]);
            console.log('기본 호텔 2개 생성 완료');
        }

        // 기본 미용실 데이터 생성
        console.log('기본 미용실 데이터 생성 중...');
        const existingGrooming = await GroomingService.findAll();
        if (existingGrooming.length === 0) {
            await GroomingService.bulkCreate([
                {
                    name: '펫미용실 예쁜이네',
                    address: '서울시 강북구 도봉로 147',
                    phone: '02-7890-1234',
                    description: '전문 그루머가 정성껏 미용해드립니다.',
                    lat: 37.6398,
                    lng: 127.0253,
                    rating: 4.4,
                    imageUrl: '/images/grooming1.jpg'
                },
                {
                    name: '도그살롱 멋쟁이',
                    address: '서울시 노원구 상계로 258',
                    phone: '02-8901-2345',
                    description: '스타일리시한 펫 미용 전문점입니다.',
                    lat: 37.6542,
                    lng: 127.0648,
                    rating: 4.3,
                    imageUrl: '/images/grooming2.jpg'
                }
            ]);
            console.log('기본 미용실 2개 생성 완료');
        }

        // 기본 숙박시설 데이터 생성
        console.log('기본 숙박시설 데이터 생성 중...');
        const existingAccommodations = await Accommodation.findAll();
        if (existingAccommodations.length === 0) {
            await Accommodation.bulkCreate([
                {
                    name: '펫프렌들리 펜션',
                    address: '강원도 춘천시 남산면 펜션로 123',
                    phone: '033-1234-5678',
                    description: '반려동물과 함께 즐기는 자연 속 펜션입니다.',
                    lat: 37.8813,
                    lng: 127.7298,
                    rating: 4.5,
                    imageUrl: '/images/pension1.jpg',
                    pricePerNight: 120000
                },
                {
                    name: '도그런 리조트',
                    address: '경기도 가평군 설악면 리조트로 456',
                    phone: '031-2345-6789',
                    description: '강아지 전용 놀이터가 있는 리조트입니다.',
                    lat: 37.8021,
                    lng: 127.5093,
                    rating: 4.7,
                    imageUrl: '/images/resort1.jpg',
                    pricePerNight: 180000
                }
            ]);
            console.log('기본 숙박시설 2개 생성 완료');
        }

        console.log('✅ 모든 기본 데이터 생성이 완료되었습니다!');
        
    } catch (error) {
        console.error('❌ 기본 데이터 생성 실패:', error);
    }
};

// 스크립트 직접 실행 시
if (require.main === module) {
    createBasicData().then(() => {
        console.log('스크립트 실행 완료');
        process.exit(0);
    }).catch(error => {
        console.error('스크립트 실행 실패:', error);
        process.exit(1);
    });
}

module.exports = createBasicData;