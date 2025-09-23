const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
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
    PetSupply,
    testConnection,
    syncDatabase,
    Op // Import Op for advanced queries
} = require('./database-sqlite');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'your_secret_key';

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 데이터베이스 초기화 및 기본 데이터 생성
const initializeDatabase = async () => {
    try {
        await testConnection();
        await syncDatabase();
        
        // 기본 관리자 계정 생성
        const existingAdmin = await AdminUser.findOne({ where: { username: 'admin' } });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await AdminUser.create({
                username: 'admin',
                password: hashedPassword,
                email: 'admin@petcare.com',
                role: 'admin'
            });
            console.log('기본 관리자 계정 생성 완료 (username: admin, password: admin123)');
        }
        
        console.log('데이터베이스 초기화 완료');
    } catch (error) {
        console.error('데이터베이스 초기화 실패:', error);
    }
};

// --- Public Product API ---
app.get('/api/products', async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let whereClause = {};
        if (search) {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } },
                    { category: { [Op.like]: `%${search}%` } },
                    { brand: { [Op.like]: `%${search}%` } },
                ]
            };
        }

        const { count, rows } = await Product.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: offset,
            order: [['createdAt', 'DESC']], // 최신순 정렬
        });

        res.json({
            success: true,
            data: {
                products: rows,
                pagination: {
                    total_products: count,
                    current_page: parseInt(page),
                    per_page: parseInt(limit),
                    total_pages: Math.ceil(count / parseInt(limit)),
                },
            },
        });
    } catch (error) {
        console.error('제품 조회 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = await Product.findByPk(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('제품 상세 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// --- Public APIs for other services ---

app.get('/api/grooming', async (req, res) => {
    try {
        const groomingServices = await GroomingService.findAll();
        res.json(groomingServices);
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/api/grooming/:id', async (req, res) => {
    try {
        const service = await GroomingService.findByPk(parseInt(req.params.id));
        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ message: 'Grooming service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/api/hospital', async (req, res) => {
    try {
        const hospitals = await Hospital.findAll();
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/api/hospital/:id', async (req, res) => {
    try {
        const hospital = await Hospital.findByPk(parseInt(req.params.id));
        if (hospital) {
            res.json(hospital);
        } else {
            res.status(404).json({ message: 'Hospital not found' });
        }
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/api/cafe', async (req, res) => {
    try {
        const cafes = await Cafe.findAll();
        res.json(cafes);
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/api/cafe/:id', async (req, res) => {
    try {
        const cafe = await Cafe.findByPk(parseInt(req.params.id));
        if (cafe) {
            res.json(cafe);
        } else {
            res.status(404).json({ message: 'Cafe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/api/hotel', async (req, res) => {
    try {
        const hotels = await Hotel.findAll();
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/api/hotel/:id', async (req, res) => {
    try {
        const hotel = await Hotel.findByPk(parseInt(req.params.id));
        if (hotel) {
            res.json(hotel);
        } else {
            res.status(404).json({ message: 'Hotel not found' });
        }
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// --- Admin Login Route ---
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const adminUser = await AdminUser.findOne({ where: { username } });

        if (!adminUser) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, adminUser.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: adminUser.id, username: adminUser.username, role: 'admin' },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (error) {
        console.error('관리자 로그인 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// --- Middleware to Protect Admin Routes ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- Admin API Routes are now handled by routes/admin.js ---



// All admin routes are now handled by routes/admin.js

// --- User Authentication API ---
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { nickname, email, password } = req.body;
        
        // 입력 검증
        if (!nickname || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: '모든 필드를 입력해주세요.' 
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: '비밀번호는 6글자 이상이어야 합니다.' 
            });
        }
        
        // 이메일 중복 확인
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: '이미 존재하는 이메일입니다.' 
            });
        }
        
        // 사용자명 중복 확인
        const existingUsername = await User.findOne({ where: { username: nickname } });
        if (existingUsername) {
            return res.status(400).json({ 
                success: false, 
                message: '이미 존재하는 닉네임입니다.' 
            });
        }
        
        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 사용자 생성
        const newUser = await User.create({
            username: nickname,
            email,
            password: hashedPassword,
            role: 'user'
        });
        
        // JWT 토큰 생성
        const token = jwt.sign(
            { 
                id: newUser.id, 
                username: newUser.username, 
                email: newUser.email,
                role: newUser.role 
            },
            SECRET_KEY,
            { expiresIn: '7d' }
        );
        
        // 비밀번호 제외하고 응답
        const { password: _, ...userWithoutPassword } = newUser.toJSON();
        
        res.status(201).json({
            success: true,
            message: '회원가입이 완료되었습니다.',
            data: {
                user: userWithoutPassword,
                token
            }
        });
        
    } catch (error) {
        console.error('회원가입 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 입력 검증
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: '이메일과 비밀번호를 입력해주세요.' 
            });
        }
        
        // 사용자 찾기
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: '존재하지 않는 이메일입니다.' 
            });
        }
        
        // 비밀번호 확인
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false, 
                message: '비밀번호가 일치하지 않습니다.' 
            });
        }
        
        // JWT 토큰 생성
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                email: user.email,
                role: user.role 
            },
            SECRET_KEY,
            { expiresIn: '7d' }
        );
        
        // 비밀번호 제외하고 응답
        const { password: _, ...userWithoutPassword } = user.toJSON();
        
        res.json({
            success: true,
            message: '로그인 성공',
            data: {
                user: userWithoutPassword,
                token
            }
        });
        
    } catch (error) {
        console.error('로그인 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// 토큰 검증 API
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: '사용자를 찾을 수 없습니다.' 
            });
        }
        
        res.json({
            success: true,
            data: { user }
        });
        
    } catch (error) {
        console.error('토큰 검증 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '서버 오류가 발생했습니다.' 
        });
    }
});

// Start the server
const startServer = async () => {
    await initializeDatabase();
    try {
        // --- Community API ---
        const communityRoutes = require('./routes/community');
        app.use('/api/community', communityRoutes);

        // --- Accommodation API ---
        const accommodationRoutes = require('./routes/accommodation');
        app.use('/api/accommodation', accommodationRoutes);

        // --- Pet Supplies API ---
        const petSuppliesRoutes = require('./routes/petSupplies');
        app.use('/api/pet-supplies', petSuppliesRoutes);

        // --- Support (Customer Service) API ---
        const supportRoutes = require('./routes/support');
        app.use('/api/support', supportRoutes);

        // Admin routes from external file
        const adminRoutes = require('./routes/admin');
        app.use('/api/admin', adminRoutes);

        // Admin support routes
        const adminSupportRoutes = require('./routes/admin-support');
        app.use('/api/admin/support', adminSupportRoutes);

        // 404 handler - 모든 라우트 등록 후에 배치
        app.use((req, res, next) => {
            res.status(404).json({ 
                success: false, 
                message: '요청한 리소스를 찾을 수 없습니다.' 
            });
        });

        // Global error handler
        app.use((err, req, res, next) => {
            console.error('서버 오류:', err);
            res.status(500).json({ 
                success: false, 
                message: '서버 내부 오류가 발생했습니다.',
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        });

        app.listen(PORT, () => {
            console.log(`✅ SQLite 기반 서버가 포트 ${PORT}에서 실행 중입니다.`);
            console.log(`📊 관리자 페이지: http://localhost:5173/admin/login`);
            console.log(`🏠 메인 페이지: http://localhost:5173`);
            console.log(`📝 기본 관리자 계정: admin / admin123`);
        });
    } catch (error) {
        console.error('❌ 서버 시작 실패:', error);
        process.exit(1);
    }
};


startServer();