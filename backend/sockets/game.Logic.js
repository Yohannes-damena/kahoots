// backend/game/gameLogic.js
export const games = {};

const ANSWER_TIME_LIMIT_MS = 15000;

export const sendQuestion = (io, pin) => {
  const game = games[pin];
  if (!game) return;
  game.currentQuestionIndex++;
  game.answers = [];
  game.gameState = "playing";
  game.questionStartTime = Date.now();

  const question = game.questions[game.currentQuestionIndex];

  io.to(pin).emit("game:new-question", {
    text: question.text,
    options: question.options,
    questionIndex: game.currentQuestionIndex,
    totalQuestions: game.questions.length,
    timeLimitMs: ANSWER_TIME_LIMIT_MS,
  });

  setTimeout(() => {
    if (game.gameState === "playing") {
      showAnswerAndLeaderboard(io, pin);
    }
  }, ANSWER_TIME_LIMIT_MS);
};

export const showAnswerAndLeaderboard = (io, pin) => {
  const game = games[pin];
  if (!game || game.gameState !== "playing") return;

  game.gameState = "leaderboard";
  const question = game.questions[game.currentQuestionIndex];
  const scores = [...game.players].sort((a, b) => b.score - a.score);

  // Add information about points earned this round
  const roundResults = game.answers.map(answer => ({
    playerId: answer.playerId,
    playerName: game.players.find(p => p.id === answer.playerId)?.name,
    isCorrect: answer.isCorrect,
    pointsEarned: answer.earned,
    elapsedMs: answer.elapsedMs
  }));

  io.to(pin).emit("game:show-answer", {
    correctAnswerIndex: question.correctAnswerIndex,
    scores,
    roundResults,
  });
};
