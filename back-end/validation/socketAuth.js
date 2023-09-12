const jwt = require("jsonwebtoken");
const JSK = process.env.JWT_SECRET;

const socketAuth = (token, socket, next) => {
  // const token = socket.handshake.auth.token;
  // console.log(token);
  if (token) {
    jwt.verify(token, JSK, (err) => {
      if (err) {
        if (err.message === "jwt expired") {
          const decoded = jwt.decode(token);

          const newClientTokenPayload = {
            user: decoded.user,
            scopes: ["read:user", "write:user"],
          };

          const newToken = jwt.sign(newClientTokenPayload, JSK, {
            expiresIn: decoded.user.is_guest ? "1d" : "30d",
          });

          socket.handshake.auth.token = newToken;
        } else {
          console.log(err);
          return next(new Error("Unauthorized"));
        }
      }

      socket.user = {
        token,
      };
      next();
    });
  } else {
    next(new Error("Unauthorized"));
  }
};

module.exports = { socketAuth };
