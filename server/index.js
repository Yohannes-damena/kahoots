import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '..', 'dist')));

const games = {};

const questions = [
    {
        text: 'What is the capital of France?',
        options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
        correctAnswerIndex: 2,
    },
    {
        text: 'Which planet is known as the Red Planet?',
        options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
        correctAnswerIndex: 1,
    },
    {
        text: 'What is the largest mammal?',
        options: ['Elephant', 'Blue Whale', 'Giraffe', 'Great White Shark'],
        correctAnswerIndex: 1,
    },
    {
        text: 'Who wrote "Romeo and Juliet"?',
        options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
        correctAnswerIndex: 1,
    },
    {
        text: 'What is the chemical symbol for water?',
        options: ['O2', 'H2O', 'CO2', 'NaCl'],
        correctAnswerIndex: 1,
    },
];

const generatePin = () => {
    let pin;
    do {
        pin = Math.floor(1000 + Math.random() * 9000).toString();
    } while (games[pin]);
    return pin;
};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('host:create-game', ({ name }) => {
        const pin = generatePin();
        const hostId = socket.id;
        games[pin] = {
            pin,
            hostId,
            players: [{ id: hostId, name, score: 0, isHost: true }],
            questions: [...questions].sort(() => 0.5 - Math.random()).slice(0, 5), // Shuffle and pick 5
            currentQuestionIndex: -1,
            gameState: 'lobby',
            answers: [],
        };
        socket.join(pin);
        socket.emit('host:game-created', { game: games[pin] });
    });

    socket.on('player:join-game', ({ name, pin }) => {
        const game = games[pin];
        if (!game) {
            return socket.emit('player:join-error', { message: 'Game not found.' });
        }
        if (game.gameState !== 'lobby') {
            return socket.emit('player:join-error', { message: 'Game has already started.' });
        }
        const playerId = socket.id;
        game.players.push({ id: playerId, name, score: 0, isHost: false });
        socket.join(pin);
        socket.emit('player:join-success', { game, playerId });
        io.to(pin).emit('game:update-players', { players: game.players });
    });

    socket.on('host:start-game', ({ pin }) => {
        const game = games[pin];
        if (game && game.hostId === socket.id) {
            game.gameState = 'playing';
            io.to(pin).emit('game:started');
            sendQuestion(pin);
        }
    });
    
    socket.on('player:submit-answer', ({ pin, answerIndex, playerId }) => {
        const game = games[pin];
        if (!game || game.gameState !== 'playing') return;

        const player = game.players.find(p => p.id === playerId);
        if (!player) return;
        
        const question = game.questions[game.currentQuestionIndex];
        const isCorrect = question.correctAnswerIndex === answerIndex;
        
        game.answers.push({ playerId, answerIndex, isCorrect });

        if (isCorrect) {
            player.score += 100; // Simple scoring
        }
        
        // Check if all players have answered
        if (game.answers.length === game.players.length) {
            showAnswerAndLeaderboard(pin);
        }
    });
    
    socket.on('host:next-question', ({ pin }) => {
        const game = games[pin];
        if (game && game.hostId === socket.id) {
            if (game.currentQuestionIndex >= game.questions.length - 1) {
                // Game over
                game.gameState = 'end';
                const finalScores = [...game.players].sort((a, b) => b.score - a.score);
                io.to(pin).emit('game:ended', { finalScores });
            } else {
                sendQuestion(pin);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Find which game the player was in and remove them
        for (const pin in games) {
            const game = games[pin];
            const playerIndex = game.players.findIndex(p => p.id === socket.id);
            if (playerIndex !== -1) {
                game.players.splice(playerIndex, 1);
                if (game.hostId === socket.id) {
                    // Host disconnected, end game
                    io.to(pin).emit('game:ended', { finalScores: [] }); // Or some other message
                    delete games[pin];
                } else {
                    io.to(pin).emit('game:update-players', { players: game.players });
                }
                break;
            }
        }
    });
});

const sendQuestion = (pin) => {
    const game = games[pin];
    game.currentQuestionIndex++;
    game.answers = []; // Reset answers for the new question
    const question = game.questions[game.currentQuestionIndex];
    
    io.to(pin).emit('game:new-question', {
        text: question.text,
        options: question.options,
        questionIndex: game.currentQuestionIndex,
        totalQuestions: game.questions.length,
    });
    
    // Set a timer for the question
    setTimeout(() => {
        if (game.gameState === 'playing') {
            showAnswerAndLeaderboard(pin);
        }
    }, 15000); // 15 seconds per question
};

const showAnswerAndLeaderboard = (pin) => {
    const game = games[pin];
    if (!game || game.gameState !== 'playing') return;

    // Prevent this from being called multiple times by the timer and by all players answering
    if (game.gameState === 'leaderboard') return;
    game.gameState = 'leaderboard';

    const question = game.questions[game.currentQuestionIndex];
    const scores = [...game.players].sort((a, b) => b.score - a.score);
    
    io.to(pin).emit('game:show-answer', {
        correctAnswerIndex: question.correctAnswerIndex,
        scores,
    });
};

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
