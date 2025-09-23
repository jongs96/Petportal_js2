// server/models/PetSupplies.js
const { PetSupply } = require('../database-sqlite');
const { Op } = require('sequelize');

class PetSupplies {
  // 상품 목록 조회
  static async getProducts(category = null, page = 1, limit = 12, search = null) {
    const where = {};
    
    if (category) {
      where.category = category;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await PetSupply.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });

    return {
      products: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  // 베스트 상품 조회
  static async getBestProducts(limit = 4) {
    return await PetSupply.findAll({
      where: { isBest: true },
      limit,
      order: [['createdAt', 'DESC']]
    });
  }

  // 특정 상품 조회
  static async getProductById(id) {
    return await PetSupply.findByPk(id);
  }

  // 상품 생성
  static async createProduct(productData) {
    const product = await PetSupply.create(productData);
    return product.id;
  }

  // 상품 수정
  static async updateProduct(id, productData) {
    const [updatedRowsCount] = await PetSupply.update(productData, {
      where: { id }
    });
    return updatedRowsCount > 0;
  }

  // 상품 삭제
  static async deleteProduct(id) {
    const deletedRowsCount = await PetSupply.destroy({
      where: { id }
    });
    return deletedRowsCount > 0;
  }

  // 카테고리 목록 조회
  static async getCategories() {
    const result = await PetSupply.findAll({
      attributes: ['category'],
      group: ['category'],
      order: [['category', 'ASC']]
    });
    return result.map(item => item.category);
  }

  // 베스트 상품 설정/해제
  static async toggleBestProduct(id) {
    const product = await this.getProductById(id);
    if (!product) return false;

    const newBestStatus = !product.isBest;
    await product.update({ isBest: newBestStatus });
    return true;
  }

  // 추천 상품 설정/해제
  static async toggleFeaturedProduct(id) {
    const product = await this.getProductById(id);
    if (!product) return false;

    const newFeaturedStatus = !product.isFeatured;
    await product.update({ isFeatured: newFeaturedStatus });
    return true;
  }
}

module.exports = PetSupplies;