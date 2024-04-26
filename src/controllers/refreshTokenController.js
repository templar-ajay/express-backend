const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const jwt = require("jsonwebtoken");
const { writeAccessTokenToCookie, signAccessToken } = require("../lib/utils");
require("dotenv").config();

const handleRefreshToken = function (req, res) {
  const cookies = req.cookies;
  if (!cookies["refresh-token"]) {
    console.log("cookie refresh-token not found", cookies);
    return res.sendStatus(401);
  }

  const refreshToken = cookies["refresh-token"];

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

    const accessToken = signAccessToken({
      username: foundUser.username,
      role: foundUser_roleCode,
    });

    writeAccessTokenToCookie({ res: res, accessToken: accessToken });

    return res.json({
      message: "login successful, access token provided in cookie in header",
    });
  });
};

module.exports = { handleRefreshToken };
