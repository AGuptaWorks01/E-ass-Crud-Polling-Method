const bcrypt = require('bcrypt')
const db = require('../utils/dbConnection');
const { generateToken } = require('../utils/jwt.utils')

const register = async (req, res) => {
    const { email, password } = req.body;
    // console.log("Received:", req.body);

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ? ', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log("hashedPassword", hashedPassword);

        await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Database error', error: error });
    }

}


const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Username and password are required." });
    }
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (!users.length) {
            return res.status(400).json({ message: "Inavlid credentails" });
        }

        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user.id);
        console.log("token", token);
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Database error', error: err })
    }
}

module.exports = {
    register, login
}