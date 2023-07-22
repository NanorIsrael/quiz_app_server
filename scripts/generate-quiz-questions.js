require("dotenv").config();

const { exit } = require("process");
const quiz = require("../models/quiz");
const user = require("../models/user");
const quizResults = require("../models/quiz_results");
const auth = require("../models/auth");
const mongoose = require("mongoose");
const url = process.env.MONGO_URI;

async function generateTestQuizes() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }

  const quizQuestionsDB = [
    {
      question: "Which of the following is the capital of Ghana?",
      question_options: ["Temale", "Kumasi", "Accra", "None of the above"],
      question_answer: "Accra",
    },
    {
      question: "In which year did Ghana became independent?",
      question_options: ["1997", "1957", "1967", "None of the above"],
      question_answer: "1957",
    },
    {
      question: "Who was the Ancient Greek God of the Sun?",
      question_options: ["Olympus", "Apollo", "Eris", "None of the above"],
      question_answer: "Apollo",
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

  try {
    await user.collection.drop();
    await quiz.collection.drop();
    await auth.collection.drop();
    await quizResults.collection.drop();

    for (let question of quizQuestionsDB) {
      await quiz.create(question);
    }
  } catch (error) {
    console.log(error);
  }

  setInterval(async () => {
    await mongoose.disconnect();
  }, 10000);
}

generateTestQuizes()
  .then((result) => {
    console.log("10 quiz questions Successfully added.");
    exit(0);
  })
  .catch((err) => {
    console.error("Script run failed");
    exit(1);
  });
