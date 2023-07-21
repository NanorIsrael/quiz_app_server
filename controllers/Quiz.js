const quiz = require("../models/quiz");

class QuizImpl {
  constructor() {
    // questions
  }

  async addQuiz(question) {
    await quiz.create(question);
  }

  async getQuizQuestion(filter) {
    return await quiz.findOne(filter);
  }

  async getAllQuizQuestions() {
    return await quiz.find({});
  }
}

const QuizDataSource = new QuizImpl();
module.exports = {
  QuizDataSource,
  QuizImpl,
};
