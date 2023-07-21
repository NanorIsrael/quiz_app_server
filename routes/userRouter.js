const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middlewares/auth");
const UserDataSource = require("../controllers/Users");
const user = new UserDataSource();

/* GET users listing. */
router.get("/", function (req, res) {
  res.send("Hmm you like to play around don't you");
});

/* Add users. */
router.post("/signup", async function (req, res, next) {
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
    const userData = req.body
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
      errors: {error: "Something might have gone wrong, Please try again later."},
    });
  }
});

/* Log user in. */
router.post("/login", async function (req, res) {
  // Todo: input validations
  const errors = {};
  if (!req.body.email) {
    errors.email = "email is required";
  }
  if (!req.body.password) {
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
    const results = await user.login(req.body.email, req.body.password);
    if (!results.errors) {
      res.status(201).json({
        ok: true,
        accessToken: results.accessToken,
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
      errors: {
        error: "Something might have gone wrong, Please try again later."
      },
    });
  }
});

/* Log user out. */
router.delete("/logout", verifyUser, async function (req, res) {
  // Todo: add cookies implementation using redis
  try {
    const results = await user.logout(req.accountId);
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
    const userResults = await user.getUserById(req.accountId);
    if (!results.errors) {
      res.status(201).json({
        ok: true,
        user: {
          username: userResults.username
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
