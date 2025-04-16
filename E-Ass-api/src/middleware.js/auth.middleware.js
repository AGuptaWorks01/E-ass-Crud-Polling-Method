const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Token must be sent in `Authorization: Bearer <token>` format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
