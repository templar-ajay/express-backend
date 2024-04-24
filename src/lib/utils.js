const { ms } = require("date-fns/locale");

function writeAccessTokenToCookie({ res, accessToken }) {
  res.cookie("jwt-access", accessToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: ms(process.env.ACCESS_TOKEN_DURATION),
  });
}

function writeRefreshTokenToCookie({ res, refreshToken }) {
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: ms(process.env.REFRESH_TOKEN_DURATION),
  });
}

module.exports = { writeAccessTokenToCookie, writeRefreshTokenToCookie };
