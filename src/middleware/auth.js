const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(498).json({ msg: "No token, authorization denied" });
    return;
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    res.status(498).json({ msg: "No token, authorization denied" });
    return;
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      res.status(498).json({ msg: "Token is not valid" });
      return;
    }
    req.id = user.id;
    next();
  });
};
