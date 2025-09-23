const { Sequelize, DataTypes, Op } = require('sequelize');
const path = require('path');

// SQLite 데이터베이스 연결 설정 (MySQL 대안)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'petcare.db'),
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    },
    define: {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    }
});

// 모델 정의
const AdminUser = sequelize.define('AdminUser', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING(20),
        defaultValue: 'admin'
    }
}, {
    tableName: 'admin_users',
    timestamps: true
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(20),
        defaultValue: 'user'
    }
}, {
    tableName: 'users',
    timestamps: true
});

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    brand: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    weight: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    dimensions: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    material: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    size: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isBestSeller: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.00
    },
    reviewCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    discountPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
}, {
    tableName: 'products',
    timestamps: true
});

const Cafe = sequelize.define('Cafe', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.00
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'cafes',
    timestamps: true
});

const Accommodation = sequelize.define('Accommodation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.00
    },
    images: {
        type: DataTypes.TEXT, // JSON 배열을 문자열로 저장
        allowNull: true,
    },
    tags: {
        type: DataTypes.TEXT, // JSON 배열을 문자열로 저장
        allowNull: true,
    },
    maxGuests: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    petsAllowed: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    checkInTime: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    checkOutTime: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // 기존 필드들도 유지 (호환성을 위해)
    address: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    operatingHours: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    reviewCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    amenities: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    roomType: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    petFriendly: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
}, {
    tableName: 'accommodations',
    timestamps: true
});

const Hospital = sequelize.define('Hospital', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    operatingHours: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.00
    },
    reviewCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    tags: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    amenities: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'hospitals',
    timestamps: true
});

const Hotel = sequelize.define('Hotel', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    operatingHours: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.00
    },
    reviewCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    tags: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    amenities: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    checkInTime: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    checkOutTime: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    roomType: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    petFriendly: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
}, {
    tableName: 'hotels',
    timestamps: true
});

const GroomingService = sequelize.define('GroomingService', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    operatingHours: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'grooming_services',
    timestamps: true
});

const CommunityPost = sequelize.define('CommunityPost', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    boardKey: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'community_posts',
    timestamps: true
});

const CommunityComment = sequelize.define('CommunityComment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CommunityPost,
            key: 'id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    parentCommentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'CommunityComment',
            key: 'id'
        }
    }
}, {
    tableName: 'community_comments',
    timestamps: true
});

const PetSupply = sequelize.define('PetSupply', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    stockQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isBest: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    brand: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.00
    },
    reviewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'pet_supplies',
    timestamps: true
});

// 고객센터 FAQ 모델
const FAQ = sequelize.define('FAQ', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    question: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'faqs',
    timestamps: true
});

// 고객센터 공지사항 모델
const Notice = sequelize.define('Notice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isImportant: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: AdminUser,
            key: 'id'
        }
    }
}, {
    tableName: 'notices',
    timestamps: true
});

// 1:1 문의 모델
const Inquiry = sequelize.define('Inquiry', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'answered', 'closed'),
        defaultValue: 'pending'
    },
    adminResponse: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    respondedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    respondedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: AdminUser,
            key: 'id'
        }
    }
}, {
    tableName: 'inquiries',
    timestamps: true
});

// 관계 설정
const setupAssociations = () => {
    CommunityPost.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
    CommunityComment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
    CommunityComment.belongsTo(CommunityPost, { foreignKey: 'postId', as: 'post' });
    CommunityComment.belongsTo(CommunityComment, { foreignKey: 'parentCommentId', as: 'parentComment' });

    User.hasMany(CommunityPost, { foreignKey: 'authorId', as: 'posts' });
    User.hasMany(CommunityComment, { foreignKey: 'authorId', as: 'comments' });
    CommunityPost.hasMany(CommunityComment, { foreignKey: 'postId', as: 'comments' });

    // 고객센터 관계 설정
    Notice.belongsTo(AdminUser, { foreignKey: 'authorId', as: 'author' });
    Inquiry.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    Inquiry.belongsTo(AdminUser, { foreignKey: 'respondedBy', as: 'responder' });

    AdminUser.hasMany(Notice, { foreignKey: 'authorId', as: 'notices' });
    User.hasMany(Inquiry, { foreignKey: 'userId', as: 'inquiries' });
    AdminUser.hasMany(Inquiry, { foreignKey: 'respondedBy', as: 'responses' });
};

// 데이터베이스 연결 테스트
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('SQLite 데이터베이스 연결 성공');
    } catch (error) {
        console.error('SQLite 데이터베이스 연결 실패:', error);
    }
};

// 데이터베이스 동기화
const syncDatabase = async () => {
    try {
        setupAssociations();
        await sequelize.sync({});
        console.log('데이터베이스 테이블 동기화 완료');
    } catch (error) {
        console.error('데이터베이스 동기화 실패:', error);
    }
};

module.exports = {
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
    PetSupply,
    FAQ,
    Notice,
    Inquiry,
    testConnection,
    syncDatabase,
    setupAssociations,
    Op
};