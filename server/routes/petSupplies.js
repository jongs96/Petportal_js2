// server/routes/petSupplies.js
const express = require('express');
const router = express.Router();
const PetSupplies = require('../models/PetSupplies');

// 상품 목록 조회
router.get('/', async (req, res) => {
  try {
    const { category, page, limit, search } = req.query;
    const result = await PetSupplies.getProducts(
      category, 
      parseInt(page) || 1, 
      parseInt(limit) || 12, 
      search
    );
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('상품 목록 조회 오류:', error);
    res.status(500).json({ success: false, message: '상품 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 베스트 상품 조회
router.get('/best', async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await PetSupplies.getBestProducts(parseInt(limit) || 4);
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('베스트 상품 조회 오류:', error);
    res.status(500).json({ success: false, message: '베스트 상품 조회 중 오류가 발생했습니다.' });
  }
});

// 카테고리 목록 조회
router.get('/categories', async (req, res) => {
  try {
    const categories = await PetSupplies.getCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('카테고리 조회 오류:', error);
    res.status(500).json({ success: false, message: '카테고리 조회 중 오류가 발생했습니다.' });
  }
});

// 특정 상품 조회
router.get('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await PetSupplies.getProductById(productId);
    
    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.status(404).json({ success: false, message: '상품을 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('상품 상세 조회 오류:', error);
    res.status(500).json({ success: false, message: '상품 상세 조회 중 오류가 발생했습니다.' });
  }
});

module.exports = router;