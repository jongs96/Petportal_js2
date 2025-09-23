const bcrypt = require('bcryptjs'); // bcryptjs is already used, keeping it consistent
const {
    sequelize,
    AdminUser,
    User,
    Product,
    Cafe,
    Accommodation,
    Hospital,
    Hotel,
    GroomingService,
    CommunityPost,
    CommunityComment,
    syncDatabase
} = require('./database-sqlite');

// 예시 데이터 생성
const seedData = async () => {
    try {
        console.log('데이터베이스 초기화 중...');

        await sequelize.sync({ force: true }); // 기존 데이터 삭제 후 재생성

        // 관리자 계정 생성
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        await AdminUser.create({
            username: 'admin',
            password: hashedAdminPassword,
            email: 'admin@petcare.com',
            role: 'admin'
        });

        // 테스트 사용자 생성
        const hashedUserPassword = await bcrypt.hash('user123', 10);
        const testUser = await User.create({
            username: 'testuser',
            password: hashedUserPassword,
            email: 'test@user.com',
            role: 'user'
        });

        // 제품 데이터
        const products = [
            { name: '프리미엄 강아지 사료 (연어)', price: 45000, description: '신선한 연어로 만든 고품질 사료입니다.', category: '사료', stock: 100, image: 'https://picsum.photos/seed/dog1/400/400' },
            { name: '고양이 털볼 케어 사료', price: 38000, description: '털볼 배출에 도움을 주는 고양이 전용 사료입니다.', category: '사료', stock: 80, image: 'https://picsum.photos/seed/cat1/400/400' },
            { name: '강아지 덴탈 스틱', price: 12000, description: '치아 건강에 좋은 덴탈 스틱입니다.', category: '간식', stock: 200, image: 'https://picsum.photos/seed/treat1/400/400' },
            { name: '고양이 참치 캔', price: 8500, description: '100% 참치로 만든 고양이 간식입니다.', category: '간식', stock: 150, image: 'https://picsum.photos/seed/can1/400/400' },
            { name: '강아지 로프 장난감', price: 15000, description: '튼튼한 로프로 만든 장난감입니다.', category: '장난감', stock: 50, image: 'https://picsum.photos/seed/rope1/400/400' },
            { name: '고양이 깃털 장난감', price: 18000, description: '고양이의 사냥 본능을 자극하는 깃털 장난감입니다.', category: '장난감', stock: 60, image: 'https://picsum.photos/seed/feather1/400/400' },
            { name: '강아지 겨울 패딩', price: 55000, description: '따뜻한 겨울용 강아지 패딩입니다.', category: '의류', stock: 30, image: 'https://picsum.photos/seed/padding1/400/400' },
            { name: '고양이 모래 (무향)', price: 22000, description: '먼지가 적은 프리미엄 고양이 모래입니다.', category: '위생용품', stock: 120, image: 'https://picsum.photos/seed/litter1/400/400' },
            { name: '자동 급식기', price: 89000, description: '타이머 설정이 가능한 자동 급식기입니다.', category: '급식기', stock: 25, image: 'https://picsum.photos/seed/feeder1/400/400' },
            { name: '펫 침대 (라지)', price: 67000, description: '대형견도 편안하게 쉴 수 있는 큰 침대입니다.', category: '리빙', stock: 15, image: 'https://picsum.photos/seed/bed1/400/400' }
        ];

        for (const product of products) {
            await Product.create(product);
        }

        // 카페 데이터
        const cafes = [
            { name: '멍멍카페', address: '서울시 강남구 논현동 123-45', phone: '02-1234-5678', description: '강아지와 함께 즐길 수 있는 애견 카페입니다.', rating: 4.8, image: 'https://picsum.photos/seed/cafe1/400/400' },
            { name: '냥냥하우스', address: '서울시 홍대 어딘가 567-89', phone: '02-2345-6789', description: '고양이들과 힐링할 수 있는 고양이 카페입니다.', rating: 4.9, image: 'https://picsum.photos/seed/cafe2/400/400' },
            { name: '펫프렌즈 카페', address: '부산시 해운대구 우동 111-22', phone: '051-3456-7890', description: '다양한 반려동물과 만날 수 있는 카페입니다.', rating: 4.7, image: 'https://picsum.photos/seed/cafe3/400/400' },
            { name: '도그타운', address: '대구시 수성구 범어동 333-44', phone: '053-4567-8901', description: '넓은 놀이터가 있는 대형 애견 카페입니다.', rating: 4.6, image: 'https://picsum.photos/seed/cafe4/400/400' },
            { name: '캣츠가든', address: '인천시 남동구 구월동 555-66', phone: '032-5678-9012', description: '정원이 있는 아늑한 고양이 카페입니다.', rating: 4.8, image: 'https://picsum.photos/seed/cafe5/400/400' },
            { name: '퍼피라운지', address: '광주시 서구 치평동 777-88', phone: '062-6789-0123', description: '소형견 전문 카페로 안전한 놀이 공간을 제공합니다.', rating: 4.5, image: 'https://picsum.photos/seed/cafe6/400/400' },
            { name: '애니멀파크', address: '대전시 유성구 봉명동 999-00', phone: '042-7890-1234', description: '다양한 동물들과 교감할 수 있는 체험형 카페입니다.', rating: 4.7, image: 'https://picsum.photos/seed/cafe7/400/400' },
            { name: '털뭉치하우스', address: '울산시 남구 삼산동 222-33', phone: '052-8901-2345', description: '털이 긴 품종 전문 펫카페입니다.', rating: 4.4, image: 'https://picsum.photos/seed/cafe8/400/400' },
            { name: '반려동물 쉼터카페', address: '세종시 조치원읍 444-55', phone: '044-9012-3456', description: '입양을 기다리는 동물들과 만날 수 있는 카페입니다.', rating: 4.9, image: 'https://picsum.photos/seed/cafe9/400/400' },
            { name: '펫조아', address: '제주시 연동 666-77', phone: '064-0123-4567', description: '제주도 여행 중 반려동물과 함께 쉴 수 있는 카페입니다.', rating: 4.6, image: 'https://picsum.photos/seed/cafe10/400/400' }
        ];

        for (const cafe of cafes) {
            await Cafe.create(cafe);
        }

        // 숙박 시설 데이터
        const accommodations = [
            { name: '펫프렌들리 펜션', type: '펜션', location: '강원도 춘천시', price: 120000, description: '반려동물과 함께 머물 수 있는 깨끗한 펜션입니다.', rating: 4.8, image: 'https://picsum.photos/seed/pension1/400/400' },
            { name: '도그런 리조트', type: '리조트', location: '경기도 가평군', price: 180000, description: '넓은 운동장이 있는 애견 전용 리조트입니다.', rating: 4.9, image: 'https://picsum.photos/seed/resort1/400/400' },
            { name: '캣츠 게스트하우스', type: '게스트하우스', location: '부산시 기장군', price: 85000, description: '고양이 친화적인 조용한 게스트하우스입니다.', rating: 4.7, image: 'https://picsum.photos/seed/guest1/400/400' },
            { name: '반려동물 캠핑장', type: '캠핑장', location: '충북 제천시', price: 45000, description: '자연 속에서 반려동물과 캠핑을 즐길 수 있습니다.', rating: 4.6, image: 'https://picsum.photos/seed/camping1/400/400' },
            { name: '펫파라다이스 펜션', type: '펜션', location: '전남 순천시', price: 95000, description: '애견 수영장이 있는 특별한 펜션입니다.', rating: 4.8, image: 'https://picsum.photos/seed/pension2/400/400' },
            { name: '힐링 펫 스테이', type: '민박', location: '경북 경주시', price: 70000, description: '전통 한옥에서 반려동물과 힐링할 수 있습니다.', rating: 4.5, image: 'https://picsum.photos/seed/stay1/400/400' },
            { name: '바다뷰 펫 하우스', type: '펜션', location: '강원도 속초시', price: 150000, description: '바다가 보이는 로맨틱한 펜션입니다.', rating: 4.9, image: 'https://picsum.photos/seed/ocean1/400/400' },
            { name: '산속 펫 빌라', type: '빌라', location: '경기도 양평군', price: 110000, description: '산속의 조용한 환경에서 휴식을 취할 수 있습니다.', rating: 4.4, image: 'https://picsum.photos/seed/villa1/400/400' },
            { name: '애견 동반 모텔', type: '모텔', location: '대전시 서구', price: 55000, description: '깨끗하고 저렴한 애견 동반 모텔입니다.', rating: 4.3, image: 'https://picsum.photos/seed/motel1/400/400' },
            { name: '반려동물 농장체험', type: '농장체험', location: '충남 홍성군', price: 80000, description: '농장에서 다양한 동물들과 체험할 수 있습니다.', rating: 4.7, image: 'https://picsum.photos/seed/farm1/400/400' }
        ];

        for (const accommodation of accommodations) {
            await Accommodation.create(accommodation);
        }

        // 병원 데이터
        const hospitals = [
            { name: '24시 동물병원', address: '서울시 강남구 역삼동 123-45', phone: '02-1111-2222', description: '24시간 응급진료가 가능한 종합 동물병원입니다.', specialties: '응급진료, 수술, 건강검진', rating: 4.9 },
            { name: '사랑동물병원', address: '부산시 해운대구 우동 567-89', phone: '051-3333-4444', description: '30년 경험의 원장님이 진료하는 믿을 수 있는 병원입니다.', specialties: '내과, 외과, 치과', rating: 4.8 },
            { name: '우리동물의료센터', address: '대구시 수성구 범어동 111-22', phone: '053-5555-6666', description: '첨단 장비를 갖춘 대형 동물의료센터입니다.', specialties: 'MRI, CT, 정형외과', rating: 4.7 },
            { name: '반려동물종합병원', address: '인천시 남동구 구월동 333-44', phone: '032-7777-8888', description: '다양한 전문의가 있는 종합병원입니다.', specialties: '심장외과, 안과, 피부과', rating: 4.6 },
            { name: '펫케어동물병원', address: '광주시 서구 치평동 555-66', phone: '062-9999-0000', description: '예방접종과 건강관리 전문 병원입니다.', specialties: '예방접종, 건강검진, 중성화수술', rating: 4.5 },
            { name: '동물사랑병원', address: '대전시 유성구 봉명동 777-88', phone: '042-1212-3434', description: '친절하고 세심한 진료로 유명한 병원입니다.', specialties: '내과, 산부인과, 행동치료', rating: 4.8 },
            { name: '희망동물병원', address: '울산시 남구 삼산동 999-00', phone: '052-5656-7878', description: '응급상황에 빠른 대응이 가능한 병원입니다.', specialties: '응급진료, 중환자실, 수혈', rating: 4.4 },
            { name: '행복한동물병원', address: '세종시 조치원읍 222-33', phone: '044-9090-1212', description: '스트레스 받지 않는 진료환경을 제공합니다.', specialties: '소동물진료, 야생동물진료', rating: 4.7 },
            { name: '제주동물메디컬센터', address: '제주시 연동 444-55', phone: '064-3434-5656', description: '제주도 최대 규모의 동물병원입니다.', specialties: '종합진료, 입원치료, 재활치료', rating: 4.9 },
            { name: '펫클리닉', address: '경기도 수원시 영통구 666-77', phone: '031-7878-9090', description: '예약제로 운영되는 프리미엄 클리닉입니다.', specialties: '성형외과, 레이저치료, 한방치료', rating: 4.6 }
        ];

        for (const hospital of hospitals) {
            await Hospital.create(hospital);
        }

        // 호텔 데이터
        const hotels = [
            { name: '펫프렌들리 호텔', address: '서울시 중구 명동 123-45', price: 180000, description: '반려동물과 함께 머물 수 있는 시내 중심가 호텔입니다.', rating: 4.8, image: 'https://picsum.photos/seed/hotel1/400/400' },
            { name: '그랜드 펫 호텔', address: '부산시 중구 남포동 567-89', price: 220000, description: '5성급 서비스를 제공하는 고급 펫 호텔입니다.', rating: 4.9, image: 'https://picsum.photos/seed/hotel2/400/400' },
            { name: '도그 리조트 호텔', address: '제주시 노형동 111-22', price: 280000, description: '제주도의 아름다운 자연을 만끽할 수 있는 리조트 호텔입니다.', rating: 4.7, image: 'https://picsum.photos/seed/hotel3/400/400' },
            { name: '펫파크 호텔', address: '강원도 강릉시 333-44', price: 160000, description: '넓은 공원이 있는 펫 친화적 호텔입니다.', rating: 4.6, image: 'https://picsum.photos/seed/hotel4/400/400' },
            { name: '애니멀 스위트', address: '경기도 파주시 555-66', price: 140000, description: '반려동물 전용 시설이 완비된 스위트 호텔입니다.', rating: 4.5, image: 'https://picsum.photos/seed/hotel5/400/400' },
            { name: '펫조아 호텔', address: '충북 청주시 777-88', price: 120000, description: '가족 단위 여행객을 위한 펫 동반 호텔입니다.', rating: 4.4, image: 'https://picsum.photos/seed/hotel6/400/400' },
            { name: '비치 펫 리조트', address: '전남 여수시 999-00', price: 200000, description: '바다가 보이는 아름다운 리조트 호텔입니다.', rating: 4.8, image: 'https://picsum.photos/seed/hotel7/400/400' },
            { name: '마운틴 펫 로지', address: '경북 안동시 222-33', phone: '054-1234-5678', price: 110000, description: '산속의 조용한 환경에서 휴식할 수 있는 로지입니다.', rating: 4.3, image: 'https://picsum.photos/seed/hotel8/400/400' },
            { name: '시티 펫 호텔', address: '대구시 중구 444-55', price: 150000, description: '도심 속 편리한 위치의 모던한 펫 호텔입니다.', rating: 4.7, image: 'https://picsum.photos/seed/hotel9/400/400' },
            { name: '컨트리 펫 인', address: '전북 전주시 666-77', price: 90000, description: '전통과 현대가 어우러진 한옥 스타일 호텔입니다.', rating: 4.6, image: 'https://picsum.photos/seed/hotel10/400/400' }
        ];

        for (const hotel of hotels) {
            await Hotel.create(hotel);
        }

        // 미용 서비스 데이터
        const groomingServices = [
            { name: '베이직 목욕 & 드라이', price: 35000, description: '기본적인 목욕과 드라이 서비스입니다.', duration: 60, rating: 4.7 },
            { name: '프리미엄 스파 패키지', price: 85000, description: '전신 마사지와 아로마 스파가 포함된 프리미엄 서비스입니다.', duration: 120, rating: 4.9 },
            { name: '전신 미용 (커트 포함)', price: 65000, description: '목욕, 드라이, 전신 커트가 포함된 종합 미용 서비스입니다.', duration: 90, rating: 4.8 },
            { name: '네일 케어', price: 15000, description: '발톱 정리와 발가락 사이 털 정리 서비스입니다.', duration: 30, rating: 4.6 },
            { name: '치아 스케일링', price: 120000, description: '전문적인 치아 스케일링과 구강 관리 서비스입니다.', duration: 180, rating: 4.8 },
            { name: '얼굴 트리밍', price: 25000, description: '눈 주변과 얼굴 털 정리 서비스입니다.', duration: 45, rating: 4.5 },
            { name: '부분 커트', price: 40000, description: '원하는 부분만 커트하는 맞춤형 서비스입니다.', duration: 60, rating: 4.4 },
            { name: '털빠짐 방지 트리트먼트', price: 55000, description: '털빠짐을 줄여주는 특수 트리트먼트입니다.', duration: 75, rating: 4.7 },
            { name: '피부 진정 케어', price: 70000, description: '민감한 피부를 위한 진정 케어 서비스입니다.', duration: 90, rating: 4.6 },
            { name: 'VIP 올인원 패키지', price: 150000, description: '모든 미용 서비스가 포함된 최고급 패키지입니다.', duration: 180, rating: 4.9 }
        ];

        for (const service of groomingServices) {
            await GroomingService.create(service);
        }

        // 커뮤니티 게시글 데이터
        const posts = [
            { title: '우리 댕댕이 첫 산책 후기', content: '오늘 처음으로 공원에서 산책을 했는데 너무 좋아하더라고요! 다른 강아지들과도 잘 놀고... 행복한 하루였습니다.', authorId: testUser.id, views: 45, likes: 12, boardKey: 'free-talk' },
            { title: '고양이 사료 추천 부탁드려요', content: '6개월 된 고양이를 키우고 있는데, 좋은 사료 추천해주실 수 있나요? 알러지가 있어서 신경쓰고 있어요.', authorId: testUser.id, views: 78, likes: 8, boardKey: 'free-talk' },
            { title: '강아지 훈련 팁 공유', content: '앉아, 기다려, 손 등 기본 명령어 훈련하는 팁들을 공유해드릴게요. 인내심이 가장 중요한 것 같아요.', authorId: testUser.id, views: 123, likes: 25, boardKey: 'free-talk' },
            { title: '응급상황 대처법', content: '반려동물 응급상황 시 대처법에 대해 알아봤어요. 미리 알아두면 도움이 될 것 같아서 공유합니다.', authorId: testUser.id, views: 89, likes: 18, boardKey: 'free-talk' },
            { title: '겨울철 산책 주의사항', content: '요즘 날씨가 추워지면서 산책 시 주의할 점들이 많더라고요. 발가락 보온과 시간 조절이 중요해요.', authorId: testUser.id, views: 67, likes: 15, boardKey: 'free-talk' }
        ];

        for (const post of posts) {
            await CommunityPost.create(post);
        }

        // 커뮤니티 댓글은 나중에 수동으로 추가

        console.log('✅ 모든 예시 데이터가 성공적으로 생성되었습니다!');
        console.log('📊 생성된 데이터:');
        console.log(`- 관리자 계정: 1개 (admin/admin123)`);
        console.log(`- 사용자 계정: 1개 (testuser/user123)`);
        console.log(`- 제품: ${products.length}개`);
        console.log(`- 카페: ${cafes.length}개`);
        console.log(`- 숙박시설: ${accommodations.length}개`);
        console.log(`- 병원: ${hospitals.length}개`);
        console.log(`- 호텔: ${hotels.length}개`);
        console.log(`- 미용서비스: ${groomingServices.length}개`);
        console.log(`- 커뮤니티 게시글: ${posts.length}개`);
        console.log(`- 커뮤니티 댓글: 0개 (수동 추가 예정)`);

    } catch (error) {
        console.error('데이터 생성 중 오류 발생:', error);
    }
};

// 스크립트로 직접 실행할 때
if (require.main === module) {
    seedData().then(() => {
        console.log('데이터 시딩 완료');
        process.exit(0);
    });
}

module.exports = { seedData };