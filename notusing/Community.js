// server/models/Community.js
// Import from both possible database configurations
let CommunityPost, CommunityComment, User, sequelize;

const db = require('../database-sqlite.js');
({ CommunityPost, CommunityComment, User, sequelize } = db);

const { Op } = require('sequelize');

class Community {
  // 게시판 카테고리 목록 조회
  static async getCategories() {
    try {
      console.log('Community.getCategories() called. Returning hardcoded categories.');
      return [
        { boardKey: 'free-talk', category_name: '자유게시판' },
        { boardKey: 'pet-showcase', category_name: '펫자랑 게시판' },
        { boardKey: 'info-share', category_name: '정보공유게시판' },
        { boardKey: 'qna', category_name: 'Q&A 게시판' },
        { boardKey: 'adoption', category_name: '임보/분양/용품나눔' },
        { boardKey: 'meetups', category_name: '산책/모임 게시판' },
        { boardKey: 'missing', category_name: '실종/보호게시판' },
        { boardKey: 'reviews', category_name: '펫동반장소 후기' }
      ];
    } catch (error) {
      console.warn('카테고리 조회 오류:', error);
      return [];
    }
  }

  // 게시글 목록 조회 (페이지네이션 포함)
  static async getPosts(categoryKey = null, page = 1, limit = 10, search = '') {
    try {
      console.log('getPosts called with:', { categoryKey, page, limit, search });
      const offset = (page - 1) * limit;

      const whereClause = {};

      if (categoryKey) {
        whereClause.boardKey = categoryKey;
      }

      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { content: { [Op.like]: `%${search}%` } }
        ];
      }

      console.log('Attempting to query CommunityPost with whereClause:', whereClause);

      const { count, rows: posts } = await CommunityPost.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username'],
            required: false // Make the join optional
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: limit,
        offset: offset
      });

      console.log('Query successful. Count:', count, 'Posts:', posts.length);

      return {
        posts: posts.map(post => ({
          id: post.id,
          boardKey: post.boardKey,
          title: post.title,
          content: post.content,
          views: post.views || 0,
          likes: post.likes || 0,
          created_at: post.createdAt,
          updated_at: post.updatedAt,
          author_id: post.author?.id,
          author_name: post.author?.username,
          comment_count: 0 // TODO: Add comment count logic
        })),
        pagination: {
          current_page: page,
          total_pages: Math.ceil(count / limit),
          total_posts: count,
          per_page: limit
        }
      };
    } catch (error) {
      console.error('Error in getPosts:', error);
      throw error;
    }
  }

  // 게시글 상세 조회
  static async getPostById(postId) {
    try {
      const post = await CommunityPost.findByPk(postId, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username']
          }
        ]
      });

      if (!post) {
        return null;
      }

      return {
        id: post.id,
        boardKey: post.boardKey,
        title: post.title,
        content: post.content,
        views: post.views || 0,
        likes: post.likes || 0,
        created_at: post.createdAt,
        updated_at: post.updatedAt,
        author_id: post.author?.id,
        author_name: post.author?.username
      };
    } catch (error) {
      throw error;
    }
  }

  // 게시글 작성
  static async createPost(postData) {
    try {
      const { userId, title, content, boardKey } = postData;

      const post = await CommunityPost.create({
        authorId: userId,
        title: title,
        content: content,
        boardKey: boardKey
      });

      return post.id;
    } catch (error) {
      throw error;
    }
  }

  // 게시글 수정
  static async updatePost(postId, userId, updateData) {
    try {
      const { title, content } = updateData;

      const post = await CommunityPost.findByPk(postId);

      if (!post) {
        throw new Error('Post not found');
      }

      if (post.authorId !== userId) {
        throw new Error('Unauthorized');
      }

      await post.update({ title, content });
      return true;
    } catch (error) {
      throw error;
    }
  }

  // 게시글 삭제
  static async deletePost(postId, userId) {
    try {
      const post = await CommunityPost.findByPk(postId);

      if (!post) {
        throw new Error('Post not found');
      }

      if (post.authorId !== userId) {
        throw new Error('Unauthorized');
      }

      await post.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

  // 조회수 증가
  static async incrementViews(postId) {
    try {
      const post = await CommunityPost.findByPk(postId);
      if (post) {
        await post.update({ views: (post.views || 0) + 1 });
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  // 게시글 좋아요 토글
  static async togglePostLike(postId, userId) {
    try {
      // For now, just return a simple response
      // This can be implemented later with a proper likes table
      return { liked: true };
    } catch (error) {
      throw error;
    }
  }

  // 댓글 목록 조회
  static async getComments(postId) {
    try {
      const comments = await CommunityComment.findAll({
        where: { postId: postId },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username']
          }
        ],
        order: [['createdAt', 'ASC']]
      });

      return comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.createdAt,
        updated_at: comment.updatedAt,
        author_id: comment.author?.id,
        author_name: comment.author?.username
      }));
    } catch (error) {
      throw error;
    }
  }

  // 댓글 작성
  static async createComment(commentData) {
    try {
      console.log('Community.createComment 호출됨:', commentData);

      const { postId, userId, content } = commentData;
      console.log('추출된 데이터:', { postId, userId, content });

      const comment = await CommunityComment.create({
        postId: postId,
        authorId: userId,
        content: content
      });

      console.log('댓글 생성 성공:', comment);
      return comment.id;
    } catch (error) {
      console.error('Community.createComment 오류:', error);
      throw error;
    }
  }

}

module.exports = Community;