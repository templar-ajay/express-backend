const jwt = require("jsonwebtoken");
const { handleRefreshToken } = require("./refreshToken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  if (!accessToken) return res.sendStatus(401);

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      handleRefreshToken(req, res, next);
    }

    req.user = decoded.UserInfo.username;
    req.role = decoded.UserInfo.role;
    next();
  });
};

module.exports = verifyJWT;
