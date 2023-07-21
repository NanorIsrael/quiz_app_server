const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizSchema = new Schema(
    {
      question: {
        type: String,
        required: true,
      },
      question_options: [
        {
          type: String,
          required: true,
        },
      ],
      question_answer: {
        type: String,
        required: true,
      },
      question_number: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    },
  );
  
  quizSchema.pre("save", function (next) {
    if (this.isNew) {
      this.constructor.find({}).then((result) => {
        this.question_number = result.length + 1;
        next();
      });
    }
  });
  
const QuizQuestions = mongoose.model("QuizQuestions", quizSchema);
module.exports = QuizQuestions;
