const db = require('../utils/dbConnection');

const findUserByEmail = async (email) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows;
    } catch (error) {
        throw { status: 500, message: 'Database error while finding user', error };
    }
};

const createUser = async (email, hashedPassword) => {
    try {
        await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw { status: 400, message: 'User already exists', error };
        }
        throw { status: 500, message: 'Database error while creating user', error };
    }
};

module.exports = {
    findUserByEmail,
    createUser
};
