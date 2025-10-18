import { games, sendQuestion, showAnswerAndLeaderboard } from "./game.Logic.js";
import { Quiz, GameResult } from "../models/game_models.js";

// Generate unique 6-digit PIN
const generatePin = (games, length = 6) => {
  const chars = "0123456789";
  let pin;
  do {
    pin = "";
    for (let i = 0; i < length; i++) {
      pin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (games[pin]);
  return pin;
};

// Main socket handlers
export const socketHandlers = (io, socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("host:create-game", async ({ name, quizId }) => {
    try {
      const quiz = await Quiz.findById(quizId);
      if (!quiz)
        return socket.emit("host:create-error", { message: "Quiz not found." });

      const pin = generatePin(games);
      const hostId = socket.id;

      const selectedQuestions = [...quiz.questions]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5)
        .map((q) => ({
          text: q.questionText,
          options: q.options.map((opt) => opt.text),
          correctAnswerIndex: q.options.findIndex((opt) => opt.isCorrect),
          points: 100,
        }));

      games[pin] = {
        pin,
        hostId,
        hostName: name,
        players: [], // empty — real players join later
        questions: selectedQuestions,
        currentQuestionIndex: -1,
        gameState: "lobby",
        answers: [],
        quizId: quiz._id,
      };

      // Create Game
      socket.join(pin);
      socket.emit("host:game-created", { game: games[pin] });
    } catch (err) {
      console.error(err);
      socket.emit("host:create-error", { message: "Failed to create game." });
    }
  });
  // Join Game
  socket.on("player:join-game", ({ name, pin }) => {
    const game = games[pin];
    if (!game)
      return socket.emit("player:join-error", { message: "Game not found." });
    if (game.gameState !== "lobby")
      return socket.emit("player:join-error", {
        message: "Game already started.",
      });

    const playerId = socket.id;
    game.players.push({ id: playerId, name, score: 0, isHost: false });
    socket.join(pin);
    socket.emit("player:join-success", { game, playerId });
    io.to(pin).emit("game:update-players", { players: game.players });
  });

  socket.on("host:start-game", ({ pin }) => {
    const game = games[pin];
    if (game && game.hostId === socket.id) {
      game.gameState = "playing";
      io.to(pin).emit("game:started");
      sendQuestion(io, pin); // pass io so it can emit
    }
  });

  socket.on("player:submit-answer", ({ pin, answerIndex, playerId }) => {
    const game = games[pin];
    if (!game || game.gameState !== "playing") return;

    const player = game.players.find((p) => p.id === playerId);
    if (!player) return;

    const question = game.questions[game.currentQuestionIndex];
    const isCorrect = question.correctAnswerIndex === answerIndex;

    // Calculate time-based score: faster answers earn more within the time limit
    const elapsedMs = Math.max(
      0,
      Date.now() - (game.questionStartTime || Date.now())
    );
    const timeFactor = Math.max(0, 1 - elapsedMs / 15000); // 0..1
    const basePoints = question.points ?? 100;
    const earned = isCorrect
      ? Math.round(basePoints * (0.5 + 0.5 * timeFactor))
      : 0; // 50%-100% of base

    game.answers.push({ playerId, answerIndex, isCorrect, elapsedMs, earned });
    if (isCorrect) player.score += earned;

    if (game.answers.length === game.players.length) {
      showAnswerAndLeaderboard(io, pin);
    }
  });
  socket.on("host:next-question", ({ pin }) => {
    const game = games[pin];
    if (!game || game.hostId !== socket.id) return;

    const isLastQuestion =
      game.currentQuestionIndex >= game.questions.length - 1;

    if (isLastQuestion) {
      game.gameState = "end";

      // ✅ Filter out the host from scores
      const finalScores = game.players
        .filter((p) => !p.isHost)
        .sort((a, b) => b.score - a.score);

      // ✅ Persist results (without host)
      const doc = new GameResult({
        pin,
        quizId: game.quizId,
        hostName: game.players.find((p) => p.isHost)?.name || "Host",
        players: finalScores.map(({ name, score }) => ({ name, score })),
        questionsCount: game.questions.length,
      });

      doc
        .save()
        .catch((err) =>
          console.warn("Failed to save game result:", err.message)
        );

      // ✅ Emit final leaderboard (players only)
      io.to(pin).emit("game:ended", { finalScores });
    } else {
      sendQuestion(io, pin);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const pin in games) {
      const game = games[pin];
      const playerIndex = game.players.findIndex((p) => p.id === socket.id);
      if (playerIndex !== -1) {
        game.players.splice(playerIndex, 1);
        if (game.hostId === socket.id) {
          io.to(pin).emit("game:ended", { finalScores: [] });
          delete games[pin];
        } else {
          io.to(pin).emit("game:update-players", { players: game.players });
        }
        break;
      }
    }
  });
};
