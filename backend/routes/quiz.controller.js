import { Quiz } from "../models/game_models.js";
// Create a new quiz
const generateUniqueCode = async (length = 6) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code;

  let exists = true;
  while (exists) {
    code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Check in DB if code already exists
    exists = await Quiz.findOne({ code });
  }

  return code;
};
export const createQuiz = async (req, res) => {
  try {
    const { hostName, questions } = req.body;
    const code = await generateUniqueCode();

    const quiz = new Quiz({ hostName, code, questions });
    await quiz.save();

    res.status(201).json({ message: "Quiz created!", quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create quiz" });
  }
};

export const getQuizByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const quiz = await Quiz.findOne({ code });

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching quiz" });
  }
};
