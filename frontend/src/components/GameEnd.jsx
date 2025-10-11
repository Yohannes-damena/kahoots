import React from 'react';
import { motion } from 'framer-motion';
import { Award, PartyPopper } from 'lucide-react';

const GameEnd = ({ finalScores, onPlayAgain }) => {
    return (
        <div className="text-center w-full max-w-2xl mx-auto">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="mb-8"
            >
                <h1 className="text-5xl font-extrabold">Game Over!</h1>
                {finalScores.length > 0 && (
                    <div className="mt-4 text-3xl font-bold flex items-center justify-center gap-3 text-brand-yellow">
                        <Award size={40} />
                        <span>{finalScores[0].name} Wins!</span>
                        <Award size={40} />
                    </div>
                )}
            </motion.div>

            <h2 className="text-3xl font-bold mb-4">Final Scores</h2>
            <div className="bg-black/20 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10 space-y-3">
                {finalScores.map((player, index) => (
                    <motion.div
                        key={player.id}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 + 0.5 }}
                        className={`flex items-center justify-between p-3 rounded-lg ${index === 0 ? 'bg-yellow-500/30' : 'bg-white/10'}`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-lg w-6">{index + 1}</span>
                            {index < 3 && <Award size={20} className={['text-yellow-400', 'text-gray-300', 'text-yellow-700'][index]} />}
                            <span className="font-semibold">{player.name}</span>
                        </div>
                        <span className="font-bold text-lg">{player.score}</span>
                    </motion.div>
                ))}
            </div>

            <button
                onClick={onPlayAgain}
                className="mt-8 bg-brand-pink text-white font-bold py-3 px-8 rounded-lg text-xl hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
            >
                <PartyPopper />
                Play Again
            </button>
        </div>
    );
};

export default GameEnd;
