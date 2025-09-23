const express = require('express');
const router = express.Router();
const { FAQ, Notice, Inquiry, User, AdminUser, Op } = require('../database-sqlite');

// 관리자 인증 미들웨어 (이미 서버에서 적용되지만 명시적으로 추가)
const authenticateAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: '관리자 권한이 필요합니다.' });
  }
  next();
};

// 모든 라우트에 관리자 인증 적용
router.use(authenticateAdmin);

// 미답변 문의 개수 조회
router.get('/inquiries/pending-count', async (req, res) => {
  try {
    const count = await Inquiry.count({
      where: { status: 'pending' }
    });

    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('미답변 문의 개수 조회 오류:', error);
    res.status(500).json({ success: false, message: '미답변 문의 개수 조회 중 오류가 발생했습니다.' });
  }
});

// 전체 문의 목록 조회 (관리자)
router.get('/inquiries', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Inquiry.findAndCountAll({
      where: whereClause,
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
    console.error('문의 목록 조회 오류:', error);
    res.status(500).json({ success: false, message: '문의 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 문의 상세 조회 (관리자)
router.get('/inquiries/:id', async (req, res) => {
  try {
    const inquiryId = parseInt(req.params.id);

    const inquiry = await Inquiry.findByPk(inquiryId, {
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

// 문의 답변 작성/수정
router.put('/inquiries/:id/response', async (req, res) => {
  try {
    const inquiryId = parseInt(req.params.id);
    const { adminResponse } = req.body;

    if (!adminResponse || !adminResponse.trim()) {
      return res.status(400).json({
        success: false,
        message: '답변 내용을 입력해주세요.'
      });
    }

    const inquiry = await Inquiry.findByPk(inquiryId);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: '문의를 찾을 수 없습니다.' });
    }

    await inquiry.update({
      adminResponse: adminResponse.trim(),
      status: 'answered',
      respondedAt: new Date(),
      respondedBy: req.user.id
    });

    res.json({
      success: true,
      message: '답변이 성공적으로 등록되었습니다.'
    });
  } catch (error) {
    console.error('문의 답변 오류:', error);
    res.status(500).json({ success: false, message: '문의 답변 중 오류가 발생했습니다.' });
  }
});

// 문의 상태 변경
router.put('/inquiries/:id/status', async (req, res) => {
  try {
    const inquiryId = parseInt(req.params.id);
    const { status } = req.body;

    if (!['pending', 'answered', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '올바른 상태값을 입력해주세요.'
      });
    }

    const inquiry = await Inquiry.findByPk(inquiryId);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: '문의를 찾을 수 없습니다.' });
    }

    await inquiry.update({ status });

    res.json({
      success: true,
      message: '상태가 성공적으로 변경되었습니다.'
    });
  } catch (error) {
    console.error('문의 상태 변경 오류:', error);
    res.status(500).json({ success: false, message: '문의 상태 변경 중 오류가 발생했습니다.' });
  }
});

// FAQ 생성
router.post('/faqs', async (req, res) => {
  try {
    const { category, question, answer, order = 0 } = req.body;

    if (!category || !question || !answer) {
      return res.status(400).json({
        success: false,
        message: '카테고리, 질문, 답변을 모두 입력해주세요.'
      });
    }

    const faq = await FAQ.create({
      category,
      question,
      answer,
      order: parseInt(order),
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'FAQ가 성공적으로 생성되었습니다.',
      data: faq
    });
  } catch (error) {
    console.error('FAQ 생성 오류:', error);
    res.status(500).json({ success: false, message: 'FAQ 생성 중 오류가 발생했습니다.' });
  }
});

// FAQ 목록 조회 (관리자 - 비활성화 포함)
router.get('/faqs', async (req, res) => {
  try {
    const { category, isActive } = req.query;
    const whereClause = {};

    if (category) {
      whereClause.category = category;
    }

    if (isActive !== undefined) {
      whereClause.isActive = isActive === 'true';
    }

    const faqs = await FAQ.findAll({
      where: whereClause,
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });

    res.json({ success: true, data: faqs });
  } catch (error) {
    console.error('FAQ 목록 조회 오류:', error);
    res.status(500).json({ success: false, message: 'FAQ 목록 조회 중 오류가 발생했습니다.' });
  }
});

// FAQ 수정
router.put('/faqs/:id', async (req, res) => {
  try {
    const faqId = parseInt(req.params.id);
    const { category, question, answer, order, isActive } = req.body;

    const faq = await FAQ.findByPk(faqId);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ를 찾을 수 없습니다.' });
    }

    const updateData = {};
    if (category !== undefined) updateData.category = category;
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (order !== undefined) updateData.order = parseInt(order);
    if (isActive !== undefined) updateData.isActive = isActive;

    await faq.update(updateData);

    res.json({
      success: true,
      message: 'FAQ가 성공적으로 수정되었습니다.',
      data: faq
    });
  } catch (error) {
    console.error('FAQ 수정 오류:', error);
    res.status(500).json({ success: false, message: 'FAQ 수정 중 오류가 발생했습니다.' });
  }
});

// FAQ 삭제
router.delete('/faqs/:id', async (req, res) => {
  try {
    const faqId = parseInt(req.params.id);

    const faq = await FAQ.findByPk(faqId);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ를 찾을 수 없습니다.' });
    }

    await faq.destroy();

    res.json({
      success: true,
      message: 'FAQ가 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('FAQ 삭제 오류:', error);
    res.status(500).json({ success: false, message: 'FAQ 삭제 중 오류가 발생했습니다.' });
  }
});

// 공지사항 생성
router.post('/notices', async (req, res) => {
  try {
    const { title, content, isImportant = false } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: '제목과 내용을 모두 입력해주세요.'
      });
    }

    const notice = await Notice.create({
      title,
      content,
      isImportant,
      authorId: req.user.id,
      views: 0
    });

    res.status(201).json({
      success: true,
      message: '공지사항이 성공적으로 생성되었습니다.',
      data: notice
    });
  } catch (error) {
    console.error('공지사항 생성 오류:', error);
    res.status(500).json({ success: false, message: '공지사항 생성 중 오류가 발생했습니다.' });
  }
});

// 공지사항 목록 조회 (관리자)
router.get('/notices', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Notice.findAndCountAll({
      where: whereClause,
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
    console.error('공지사항 목록 조회 오류:', error);
    res.status(500).json({ success: false, message: '공지사항 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 공지사항 수정
router.put('/notices/:id', async (req, res) => {
  try {
    const noticeId = parseInt(req.params.id);
    const { title, content, isImportant } = req.body;

    const notice = await Notice.findByPk(noticeId);
    if (!notice) {
      return res.status(404).json({ success: false, message: '공지사항을 찾을 수 없습니다.' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (isImportant !== undefined) updateData.isImportant = isImportant;

    await notice.update(updateData);

    res.json({
      success: true,
      message: '공지사항이 성공적으로 수정되었습니다.',
      data: notice
    });
  } catch (error) {
    console.error('공지사항 수정 오류:', error);
    res.status(500).json({ success: false, message: '공지사항 수정 중 오류가 발생했습니다.' });
  }
});

// 공지사항 삭제
router.delete('/notices/:id', async (req, res) => {
  try {
    const noticeId = parseInt(req.params.id);

    const notice = await Notice.findByPk(noticeId);
    if (!notice) {
      return res.status(404).json({ success: false, message: '공지사항을 찾을 수 없습니다.' });
    }

    await notice.destroy();

    res.json({
      success: true,
      message: '공지사항이 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('공지사항 삭제 오류:', error);
    res.status(500).json({ success: false, message: '공지사항 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;