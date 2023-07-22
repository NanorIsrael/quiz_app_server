const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middlewares/auth");
const { QuizDataSource } = require("../controllers/Quiz");
const { QuizResultsDataSource } = require("../controllers/Results");
// const quiz = new UserDataSource();

/* GET quizes listing. */
router.get("/", async function (req, res) {
  try {
    const quizQuestions = await QuizDataSource.getAllQuizQuestions();
    res.status(200).json({
      ok: true,
      quizQuestions,
      errors: {},
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      errors: {
        error: "Something might have gone wrong, Please try again later.",
      },
    });
  }
});

/* GET quizes scores. */
router.post("/", verifyUser, async function (req, res) {
  try {
    const quizTaker = {
      quizQuestions: req.body.quizQuestions,
      status: req.body.status,
      accountId: req.body.accountId,
    };
    const score = await QuizResultsDataSource.processScore(
      quizTaker.quizQuestions,
    );

    await QuizResultsDataSource.processQuizResults(
      quizTaker.status,
      score,
      quizTaker.accountId,
      quizTaker.quizQuestions,
    );

    res.status(200).json({
      ok: true,
      score,
      errors: {},
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      errors: {
        error: "Something might have gone wrong, Please try again later.",
      },
    });
  }
});

/* GET quiz by number. */
router.get("/question", verifyUser, async function (req, res) {
  let questionNumber = 1;

  if (JSON.parse(req.query.index)) {
    questionNumber = Number(req.query.index);
  }

  try {
    const allQuizQuestions = await QuizDataSource.getAllQuizQuestions();
    const quizQuestion = await QuizDataSource.getQuizQuestion({
      question_number: questionNumber,
    });

    if (!quizQuestion || !allQuizQuestions) {
      res.status(501).json({
        ok: false,
        cusor: {
          hasNext: false,
          currentIndex: 0,
          totalNumber: 0,
        },
        errors: {
          error: "Could not retrieve question.",
        },
      });
      return;
    }

    res.status(200).json({
      ok: true,
      quizQuestion: {
        question: quizQuestion.question,
        question_number: quizQuestion.question_number,
        answer_options: quizQuestion.question_options,
      },

      cusor: {
        hasNext: questionNumber <= allQuizQuestions.length - 1,
        currentIndex: questionNumber,
        totalNumber: allQuizQuestions.length,
      },
      errors: {},
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      errors: {
        error: "Something might have gone wrong, Please try again later.",
      },
    });
  }
});

module.exports = router;
