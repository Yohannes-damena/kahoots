import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const QuizQuestions = () => {
  const { code } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quiz/${code}`);
        console.log("Response data:", res.data);
        setQuiz(res.data.quiz || res.data);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [code]);

  if (loading)
    return <p className="text-center text-purple-500 mt-10">Loading quiz...</p>;

  if (!quiz)
    return <p className="text-center text-red-500 mt-10">Quiz not found.</p>;

  return (
    <div className="min-h-screen bg-purple-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">
        {quiz.hostName}'s Quiz
      </h1>
      {quiz.questions.map((q, index) => (
        <div
          key={index}
          className="bg-white w-full max-w-xl p-6 mb-4 rounded-xl shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-3">
            {index + 1}. {q.questionText}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                className="bg-purple-200 hover:bg-purple-400 text-purple-800 py-2 px-4 rounded-lg transition"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizQuestions;
