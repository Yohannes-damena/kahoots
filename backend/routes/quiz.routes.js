import express from "express";
import { addQuestion, createQuiz, getQuestion } from "./quiz.controller.js";

const router = express.Router();

router.post("/add-question/:quizId", addQuestion);
router.post("/create-quiz", createQuiz);
router.get("/:code", getQuestion);
export default router;
