const { faker } = require('@faker-js/faker/locale/ko');
const bcrypt = require('bcryptjs');
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
    CommunityComment
} = require('./database.js');

// --- Helper Functions ---
const createRandomUser = async (i) => ({
    username: faker.person.fullName(),
    email: faker.internet.email() + i,
    password: await bcrypt.hash('password123', 10),
    role: 'user',
});

const createRandomProduct = () => ({
    name: faker.commerce.productName(),
    price: faker.commerce.price({ min: 10000, max: 200000, dec: 0 }),
    description: faker.commerce.productDescription(),
    category: faker.helpers.arrayElement(['사료', '간식', '장난감', '의류', '위생용품']),
    stock: faker.number.int({ min: 0, max: 100 }),
    image: `/images/products/product${faker.number.int({ min: 1, max: 10 })}.jpg`,
    images: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => `/images/products/product${faker.number.int({ min: 1, max: 10 })}.jpg`),
});

const createRandomAccommodation = () => ({
    name: `${faker.location.city()} ${faker.helpers.arrayElement(['펫 프렌들리', '강아지', '고양이'])} 펜션`,
    type: faker.helpers.arrayElement(['펜션', '리조트', '풀빌라']),
    location: `${faker.location.state()} ${faker.location.city()}`,
    price: faker.commerce.price({ min: 150000, max: 500000, dec: 0 }),
    description: faker.lorem.paragraph(),
    rating: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
    image: `/images/pensions/pension${faker.number.int({ min: 1, max: 10 })}.jpg`,
    images: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => `/images/pensions/pension${faker.number.int({ min: 1, max: 10 })}.jpg`),
});

const createRandomCafe = () => ({
    name: `카페 ${faker.company.name()}`,
    address: faker.location.streetAddress(),
    phone: faker.phone.number(),
    description: faker.lorem.sentence(),
    rating: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
    image: `/images/cafes/cafe${faker.number.int({ min: 1, max: 10 })}.jpg`,
});

const createRandomHospital = () => ({
    name: `${faker.location.city()} 동물병원`,
    address: faker.location.streetAddress(),
    phone: faker.phone.number(),
    description: faker.lorem.sentence(),
    specialties: faker.helpers.arrayElements(['내과', '외과', '피부과', '치과'], faker.number.int({ min: 1, max: 3 })).join(', '),
    rating: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
});

const createRandomHotel = () => ({
    name: `${faker.company.name()} 펫 호텔`,
    address: faker.location.streetAddress(),
    price: faker.commerce.price({ min: 50000, max: 150000, dec: 0 }),
    description: faker.lorem.paragraph(),
    rating: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
    image: `/images/hotels/hotel${faker.number.int({ min: 1, max: 5 })}.jpg`,
    images: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => `/images/hotels/hotel${faker.number.int({ min: 1, max: 5 })}.jpg`),
});

const createRandomGroomingService = () => ({
    name: `${faker.helpers.arrayElement(['해피', '큐티', '프리티'])} 펫 살롱`,
    price: faker.commerce.price({ min: 30000, max: 120000, dec: 0 }),
    description: faker.lorem.sentence(),
    duration: faker.helpers.arrayElement([30, 60, 90, 120]),
    rating: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
});

const boardKeys = [
    'free-talk', 'pet-showcase', 'info-share', 'qna', 
    'adoption', 'meetups', 'missing', 'reviews'
];

