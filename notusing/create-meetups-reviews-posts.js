const { CommunityPost, User, testConnection, syncDatabase } = require('./database-sqlite');

const createMeetupsAndReviewsPosts = async () => {
    try {
        await testConnection();
        await syncDatabase();

        console.log('meetups와 reviews 게시판 샘플 게시글 생성 중...');

        // 기존 사용자 확인
        const users = await User.findAll();
        if (users.length === 0) {
            console.log('사용자가 없습니다. 먼저 테스트 사용자를 생성해주세요.');
            return;
        }

        const samplePosts = [
            // 산책/모임 게시판 (meetups) - 5개
            {
                boardKey: 'meetups',
                title: '한강공원 주말 산책모임 (소형견) 🐕',
                content: `소형견 주말 산책모임을 만들어요!

일시: 매주 토요일 오전 10시
장소: 여의도 한강공원
대상: 소형견 (10kg 이하)

현재 멤버: 5명
- 말티즈 2마리
- 포메라니안 1마리
- 요크셔테리어 2마리

함께 산책하며 정보도 나누고 친목도 다져요!
관심 있으신 분 댓글 남겨주세요.

카톡방: https://open.kakao.com/o/xxxxx`,
                authorId: users[0].id
            },
            {
                boardKey: 'meetups',
                title: '올림픽공원 대형견 산책모임 🦮',
                content: `대형견 산책모임 멤버를 모집합니다!

일시: 매주 일요일 오후 3시
장소: 올림픽공원 평화의 광장
대상: 대형견 (20kg 이상)

현재 멤버:
- 골든리트리버 3마리
- 래브라도 2마리
- 허스키 1마리

넓은 공간에서 자유롭게 뛰어놀 수 있어요!
사회성 훈련에도 도움됩니다.

연락처: 010-8888-2222`,
                authorId: users[1] ? users[1].id : users[0].id
            },
            {
                boardKey: 'meetups',
                title: '남산 야간 산책모임 (중형견) 🌙',
                content: `남산에서 야간 산책하실 분 모집해요!

일시: 매주 화, 목 오후 8시
장소: 남산 순환로
대상: 중형견 (10-20kg)
소요시간: 약 1시간

야경도 보고 운동도 하고 일석이조!
LED 목줄 필수입니다.

현재 4명 모였고 2명 더 모집해요.
댓글로 연락주세요!`,
                authorId: users[2] ? users[2].id : users[0].id
            },
            {
                boardKey: 'meetups',
                title: '뚝섬공원 강아지 사회화 모임 🎾',
                content: `강아지 사회화 훈련 모임입니다.

일시: 매주 수요일 오후 4시
장소: 뚝섬한강공원 자유광장
대상: 6개월~2살 강아지

전문 훈련사와 함께하는 사회화 프로그램:
- 다른 강아지와의 만남
- 사람과의 인사법
- 기본 예절 교육

참가비: 1회 2만원
정원: 8마리 (현재 5마리 등록)

연락처: 010-4444-6666`,
                authorId: users[0].id
            },
            {
                boardKey: 'meetups',
                title: '반포한강공원 새벽 조깅모임 🏃‍♂️',
                content: `반려견과 함께하는 새벽 조깅모임!

일시: 매일 오전 6시 (주말 제외)
장소: 반포한강공원 세빛섬 앞
거리: 약 3km
소요시간: 30분

건강한 하루의 시작을 반려견과 함께해요!
조깅 가능한 견종만 참여 부탁드립니다.

현재 멤버: 12명
- 보더콜리, 웰시코기, 비글 등

카톡방 참여: 010-9999-3333`,
                authorId: users[1] ? users[1].id : users[0].id
            },

            // 펫 동반 장소 후기 (reviews) - 5개
            {
                boardKey: 'reviews',
                title: '제주도 펜션 "바다뷰" 후기 (반려견 동반) 🏖️',
                content: `제주도 여행에서 반려견과 함께 머물렀던 펜션 후기입니다.

펜션명: 바다뷰 펜션
위치: 제주시 애월읍
기간: 2박 3일
동반견: 말티즈 2마리

장점:
✅ 바다 전망이 정말 좋음
✅ 펜션 앞마당에서 자유롭게 뛰어놀 수 있음
✅ 근처에 반려견 동반 카페 많음
✅ 사장님이 반려견을 매우 좋아하심
✅ 펜션 내 반려견 용품 구비

단점:
❌ 주변이 조금 외진 곳
❌ 근처 마트까지 차로 10분

전체적으로 만족스러운 여행이었어요!
반려견과 제주도 여행 계획 있으신 분들께 추천합니다.

평점: ⭐⭐⭐⭐⭐`,
                authorId: users[0].id
            },
            {
                boardKey: 'reviews',
                title: '경주 불국사 근처 펜션 후기 🏛️',
                content: `경주 여행에서 반려견과 함께 머물렀던 펜션 후기입니다.

펜션명: 경주 한옥펜션
위치: 경주시 불국사 근처
기간: 1박 2일
동반견: 골든리트리버 1마리

장점:
✅ 전통 한옥 스타일로 분위기 좋음
✅ 마당이 넓어서 대형견도 OK
✅ 불국사까지 도보 15분
✅ 주인분이 친절하심
✅ 반려견 전용 수건, 그릇 제공

단점:
❌ 한옥 특성상 방음이 잘 안됨
❌ 에어컨이 약간 오래된 느낌

문화재 관람은 반려견 동반이 어려워서
펜션에서 휴식 위주로 보냈어요.

평점: ⭐⭐⭐⭐`,
                authorId: users[1] ? users[1].id : users[0].id
            },
            {
                boardKey: 'reviews',
                title: '강릉 바다 펜션 "오션뷰" 솔직후기 🌊',
                content: `강릉 바다 앞 펜션에서 반려견과 함께한 후기입니다.

펜션명: 오션뷰 펜션
위치: 강릉시 사천면
기간: 2박 3일
동반견: 웰시코기 1마리

장점:
✅ 바로 앞이 바다라 산책하기 좋음
✅ 펜션 테라스에서 바다뷰 감상
✅ 근처 해변에서 반려견과 뛰어놀기 가능
✅ 펜션 시설이 깔끔함
✅ 바베큐 시설 이용 가능

단점:
❌ 성수기라 가격이 비쌈
❌ 주변 식당 중 반려견 동반 가능한 곳이 적음
❌ 바람이 강해서 소형견은 주의 필요

바다를 좋아하는 반려견이라면 추천!
다음에도 또 가고 싶어요.

평점: ⭐⭐⭐⭐⭐`,
                authorId: users[2] ? users[2].id : users[0].id
            },
            {
                boardKey: 'reviews',
                title: '남이섬 펜션 "자연속으로" 후기 🍃',
                content: `남이섬 근처 펜션에서 반려견과 함께한 1박 2일 후기입니다.

펜션명: 자연속으로 펜션
위치: 가평군 남이섬 근처
기간: 1박 2일
동반견: 비글 1마리

장점:
✅ 남이섬까지 차로 5분 거리
✅ 펜션 주변이 자연환경이 좋음
✅ 산책로가 잘 되어 있음
✅ 펜션 사장님이 반려견 키우셔서 이해도가 높음
✅ 근처에 반려견 동반 카페 있음

단점:
❌ 남이섬 자체는 반려견 입장 제한
❌ 겨울이라 좀 추웠음
❌ 주변에 편의점이 멀음

남이섬은 못 들어가지만 주변 산책만으로도 충분히 좋았어요!

평점: ⭐⭐⭐⭐`,
                authorId: users[0].id
            },
            {
                boardKey: 'reviews',
                title: '부산 해운대 펜션 "씨사이드" 후기 🏖️',
                content: `부산 해운대에서 반려견과 함께한 펜션 후기입니다.

펜션명: 씨사이드 펜션
위치: 부산 해운대구
기간: 3박 4일
동반견: 포메라니안 2마리

장점:
✅ 해운대 해수욕장까지 도보 3분
✅ 펜션 옥상에서 바다 전망 끝내줌
✅ 해운대 시장, 카페거리 접근성 좋음
✅ 펜션 내부가 깔끔하고 모던함
✅ 반려견 동반 식당 정보 제공

단점:
❌ 성수기라 사람이 너무 많음
❌ 해변에서 반려견 산책 시 주의 필요
❌ 주차 공간이 협소함

도시적인 바다 여행을 원한다면 추천!
다양한 먹거리와 볼거리가 많아요.

평점: ⭐⭐⭐⭐`,
                authorId: users[1] ? users[1].id : users[0].id
            }
        ];

        // 게시글 생성
        for (const postData of samplePosts) {
            await CommunityPost.create(postData);
            console.log(`게시글 생성: ${postData.title}`);
        }

        console.log(`총 ${samplePosts.length}개의 샘플 게시글이 생성되었습니다!`);
        console.log('- meetups: 5개');
        console.log('- reviews: 5개');

    } catch (error) {
        console.error('샘플 게시글 생성 실패:', error);
    } finally {
        process.exit(0);
    }
};

createMeetupsAndReviewsPosts();