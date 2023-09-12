const jwt = require("jsonwebtoken");

const socketScope = (requiredScopes) => {
  return (token, socket, next) => {
    // const token = socket.user.token;
    const decoded = jwt.decode(token);
    const { scopes } = decoded;

    const hasRequiredScopes = requiredScopes.every((requiredScope) =>
      scopes.includes(requiredScope)
    );

    if (!hasRequiredScopes) {
      return next(new Error("Insufficient privileges"));
    }
    next();
  };
};

module.exports = { socketScope };
