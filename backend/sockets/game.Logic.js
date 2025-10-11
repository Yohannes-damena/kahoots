// backend/game/gameLogic.js
export const games = {};

export const sendQuestion = (io, pin) => {
  const game = games[pin];
  if (!game) return;
  game.currentQuestionIndex++;
  game.answers = [];
  game.gameState = "playing";

  const question = game.questions[game.currentQuestionIndex];

  io.to(pin).emit("game:new-question", {
    text: question.text,
    options: question.options,
    questionIndex: game.currentQuestionIndex,
    totalQuestions: game.questions.length,
  });

  setTimeout(() => {
    if (game.gameState === "playing") {
      showAnswerAndLeaderboard(io, pin);
    }
  }, 15000);
};

export const showAnswerAndLeaderboard = (io, pin) => {
  const game = games[pin];
  if (!game || game.gameState !== "playing") return;

  game.gameState = "leaderboard";
  const question = game.questions[game.currentQuestionIndex];
  const scores = [...game.players].sort((a, b) => b.score - a.score);

  io.to(pin).emit("game:show-answer", {
    correctAnswerIndex: question.correctAnswerIndex,
    scores,
  });
};
