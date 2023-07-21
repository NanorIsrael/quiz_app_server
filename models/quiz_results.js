const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quiz_resultSchema = new Schema({
  status: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  quiz: [
    {
      question_number: {
        type: Number,
        required: true,
      },
      selected_answer: {
        type: String,
        required: true,
      },
    },
  ],
});
const QuizResults = mongoose.model("QuizResults", quiz_resultSchema);
module.exports = QuizResults;
