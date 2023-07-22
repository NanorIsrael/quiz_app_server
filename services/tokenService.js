const jwt = require("jsonwebtoken");
const tokenType = require("./token");
const { DateTime } = require("luxon");
const Auth = require("../models/auth");

function generateToken(userId, expires, type) {
  const secret = process.env.JWT_SECRET;
  const payload = {
    userId: userId,
    iat: DateTime.now().toSeconds(),
    exp: expires.toSeconds(),
    type,
  };
  return jwt.sign(payload, secret);
}

async function saveToken(token, userId, expires, type) {
  const tokenData = { token, type, expires, userId };

  await Auth.create(tokenData);
}

async function generateAuthTokens(accountId) {
  const accessTokenExpires = DateTime.now().plus({
    minutes: Number(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_MINUTES),
  });

  const accessToken = generateToken(
    accountId,
    accessTokenExpires,
    tokenType.ACCESS,
  );
  await saveToken(accessToken, accountId, accessTokenExpires, tokenType.ACCESS);

  const refreshTokenExpires = DateTime.now().plus({
    days: Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_MINUTES),
  });

  const refreshToken = generateToken(
    accountId,
    refreshTokenExpires,
    tokenType.REFRESH,
  );
  await saveToken(
    refreshToken,
    accountId,
    refreshTokenExpires,
    tokenType.REFRESH,
  );

  return {
    accessToken,
    accessTokenExpires: accessTokenExpires.toHTTP(),
    refreshToken,
    refreshTokenExpires: refreshTokenExpires.toHTTP(),
  };
}

async function verifyToken(token, type) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  if (!payload) {
    return "";
  }
  if (payload.type === type) {
    const tokenRow = await Auth.findOne({
      userId: payload.userId,
      type: payload.type,
    });

    if (tokenRow) {
      return tokenRow;
    } else {
      return new Error("Invalid token.");
    }
  } else {
    return new Error("Invalid token type.");
  }
}

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
};
