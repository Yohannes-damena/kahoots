import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Leaderboard from '../../components/Leaderboard';
import { mockLeaderboard, mockQuestionResult, mockQuestionResultTimeout } from '../../lib/mockData';

const TestLeaderboardPage = () => {
    const [isHost, setIsHost] = useState(true);
    const [isLastQuestion, setIsLastQuestion] = useState(false);
    const [isTimeout, setIsTimeout] = useState(false);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white font-sans">
            <Leaderboard
                leaderboard={mockLeaderboard}
                questionResult={isTimeout ? mockQuestionResultTimeout : mockQuestionResult}
                isHost={isHost}
                onNext={() => alert('Host clicked Next!')}
                isLastQuestion={isLastQuestion}
            />
            <div className="mt-8 p-4 rounded-lg bg-black/20 backdrop-blur-md border border-white/10 flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="isHost" checked={isHost} onChange={() => setIsHost(!isHost)} />
                    <label htmlFor="isHost">Is Host View</label>
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="isLast" checked={isLastQuestion} onChange={() => setIsLastQuestion(!isLastQuestion)} />
                    <label htmlFor="isLast">Is Last Question</label>
                </div>
                 <div className="flex items-center gap-2">
                    <input type="checkbox" id="isTimeout" checked={isTimeout} onChange={() => setIsTimeout(!isTimeout)} />
                    <label htmlFor="isTimeout">Simulate Timeout</label>
                </div>
            </div>
            <Link to="/test" className="mt-4 text-white/50 hover:text-white transition-colors">
                &larr; Back to Test Lab
            </Link>
        </div>
    );
};

export default TestLeaderboardPage;
