import express from "express";
import { addQuestion, createQuiz } from "./quiz.controller.js";

const router = express.Router();

router.post("/add-question/:quizId", addQuestion);
router.post("/create-quiz", createQuiz);

export default router;
