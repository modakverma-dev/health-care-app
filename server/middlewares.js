function extractToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    req.token = authHeader.split(" ")[1];
  }
  next();
}

module.exports = { extractToken };
