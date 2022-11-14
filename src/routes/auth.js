
const jwt = require("jsonwebtoken");
const config = process.env;

const verifyToken = (req, res, next) => {
  const token =req.session.token;
  req.isValid = false;  
  if (!token) {
    return res.status(403).json({message : "token not found"});
  }
  try {
    const decoded = jwt.verify(token, config.SECRET_KEY);
    
    if(req.params.username === decoded.username)
    req.isValid = true;
    
  } catch (err) {
    return res.status(401).json({message : "invalid token"});
  }
  return next();
};

module.exports = verifyToken;