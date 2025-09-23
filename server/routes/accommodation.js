const express = require('express');
const router = express.Router();
const { Accommodation } = require('../database-sqlite.js');
const { Op } = require('sequelize');

// 모든 숙소 조회 (페이지네이션 포함)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', type = '', location = '' } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { location: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }
        
        if (type && type !== '전체') {
            whereClause.type = type;
        }
        
        if (location) {
            whereClause.location = { [Op.like]: `%${location}%` };
        }

        const { count, rows: accommodations } = await Accommodation.findAndCountAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        // JSON 문자열 필드들을 배열로 파싱
        const processedAccommodations = accommodations.map(acc => {
            const accommodation = acc.toJSON();
            try {
                if (accommodation.images && typeof accommodation.images === 'string') {
                    accommodation.images = JSON.parse(accommodation.images);
                }
                if (accommodation.tags && typeof accommodation.tags === 'string') {
                    accommodation.tags = JSON.parse(accommodation.tags);
                }
            } catch (e) {
                console.error('Error parsing JSON fields:', e);
            }
            return accommodation;
        });

        res.json({
            success: true,
            data: processedAccommodations,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(count / limit),
                total_items: count,
                per_page: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching accommodations:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch accommodations.' });
    }
});

// 특정 숙소 조회
router.get('/:id', async (req, res) => {
    try {
        const accommodation = await Accommodation.findByPk(req.params.id);
        if (!accommodation) {
            return res.status(404).json({ success: false, message: 'Accommodation not found.' });
        }

        const accommodationData = accommodation.toJSON();
        
        // JSON 문자열 필드들을 배열로 파싱
        try {
            if (accommodationData.images && typeof accommodationData.images === 'string') {
                accommodationData.images = JSON.parse(accommodationData.images);
            }
            if (accommodationData.tags && typeof accommodationData.tags === 'string') {
                accommodationData.tags = JSON.parse(accommodationData.tags);
            }
        } catch (e) {
            console.error('Error parsing JSON fields:', e);
        }

        res.json({ success: true, data: accommodationData });
    } catch (error) {
        console.error('Error fetching accommodation:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch accommodation.' });
    }
});

module.exports = router;