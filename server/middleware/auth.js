const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Get the token from the request header
    const token = req.header('x-auth-token');

    // 2. Check if no token exists
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied! Access blocked.' });
    }

    // 3. Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach the user data to the request so we know WHO is making the request
        req.user = decoded.user;
        next(); // This tells the server: "Token is valid, let them through to the next step!"
        
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid or has expired.' });
    }
};