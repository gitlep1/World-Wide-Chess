const jwt = require("jsonwebtoken");
const JSC = process.env.JWT_SECRET;

const requireAuth = (propertyName) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JSC, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req[propertyName] = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { requireAuth };
