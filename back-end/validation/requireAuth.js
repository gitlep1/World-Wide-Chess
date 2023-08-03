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
            const decoded = jwt.decode(token);

            const newClientTokenPayload = {
              user: decoded.user,
              scopes: ["read:user", "write:user"],
            };

            const newToken = jwt.sign(newClientTokenPayload, JSK, {
              expiresIn: "1h",
            });

            res.setHeader("Authorization", `Bearer ${newToken}`);
          } else {
            console.log(err);
            return res.sendStatus(403);
          }
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
