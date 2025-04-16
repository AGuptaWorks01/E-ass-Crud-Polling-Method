const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.generateToken = (userId) => {
    try {
        const token = jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '1h' })
        return token;
    } catch (err) {
        throw new Error('Error generating token');

    }
}

exports.verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (err) {
        throw new Error('Invalid or expired token');
    }
}