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
    testConnection,
    syncDatabase
} = require('./database-mysql');

// Import community routes
const communityRoutes = require('./routes/community');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'your_secret_key'; // Change this in production

// Middleware
app.use(bodyParser.json());
app.use(cors());

// 데이터베이스 연결 및 초기화
const initializeDatabase = async () => {
    try {
        await testConnection();
        await syncDatabase();
        console.log('데이터베이스 초기화 완료');
    } catch (error) {
        console.error('데이터베이스 초기화 실패:', error);
        process.exit(1);
    }
};

// --- Public Product API ---
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        console.error('제품 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
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

// Use community routes
app.use('/api/community', communityRoutes);

// --- Public Accommodation API ---
app.get('/api/accommodation', async (req, res) => {
    try {
        const accommodations = await Accommodation.findAll();
        res.json(accommodations);
    } catch (error) {
        console.error('숙박 시설 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/api/accommodation/:id', async (req, res) => {
    try {
        const accommodationId = parseInt(req.params.id);
        const accommodation = await Accommodation.findByPk(accommodationId);
        if (accommodation) {
            res.json(accommodation);
        } else {
            res.status(404).json({ message: 'Accommodation not found' });
        }
    } catch (error) {
        console.error('숙박 시설 상세 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// --- Public Grooming API ---
app.get('/api/grooming', async (req, res) => {
    try {
        const groomingServices = await GroomingService.findAll();
        res.json(groomingServices);
    } catch (error) {
        console.error('미용 서비스 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/api/grooming/:id', async (req, res) => {
    try {
        const serviceId = parseInt(req.params.id);
        const service = await GroomingService.findByPk(serviceId);
        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ message: 'Grooming service not found' });
        }
    } catch (error) {
        console.error('미용 서비스 상세 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// --- Public Hospital API ---
app.get('/api/hospital', async (req, res) => {
    try {
        const hospitals = await Hospital.findAll();
        res.json(hospitals);
    } catch (error) {
        console.error('병원 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/api/hospital/:id', async (req, res) => {
    try {
        const hospitalId = parseInt(req.params.id);
        const hospital = await Hospital.findByPk(hospitalId);
        if (hospital) {
            res.json(hospital);
        } else {
            res.status(404).json({ message: 'Hospital not found' });
        }
    } catch (error) {
        console.error('병원 상세 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// --- Public Cafe API ---
app.get('/api/cafe', async (req, res) => {
    try {
        const cafes = await Cafe.findAll();
        res.json(cafes);
    } catch (error) {
        console.error('카페 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/api/cafe/:id', async (req, res) => {
    try {
        const cafeId = parseInt(req.params.id);
        const cafe = await Cafe.findByPk(cafeId);
        if (cafe) {
            res.json(cafe);
        } else {
            res.status(404).json({ message: 'Cafe not found' });
        }
    } catch (error) {
        console.error('카페 상세 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// --- Public Hotel API ---
app.get('/api/hotel', async (req, res) => {
    try {
        const hotels = await Hotel.findAll();
        res.json(hotels);
    } catch (error) {
        console.error('호텔 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/api/hotel/:id', async (req, res) => {
    try {
        const hotelId = parseInt(req.params.id);
        const hotel = await Hotel.findByPk(hotelId);
        if (hotel) {
            res.json(hotel);
        } else {
            res.status(404).json({ message: 'Hotel not found' });
        }
    } catch (error) {
        console.error('호텔 상세 조회 오류:', error);
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

// --- User Management API (Protected) ---
app.get('/api/admin/users', authenticateToken, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        console.error('사용자 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/api/admin/users', authenticateToken, async (req, res) => {
    try {
        const { username, password, email, role } = req.body;
        
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            password: hashedPassword,
            email,
            role: role || 'user'
        });

        const { password: _, ...userWithoutPassword } = newUser.toJSON();
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error('사용자 생성 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.put('/api/admin/users/:id', authenticateToken, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { username, password, email, role } = req.body;
        
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updateData = { username, email, role: role || user.role };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await user.update(updateData);
        const { password: _, ...userWithoutPassword } = user.toJSON();
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('사용자 수정 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('사용자 삭제 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// --- Product Management API (Protected) ---
app.get('/api/admin/products', authenticateToken, async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        console.error('제품 관리 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/api/admin/products', authenticateToken, async (req, res) => {
    try {
        const { name, price, description, category, stock, image } = req.body;
        const newProduct = await Product.create({
            name,
            price,
            description,
            category,
            stock,
            image
        });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('제품 생성 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.put('/api/admin/products/:id', authenticateToken, async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const { name, price, description, category, stock, image } = req.body;
        
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.update({ name, price, description, category, stock, image });
        res.json(product);
    } catch (error) {
        console.error('제품 수정 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.delete('/api/admin/products/:id', authenticateToken, async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = await Product.findByPk(productId);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('제품 삭제 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// --- Grooming Management API (Protected) ---
app.get('/api/admin/grooming', authenticateToken, async (req, res) => {
    try {
        const groomingServices = await GroomingService.findAll();
        res.json(groomingServices);
    } catch (error) {
        console.error('미용 서비스 관리 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/api/admin/grooming', authenticateToken, async (req, res) => {
    try {
        const { name, price, description, duration } = req.body;
        const newService = await GroomingService.create({
            name,
            price,
            description,
            duration
        });
        res.status(201).json(newService);
    } catch (error) {
        console.error('미용 서비스 생성 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.put('/api/admin/grooming/:id', authenticateToken, async (req, res) => {
    try {
        const serviceId = parseInt(req.params.id);
        const { name, price, description, duration } = req.body;
        
        const service = await GroomingService.findByPk(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Grooming service not found' });
        }

        await service.update({ name, price, description, duration });
        res.json(service);
    } catch (error) {
        console.error('미용 서비스 수정 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.delete('/api/admin/grooming/:id', authenticateToken, async (req, res) => {
    try {
        const serviceId = parseInt(req.params.id);
        const service = await GroomingService.findByPk(serviceId);
        
        if (!service) {
            return res.status(404).json({ message: 'Grooming service not found' });
        }

        await service.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('미용 서비스 삭제 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// --- Cafe Management API (Protected) ---
app.get('/api/admin/cafe', authenticateToken, async (req, res) => {
    try {
        const cafes = await Cafe.findAll();
        res.json(cafes);
    } catch (error) {
        console.error('카페 관리 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/api/admin/cafe', authenticateToken, async (req, res) => {
    try {
        const { name, address, phone, description, image } = req.body;
        const newCafe = await Cafe.create({
            name,
            address,
            phone,
            description,
            image
        });
        res.status(201).json(newCafe);
    } catch (error) {
        console.error('카페 생성 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.put('/api/admin/cafe/:id', authenticateToken, async (req, res) => {
    try {
        const cafeId = parseInt(req.params.id);
        const { name, address, phone, description, image } = req.body;
        
        const cafe = await Cafe.findByPk(cafeId);
        if (!cafe) {
            return res.status(404).json({ message: 'Cafe not found' });
        }

        await cafe.update({ name, address, phone, description, image });
        res.json(cafe);
    } catch (error) {
        console.error('카페 수정 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.delete('/api/admin/cafe/:id', authenticateToken, async (req, res) => {
    try {
        const cafeId = parseInt(req.params.id);
        const cafe = await Cafe.findByPk(cafeId);
        
        if (!cafe) {
            return res.status(404).json({ message: 'Cafe not found' });
        }

        await cafe.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('카페 삭제 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// --- Accommodation Management API (Protected) ---
app.get('/api/admin/accommodation', authenticateToken, async (req, res) => {
    try {
        const accommodations = await Accommodation.findAll();
        res.json(accommodations);
    } catch (error) {
        console.error('숙박 시설 관리 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/api/admin/accommodation', authenticateToken, async (req, res) => {
    try {
        const { name, type, location, price, description, image } = req.body;
        const newAccommodation = await Accommodation.create({
            name,
            type,
            location,
            price,
            description,
            image
        });
        res.status(201).json(newAccommodation);
    } catch (error) {
        console.error('숙박 시설 생성 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.put('/api/admin/accommodation/:id', authenticateToken, async (req, res) => {
    try {
        const accommodationId = parseInt(req.params.id);
        const { name, type, location, price, description, image } = req.body;
        
        const accommodation = await Accommodation.findByPk(accommodationId);
        if (!accommodation) {
            return res.status(404).json({ message: 'Accommodation not found' });
        }

        await accommodation.update({ name, type, location, price, description, image });
        res.json(accommodation);
    } catch (error) {
        console.error('숙박 시설 수정 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.delete('/api/admin/accommodation/:id', authenticateToken, async (req, res) => {
    try {
        const accommodationId = parseInt(req.params.id);
        const accommodation = await Accommodation.findByPk(accommodationId);
        
        if (!accommodation) {
            return res.status(404).json({ message: 'Accommodation not found' });
        }

        await accommodation.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('숙박 시설 삭제 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// --- Hospital Management API (Protected) ---
app.get('/api/admin/hospital', authenticateToken, async (req, res) => {
    try {
        const hospitals = await Hospital.findAll();
        res.json(hospitals);
    } catch (error) {
        console.error('병원 관리 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/api/admin/hospital', authenticateToken, async (req, res) => {
    try {
        const { name, address, phone, description, specialties } = req.body;
        const newHospital = await Hospital.create({
            name,
            address,
            phone,
            description,
            specialties
        });
        res.status(201).json(newHospital);
    } catch (error) {
        console.error('병원 생성 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.put('/api/admin/hospital/:id', authenticateToken, async (req, res) => {
    try {
        const hospitalId = parseInt(req.params.id);
        const { name, address, phone, description, specialties } = req.body;
        
        const hospital = await Hospital.findByPk(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        await hospital.update({ name, address, phone, description, specialties });
        res.json(hospital);
    } catch (error) {
        console.error('병원 수정 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.delete('/api/admin/hospital/:id', authenticateToken, async (req, res) => {
    try {
        const hospitalId = parseInt(req.params.id);
        const hospital = await Hospital.findByPk(hospitalId);
        
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        await hospital.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('병원 삭제 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// --- Hotel Management API (Protected) ---
app.get('/api/admin/hotel', authenticateToken, async (req, res) => {
    try {
        const hotels = await Hotel.findAll();
        res.json(hotels);
    } catch (error) {
        console.error('호텔 관리 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/api/admin/hotel', authenticateToken, async (req, res) => {
    try {
        const { name, address, price, description, image } = req.body;
        const newHotel = await Hotel.create({
            name,
            address,
            price,
            description,
            image
        });
        res.status(201).json(newHotel);
    } catch (error) {
        console.error('호텔 생성 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.put('/api/admin/hotel/:id', authenticateToken, async (req, res) => {
    try {
        const hotelId = parseInt(req.params.id);
        const { name, address, price, description, image } = req.body;
        
        const hotel = await Hotel.findByPk(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        await hotel.update({ name, address, price, description, image });
        res.json(hotel);
    } catch (error) {
        console.error('호텔 수정 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.delete('/api/admin/hotel/:id', authenticateToken, async (req, res) => {
    try {
        const hotelId = parseInt(req.params.id);
        const hotel = await Hotel.findByPk(hotelId);
        
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        await hotel.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('호텔 삭제 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// --- Community Management API (Protected) ---
app.get('/api/admin/community/posts', authenticateToken, async (req, res) => {
    try {
        const posts = await CommunityPost.findAll({
            include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(posts);
    } catch (error) {
        console.error('커뮤니티 게시글 관리 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/api/admin/community/posts', authenticateToken, async (req, res) => {
    try {
        const { title, content, authorId } = req.body;
        const newPost = await CommunityPost.create({
            title,
            content,
            authorId
        });
        res.status(201).json(newPost);
    } catch (error) {
        console.error('커뮤니티 게시글 생성 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.put('/api/admin/community/posts/:id', authenticateToken, async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const { title, content } = req.body;
        
        const post = await CommunityPost.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await post.update({ title, content });
        res.json(post);
    } catch (error) {
        console.error('커뮤니티 게시글 수정 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.delete('/api/admin/community/posts/:id', authenticateToken, async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const post = await CommunityPost.findByPk(postId);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await post.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('커뮤니티 게시글 삭제 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// --- Community Comments Management API (Protected) ---
app.get('/api/admin/community/comments', authenticateToken, async (req, res) => {
    try {
        const comments = await CommunityComment.findAll({
            include: [
                { model: User, as: 'author', attributes: ['id', 'username'] },
                { model: CommunityPost, as: 'post', attributes: ['id', 'title'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(comments);
    } catch (error) {
        console.error('커뮤니티 댓글 관리 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/api/admin/community/posts/:postId/comments', authenticateToken, async (req, res) => {
    try {
        const postId = parseInt(req.params.postId);
        const comments = await CommunityComment.findAll({
            where: { postId },
            include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
            order: [['createdAt', 'ASC']]
        });
        res.json(comments);
    } catch (error) {
        console.error('특정 게시글 댓글 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/api/admin/community/posts/:postId/comments', authenticateToken, async (req, res) => {
    try {
        const postId = parseInt(req.params.postId);
        const { content, authorId, parentCommentId } = req.body;
        
        const newComment = await CommunityComment.create({
            postId,
            content,
            authorId,
            parentCommentId: parentCommentId || null
        });
        res.status(201).json(newComment);
    } catch (error) {
        console.error('커뮤니티 댓글 생성 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.put('/api/admin/community/comments/:id', authenticateToken, async (req, res) => {
    try {
        const commentId = parseInt(req.params.id);
        const { content } = req.body;
        
        const comment = await CommunityComment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        await comment.update({ content });
        res.json(comment);
    } catch (error) {
        console.error('커뮤니티 댓글 수정 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.delete('/api/admin/community/comments/:id', authenticateToken, async (req, res) => {
    try {
        const commentId = parseInt(req.params.id);
        const comment = await CommunityComment.findByPk(commentId);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        await comment.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('커뮤니티 댓글 삭제 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// --- Dashboard Route ---
app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
    res.json({ message: `Welcome to the admin dashboard, ${req.user.username}!` });
});

// --- Start the server ---
const startServer = async () => {
    await initializeDatabase();
    try {
        app.listen(PORT, () => {
            console.log(`MySQL 기반 서버가 포트 ${PORT}에서 실행 중입니다.`);
        });
    } catch (error) {
        console.error('서버 시작 실패:', error);
        process.exit(1);
    }
};

startServer();