// Importing AuthService to handle user registration and login logic
const AuthService = require('../services/auth.Service');

// Register Method
const register = async (req, res) => {
    // Destructuring email and password from request body
    const { email, password } = req.body;

    // Checking if both email and password are provided
    if (!email || !password) {
        // If either is missing, return a 400 Bad Request response
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Call registerUser method from AuthService to register the user
        await AuthService.registerUser(email, password);

        // Return a success response if user is successfully registered
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        // Catching errors, if any, during the registration process
        console.error("Register Error:", error);

        // Return appropriate error response with status and error message
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
}

// Login Method
const login = async (req, res) => {
    // Destructuring email and password from request body
    const { email, password } = req.body;

    // Checking if both email and password are provided
    if (!email || !password) {
        // If either is missing, return a 400 Bad Request response
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Call loginUser method from AuthService to authenticate the user and get the JWT token
        const { token } = await AuthService.loginUser(email, password);

        // Return success response with the token if login is successful
        res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        // Catching errors, if any, during the login process
        console.error("Login Error:", error);

        // Return appropriate error response with status and error message
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
};

// Exporting the register and login methods to be used in routes
module.exports = {
    register,
    login
};
