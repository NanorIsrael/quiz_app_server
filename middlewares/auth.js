const { verifyToken } = require("../services/tokenService");
const tokenTypes = require("../services/token");
const UserDataSource = require("../models/user");
// const userData = new UserDataSource();

async function verifyUser(req, res, next) {
  try {
    if (!req.headers.authorization)
      return res.status(403).json({
        errors: {
          error: "Authorization required.",
        },
      });

    const tokenParts = req.headers.authorization.split(" ");

    if (tokenParts[0] === "Bearer" && tokenParts[1].match(/\S*\.\S*\.\S*/)) {
      const tokenData = await verifyToken(tokenParts[1], tokenTypes.ACCESS);
      // if (tokenData)
      const userId = tokenData["userId"].toString();

      const user = await UserDataSource.findById(userId);

      if (!user) {
        return res.status(401).json({
          ok: false,
          errors: {
            error: "You are not authorized.",
          },
        });
      }

      req.body.accountId = user._id;

      next();
    } else {
      return res.status(403).json({
        ok: false,
        errors: {
          error: "Access denied. No token provided.",
        },
      });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        errors: {
          error: "Oops! An Error occurred. token expired.",
        },
      });
    }
    return res.status(error.code || 500).json({
      ok: false,
      errors: {
        error: "Oops! An Error occurred. Please try again later.",
      },
    });
  }
}

module.exports = {
  verifyUser,
};
