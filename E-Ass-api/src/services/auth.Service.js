const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt.util');
const UserModel = require('../models/auth.Model');

const registerUser = async (email, password) => {
    try {
        const existingUser = await UserModel.findUserByEmail(email);
        if (existingUser.length > 0) {
            throw { status: 400, message: 'User already exists' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.createUser(email, hashedPassword);
    } catch (error) {
        // If the model already handled the error, just rethrow it
        throw error;
    }
};

const loginUser = async (email, password) => {
    try {
        const users = await UserModel.findUserByEmail(email);
        if (!users.length) {
            throw { status: 400, message: 'Invalid credentials' };
        }

        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw { status: 400, message: 'Invalid credentials' };
        }

        const token = generateToken(user.id);
        return { token };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    registerUser,
    loginUser
};
