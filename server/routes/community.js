const express = require('express');
const router = express.Router();
const Community = require('../models/Community');
const authenticateToken = require('../auth.js');

// 게시판 카테고리 목록 조회
router.get('/categories', async (req, res) => {
  try {
    const categories = await Community.getCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('카테고리 조회 오류:', error);
    res.status(500).json({ success: false, message: '카테고리 조회 중 오류가 발생했습니다.' });
  }
});

// 게시글 목록 조회
router.get('/posts', async (req, res) => {
  try {
    const { categoryKey, page, limit, search } = req.query;
    const postsData = await Community.getPosts(categoryKey, parseInt(page) || 1, parseInt(limit) || 10, search);
    res.json({ success: true, data: postsData });
  } catch (error) {
    console.error('게시글 목록 조회 오류:', error);
    res.status(500).json({ success: false, message: '게시글 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 게시글 상세 조회
router.get('/posts/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const post = await Community.getPostById(postId);
    if (post) {
      // 조회수 증가
      await Community.incrementViews(postId);
      res.json({ success: true, data: post });
    } else {
      res.status(404).json({ success: false, message: '게시글을 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('게시글 상세 조회 오류:', error);
    res.status(500).json({ success: false, message: '게시글 상세 조회 중 오류가 발생했습니다.' });
  }
});

// 게시글 작성
router.post('/posts', authenticateToken, async (req, res) => {
  try {
    console.log('게시글 작성 요청 데이터:', req.body);
    console.log('인증된 사용자:', req.user);

    const postData = { ...req.body, userId: req.user.id };
    console.log('최종 게시글 데이터:', postData);

    const newPostId = await Community.createPost(postData);
    console.log('생성된 게시글 ID:', newPostId);

    res.status(201).json({ success: true, data: { id: newPostId } });
  } catch (error) {
    console.error('게시글 작성 오류:', error);
    res.status(500).json({ success: false, message: '게시글 작성 중 오류가 발생했습니다.' });
  }
});

// 게시글 수정
router.put('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const success = await Community.updatePost(postId, req.user.id, req.body);
    if (success) {
      res.json({ success: true, message: '게시글이 수정되었습니다.' });
    } else {
      res.status(404).json({ success: false, message: '게시글을 찾을 수 없거나 수정할 권한이 없습니다.' });
    }
  } catch (error) {
    console.error('게시글 수정 오류:', error);
    if (error.message === 'Unauthorized') {
        return res.status(403).json({ success: false, message: '수정할 권한이 없습니다.' });
    }
    res.status(500).json({ success: false, message: '게시글 수정 중 오류가 발생했습니다.' });
  }
});

// 게시글 삭제
router.delete('/posts/:id', authenticateToken, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const success = await Community.deletePost(postId, req.user.id);
    if (success) {
      res.json({ success: true, message: '게시글이 삭제되었습니다.' });
    } else {
      res.status(404).json({ success: false, message: '게시글을 찾을 수 없거나 삭제할 권한이 없습니다.' });
    }
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    if (error.message === 'Unauthorized') {
        return res.status(403).json({ success: false, message: '삭제할 권한이 없습니다.' });
    }
    res.status(500).json({ success: false, message: '게시글 삭제 중 오류가 발생했습니다.' });
  }
});

// 게시글 좋아요
router.post('/posts/:id/like', authenticateToken, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const result = await Community.togglePostLike(postId, req.user.id);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('게시글 좋아요 오류:', error);
      res.status(500).json({ success: false, message: '게시글 좋아요 처리 중 오류가 발생했습니다.' });
    }
});

// 댓글 목록 조회
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const comments = await Community.getComments(postId);
    res.json({ success: true, data: comments });
  } catch (error) {
    console.error('댓글 조회 오류:', error);
    res.status(500).json({ success: false, message: '댓글 조회 중 오류가 발생했습니다.' });
  }
});

// 댓글 작성
router.post('/posts/:postId/comments', authenticateToken, async (req, res) => {
  try {
    console.log('댓글 작성 요청 - postId:', req.params.postId);
    console.log('댓글 작성 요청 - body:', req.body);
    console.log('댓글 작성 요청 - user:', req.user);

    const commentData = {
      ...req.body,
      postId: parseInt(req.params.postId),
      userId: req.user.id,
    };

    console.log('최종 댓글 데이터:', commentData);

    const newCommentId = await Community.createComment(commentData);
    console.log('생성된 댓글 ID:', newCommentId);

    res.status(201).json({ success: true, data: { id: newCommentId } });
  } catch (error) {
    console.error('댓글 작성 오류:', error);
    console.error('오류 스택:', error.stack);
    res.status(500).json({ success: false, message: '댓글 작성 중 오류가 발생했습니다.' });
  }
});

// ... (댓글 수정, 삭제, 좋아요 API 추가 가능)

module.exports = router;