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
          questionNumber: 1,
          question: "Which of the following is the capital of Ghana.",
          question_options: ["Temale", "Kumasi", "Accra", "None of the above"],
          question_answer: "Accra",
          selectedAnswer: "Kumasi",
        },
        {
          questionNumber: 2,
          question: "In which year did Ghana became independent.",
          question_options: ["1997", "19957", "1967", "None of the above"],
          selectedAnswer: "1957",
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
    await generateTestQuizes();
    const quizes = await QuizDataSource.getQuizQuestion();

    expect(quizes).not.toBeNull();
    expect(quizes.question_number).toBe(1);
    expect(Object.keys(quizes.question_options)).toHaveLength(4);
  });

  it("gets all quizes questions", async () => {
    await generateTestQuizes();
    const quizes = await QuizDataSource.getAllQuizQuestions();

    expect(quizes).toHaveLength(10);
    expect(quizes[0].question_options).toHaveLength(4);
  });

  it("processes quiz results", async () => {
    await generateTestQuizes();

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

const generateTestQuizes = async () => {
  const quizQuestionsDB = [
    {
      question: "Which of the following is the capital of Ghana?",
      question_options: ["Temale", "Kumasi", "Accra", "None of the above"],
      question_answer: "Accra",
    },
    {
      question: "In which year did Ghana became independent?",
      question_options: ["1997", "19957", "1967", "None of the above"],
      question_answer: "1957",
    },
    {
      question: "Who was the Ancient Greek God of the Sun?",
      question_options: ["Olympus", "Apollo", "Eris", "None of the above"],
      question_answer: "e",
    },
    {
      question: "Aureolin is a shade of what color?",
      question_options: ["White", "Purple", "Yellow", "None of the above"],
      question_answer: "Yellow",
    },
    {
      question: 'What company was originally called "Cadabra"?',
      question_options: [
        "spaceX",
        "Grace Valley",
        "Amazon",
        "None of the above",
      ],
      question_answer: "Amazon",
    },
    {
      question: "How many minutes are in a full week?",
      question_options: ["1090", "1080", "2015", "None of the above"],
      question_answer: "1080",
    },
    {
      question: "How many elements are in the periodic table?",
      question_options: ["118", "108", "20", "None of the above"],
      question_answer: "118",
    },
    {
      question: "How many faces does a Dodecahedron have?",
      question_options: ["10", "8", "12", "None of the above"],
      question_answer: "12",
    },
    {
      question: 'What city is known as "The Eternal City"?',
      question_options: ["Rome", "Paris", "London", "None of the above"],
      question_answer: "Rome",
    },
    {
      question: "Which planet has the most moons?",
      question_options: ["Mars", "Saturn", "Jupiter", "None of the above"],
      question_answer: "Saturn",
    },
  ];

  for (let question of quizQuestionsDB) {
    await quiz.create(question);
  }
};
