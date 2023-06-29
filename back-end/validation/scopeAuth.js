const jwt = require("jsonwebtoken");

const scopeAuth = (requiredScopes) => {
  return (req, res, next) => {
    const { token } = req.user;
    const decoded = jwt.decode(token);
    const { scopes } = decoded;

    const hasRequiredScopes = requiredScopes.every((requiredScope) =>
      scopes.includes(requiredScope)
    );

    if (!hasRequiredScopes) {
      return res.status(403).json({ message: "Insufficient privileges" });
    }
    next();
  };
};

module.exports = { scopeAuth };
