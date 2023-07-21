const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middlewares/auth");
const {QuizDataSource} = require("../controllers/Quiz");
// const quiz = new UserDataSource();

/* GET users listing. */
router.get("/", async function (req, res) {
  try {
    const quizQuestions = await QuizDataSource.getAllQuizQuestions();
    res.status(200).json({
      ok: false,
      quizQuestions,
      errors: {},
    });
  } catch(error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      errors: {
        error: "Something might have gone wrong, Please try again later."
      },
    });
  }
});

module.exports = router;