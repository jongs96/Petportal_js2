const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { Op } = require('sequelize');
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
} = require('./database-sqlite');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'your_secret_key';

// Middleware
app.use(bodyParser.json());
app.use(cors());

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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        let whereClause = {};
        if (search) {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } },
                    { category: { [Op.like]: `%${search}%` } },
                    { brand: { [Op.like]: `%${search}%` } },
                    { material: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where: whereClause,
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            data: products,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: limit
            }
        });
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

// --- Public APIs for other services ---
app.get('/api/accommodation', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        let whereClause = {};
        if (search) {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { location: { [Op.like]: `%${search}%` } },
                    { type: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const { count, rows: accommodations } = await Accommodation.findAndCountAll({
            where: whereClause,
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            data: accommodations,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/api/accommodation/:id', async (req, res) => {
    try {
        const accommodation = await Accommodation.findByPk(parseInt(req.params.id));
        if (accommodation) {
            res.json(accommodation);
        } else {
            res.status(404).json({ message: 'Accommodation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.get('/api/grooming', async (req, res) => {
    try {
        const groomingServices = await GroomingService.findAll();
        res.json({
            data: groomingServices,
            pagination: {
                currentPage: 1,
                totalPages: 1,
                totalItems: groomingServices.length,
                itemsPerPage: groomingServices.length
            }
        });
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        let whereClause = {};
        if (search) {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { address: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } },
                    { phone: { [Op.like]: `%${search}%` } },
                    { category: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const { count, rows: hospitals } = await Hospital.findAndCountAll({
            where: whereClause,
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            data: hospitals,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: limit
            }
        });
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        let whereClause = {};
        if (search) {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { address: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const { count, rows: cafes } = await Cafe.findAndCountAll({
            where: whereClause,
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            data: cafes,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: limit
            }
        });
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        let whereClause = {};
        if (search) {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { address: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } },
                    { phone: { [Op.like]: `%${search}%` } },
                    { category: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const { count, rows: hotels } = await Hotel.findAndCountAll({
            where: whereClause,
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            data: hotels,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                itemsPerPage: limit
            }
        });
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

// --- Admin API Routes ---
// User Management
app.get('/api/admin/users', authenticateToken, async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (error) {
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
        const newUser = await User.create({ username, password: hashedPassword, email, role: role || 'user' });
        const { password: _, ...userWithoutPassword } = newUser.toJSON();
        res.status(201).json(userWithoutPassword);
    } catch (error) {
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
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// Product Management
app.get('/api/admin/products', authenticateToken, async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/api/admin/products', authenticateToken, async (req, res) => {
    try {
        const { name, price, description, category, stock, image } = req.body;
        const newProduct = await Product.create({ name, price, description, category, stock, image });
        res.status(201).json(newProduct);
    } catch (error) {
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
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// Cafe Management
app.get('/api/admin/cafe', authenticateToken, async (req, res) => {
    try {
        const cafes = await Cafe.findAll();
        res.json(cafes);
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/api/admin/cafe', authenticateToken, async (req, res) => {
    try {
        const { name, address, phone, description, image } = req.body;
        const newCafe = await Cafe.create({ name, address, phone, description, image });
        res.status(201).json(newCafe);
    } catch (error) {
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
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// Similar implementations for other services (accommodation, hospital, hotel, grooming)
// [동일한 패턴으로 다른 서비스들도 구현]

app.get('/api/admin/accommodation', authenticateToken, async (req, res) => {
    try {
        const accommodations = await Accommodation.findAll();
        res.json(accommodations);
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/api/admin/accommodation', authenticateToken, async (req, res) => {
    try {
        const { name, type, location, price, description, image } = req.body;
        const newAccommodation = await Accommodation.create({ name, type, location, price, description, image });
        res.status(201).json(newAccommodation);
    } catch (error) {
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
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// Hospital Management
app.get('/api/admin/hospital', authenticateToken, async (req, res) => {
    try {
        const hospitals = await Hospital.findAll();
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/api/admin/hospital', authenticateToken, async (req, res) => {
    try {
        const { name, address, phone, description, specialties } = req.body;
        const newHospital = await Hospital.create({ name, address, phone, description, specialties });
        res.status(201).json(newHospital);
    } catch (error) {
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
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// Hotel Management
app.get('/api/admin/hotel', authenticateToken, async (req, res) => {
    try {
        const hotels = await Hotel.findAll();
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/api/admin/hotel', authenticateToken, async (req, res) => {
    try {
        const { name, address, price, description, image } = req.body;
        const newHotel = await Hotel.create({ name, address, price, description, image });
        res.status(201).json(newHotel);
    } catch (error) {
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
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// Grooming Management
app.get('/api/admin/grooming', authenticateToken, async (req, res) => {
    try {
        const groomingServices = await GroomingService.findAll();
        res.json(groomingServices);
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/api/admin/grooming', authenticateToken, async (req, res) => {
    try {
        const { name, price, description, duration } = req.body;
        const newService = await GroomingService.create({ name, price, description, duration });
        res.status(201).json(newService);
    } catch (error) {
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
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// Community Management
app.get('/api/admin/community/posts', authenticateToken, async (req, res) => {
    try {
        const posts = await CommunityPost.findAll({
            include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/api/admin/community/posts', authenticateToken, async (req, res) => {
    try {
        const { title, content, authorId } = req.body;
        const newPost = await CommunityPost.create({ title, content, authorId });
        res.status(201).json(newPost);
    } catch (error) {
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
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// Comments
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
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// Dashboard Route
app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
    res.json({ message: `Welcome to the admin dashboard, ${req.user.username}!` });
});

// Admin routes from external file
const adminRoutes = require('./routes/admin');
app.use('/api/admin', (req, res, next) => {
    adminRoutes(req, res, next);
});

// Start the server
const startServer = async () => {
    await initializeDatabase();
    try {
        app.listen(PORT, () => {
            // --- Community API ---
            // Move route setup inside here to ensure DB is ready
            const communityRoutes = require('./routes/community');
            app.use('/api/community', communityRoutes);

            console.log(`SQLite 기반 서버가 포트 ${PORT}에서 실행 중입니다.`);
        });
    } catch (error) {
        console.error('서버 시작 실패:', error);
        process.exit(1);
    }
};


startServer();