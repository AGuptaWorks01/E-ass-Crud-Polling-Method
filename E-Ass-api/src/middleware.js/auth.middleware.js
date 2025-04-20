const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Middleware to authenticate requests using JWT.
 *
 * It expects the token to be sent in the Authorization header
 * in the format: 'Bearer <token>'.
 *
 * If the token is valid, it decodes the payload and attaches
 * the user information to the request object.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header is present and properly formatted
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed" });
  }

  // Extract token from the header
  const token = authHeader.split(" ")[1];

  try {
    // Verify token using secret key
    const decoded = jwt.verify(token, SECRET_KEY);

    // Attach decoded payload (e.g., user info) to the request object
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    // Token is invalid or expired
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
