const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    // 1. Look for the token in the headers
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Not authorized. No token found." });
    }

    try {
        // 2. Extract the token (Remove the word "Bearer ")
        const token = authHeader.split(' ')[1];

        // 3. Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach the user's ID to the request so the controller can use it
        req.user = decoded; 
        
        // 5. Let them pass!
        next(); 
    } catch (error) {
        res.status(401).json({ message: "Not authorized. Token failed." });
    }
};

module.exports = { protect };