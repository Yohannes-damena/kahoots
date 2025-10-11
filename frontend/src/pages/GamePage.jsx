import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import Question from '../components/Question';
import AnswerOptions from '../components/AnswerOptions';
import Leaderboard from '../components/Leaderboard';
import GameEnd from '../components/GameEnd';
import Spinner from '../components/Spinner';

const GamePage = () => {
    const { state } = useLocation();
    const { gamePin } = useParams();
    const navigate = useNavigate();
    const socket = useSocket();

    const [gameState, setGameState] = useState('waiting'); // waiting, question, leaderboard, end
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionResult, setQuestionResult] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [finalScores, setFinalScores] = useState([]);
    const [playerAnswer, setPlayerAnswer] = useState(null);
    const [isLastQuestion, setIsLastQuestion] = useState(false);

    const { isHost, playerId } = state || {};

    useEffect(() => {
        if (!state) {
            navigate('/');
            return;
        }

        const handleNewQuestion = (data) => {
            setCurrentQuestion(data);
            setQuestionResult(null);
            setPlayerAnswer(null);
            setGameState('question');
            setIsLastQuestion(data.questionIndex === data.totalQuestions - 1);
        };

        const handleShowAnswer = (data) => {
            setQuestionResult(data);
            setLeaderboard(data.scores);
            setGameState('leaderboard');
        };

        const handleGameEnded = (data) => {
            setFinalScores(data.finalScores);
            setGameState('end');
        };

        socket.on('game:new-question', handleNewQuestion);
        socket.on('game:show-answer', handleShowAnswer);
        socket.on('game:ended', handleGameEnded);

        return () => {
            socket.off('game:new-question', handleNewQuestion);
            socket.off('game:show-answer', handleShowAnswer);
            socket.off('game:ended', handleGameEnded);
        };
    }, [socket, navigate, state]);

    const handleAnswerSubmit = (answerIndex) => {
        if (playerAnswer === null) {
            setPlayerAnswer(answerIndex);
            socket.emit('player:submit-answer', { pin: gamePin, answerIndex, playerId });
        }
    };

    const handleNextQuestion = () => {
        socket.emit('host:next-question', { pin: gamePin });
    };

    const handlePlayAgain = () => {
        navigate('/');
    };

    const renderContent = () => {
        switch (gameState) {
            case 'question':
                return (
                    <div className="w-full">
                        <Question question={currentQuestion} />
                        {!isHost && <AnswerOptions question={currentQuestion} onAnswer={handleAnswerSubmit} playerAnswer={playerAnswer} />}
                        {isHost && <p className="text-center text-white/70 mt-4">Players are answering...</p>}
                    </div>
                );
            case 'leaderboard':
                return (
                    <Leaderboard
                        leaderboard={leaderboard}
                        questionResult={questionResult}
                        isHost={isHost}
                        onNext={handleNextQuestion}
                        isLastQuestion={isLastQuestion}
                    />
                );
            case 'end':
                return <GameEnd finalScores={finalScores} onPlayAgain={handlePlayAgain} />;
            default:
                return <Spinner text="Waiting for the next question..." />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-4 text-white font-sans"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={gameState}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-5xl mx-auto"
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default GamePage;
