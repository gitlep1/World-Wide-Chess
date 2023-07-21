const jwt = require("jsonwebtoken");
const JSK = process.env.JWT_SECRET;

const requireAuth = () => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, JSK, (err) => {
        if (err) {
          if (err.message === "jwt expired") {
            const expired = err.message;
            console.log(expired);
          }
          return res.sendStatus(403);
        }
        req.user = {
          token,
        };
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };
};

module.exports = { requireAuth };
