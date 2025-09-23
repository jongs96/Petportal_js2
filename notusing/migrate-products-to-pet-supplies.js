// server/migrate-products-to-pet-supplies.js
const { 
    testConnection, 
    syncDatabase, 
    Product, 
    PetSupply 
} = require('./database-sqlite');

const migrateProductsToPetSupplies = async () => {
    try {
        console.log('데이터베이스 연결 및 동기화 중...');
        await testConnection();
        await syncDatabase();
        
        console.log('기존 Product 데이터 조회 중...');
        const products = await Product.findAll();
        
        if (products.length === 0) {
            console.log('마이그레이션할 Product 데이터가 없습니다.');
            return;
        }
        
        console.log(`${products.length}개의 Product 데이터를 PetSupply로 마이그레이션 중...`);
        
        for (const product of products) {
            // 기존 PetSupply에 같은 이름의 상품이 있는지 확인
            const existingPetSupply = await PetSupply.findOne({
                where: { name: product.name }
            });
            
            if (!existingPetSupply) {
                // Product 데이터를 PetSupply 형태로 변환
                const petSupplyData = {
                    name: product.name,
                    description: product.description || '',
                    price: product.price || 0,
                    category: product.category || '기타',
                    imageUrl: product.imageUrl || product.image || '',
                    stockQuantity: product.stock || 0,
                    brand: product.brand || '',
                    rating: 0,
                    reviewCount: 0,
                    isFeatured: false,
                    isBest: false
                };
                
                await PetSupply.create(petSupplyData);
                console.log(`✅ "${product.name}" 마이그레이션 완료`);
            } else {
                console.log(`⚠️ "${product.name}" 이미 PetSupply에 존재함 - 건너뜀`);
            }
        }
        
        console.log('✅ Product → PetSupply 마이그레이션 완료!');
        console.log('⚠️ 마이그레이션이 완료되었습니다. 기존 Product 테이블은 수동으로 정리해주세요.');
        
    } catch (error) {
        console.error('❌ 마이그레이션 실패:', error);
    }
};

// 스크립트 직접 실행 시
if (require.main === module) {
    migrateProductsToPetSupplies().then(() => {
        console.log('마이그레이션 스크립트 실행 완료');
        process.exit(0);
    }).catch(error => {
        console.error('마이그레이션 스크립트 실행 실패:', error);
        process.exit(1);
    });
}

module.exports = migrateProductsToPetSupplies;