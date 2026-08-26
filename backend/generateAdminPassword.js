const bcrypt = require('bcryptjs');

const password = 'AdminVixen123';

bcrypt.hash(password, 10)
    .then(hash => console.log(hash));