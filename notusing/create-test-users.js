const { User, testConnection, syncDatabase } = require('./database-sqlite');
const bcrypt = require('bcryptjs');

const createTestUsers = async () => {
    try {
        await testConnection();
        await syncDatabase();
        
        console.log('테스트 사용자 계정 생성 중...');
        
        // 테스트 사용자 데이터
        const testUsers = [
            {
                username: 'testuser2',
                email: 'test2@example.com',
                password: 'test123',
                role: 'user'
            },
            {
                username: '펫러버',
                email: 'petlover@example.com',
                password: 'petlove123',
                role: 'user'
            },
            {
                username: '댕댕이맘',
                email: 'dogmom@example.com',
                password: 'dogmom123',
                role: 'user'
            }
        ];
        
        for (const userData of testUsers) {
            // 기존 사용자 확인 (이메일과 사용자명 모두 확인)
            const existingUserByEmail = await User.findOne({ 
                where: { email: userData.email } 
            });
            const existingUserByUsername = await User.findOne({ 
                where: { username: userData.username } 
            });
            
            if (existingUserByEmail) {
                console.log(`사용자 ${userData.email}는 이미 존재합니다.`);
                continue;
            }
            
            if (existingUserByUsername) {
                console.log(`사용자명 ${userData.username}는 이미 존재합니다.`);
                continue;
            }
            
            try {
                // 비밀번호 암호화
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                
                // 사용자 생성
                await User.create({
                    username: userData.username,
                    email: userData.email,
                    password: hashedPassword,
                    role: userData.role
                });
                
                console.log(`테스트 사용자 생성 완료: ${userData.email} (비밀번호: ${userData.password})`);
            } catch (error) {
                console.error(`사용자 ${userData.email} 생성 실패:`, error.message);
            }
        }
        
        console.log('\n=== 테스트 계정 정보 ===');
        console.log('1. test2@example.com / test123');
        console.log('2. petlover@example.com / petlove123');
        console.log('3. dogmom@example.com / dogmom123');
        console.log('========================\n');
        
    } catch (error) {
        console.error('테스트 사용자 생성 실패:', error);
    } finally {
        process.exit(0);
    }
};

createTestUsers();