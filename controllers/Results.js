const quizResults = require("../models/quiz_results");
const { QuizImpl } = require("../controllers/Quiz");

class QuizResultsImpl extends QuizImpl {
  constructor() {
    super();
  }

  async processScore(quizQuestions) {
    let score = 0;

    for (let q of quizQuestions) {
      const getAnsweredQuestion = await this.getQuizQuestion({
        question_number: q.question_number,
      });

      if (q.selected_answer === getAnsweredQuestion.question_answer) {
        score += 10;
      }
    }
    return score;
  }

  async processQuizResults(status, score, userId, quizQuestions) {
    try {
      let result = await quizResults
        .findOneAndUpdate(
          { userId },
          { status, score },
          { upsert: true, new: true },
        )
        .exec();

      // if (!result.quiz) {
      result.quiz = [];
      // }

      quizQuestions.forEach((question) => {
        result.quiz.push({
          question_number: question.question_number,
          selected_answer: question.selected_answer,
        });
      });

      await result.save();

      return result;
    } catch (error) {
      throw new Error(`Failed to process quiz results: ${error.message}`);
    }
  }

  async getUserQuizResults(userId) {
    return await quizResults.findOne({ userId });
  }
}

const quizeStatus = {
  COMPLETED: 1,
  PAUSED: 2,
  NOT_STARTED: 3,
};

const QuizResultsDataSource = new QuizResultsImpl();
module.exports = { QuizResultsDataSource, quizeStatus };