const samplePostData = {
    'free-talk': [
        { title: '오늘 산책하다 만난 댕댕이 친구!', content: '오늘 공원에서 산책하는데, 정말 귀여운 비숑 친구를 만났어요. 저희 집 댕댕이랑 한참을 같이 뛰어놀았네요. 여러분도 오늘 반려견과 즐거운 시간 보내셨나요?' },
        { title: '고양이들은 왜 상자를 좋아할까요?', content: '새로 산 캣타워보다 택배 상자를 더 좋아하는 우리 냥이... 이유가 뭘까요? 다들 공감하시죠? 🤣' },
        { title: '다들 반려동물 이름은 어떻게 지으셨어요?', content: '저희 집 아이 이름은 "보리"인데, 처음 데려왔을 때 보리차 색깔이라 그렇게 지었어요. 다들 어떤 특별한 의미가 있는지 궁금해요!' },
        { title: '반려동물 키우면서 가장 행복했던 순간은?', content: '저는 퇴근하고 집에 왔을 때, 꼬리치며 반겨주는 모습을 볼 때가 가장 행복해요. 여러분의 행복한 순간도 공유해주세요!' },
        { title: '강아지랑 고양이 같이 키우시는 분 계신가요?', content: '둘째로 고양이를 데려오고 싶은데, 이미 있는 강아지랑 잘 지낼 수 있을지 걱정이에요. 경험 있으신 분들의 조언을 구합니다.' }
    ],
    'pet-showcase': [
        { title: '저희 집 냥이 자는 모습 좀 보세요... 심쿵주의', content: '세상 평화롭게 자는 모습이 너무 사랑스러워서 공유합니다. 이 맛에 집사합니다.' },
        { title: '인생 첫 미용! 곰돌이컷 성공했어요', content: '배냇미용으로 곰돌이컷 했는데 너무 귀여워서 기절... 사진 백만장 찍었어요.' },
        { title: '새로 산 장난감에 대한 격한 반응', content: '캣닢 쿠션을 사줬더니 아주 난리가 났네요. 이렇게 좋아할 줄이야!' },
        { title: '산책하다가 인생샷 건졌습니다', content: '해질녘 공원에서 찍은 사진인데, 완전 모델 같지 않나요? (팔불출 맞습니다)' },
        { title: '숨막히는 뒤태... 치명적인 식빵 궁둥이', content: '식빵 굽고 있는 뒷모습이 너무 동글동글 귀여워서 안 찍을 수가 없었어요.' }
    ],
    'info-share': [
        { title: '강아지 슬개골 탈구에 좋은 영양제 추천', content: '저희 아이가 슬개골이 안 좋아서 영양제를 꾸준히 먹이고 있는데, 효과 봤던 제품들 정보 공유합니다.' },
        { title: '여름철 고양이 음수량 늘리는 꿀팁!', content: '물을 잘 안 마시는 냥이들을 위해 제가 사용하는 방법 몇 가지를 공유해봐요. 츄르에 물 타주기, 분수대 설치 등등...' },
        { title: '서울 근교 애견동반 가능한 식당 리스트', content: '주말에 강아지랑 같이 갈 수 있는 식당들 리스트업 해봤어요. 파스타, 바베큐 등 종류별로 정리했습니다.' },
        { title: '고양이 화장실 모래 유목민 드디어 정착합니다', content: '먼지 날림 적고, 응고력 좋고, 탈취력까지 좋은 모래 드디어 찾았어요. OOOO 제품 강추합니다.' },
        { title: '강아지 문제행동, 짖음 훈련 성공 후기', content: '초인종 소리에 너무 짖어서 고민이 많았는데, 훈련사님 도움과 꾸준한 노력으로 많이 좋아졌어요. 제 경험담 공유합니다.' }
    ],
    'qna': [
        { title: '강아지가 갑자기 사료를 안 먹어요. 왜 그럴까요?', content: '어제까지만 해도 잘 먹던 사료를 오늘 아침부터 갑자기 안 먹네요. 간식은 잘 받아먹는데... 어디 아픈 걸까요?' },
        { title: '고양이가 자꾸 구토를 하는데 병원에 가봐야 할까요?', content: '헤어볼 토가 아니라 노란색 토를 일주일에 두세 번 정도 해요. 비슷한 경험 있으신 집사님들 계신가요? 병원에 가봐야 할 수준인지 궁금합니다.' },
        { title: '이제 3개월 된 퍼피인데, 예방접종은 언제부터 시작해야 하나요?', content: '이제 막 데려온 지 일주일 됐어요. 종합백신은 언제부터 맞추는 게 좋은가요? 동물병원 가기 전에 미리 알고 싶어서 질문합니다.' },
        { title: '산책할 때 너무 흥분해서 줄을 당기는데 어떻게 훈련해야 할까요?', content: '산책만 나가면 너무 좋아서 앞으로 튀어나가려고 해요. 목줄을 해도 소용이 없는데, 좋은 훈련 방법이 있을까요?' },
        { title: '고양이 발톱은 얼마나 자주 깎아줘야 하나요?', content: '저희 냥이가 발톱 깎는 걸 너무 싫어해서 고민이에요. 다들 얼마나 자주 관리해주시는지 궁금합니다.' }
    ],
    'adoption': [
        { title: '[서울/무료] 사용하지 않는 강아지 울타리 나눔합니다.', content: '저희 아이가 이제 다 커서 쓰지 않는 울타리를 나눔하려고 합니다. 상태는 깨끗하고, 직접 가지러 오셔야 해요. 필요하신 분 연락주세요.' },
        { title: '[경기/책임분양] 사람을 너무 좋아하는 애교냥이의 가족을 찾습니다.', content: '사정이 생겨 더 이상 키우지 못하게 되었습니다. 1살 된 코숏 남아이고, 중성화 완료했습니다. 사랑으로 품어주실 가족을 기다립니다.' },
        { title: '[부산/무료] 고양이 캣타워 드림해요!', content: '새 캣타워를 사면서 기존에 쓰던 제품을 드림합니다. 사용감은 좀 있지만 튼튼해요. SUV 차량이 있으셔야 가져가실 수 있을 거예요.' },
        { title: '[대구/책임분양] 겁 많지만 순한 시츄 왕자님입니다.', content: '구조 후 임시보호 중인 아이입니다. 낯을 좀 가리지만 마음을 열면 한없는 애교쟁이에요. 사상충 검사 및 접종 완료했습니다.' },
        { title: '[나눔] 유통기한 임박한 강아지 간식 나눔합니다.', content: '실수로 너무 많이 주문해서... 유통기한이 한 달 정도 남은 간식입니다. 양이 많으니 여러 아이 키우시는 분이 가져가시면 좋겠어요.' }
    ],
    'meetups': [
        { title: '이번주 토요일, 서울숲에서 산책 번개 하실 분!', content: '날씨도 좋은데 같이 산책해요! 2살 말티즈 키우고 있습니다. 소형견 친구들이면 더 좋을 것 같아요. 오후 3시쯤 어떠세요?' },
        { title: '부산 비숑 모임 (부비숑) 신입회원 모집합니다.', content: '부산/경남 지역 비숑들의 정기 모임입니다. 한 달에 한 번 애견운동장에서 모여서 신나게 놀아요! 관심 있으신 분들은 댓글 남겨주세요.' },
        { title: '대전 웰시코기 키우시는 분들~ 주말에 남문광장 어떠세요?', content: '식빵 궁둥이들 모여라! 이번 주 일요일 오후에 남문광장에서 같이 뛰어놀아요. 저희 집 코기는 4살입니다.' },
        { title: '인천 소래습지생태공원 같이 가실 분 찾아요.', content: '주말에 차 가지고 소래습지생태공원 가려고 하는데, 같이 카풀해서 가실 분 있을까요? 저희는 푸들 2마리 키웁니다.' },
        { title: '고양이 카페에서 집사님들 정모 한번 할까요?', content: '강아지 모임은 많은데 고양이 모임은 별로 없네요. 다 같이 고양이 카페 가서 정보 공유도 하고 수다도 떨어요! 원하는 지역 투표 받습니다.' }
    ],
    'missing': [
        { title: '[찾습니다] 경기도 성남시 분당구에서 갈색 푸들을 잃어버렸습니다.', content: '오늘(9/10) 오후 5시경 정자동 카페거리에서 산책하다가 놓쳤습니다. 이름은 초코이고, 5살 수컷입니다. 빨간색 목줄을 하고 있어요. 보시면 꼭 연락주세요.' },
        { title: '[보호중] 서울시 강서구 화곡동에서 노란색 고양이를 보호하고 있습니다.', content: '어제 저녁부터 저희 집 주차장에서 계속 울고 있어서 우선 집으로 데려와 보호 중입니다. 사람 손을 타는 걸 보니 집고양이 같아요. 사진 확인하시고 연락주세요.' },
        { title: '[찾아주세요] 인천 부평구에서 앵무새(코뉴어)를 찾습니다.', content: '창문 방충망이 뚫린 사이로 날아갔습니다. 이름은 "루비"이고 "안녕"이라고 말할 수 있어요. 보신 분은 꼭 좀 부탁드립니다. 사례하겠습니다.' },
        { title: '[주인을 찾습니다] 대전 유성구에서 발견된 허스키입니다.', content: '파란색 눈을 가진 허스키를 어젯밤에 발견해서 보호하고 있습니다. 칩은 없는 것 같아요. 주인을 애타게 찾고 있습니다.' },
        { title: '[찾습니다] 저희 집 뽀삐를 보신 분 없나요? (전단지 첨부)', content: '일주일 째 집에 들어오지 않고 있습니다. 흰색 말티즈이고, 겁이 많습니다. 전단지 사진 보시고 비슷한 아이를 보시면 꼭 연락 부탁드립니다.' }
    ],
    'reviews': [
        { title: '가평 애견동반 펜션 "펫포레스트" 완전 강추해요!', content: '개별 운동장도 넓고, 수영장 물도 깨끗하고, 룸 컨디션도 최고였어요. 바베큐도 개별이라 편하게 먹었네요. 재방문 의사 200%입니다.' },
        { title: '제주도 애견동반 카페 "댕댕당" 솔직 후기', content: '인테리어도 예쁘고 포토존도 많아서 좋았어요. 강아지용 메뉴도 따로 있어서 같이 즐길 수 있었네요. 다만 주말에는 사람이 너무 많아서 참고하세요.' },
        { title: '서울숲 근처 애견동반 식당 "멍슐랭" 다녀왔어요.', content: '야외 테라스 자리가 있어서 강아지랑 같이 식사하기 좋았어요. 음식도 맛있고 직원분들도 친절하셨습니다. 강아지 물그릇도 챙겨주시는 센스!' },
        { title: '강릉 애견 전용 해수욕장, 안목해변 후기', content: '강아지들이랑 눈치 안 보고 마음껏 수영할 수 있어서 너무 좋았어요. 주변에 간단히 씻길 수 있는 시설도 있어서 편리했습니다.' },
        { title: '하남 스타필드, 반려견 동반 쇼핑 후기!', content: '유모차나 케이지 이용하면 대부분의 매장에 동반 출입이 가능해서 좋았어요. 펫 전용 편의시설도 잘 되어있어서 쇼핑하기 편했습니다.' }
    ]
};

