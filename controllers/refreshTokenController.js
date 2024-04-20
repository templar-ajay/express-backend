const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = function (req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(
    (_user) => _user.refreshToken === refreshToken
  );

  if (!foundUser) {
    return res.sendStatus(403); // forbidden
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);

    // const roles = Object.values(foundUser.roles);
    const foundUser_roleCode = Object.values(foundUser.role)[0];

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          role: foundUser_roleCode,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_DURATION || "30s" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
