import jwt from 'jsonwebtoken';

const isAuth = (req, res, next) => {
  try {
    console.log("Cookies received:", req.cookies);

    const token = req.cookies.token;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ message: "Token not found or invalid." });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET); 

    req.userId = verifyToken.userID; 

    next();
  } catch (error) {
    console.log("Auth middleware error:", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default isAuth;
