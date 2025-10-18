import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Award } from 'lucide-react';

const Leaderboard = ({ leaderboard, questionResult, isHost, onNext, isLastQuestion }) => {
    const { correctAnswerIndex, roundResults } = questionResult;

    const getPointsEarned = (playerId) => {
        const result = roundResults?.find(r => r.playerId === playerId);
        return result?.pointsEarned || 0;
    };

    return (
        <div className="text-center w-full max-w-2xl mx-auto">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="mb-8"
            >
                {correctAnswerIndex !== null ? (
                    <div className="flex items-center justify-center gap-2 text-3xl font-bold text-green-400">
                        <CheckCircle />
                        <span>Correct Answer!</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2 text-3xl font-bold text-red-400">
                        <XCircle />
                        <span>Times Up!</span>
                    </div>
                )}
            </motion.div>

            <h2 className="text-3xl font-bold mb-4">Leaderboard</h2>
            <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10 space-y-3">
                {leaderboard.map((player, index) => {
                    const pointsThisRound = getPointsEarned(player.id);
                    return (
                        <motion.div
                            key={player.id}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15 }}
                            className="flex items-center justify-between bg-white/10 p-3 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-lg w-6">{index + 1}</span>
                                {index < 3 && <Award size={20} className={['text-yellow-400', 'text-gray-300', 'text-yellow-700'][index]} />}
                                <div className="flex flex-col items-start">
                                    <span className="font-semibold">{player.name}</span>
                                    {pointsThisRound > 0 && (
                                        <span className="text-xs text-green-400">+{pointsThisRound} this round</span>
                                    )}
                                </div>
                            </div>
                            <span className="font-bold text-lg">{player.score}</span>
                        </motion.div>
                    );
                })}
            </div>
            {isHost && (
                <button
                    onClick={onNext}
                    className="mt-8 bg-brand-purple text-white font-bold py-3 px-8 rounded-lg text-xl hover:scale-105 transition-transform"
                >
                    {isLastQuestion ? 'Show Final Results' : 'Next Question'}
                </button>
            )}
        </div>
    );
};

export default Leaderboard;
