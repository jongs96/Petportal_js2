-- 커뮤니티 데이터베이스 스키마
-- MySQL 데이터베이스: petcare_community

USE petcare_community;

-- 사용자 테이블 (이미 존재한다고 가정, 참조용)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 게시판 카테고리 테이블
CREATE TABLE IF NOT EXISTS board_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_key VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 기본 카테고리 데이터 삽입
INSERT INTO board_categories (category_key, category_name, description, icon, sort_order) VALUES
('general', '자유게시판', '자유롭게 이야기를 나누는 공간입니다', '💬', 1),
('qna', '질문/답변', '궁금한 것들을 물어보고 답변하는 공간입니다', '❓', 2),
('tips', '꿀팁 공유', '유용한 정보와 팁을 공유하는 공간입니다', '💡', 3),
('photos', '사진 자랑', '우리 아이들의 사진을 자랑하는 공간입니다', '📸', 4),
('reviews', '후기', '서비스나 제품 후기를 공유하는 공간입니다', '⭐', 5),
('events', '이벤트', '다양한 이벤트 정보를 공유하는 공간입니다', '🎉', 6)
ON DUPLICATE KEY UPDATE category_name = VALUES(category_name);

-- 게시글 테이블
CREATE TABLE IF NOT EXISTS posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    images JSON, -- 이미지 URL 배열을 JSON으로 저장
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'published', 'hidden', 'deleted') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES board_categories(id),
    INDEX idx_category_created (category_id, created_at DESC),
    INDEX idx_user_created (user_id, created_at DESC),
    INDEX idx_status_created (status, created_at DESC),
    FULLTEXT INDEX idx_title_content (title, content)
);

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_id INT NULL, -- 대댓글을 위한 부모 댓글 ID
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_post_created (post_id, created_at),
    INDEX idx_user_created (user_id, created_at)
);

-- 좋아요 테이블 (게시글 좋아요)
CREATE TABLE IF NOT EXISTS post_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_like (post_id, user_id)
);

-- 댓글 좋아요 테이블
CREATE TABLE IF NOT EXISTS comment_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_comment_like (comment_id, user_id)
);

-- 태그 테이블
CREATE TABLE IF NOT EXISTS tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 게시글-태그 연결 테이블
CREATE TABLE IF NOT EXISTS post_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_tag (post_id, tag_id)
);

-- 뷰 카운트를 위한 트리거
DELIMITER //
CREATE TRIGGER update_post_views
BEFORE UPDATE ON posts
FOR EACH ROW
BEGIN
    IF NEW.views > OLD.views THEN
        SET NEW.updated_at = OLD.updated_at; -- 조회수 증가 시 updated_at 변경 방지
    END IF;
END//
DELIMITER ;

-- 좋아요 수 업데이트를 위한 트리거
DELIMITER //
CREATE TRIGGER post_like_insert_trigger
AFTER INSERT ON post_likes
FOR EACH ROW
BEGIN
    UPDATE posts SET likes = likes + 1 WHERE id = NEW.post_id;
END//

CREATE TRIGGER post_like_delete_trigger
AFTER DELETE ON post_likes
FOR EACH ROW
BEGIN
    UPDATE posts SET likes = likes - 1 WHERE id = OLD.post_id;
END//

CREATE TRIGGER comment_like_insert_trigger
AFTER INSERT ON comment_likes
FOR EACH ROW
BEGIN
    UPDATE comments SET likes = likes + 1 WHERE id = NEW.comment_id;
END//

CREATE TRIGGER comment_like_delete_trigger
AFTER DELETE ON comment_likes
FOR EACH ROW
BEGIN
    UPDATE comments SET likes = likes - 1 WHERE id = OLD.comment_id;
END//
DELIMITER ;

-- 인덱스 추가 (성능 최적화)
CREATE INDEX idx_posts_category_status_created ON posts(category_id, status, created_at DESC);
CREATE INDEX idx_comments_post_parent ON comments(post_id, parent_id, created_at);
CREATE INDEX idx_posts_featured_pinned ON posts(is_featured, is_pinned, created_at DESC);