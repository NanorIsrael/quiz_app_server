import { QuizDataSource } from "../controllers/Quiz";
import { QuizResultsDataSource, quizeStatus } from "../controllers/Results";
import quiz from "../models/quiz";

const mongoose = require("mongoose");
const url = process.env.MONGO_URI;

describe("Quiz questions", () => {
  let quizTaker;
  beforeAll(async () => {
    try {
      // Connect to the MongoDB database
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }

    quizTaker = {
      quizQuestions: [
        {
          question_number: 1,
          question: "Which of the following is the capital of Ghana.",
          question_options: ["Temale", "Kumasi", "Accra", "None of the above"],
          question_answer: "Accra",
          selected_answer: "Kumasi",
        },
        {
          question_number: 2,
          question: "In which year did Ghana became independent.",
          question_options: ["1997", "19957", "1967", "None of the above"],
          selected_answer: "1957",
        },
      ],
      accountId: new mongoose.Types.ObjectId(),
      status: quizeStatus.COMPLETED,
    };
  });

  beforeEach(async () => {
    await quiz.deleteMany({});
  });

  afterAll(async () => {
    await quiz.collection.drop();
    // Close the Mongoose connection after all tests are done
    await mongoose.disconnect();
  });

  it("gets one quizes", async () => {
    await QuizDataSource.addQuiz();
    const quizes = await QuizDataSource.getQuizQuestion();

    expect(quizes).not.toBeNull();
    expect(quizes.question_number).toBe(1);
    expect(Object.keys(quizes.question_options)).toHaveLength(4);
  });

    it("gets all quizes questions", async () => {
      await QuizDataSource.addQuiz();
      const quizes = await QuizDataSource.getAllQuizQuestions();

      expect(quizes).toHaveLength(10);
      expect(quizes[0].question_options).toHaveLength(4);
    });

    it("processes quiz results", async () => {
      await QuizDataSource.addQuiz();

      const score = await QuizResultsDataSource.processScore(
        quizTaker.quizQuestions,
      );

      await QuizResultsDataSource.processQuizResults(
        quizTaker.status,
        score,
        quizTaker.accountId,
        quizTaker.quizQuestions,
      );
      const queryUserQuizResults = await QuizResultsDataSource.getUserQuizResults(
        quizTaker.accountId,
      );

      expect(queryUserQuizResults.userId).toEqual(quizTaker.accountId);
      expect(queryUserQuizResults.quiz).toHaveLength(
        quizTaker.quizQuestions.length,
      );
      expect(queryUserQuizResults.score).toEqual(10);
    });
});
