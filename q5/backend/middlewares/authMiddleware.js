import jwt from 'jsonwebtoken';

const JWT_SECRET = 'my-secret-key';

export const authMiddleware = (req, res, next) => {

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }

    try {

        const decoded = jwt.verify(token, JWT_SECRET);

        req.employeeId = decoded.employeeId;

        next();

    } catch (error) {

        res.status(401).json({
            message: 'Invalid or expired token'
        });

    }

};