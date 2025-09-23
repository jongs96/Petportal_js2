const express = require('express');
const router = express.Router();
const { User, CommunityPost, Accommodation, PetSupply, Op } = require('../database-sqlite.js');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// Admin authentication middleware
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

// Middleware to ensure user is an admin
const ensureAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
};

// All routes in this file are protected and require admin privileges
router.use(authenticateToken);
router.use(ensureAdmin);

// 사용자 목록 조회
router.get('/users', async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        
        let whereClause = {};
        if (search) {
            whereClause[Op.or] = [
                { username: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await User.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: offset,
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['password'] }
        });

        res.json({
            success: true,
            data: rows,
            pagination: {
                totalPages: Math.ceil(count / parseInt(limit)),
                currentPage: parseInt(page),
                totalUsers: count,
                page: parseInt(page),
                limit: parseInt(limit)
            },
            // 하위 호환성을 위해 기존 형태도 유지
            users: rows,
            totalPages: Math.ceil(count / parseInt(limit)),
            currentPage: parseInt(page),
            totalUsers: count
        });
    } catch (error) {
        console.error('사용자 조회 실패:', error);
        res.status(500).json({ 
            success: false, 
            error: '사용자 조회에 실패했습니다.',
            message: error.message 
        });
    }
});

router.post('/users', async (req, res) => {
    try {
        // In a real app, you'd hash the password
        const newUser = await User.create(req.body);
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create user.' });
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const [updated] = await User.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedUser = await User.findByPk(req.params.id);
            res.json({ success: true, data: updatedUser });
        } else {
            res.status(404).json({ success: false, message: 'User not found.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update user.' });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const deleted = await User.destroy({ where: { id: req.params.id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ success: false, message: 'User not found.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete user.' });
    }
});

// 비밀번호 초기화 API
router.post('/users/reset-passwords', async (req, res) => {
    try {
        const { userIds, newPassword } = req.body;
        
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ success: false, message: '사용자 ID 목록이 필요합니다.' });
        }
        
        if (!newPassword) {
            return res.status(400).json({ success: false, message: '새 비밀번호가 필요합니다.' });
        }
        
        // 비밀번호 암호화
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // 선택된 사용자들의 비밀번호 업데이트
        const [updatedCount] = await User.update(
            { password: hashedPassword },
            { where: { id: userIds } }
        );
        
        res.json({ 
            success: true, 
            message: `${updatedCount}명의 사용자 비밀번호가 초기화되었습니다.`,
            updatedCount 
        });
        
    } catch (error) {
        console.error('비밀번호 초기화 오류:', error);
        res.status(500).json({ success: false, message: '비밀번호 초기화에 실패했습니다.' });
    }
});

// Product Management routes removed - merged into Pet Supplies Management

// --- Community Post Management ---
router.get('/community/posts', async (req, res) => {
    try {
        const posts = await CommunityPost.findAll({ include: [{ model: User, as: 'author' }] });
        res.json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch posts.' });
    }
});

router.post('/community/posts', async (req, res) => {
    try {
        const newPost = await CommunityPost.create(req.body);
        res.status(201).json({ success: true, data: newPost });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create post.' });
    }
});

router.put('/community/posts/:id', async (req, res) => {
    try {
        const [updated] = await CommunityPost.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedPost = await CommunityPost.findByPk(req.params.id);
            res.json({ success: true, data: updatedPost });
        } else {
            res.status(404).json({ success: false, message: 'Post not found.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update post.' });
    }
});

router.delete('/community/posts/:id', async (req, res) => {
    try {
        const deleted = await CommunityPost.destroy({ where: { id: req.params.id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ success: false, message: 'Post not found.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete post.' });
    }
});

// --- Accommodation Management ---
router.get('/accommodation', async (req, res) => {
    try {
        const accommodations = await Accommodation.findAll();
        res.json({ success: true, data: accommodations });
    } catch (error) {
        console.error('Failed to fetch accommodations:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch accommodations.' });
    }
});

router.post('/accommodation', async (req, res) => {
    try {
        // JSON 배열 필드들을 문자열로 변환
        const accommodationData = { ...req.body };
        if (accommodationData.images && Array.isArray(accommodationData.images)) {
            accommodationData.images = JSON.stringify(accommodationData.images);
        }
        if (accommodationData.tags && Array.isArray(accommodationData.tags)) {
            accommodationData.tags = JSON.stringify(accommodationData.tags);
        }
        
        const newAccommodation = await Accommodation.create(accommodationData);
        res.status(201).json({ success: true, data: newAccommodation });
    } catch (error) {
        console.error('Failed to create accommodation:', error);
        res.status(500).json({ success: false, message: 'Failed to create accommodation.' });
    }
});

