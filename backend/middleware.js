const jwt = require('jsonwebtoken');
const JWT_SECRET = require('./config');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(403).json({msg: "invalid token!"});

    const token = authHeader.split(' ')[1];  // [0] ind is Bearer

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if(decoded.userId) {
            req.userId = decoded.userId;     // putting it in request object to get it later
            next();
        } 
        else {
            return res.status(403).json({msg: "Invalid Token!"});
        }
    } 
    catch (error) {
        return res.status(403).json({msg: "Token is incorrect"});
    }
}

module.exports = {
    authMiddleware
}