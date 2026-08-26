const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;


// ==========================================
// AUTHENTICATE TOKEN
// ==========================================

const authenticateToken = (req, res, next) => {

    const authHeader = req.headers.authorization;


    // ==========================================
    // CHECK AUTHORIZATION HEADER
    // ==========================================

    if (!authHeader) {

        return res.status(401).json({
            message: 'Authentication token required'
        });

    }


    // ==========================================
    // CHECK BEARER FORMAT
    // ==========================================

    const parts = authHeader.split(' ');

    if (
        parts.length !== 2 ||
        parts[0] !== 'Bearer'
    ) {

        return res.status(401).json({
            message: 'Invalid authorization format'
        });

    }


    const token = parts[1];


    // ==========================================
    // VERIFY JWT
    // ==========================================

    try {

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

if (decoded.role !== 'user') {

    return res.status(403).json({

        message:
            'User access required'

    });

}

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(403).json({
            message: 'Invalid or expired token'
        });

    }

};


module.exports = authenticateToken;