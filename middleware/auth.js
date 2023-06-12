const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require('dotenv').config();

const jwtSecret = process.env.JWT_TOKEN_SECRET


exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log(token);
    if (token) {
      try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded?.user; // Use optional chaining operator
        next();
      } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
      }
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
  