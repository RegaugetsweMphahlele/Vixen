const jwt = require('jsonwebtoken');

const JWT_SECRET = 'VIXEN_JWT_SECRET_CHANGE_THIS_LATER';

const authenticateToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
        return res.status(401).json({
            message: 'Authentication token required'
        });
    }

    // Expected format:
    // Authorization: Bearer TOKEN

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
            message: 'Invalid authorization format'
        });
    }

    const token = parts[1];

    try {

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        // Make authenticated user available
        // to the next controller
        req.user = decoded;

        next();

    } catch (error) {

        return res.status(403).json({
            message: 'Invalid or expired token'
        });
    }
};

module.exports = authenticateToken;