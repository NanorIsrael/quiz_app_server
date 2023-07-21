const mongoose = require("mongoose");

const quizSchema = require("./quizSchema");

const QuizQuestions = mongoose.model("QuizQuestions", quizSchema);
module.exports = QuizQuestions;
