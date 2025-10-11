import React from 'react';
import { motion } from 'framer-motion';
import { Triangle, Circle, Square, Diamond } from 'lucide-react';

const shapes = [
    { icon: <Triangle className="h-6 w-6" />, color: 'bg-red-500' },
    { icon: <Diamond className="h-6 w-6" />, color: 'bg-blue-500' },
    { icon: <Circle className="h-6 w-6" />, color: 'bg-yellow-500' },
    { icon: <Square className="h-6 w-6" />, color: 'bg-green-500' },
];

const AnswerOptions = ({ question, onAnswer, playerAnswer }) => {
    if (!question) return null;

    return (
        <motion.div
            className="grid grid-cols-2 gap-4 mt-8"
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1,
                    },
                },
            }}
            initial="hidden"
            animate="show"
        >
            {question.options.map((option, index) => (
                <motion.button
                    key={index}
                    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                    onClick={() => onAnswer(index)}
                    disabled={playerAnswer !== null}
                    className={`flex items-center justify-start p-4 rounded-lg text-white font-semibold text-lg transition-all duration-300
                        ${shapes[index].color} 
                        ${playerAnswer !== null && playerAnswer !== index ? 'opacity-50' : ''}
                        ${playerAnswer !== null && playerAnswer === index ? 'ring-4 ring-white' : ''}
                        hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed`}
                >
                    <div className="bg-white/80 text-black rounded p-2 mr-4">{shapes[index].icon}</div>
                    <span>{option}</span>
                </motion.button>
            ))}
        </motion.div>
    );
};

export default AnswerOptions;
