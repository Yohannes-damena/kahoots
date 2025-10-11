import React, { useState } from "react";
import axios from "axios";

const CreateQuiz = () => {
  const [hostName, setHostName] = useState("");
  const [questions, setQuestions] = useState([
    // Initial state with one question
    { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  // --- Handlers to update the questions array ---

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      // Add a new question object
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

  // --- Validation Function ---

  const validateForm = () => {
    if (!hostName.trim()) {
      alert("Please enter the Host Name.");
      return false;
    }

    // Check every question for non-empty text and non-empty options
    for (const q of questions) {
      if (!q.questionText.trim()) {
        alert("Please fill out all question texts.");
        return false;
      }
      for (const option of q.options) {
        if (!option.trim()) {
          alert("Please fill out all option fields.");
          return false;
        }
      }
    }
    return true;
  };

  // --- Submission Handler ---

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    setLoading(true);

    try {
      // Transform questions to match the expected backend schema
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

      alert(`Quiz created! Code: ${res.data.quiz.code}`);
      // Reset form on success
      setHostName("");
      setQuestions([
        { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
      ]);
    } catch (err) {
      console.error(err);
      alert(
        "Error creating quiz. Check your console and ensure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Component Render ---

  return (
    // Reverted to simple max-w-md container for centered look without changing background
    <div className="w-full max-w-md mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold text-center text-purple-600 mb-6">
        Create Quiz
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Host Name Input */}
        <input
          type="text"
          placeholder="Host Name"
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
          className="p-2 border rounded"
          required
        />

        {/* Map through Questions */}
        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="border p-4 rounded flex flex-col gap-3 bg-white shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-700">
              Question {qIndex + 1}
            </h2>
            {/* Question Text Input */}
            <input
              type="text"
              placeholder={`Question ${qIndex + 1} text`}
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="w-full p-2 border rounded"
              required
            />

            {/* Options & Correct Answer Selection */}
            <div className="flex flex-col gap-2">
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
          </div>
        ))}

        {/* Add Question Button */}
        <button
          type="button"
          onClick={handleAddQuestion}
          className="p-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition duration-150"
        >
          Add Another Question
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          onClick={() => navigate("/create")}
          className="p-3 bg-purple-600 text-white font-extrabold rounded-lg hover:bg-purple-700 transition duration-150 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Creating Quiz..." : "Create Quiz"}
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
