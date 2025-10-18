import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

const Question = ({ question }) => {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (!question || !question.timeLimitMs) return;
        
        const endTime = Date.now() + question.timeLimitMs;
        
        const interval = setInterval(() => {
            const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
            setTimeLeft(remaining);
            
            if (remaining <= 0) {
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [question]);

    if (!question) return null;

    const getTimerColor = () => {
        if (timeLeft === null) return 'text-white';
        if (timeLeft <= 3) return 'text-red-500';
        if (timeLeft <= 7) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <div className="text-center">
            <div className="flex justify-between items-center mb-4 text-lg">
                <span>Question {question.questionIndex + 1} of {question.totalQuestions}</span>
                {timeLeft !== null && (
                    <motion.div
                        key={timeLeft}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className={`flex items-center gap-2 font-bold text-2xl ${getTimerColor()}`}
                    >
                        <Clock size={24} />
                        <span>{timeLeft}s</span>
                    </motion.div>
                )}
            </div>
            <motion.div
                key={question.questionIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="bg-black/20 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-lg border border-white/10"
            >
                <h2 className="text-2xl md:text-4xl font-bold">{question.text}</h2>
            </motion.div>
        </div>
    );
};

export default Question;