const createRandomPost = (userId) => {
    const boardKey = faker.helpers.arrayElement(boardKeys);
    const sampleData = faker.helpers.arrayElement(samplePostData[boardKey]);

    return {
        title: sampleData.title,
        content: sampleData.content,
        authorId: userId,
        boardKey: boardKey,
        views: faker.number.int({ min: 0, max: 1000 }),
        likes: faker.number.int({ min: 0, max: 200 }),
    };
}; 

const runMigrations = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('데이터베이스 동기화 완료.');

        const NUM_USERS = 20;
        const NUM_POSTS_PER_BOARD = 5;
        const TOTAL_POSTS = boardKeys.length * NUM_POSTS_PER_BOARD;

        // --- 기본 관리자 및 사용자 생성 ---
        console.log('기본 사용자 생성 중...');
        const adminPassword = await bcrypt.hash('admin123', 10);
        await AdminUser.upsert({ id: 1, username: 'admin', password: adminPassword, email: 'admin@petpotal.com' });

        const usersData = [];
        for (let i = 0; i < NUM_USERS; i++) {
            usersData.push(await createRandomUser(i));
        }
        await User.bulkCreate(usersData, { ignoreDuplicates: true });
        console.log('기본 사용자 생성 완료.');

        const users = await User.findAll();
        const userIds = users.map(u => u.id);

        // --- 카탈로그 데이터 생성 ---
        const catalogs = [
            { name: '반려용품', model: Product, generator: createRandomProduct },
            { name: '동반숙소', model: Accommodation, generator: createRandomAccommodation },
            { name: '카페', model: Cafe, generator: createRandomCafe },
            { name: '병원', model: Hospital, generator: createRandomHospital },
            { name: '호텔', model: Hotel, generator: createRandomHotel },
            { name: '미용', model: GroomingService, generator: createRandomGroomingService },
        ];

        for (const catalog of catalogs) {
            console.log(`${catalog.name} 데이터 생성 중...`);
            const existingCatalogCount = await catalog.model.count();
            if (existingCatalogCount < NUM_USERS) {
                const data = Array.from({ length: NUM_USERS - existingCatalogCount }, catalog.generator);
                await catalog.model.bulkCreate(data);
            }
            console.log(`${catalog.name} 데이터 생성 완료.`);
        }

        // --- 커뮤니티 데이터 생성 ---
        console.log('커뮤니티 게시글 생성 중...');
        const existingPostCount = await CommunityPost.count();
        if (existingPostCount < TOTAL_POSTS) {
            const postsData = Array.from({ length: TOTAL_POSTS - existingPostCount }, () => createRandomPost(faker.helpers.arrayElement(userIds)));
            await CommunityPost.bulkCreate(postsData);
        }
        console.log('커뮤니티 게시글 생성 완료.');


        console.log('\n🎉 모든 데이터 마이그레이션이 성공적으로 완료되었습니다.');

    } catch (error) {
        console.error('데이터 마이그레이션 중 오류 발생:', error);
    } finally {
        await sequelize.close();
    }
};

runMigrations();
