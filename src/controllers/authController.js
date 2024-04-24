const {
  writeAccessTokenToCookie,
  writeRefreshTokenToCookie,
} = require("../lib/utils");
const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async function (req, res) {
  const { user, pwd } = req.body;
  console.log("user", user);
  console.log("pwd", pwd);
  if (!user || !pwd) {
    return res.status(400).json({ message: "user and pwd are required" });
  }
  const foundUser = usersDB.users.find((_user) => _user.username === user);
  if (!foundUser) {
    return res.status(401).json({ error: "user not found", field: "username" }); // unauthorized
  }
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // const roles = Object.values(foundUser.roles);
    const foundUser_roleCode = Object.values(foundUser.role)[0];

    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          role: foundUser_roleCode,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_DURATION || "30s",
      }
    );
    const refreshToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // save refreshToken in database as a user property
    const otherUsers = usersDB.users.filter(
      (_user) => _user.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users, null, 2)
    );
    writeRefreshTokenToCookie({ res: res, refreshToken: refreshToken });
    writeAccessTokenToCookie({ res: res, accessToken: accessToken });
    return res.status(200).json({
      message: "login successful, access token provided in cookie in header",
    });
  }
  res.status(401).json({ error: "wrong password", field: "password" });
};

module.exports = { handleLogin };
