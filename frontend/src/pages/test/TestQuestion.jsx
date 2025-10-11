import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Question from '../../components/Question';
import AnswerOptions from '../../components/AnswerOptions';
import { mockQuestion } from '../../lib/mockData';

const TestQuestionPage = () => {
    const [playerAnswer, setPlayerAnswer] = useState(null);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl mx-auto"
            >
                <Question question={mockQuestion} />
                <AnswerOptions question={mockQuestion} onAnswer={setPlayerAnswer} playerAnswer={playerAnswer} />
            </motion.div>
            <div className="mt-8 flex gap-4">
                <button onClick={() => setPlayerAnswer(null)} className="bg-brand-blue text-white font-bold py-2 px-6 rounded-lg hover:opacity-80 transition-opacity">
                    Reset Answer
                </button>
                <Link to="/test" className="text-white/50 hover:text-white transition-colors bg-white/10 py-2 px-6 rounded-lg">
                    &larr; Back to Test Lab
                </Link>
            </div>
        </div>
    );
};

export default TestQuestionPage;
