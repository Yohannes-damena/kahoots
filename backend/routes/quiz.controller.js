import { Quiz } from "../models/game_models.js";
// Create a new quiz
export const createQuiz = async (req, res) => {
  try {
    const { hostName } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code

    const quiz = new Quiz({ hostName, code, questions: [] });
    await quiz.save();

    res.status(201).json({ quizId: quiz._id, code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create quiz" });
  }
};
// Called each time the host submits a new question.
export const addQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { text, options, correctAnswerIndex } = req.body;

    const question = {
      text,
      options: options.map((opt, i) => ({
        text: opt,
        isCorrect: i === correctAnswerIndex,
      })),
    };

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { $push: { questions: question } },
      { new: true }
    );

    res.json(updatedQuiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add question" });
  }
};
