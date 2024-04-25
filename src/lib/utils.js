const ms = require("ms");

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

module.exports = { writeAccessTokenToCookie, writeRefreshTokenToCookie };
