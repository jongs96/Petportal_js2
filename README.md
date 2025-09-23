# PetCare - 반려동물 종합 케어 플랫폼

반려동물을 위한 종합 케어 서비스 플랫폼입니다. 미용, 병원, 호텔, 카페 등 다양한 서비스를 제공하며, 관리자 시스템과 커뮤니티 기능을 포함합니다.

## 주요 기능

- 🏥 **병원 찾기**: 반려동물 병원 검색 및 예약
- ✂️ **미용 서비스**: 펫 미용샵 예약 및 관리
- 🏨 **숙박 서비스**: 반려동물 동반 숙소 예약
- ☕ **카페 정보**: 펫 프렌들리 카페 찾기
- 🛒 **쇼핑몰**: 반려동물 용품 구매
- 💬 **커뮤니티**: 반려동물 관련 정보 공유

## 환경 설정

### 1. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 카카오맵 API 키 (필수)
VITE_KAKAO_JS_KEY=your_kakao_api_key_here
```

### 2. 카카오맵 API 키 발급 방법

1. [카카오 개발자 콘솔](https://developers.kakao.com/)에 접속
2. 애플리케이션 생성 또는 기존 앱 선택
3. **플랫폼 설정** → **Web 플랫폼 등록**
4. 사이트 도메인 추가:
   - 개발: `http://localhost:5173`
   - 배포: 실제 도메인 주소
5. **JavaScript 키**를 복사하여 `.env` 파일에 설정

### 3. 설치 및 실행

#### 서버 실행 (먼저 실행)
```bash
cd server
npm install          # 의존성 설치 (처음 실행 시)
npm run init-data    # 기본 데이터 생성 (처음 실행 시)
npm start           # 서버 시작 (http://localhost:3001)
```

#### 프론트엔드 실행
```bash
npm install         # 의존성 설치 (처음 실행 시)
npm run dev        # 개발 서버 시작 (http://localhost:5173)
```

## 기술 스택

### Frontend
- React 18 + Vite
- React Router
- Axios
- CSS Modules

### Backend
- Node.js + Express
- SQLite (Sequelize ORM)
- JWT 인증
- bcryptjs

### 지도 서비스
- 카카오맵 API
- 대체 지도 뷰 (API 연결 실패 시)

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── admin/          # 관리자 페이지 컴포넌트
│   ├── common/         # 공통 컴포넌트 (지도, 페이지네이션 등)
│   ├── community/      # 커뮤니티 관련 컴포넌트
│   └── ui/            # UI 컴포넌트 (버튼, 입력 등)
├── pages/              # 페이지 컴포넌트
├── contexts/           # React Context
├── hooks/              # 커스텀 훅
├── utils/              # 유틸리티 함수
└── data/              # 목업 데이터

server/
├── routes/             # API 라우트
├── models/             # 데이터베이스 모델
├── data/              # 초기 데이터
└── database-sqlite.js  # 데이터베이스 설정
```

## 관리자 기능

관리자 계정으로 로그인하여 다음 기능을 사용할 수 있습니다:

- 사용자 관리
- 상품 관리
- 숙소 관리 (가격, 위치 정보 포함)
- 커뮤니티 게시글/댓글 관리
- 각종 서비스 업체 정보 관리

## 🔑 기본 계정 정보

### 관리자 계정
- **URL**: http://localhost:5173/admin/login
- **아이디**: admin
- **비밀번호**: admin123

### 테스트 사용자 계정
- **이메일**: test1@example.com
- **비밀번호**: password123

## 문제 해결

### 카카오맵이 로드되지 않는 경우

1. `.env` 파일의 API 키 확인
2. 카카오 개발자 콘솔에서 도메인 설정 확인
3. API 키가 없어도 대체 지도 뷰가 표시됩니다

### 데이터베이스 초기화

```bash
cd server
node import-accommodation-data.js  # 숙소 데이터 초기화
```
