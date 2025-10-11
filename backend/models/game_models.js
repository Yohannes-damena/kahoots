import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
});
const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [OptionSchema],
});
const QuizSchema = new mongoose.Schema(
  {
    hostName: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    questions: [QuestionSchema],
  },
  { timestamps: true } // Automatically adds a createdAt & updatedAt
);

export const Quiz = mongoose.model("Quiz", QuizSchema);
