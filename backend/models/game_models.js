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


// Persisted game results
const PlayerResultSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true },
});

const GameResultSchema = new mongoose.Schema(
  {
    pin: { type: String, required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    hostName: { type: String, required: true },
    players: [PlayerResultSchema],
    questionsCount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", QuizSchema);
export const GameResult = mongoose.model("GameResult", GameResultSchema);
