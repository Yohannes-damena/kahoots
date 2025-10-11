import React, { useState } from "react";
import axios from "axios";

const CreateQuiz = () => {
  const [hostName, setHostName] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
    ]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Transform questions to match Mongoose schema
      const formattedQuestions = questions.map((q) => ({
        questionText: q.questionText,
        options: q.options.map((opt, index) => ({
          text: opt,
          isCorrect: index === q.correctAnswerIndex,
        })),
      }));

      const res = await axios.post("http://localhost:5000/api/quiz/create", {
        hostName,
        questions: formattedQuestions,
      });

      alert(`Quiz created! PIN: ${res.data.quiz.code}`);
      // Reset form
      setHostName("");
      setQuestions([
        { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
      ]);
    } catch (err) {
      console.error(err);
      alert("Error creating quiz. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-purple-600">
        Create Quiz
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="border p-4 rounded flex flex-col gap-2">
            <input
              type="text"
              placeholder={`Question ${qIndex + 1}`}
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="p-2 border rounded"
            />
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex items-center gap-2">
                <input
                  required="true"
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={q.correctAnswerIndex === oIndex}
                  onChange={() => handleCorrectAnswer(qIndex, oIndex)}
                />
                <input
                  type="text"
                  required="true"
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, e.target.value)
                  }
                  className="p-2 border rounded flex-1"
                />
              </div>
            ))}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddQuestion}
          className="bg-gray-200 p-2 rounded"
        >
          Add Question
        </button>

        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded font-bold"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Quiz"}
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
