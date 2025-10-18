import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useSocket } from "../context/SocketContext";

const CreateQuiz = () => {
  const [hostName, setHostName] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    const storedHostName = localStorage.getItem("hostName");
    if (storedHostName) setHostName(storedHostName);

    if (!socket.connected) {
      socket.connect();
    }

    const handleGameCreated = ({ game }) => {
      navigate(`/lobby/${game.pin}`, { state: { isHost: true, game } });
    };

    socket.on("host:game-created", handleGameCreated);
    return () => {
      socket.off("host:game-created", handleGameCreated);
    };
  }, [socket, navigate]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
    ]);
  };

  const handleDeleteQuestion = (qIndex) => {
    if (questions.length === 1) return; // keep at least one question
    const newQuestions = questions.filter((_, idx) => idx !== qIndex);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswer = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswerIndex = oIndex;
    setQuestions(newQuestions);
  };

  const validateForm = () => {
    if (!hostName.trim()) {
      toast.error("Please enter the host name");
      return false;
    }
    for (const q of questions) {
      if (!q.questionText.trim())
        return toast.error("Please fill out all question fields"), false;
      for (const opt of q.options)
        if (!opt.trim())
          return toast.error("Please fill out all option fields"), false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const formattedQuestions = questions.map((q) => ({
        questionText: q.questionText,
        options: q.options.map((opt, index) => ({
          text: opt,
          isCorrect: index === q.correctAnswerIndex,
        })),
      }));

      const payload = { hostName, questions: formattedQuestions };

      const res = await axios.post(
        "http://localhost:5000/api/quiz/create-quiz",
        payload
      );

      const quiz = res.data.quiz;
      const code = quiz.code;
      const quizId = quiz._id;

      toast.success(`Quiz created! Code: ${code}`);

      // Save for later sessions
      localStorage.setItem("quizCode", code);
      localStorage.setItem("quizId", quizId);

      // Immediately create a live game session for this quiz
      socket.emit("host:create-game", { name: hostName, quizId });

      //* Clear the form
      localStorage.removeItem("hostName");
      setHostName("");
      setQuestions([
        { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
      ]);
    } catch (err) {
      console.error(err);
      toast.error("Error creating quiz. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold text-center text-purple-600 mb-6">
        Create Quiz
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Host Name"
          readOnly={Boolean(localStorage.getItem("hostName"))}
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
          className="p-2 border rounded"
          required
        />

        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="border p-4 rounded flex flex-col gap-3 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">
                Question {qIndex + 1}
              </h2>
              <button
                type="button"
                onClick={() => handleDeleteQuestion(qIndex)}
                disabled={questions.length === 1}
                className="text-red-600 text-sm px-2 py-1 rounded hover:bg-red-50 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
            <input
              type="text"
              placeholder={`Question ${qIndex + 1} text`}
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="w-full p-2 border rounded"
              required
            />

            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={q.correctAnswerIndex === oIndex}
                  onChange={() => handleCorrectAnswer(qIndex, oIndex)}
                  className="form-radio text-purple-600 h-4 w-4"
                />
                <input
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, e.target.value)
                  }
                  className="p-2 border rounded flex-1"
                  required
                />
              </div>
            ))}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddQuestion}
          className="p-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition duration-150"
        >
          Add Another Question
        </button>

        <button
          type="submit"
          className="p-3 bg-purple-600 text-white font-extrabold rounded-lg hover:bg-purple-700 transition duration-150 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Creating Quiz..." : "Create Quiz"}
        </button>
      </form>
      //* Toaster container
      <ToastContainer position="top-center" />
    </div>
  );
};

export default CreateQuiz;
