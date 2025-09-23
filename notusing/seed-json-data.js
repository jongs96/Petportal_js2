const fs = require('fs');
const path = require('path');
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
    CommunityComment,
    testConnection,
    syncDatabase,
    setupAssociations
} = require('./database');

// JSON 파일에서 데이터 읽기
const loadJsonData = (filename) => {
    try {
        const filePath = path.join(__dirname, 'data', filename);
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`${filename} 파일을 읽는 중 오류 발생:`, error);
        return [];
    }
};

// JSON 데이터를 데이터베이스에 삽입
const seedJsonData = async () => {
    try {
        console.log('데이터베이스 연결 테스트 중...');
        await testConnection();

        console.log('데이터베이스 동기화 중...');
        setupAssociations();
        await sequelize.sync({ force: true }); // 기존 데이터 삭제 후 재생성

        // 관리자 계정 생성
        console.log('관리자 계정 생성 중...');
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        await AdminUser.create({
            username: 'admin',
            password: hashedAdminPassword,
            email: 'admin@petcare.com',
            role: 'admin'
        });

        // 테스트 사용자 생성
        console.log('테스트 사용자 생성 중...');
        const hashedUserPassword = await bcrypt.hash('user123', 10);
        const testUser = await User.create({
            username: 'testuser',
            password: hashedUserPassword,
            email: 'test@user.com',
            role: 'user'
        });

        // JSON 파일에서 데이터 로드 및 삽입
        console.log('JSON 데이터 로드 중...');

        // Products 데이터 삽입
        const productsData = loadJsonData('products.json');
        if (productsData.length > 0) {
            console.log(`제품 데이터 ${productsData.length}개 삽입 중...`);
            for (const product of productsData) {
                await Product.create({
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    category: product.category,
                    stock: product.stock || 0,
                    image: product.image
                });
            }
        }

        // Accommodation 데이터 삽입
        const accommodationData = loadJsonData('accommodation.json');
        if (accommodationData.length > 0) {
            console.log(`숙박시설 데이터 ${accommodationData.length}개 삽입 중...`);
            for (const accommodation of accommodationData) {
                await Accommodation.create({
                    name: accommodation.name,
                    type: accommodation.type,
                    location: accommodation.location,
                    price: faker.number.int({ min: 100000, max: 500000 }),
                    description: `평점: ${accommodation.rating}/5 - 최대 인원: ${accommodation.maxGuests}명`,
                    rating: accommodation.rating,
                    image: accommodation.images ? accommodation.images[0] : null
                });
            }
        }

        // Cafe 데이터 삽입
        const cafeData = loadJsonData('cafe.json');
        if (cafeData.length > 0) {
            console.log(`카페 데이터 ${cafeData.length}개 삽입 중...`);
            for (const cafe of cafeData) {
                await Cafe.create({
                    name: cafe.name,
                    address: cafe.address,
                    phone: cafe.phone,
                    description: cafe.description,
                    rating: cafe.rating,
                    image: cafe.images ? cafe.images[0] : null
                });
            }
        }

        // Hospital 데이터 삽입
        const hospitalData = loadJsonData('hospital.json');
        if (hospitalData.length > 0) {
            console.log(`병원 데이터 ${hospitalData.length}개 삽입 중...`);
            for (const hospital of hospitalData) {
                await Hospital.create({
                    name: hospital.name,
                    address: hospital.address,
                    phone: hospital.phone,
                    description: hospital.description,
                    specialties: hospital.specialties ? hospital.specialties.join(', ') : '',
                    rating: hospital.rating
                });
            }
        }

        // Hotel 데이터 삽입
        const hotelData = loadJsonData('hotel.json');
        if (hotelData.length > 0) {
            console.log(`호텔 데이터 ${hotelData.length}개 삽입 중...`);
            for (const hotel of hotelData) {
                await Hotel.create({
                    name: hotel.name,
                    address: hotel.address,
                    price: 150000, // 기본값 설정 (JSON에 price 필드가 없음)
                    description: hotel.description,
                    rating: hotel.rating,
                    image: hotel.imageUrl
                });
            }
        }

        // Grooming 데이터 삽입
        const groomingData = loadJsonData('grooming.json');
        if (groomingData.length > 0) {
            console.log(`미용 서비스 데이터 ${groomingData.length}개 삽입 중...`);
            for (const grooming of groomingData) {
                await GroomingService.create({
                    name: grooming.name,
                    price: 50000, // 기본값 설정 (JSON에 price 필드가 없음)
                    description: grooming.description,
                    duration: 60, // 기본값
                    rating: 4.5 // 기본값
                });
            }
        }

        // 커뮤니티 게시글 데이터 삽입
        const communityPostsData = loadJsonData('community_posts.json');
        if (communityPostsData.length > 0) {
            console.log(`커뮤니티 게시글 ${communityPostsData.length}개 삽입 중...`);
            for (const post of communityPostsData) {
                await CommunityPost.create({
                    title: post.title,
                    content: post.content,
                    authorId: testUser.id,
                    views: post.views || 0,
                    likes: post.likes || 0
                });
            }
        }

        // 커뮤니티 댓글은 일단 스킵 (테이블 관계 이슈)
        // const communityCommentsData = loadJsonData('community_comments.json');

        console.log('\n✅ 모든 JSON 데이터가 성공적으로 데이터베이스에 삽입되었습니다!');
        console.log('📊 삽입된 데이터:');
        console.log(`- 관리자 계정: 1개 (admin/admin123)`);
        console.log(`- 사용자 계정: 1개 (testuser/user123)`);
        console.log(`- 제품: ${productsData.length}개`);
        console.log(`- 숙박시설: ${accommodationData.length}개`);
        console.log(`- 카페: ${cafeData.length}개`);
        console.log(`- 병원: ${hospitalData.length}개`);
        console.log(`- 호텔: ${hotelData.length}개`);
        console.log(`- 미용서비스: ${groomingData.length}개`);
        console.log(`- 커뮤니티 게시글: ${communityPostsData.length}개`);
        console.log(`- 커뮤니티 댓글: 0개 (스킵됨)`);

    } catch (error) {
        console.error('데이터 삽입 중 오류 발생:', error);
        throw error;
    }
};

// 스크립트로 직접 실행할 때
if (require.main === module) {
    seedJsonData().then(() => {
        console.log('\n🎉 JSON 데이터 시딩 완료!');
        console.log('이제 서버를 시작하면 모든 카테고리의 데이터를 확인할 수 있습니다.');
        process.exit(0);
    }).catch((error) => {
        console.error('시딩 실패:', error);
        process.exit(1);
    });
}

module.exports = { seedJsonData };