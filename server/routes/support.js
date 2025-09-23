const express = require('express');
const router = express.Router();
const { FAQ, Notice, Inquiry, User, AdminUser, Op } = require('../database-sqlite');
const authenticateToken = require('../auth.js');

// FAQ 목록 조회 (공개)
router.get('/faqs', async (req, res) => {
  try {
    const { category } = req.query;
    const whereClause = { isActive: true };

    if (category) {
      whereClause.category = category;
    }

    const faqs = await FAQ.findAll({
      where: whereClause,
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });

    res.json({ success: true, data: faqs });
  } catch (error) {
    console.error('FAQ 조회 오류:', error);
    res.status(500).json({ success: false, message: 'FAQ 조회 중 오류가 발생했습니다.' });
  }
});

// FAQ 카테고리 목록 조회
router.get('/faq-categories', async (req, res) => {
  try {
    const categories = await FAQ.findAll({
      attributes: ['category'],
      where: { isActive: true },
      group: ['category'],
      order: [['category', 'ASC']]
    });

    const categoryList = categories.map(item => item.category);
    res.json({ success: true, data: categoryList });
  } catch (error) {
    console.error('FAQ 카테고리 조회 오류:', error);
    res.status(500).json({ success: false, message: 'FAQ 카테고리 조회 중 오류가 발생했습니다.' });
  }
});

// 공지사항 목록 조회 (공개)
router.get('/notices', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Notice.findAndCountAll({
      include: [
        {
          model: AdminUser,
          as: 'author',
          attributes: ['username']
        }
      ],
      order: [['isImportant', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      success: true,
      data: {
        notices: rows,
        pagination: {
          total: count,
          currentPage: parseInt(page),
          perPage: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('공지사항 조회 오류:', error);
    res.status(500).json({ success: false, message: '공지사항 조회 중 오류가 발생했습니다.' });
  }
});

// 공지사항 상세 조회
router.get('/notices/:id', async (req, res) => {
  try {
    const noticeId = parseInt(req.params.id);

    const notice = await Notice.findByPk(noticeId, {
      include: [
        {
          model: AdminUser,
          as: 'author',
          attributes: ['username']
        }
      ]
    });

    if (!notice) {
      return res.status(404).json({ success: false, message: '공지사항을 찾을 수 없습니다.' });
    }

    // 조회수 증가
    await notice.increment('views');

    res.json({ success: true, data: notice });
  } catch (error) {
    console.error('공지사항 상세 조회 오류:', error);
    res.status(500).json({ success: false, message: '공지사항 상세 조회 중 오류가 발생했습니다.' });
  }
});

// 1:1 문의 작성 (로그인 필요)
router.post('/inquiries', authenticateToken, async (req, res) => {
  try {
    const { category, title, content } = req.body;

    if (!category || !title || !content) {
      return res.status(400).json({
        success: false,
        message: '카테고리, 제목, 내용을 모두 입력해주세요.'
      });
    }

    const inquiry = await Inquiry.create({
      userId: req.user.id,
      category,
      title,
      content,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: '문의가 성공적으로 등록되었습니다.',
      data: { id: inquiry.id }
    });
  } catch (error) {
    console.error('문의 작성 오류:', error);
    res.status(500).json({ success: false, message: '문의 작성 중 오류가 발생했습니다.' });
  }
});

// 내 문의 목록 조회 (로그인 필요)
router.get('/my-inquiries', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Inquiry.findAndCountAll({
      where: { userId: req.user.id },
      include: [
        {
          model: AdminUser,
          as: 'responder',
          attributes: ['username']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      success: true,
      data: {
        inquiries: rows,
        pagination: {
          total: count,
          currentPage: parseInt(page),
          perPage: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('내 문의 조회 오류:', error);
    res.status(500).json({ success: false, message: '문의 조회 중 오류가 발생했습니다.' });
  }
});

// 문의 상세 조회 (본인 문의만)
router.get('/inquiries/:id', authenticateToken, async (req, res) => {
  try {
    const inquiryId = parseInt(req.params.id);

    const inquiry = await Inquiry.findOne({
      where: {
        id: inquiryId,
        userId: req.user.id
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username', 'email']
        },
        {
          model: AdminUser,
          as: 'responder',
          attributes: ['username']
        }
      ]
    });

    if (!inquiry) {
      return res.status(404).json({ success: false, message: '문의를 찾을 수 없습니다.' });
    }

    res.json({ success: true, data: inquiry });
  } catch (error) {
    console.error('문의 상세 조회 오류:', error);
    res.status(500).json({ success: false, message: '문의 상세 조회 중 오류가 발생했습니다.' });
  }
});

// 문의 카테고리 목록
router.get('/inquiry-categories', (req, res) => {
  const categories = [
    '계정/로그인',
    '서비스 이용',
    '결제/환불',
    '기술 문의',
    '신고/제재',
    '기타'
  ];

  res.json({ success: true, data: categories });
});

module.exports = router;