router.put('/accommodation/:id', async (req, res) => {
    try {
        // JSON 배열 필드들을 문자열로 변환
        const accommodationData = { ...req.body };
        if (accommodationData.images && Array.isArray(accommodationData.images)) {
            accommodationData.images = JSON.stringify(accommodationData.images);
        }
        if (accommodationData.tags && Array.isArray(accommodationData.tags)) {
            accommodationData.tags = JSON.stringify(accommodationData.tags);
        }
        
        const [updated] = await Accommodation.update(accommodationData, { where: { id: req.params.id } });
        if (updated) {
            const updatedAccommodation = await Accommodation.findByPk(req.params.id);
            res.json({ success: true, data: updatedAccommodation });
        } else {
            res.status(404).json({ success: false, message: 'Accommodation not found.' });
        }
    } catch (error) {
        console.error('Failed to update accommodation:', error);
        res.status(500).json({ success: false, message: 'Failed to update accommodation.' });
    }
});

router.delete('/accommodation/:id', async (req, res) => {
    try {
        const deleted = await Accommodation.destroy({ where: { id: req.params.id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ success: false, message: 'Accommodation not found.' });
        }
    } catch (error) {
        console.error('Failed to delete accommodation:', error);
        res.status(500).json({ success: false, message: 'Failed to delete accommodation.' });
    }
});

// --- Pet Supplies Management ---
router.get('/pet-supplies', async (req, res) => {
    try {
        const { page = 1, limit = 10, category, search } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        
        let whereClause = {};
        if (category) {
            whereClause.category = category;
        }
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await PetSupply.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                products: rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: count,
                    totalPages: Math.ceil(count / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('반려용품 조회 실패:', error);
        res.status(500).json({ success: false, message: '반려용품 조회에 실패했습니다.' });
    }
});

router.post('/pet-supplies', async (req, res) => {
    try {
        const newProduct = await PetSupply.create(req.body);
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error('반려용품 생성 실패:', error);
        res.status(500).json({ success: false, message: '반려용품 생성에 실패했습니다.' });
    }
});

router.put('/pet-supplies/:id', async (req, res) => {
    try {
        const [updated] = await PetSupply.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedProduct = await PetSupply.findByPk(req.params.id);
            res.json({ success: true, data: updatedProduct });
        } else {
            res.status(404).json({ success: false, message: '반려용품을 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error('반려용품 수정 실패:', error);
        res.status(500).json({ success: false, message: '반려용품 수정에 실패했습니다.' });
    }
});

router.delete('/pet-supplies/:id', async (req, res) => {
    try {
        const deleted = await PetSupply.destroy({ where: { id: req.params.id } });
        if (deleted) {
            res.json({ success: true, message: '반려용품이 삭제되었습니다.' });
        } else {
            res.status(404).json({ success: false, message: '반려용품을 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error('반려용품 삭제 실패:', error);
        res.status(500).json({ success: false, message: '반려용품 삭제에 실패했습니다.' });
    }
});

router.patch('/pet-supplies/:id/toggle-best', async (req, res) => {
    try {
        const product = await PetSupply.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: '반려용품을 찾을 수 없습니다.' });
        }

        const newBestStatus = !product.isBest;
        await product.update({ isBest: newBestStatus });
        
        res.json({ 
            success: true, 
            message: `베스트 상품이 ${newBestStatus ? '설정' : '해제'}되었습니다.`,
            data: product 
        });
    } catch (error) {
        console.error('베스트 상품 설정 실패:', error);
        res.status(500).json({ success: false, message: '베스트 상품 설정에 실패했습니다.' });
    }
});

router.patch('/pet-supplies/:id/toggle-featured', async (req, res) => {
    try {
        const product = await PetSupply.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: '반려용품을 찾을 수 없습니다.' });
        }

        const newFeaturedStatus = !product.isFeatured;
        await product.update({ isFeatured: newFeaturedStatus });
        
        res.json({ 
            success: true, 
            message: `추천 상품이 ${newFeaturedStatus ? '설정' : '해제'}되었습니다.`,
            data: product 
        });
    } catch (error) {
        console.error('추천 상품 설정 실패:', error);
        res.status(500).json({ success: false, message: '추천 상품 설정에 실패했습니다.' });
    }
});

module.exports = router;