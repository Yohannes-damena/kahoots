import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import { Users, Crown, Copy } from 'lucide-react';

const LobbyPage = () => {
    const { state } = useLocation();
    const { gamePin } = useParams();
    const navigate = useNavigate();
    const socket = useSocket();

    const { isHost, game: initialGame } = state || {};
    const [game, setGame] = useState(initialGame);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!state) {
            navigate('/');
            return;
        }

        const handleUpdatePlayers = ({ players }) => {
            setGame(prev => ({ ...prev, players }));
        };

        const handleGameStarted = () => {
            navigate(`/game/${gamePin}`, { state: { isHost, game, playerId: state.playerId } });
        };

        socket.on('game:update-players', handleUpdatePlayers);
        socket.on('game:started', handleGameStarted);

        return () => {
            socket.off('game:update-players', handleUpdatePlayers);
            socket.off('game:started', handleGameStarted);
        };
    }, [socket, navigate, gamePin, state, isHost]);

    const handleStartGame = () => {
        socket.emit('host:start-game', { pin: gamePin });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(gamePin);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!game) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-4 text-white font-sans"
        >
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold">Game Lobby</h1>
                    <p className="text-white/70">Waiting for players to join...</p>
                </div>

                <div className="bg-black/20 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <h2 className="text-xl font-semibold text-white/80">Game PIN</h2>
                        <p className="text-5xl font-extrabold tracking-widest text-brand-yellow">{gamePin}</p>
                    </div>
                    <button onClick={copyToClipboard} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">
                        <Copy size={18} />
                        {copied ? 'Copied!' : 'Copy PIN'}
                    </button>
                </div>

                <div className="bg-black/20 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/10">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><Users /> Players ({game.players.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {game.players.map((player, index) => (
                            <motion.div
                                key={player.id}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/10 p-4 rounded-lg text-center"
                            >
                                <p className="font-semibold truncate">{player.name}</p>
                                {player.isHost && <Crown size={16} className="mx-auto mt-1 text-brand-yellow" />}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {isHost && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleStartGame}
                            disabled={game.players.length < 1}
                            className="bg-brand-green text-white font-bold py-4 px-12 rounded-lg text-2xl hover:scale-105 transition-transform disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            Start Game
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default LobbyPage;
