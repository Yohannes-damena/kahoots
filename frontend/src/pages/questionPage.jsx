import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Question from "../components/Question";
import AnswerOptions from "../components/AnswerOptions";

const questionPage = () => {
  const { code } = useParams(); // e.g. /quiz/:code
  const [quiz, setQuiz] = useState(null);
  const [playerAnswer, setPlayerAnswer] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch quiz from backend
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quiz/${code}`);
        setQuiz(res.data.quiz);
      } catch (err) {
        console.error(err);
        setError(
          "Failed to load quiz. Please check your backend or quiz code."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [code]);

  if (loading) {
    return <div className="text-center text-white mt-10">Loading quiz...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!quiz) {
    return <div className="text-center text-white mt-10">No quiz found.</div>;
  }

  const question = quiz.questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setPlayerAnswer(null);
    } else {
      alert("Quiz completed!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-brand-blue">
          Host: {quiz.hostName}
        </h2>
        <Question question={question} />
        <AnswerOptions
          question={question}
          onAnswer={setPlayerAnswer}
          playerAnswer={playerAnswer}
        />
      </motion.div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => setPlayerAnswer(null)}
          className="bg-brand-blue text-white font-bold py-2 px-6 rounded-lg hover:opacity-80 transition-opacity"
        >
          Reset Answer
        </button>
        <button
          onClick={handleNext}
          className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:opacity-80 transition-opacity"
        >
          Next Question
        </button>
        <Link
          to="/test"
          className="text-white/50 hover:text-white transition-colors bg-white/10 py-2 px-6 rounded-lg"
        >
          &larr; Back to Test Lab
        </Link>
      </div>
    </div>
  );
};

export default questionPage;
