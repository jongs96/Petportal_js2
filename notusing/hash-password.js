const bcrypt = require('bcryptjs');

bcrypt.hash('1234', 10).then(hash => {
    console.log('원래 비밀번호: 1234');
    console.log('암호화된 해시:', hash);
});