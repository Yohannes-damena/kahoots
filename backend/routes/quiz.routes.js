import express from "express";
import { createQuiz, getQuizByCode } from "./quiz.controller.js";

const router = express.Router();

router.post("/create-quiz", createQuiz);
router.get("/:code", getQuizByCode);
export default router;
