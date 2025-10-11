import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Beaker, List, Trophy, HelpCircle, Users } from 'lucide-react';

const TestPage = () => {
    const testLinks = [
        { path: '/test/multiplayer', title: 'Multiplayer Flow', icon: <Users /> },
        { path: '/test/question', title: 'Question Page', icon: <HelpCircle /> },
        { path: '/test/leaderboard', title: 'Leaderboard', icon: <List /> },
        { path: '/test/game-end', title: 'Game End Screen', icon: <Trophy /> },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-4 text-white font-sans"
        >
            <div className="text-center mb-10">
                <motion.h1
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="text-5xl md:text-6xl font-extrabold tracking-tighter flex items-center gap-4"
                >
                    <Beaker size={48} className="text-brand-yellow" />
                    Component Test Lab
                </motion.h1>
                <motion.p
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                    className="text-lg text-white/70 mt-2"
                >
                    Isolate and test individual application components here.
                </motion.p>
            </div>

            <motion.div
                layout
                className="w-full max-w-md bg-black/20 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/10"
            >
                <div className="flex flex-col gap-4">
                    {testLinks.map((link, index) => (
                        <Link
                            key={index}
                            to={link.path}
                            className="flex items-center gap-4 p-4 bg-white/10 text-white font-bold rounded-lg text-xl hover:bg-white/20 hover:scale-105 transition-all"
                        >
                            {link.icon}
                            <span>{link.title}</span>
                        </Link>
                    ))}
                </div>
            </motion.div>
             <Link to="/" className="mt-8 text-white/50 hover:text-white transition-colors">
                &larr; Back to Home
            </Link>
        </motion.div>
    );
};

export default TestPage;
