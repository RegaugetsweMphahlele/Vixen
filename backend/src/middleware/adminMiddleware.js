const jwt = require('jsonwebtoken');


// ==========================================
// JWT SECRET
// ==========================================

const JWT_SECRET =
    process.env.JWT_SECRET;


// ==========================================
// AUTHENTICATE ADMIN TOKEN
// ==========================================

const authenticateAdmin = (
    req,
    res,
    next
) => {

    const authHeader =
        req.headers.authorization;


    // ==========================================
    // CHECK AUTHORIZATION HEADER
    // ==========================================

    if (!authHeader) {

        return res.status(401).json({

            message:
                'Authentication token required'

        });

    }


    // ==========================================
    // CHECK BEARER FORMAT
    // ==========================================

    const parts =
        authHeader.split(' ');


    if (
        parts.length !== 2 ||
        parts[0] !== 'Bearer'
    ) {

        return res.status(401).json({

            message:
                'Invalid authorization format'

        });

    }


    const token =
        parts[1];


    // ==========================================
    // VERIFY JWT
    // ==========================================

    try {

        const decoded =
            jwt.verify(
                token,
                JWT_SECRET
            );


        // ==========================================
        // CHECK ADMIN ROLE
        // ==========================================

        if (
            decoded.role !== 'admin'
        ) {

            return res.status(403).json({

                message:
                    'Admin access required'

            });

        }


        // ==========================================
        // MAKE ADMIN AVAILABLE
        // ==========================================

        req.admin =
            decoded;


        next();

    } catch (error) {

        return res.status(403).json({

            message:
                'Invalid or expired admin token'

        });

    }

};


module.exports =
    authenticateAdmin;