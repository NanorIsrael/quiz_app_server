const quiz = require("../models/quiz");

class QuizImpl {
  constructor() {
    // question_number
  }

  // question_number
  // question
  // question option
  // correct option
  async addQuiz() {
    await quiz.create({
      question: "Which of the following is the capital of Ghana.",
      question_options: ["Temale", "Kumasi", "Accra", "None of the above"],
      question_answer: "Accra",
    });
    await quiz.create({
      question: "In which year did Ghana became independent.",
      question_options: ["1997", "19957", "1967", "None of the above"],
      question_answer: "1957",
    });
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
