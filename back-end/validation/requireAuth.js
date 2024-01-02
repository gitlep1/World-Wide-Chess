const jwt = require("jsonwebtoken");
const JSK = process.env.JWT_SECRET;

const requireAuth = () => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, JSK, async (err) => {
        const decoded = jwt.decode(token);
        if (err) {
          if (err.message === "jwt expired") {
            try {
              const newClientTokenPayload = {
                user: decoded.user,
                scopes: ["read:user", "write:user"],
              };

              const newToken = jwt.sign(newClientTokenPayload, JSK, {
                expiresIn: decoded.user.is_guest ? "1d" : "30d",
              });

              res.setHeader("authorization", `Bearer ${newToken}`);

              req.user = {
                token: newToken,
              };
            } catch (error) {
              console.error("Error generating new token:", { error });
              return res.sendStatus(403);
            }
          } else {
            console.error({ ERROR: err });
            return res.sendStatus(403);
          }
        }

        req.user = {
          token,
          decodedUser: decoded.user,
        };

        next();
      });
    } else {
      res.sendStatus(401);
    }
  };
};

module.exports = { requireAuth };
