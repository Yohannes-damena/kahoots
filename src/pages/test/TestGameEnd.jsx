import React from 'react';
import { Link } from 'react-router-dom';
import GameEnd from '../../components/GameEnd';
import { mockFinalScores } from '../../lib/mockData';

const TestGameEndPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white font-sans">
            <GameEnd finalScores={mockFinalScores} onPlayAgain={() => alert('Play Again clicked!')} />
            <Link to="/test" className="mt-8 text-white/50 hover:text-white transition-colors">
                &larr; Back to Test Lab
            </Link>
        </div>
    );
};

export default TestGameEndPage;
