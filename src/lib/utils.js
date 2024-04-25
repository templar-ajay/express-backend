const ms = require("ms");
const jwt = require("jsonwebtoken");

function writeAccessTokenToCookie({ res, accessToken }) {
  res.cookie("access-token", accessToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: ms(process.env.ACCESS_TOKEN_DURATION),
  });
}

function writeRefreshTokenToCookie({ res, refreshToken }) {
  res.cookie("refresh-token", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: ms(process.env.REFRESH_TOKEN_DURATION),
  });
}

const signAccessToken = ({ username, role }) =>
  jwt.sign(
    {
      UserInfo: {
        username,
        role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      algorithm: "RS256",
      expiresIn: process.env.ACCESS_TOKEN_DURATION,
    }
  );

const signRefreshToken = ({ username }) =>
  jwt.sign(
    {
      username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_DURATION,
    }
  );

module.exports = {
  writeAccessTokenToCookie,
  writeRefreshTokenToCookie,
  signAccessToken,
  signRefreshToken,
};
