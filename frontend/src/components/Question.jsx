import { motion } from 'framer-motion';

const Question = ({ question }) => {
    if (!question) return null;

    return (
        <div className="text-center">
            <div className="flex justify-between items-center mb-4 text-lg">
                <span>Question {question.questionIndex + 1} of {question.totalQuestions}</span>
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
