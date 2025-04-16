const AuthService = require('../services/auth.Service');

const register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        await AuthService.registerUser(email, password);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const { token } = await AuthService.loginUser(email, password);
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

module.exports = {
    register,
    login
};