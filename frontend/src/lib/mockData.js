export const mockPlayers = [
    { id: '1', name: 'Alice', score: 300, isHost: true },
    { id: '2', name: 'Bob', score: 450, isHost: false },
    { id: '3', name: 'Charlie', score: 200, isHost: false },
    { id: '4', name: 'David', score: 500, isHost: false },
    { id: '5', name: 'Eve', score: 150, isHost: false },
];

export const mockQuestion = {
    text: 'Which component library is used for icons in this app?',
    options: ['Font Awesome', 'Material Icons', 'Lucide React', 'Heroicons'],
    correctAnswerIndex: 2,
    questionIndex: 2,
    totalQuestions: 5,
};

export const mockLeaderboard = [...mockPlayers].sort((a, b) => b.score - a.score);

export const mockQuestionResult = {
    correctAnswerIndex: 2,
};

export const mockQuestionResultTimeout = {
    correctAnswerIndex: null, // This simulates a timeout
};

export const mockFinalScores = [...mockPlayers].sort((a, b) => b.score - a.score);
