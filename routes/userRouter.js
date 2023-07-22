const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middlewares/auth");
const UserDataSource = require("../controllers/Users");
const Auth = require("../models/auth");
const tokenTypes = require("../services/token");
const authService = require("../services/tokenService");
const user = new UserDataSource();

/* GET users listing. */
router.get("/", function (req, res) {
  res.send("Hmm you like to play around don't you");
});

/* Add users. */
router.post("/tokens", async function (req, res, next) {
  // Todo: input validations
  const errors = {};
  if (!req.body.email) {
    errors.email = "email is required";
  }
  if (!req.body.username) {
    errors.lastname = "lastname is required";
  }

  if (!req.body.password) {
    errors.password = "password is required";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(403).json({
      ok: false,
      errors,
    });
  }

  try {
    const userData = req.body;
    const result = await user.addUser(userData);

    if (!result.errors) {
      res.status(201).json({
        ok: true,
        errors: {},
      });
    } else {
      res.status(403).json({
        ok: false,
        errors: result.errors,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      errors: {
        error: "Something might have gone wrong, Please try again later.",
      },
    });
  }
});

/* Log user in. */
router.post("/token", async function (req, res) {
  // Todo: input validations
  // header authorization check
  const errors = {};
  const body = req.headers.authorization.split("Basic ");
  const decodedString = Buffer.from(body[1], "base64").toString("utf-8");
  const loginCredentials = decodedString.split(":");

  const email = loginCredentials[0];
  const password = loginCredentials[1];
  if (!email) {
    errors.email = "email is required";
  }
  if (!password) {
    errors.password = "password is required";
  }

  if (Object.keys(errors).length > 0) {
    res.status(403).json({
      ok: false,
      accessToken: null,
      errors,
    });

    return;
  }
  try {
    const results = await user.login(email, password);

    if (!results.errors) {
      res.cookie("checker", results.refreshToken, {
        httpOnly: true,
        maxAge: 3600000, // 1 hour in milliseconds
        path: "/",
      });
      res.status(201).json({
        ok: true,
        accessToken: results.accessToken,
        errors: {},
      });
    } else {
      res.status(401).json({
        ok: false,
        errors: results.errors,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      errors: {
        error: "Something might have gone wrong, Please try again later.",
      },
    });
  }
});

/* Log user out. */
router.delete("/tokens", verifyUser, async function (req, res) {
  try {
    const results = await user.logout(req.body.accountId);
    if (!results.errors) {
      res.status(201).json({
        ok: true,
        errors: {},
      });
    } else {
      res.status(403).json({
        ok: false,
        errors: results.errors,
      });
    }
  } catch (err) {
    res.status(500).json({
      ok: false,
      errors: "Something might have gone wrong, Please try again later.",
    });
  }
});

/* update user access tokens. */
router.put("/tokens", async function (req, res) {
  //  Todo: check for cookie and authorization

  try {
    if (!req.body.accessToken || !req.headers.cookie) {
      return res.status(401).json({
        errors: {
          error: "access token required",
        },
      });
    }

    const accessToken = req.body.accessToken;

    const refreshToken = req.headers.cookie.split("checker=")[1];

    const tokenData = await authService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH,
    );
    const userId = tokenData["userId"].toString();

    const authInfo = await Auth.findOne({
      userId,
      type: tokenTypes.ACCESS,
    });

    if (authInfo) {
      const isVerified = authInfo.token === accessToken;

      if (isVerified) {
        await Auth.deleteMany({ userId });

        const newTokens = await authService.generateAuthTokens(userId);
        const newAccessToken = newTokens.accessToken;

        res.cookie("checker", newTokens.refreshToken).json({
          accessToken: newAccessToken,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      errors: "Something might have gone wrong, Please try again later.",
    });
  }
});

/* GET users listing. */
router.get("/me", verifyUser, async function (req, res) {
  try {
    const accountId = req.body.accountId;
    const userResults = await user.getUserById(accountId);

    if (!userResults.errors) {
      res.status(201).json({
        user: {
          username: userResults.username,
        },
        errors: {},
      });
    } else {
      res.status(403).json({
        ok: false,
        errors: results.errors,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      errors: "Something might have gone wrong, Please try again later.",
    });
  }
});

module.exports = router;
