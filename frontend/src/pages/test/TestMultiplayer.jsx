import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Tv, Gamepad2 } from 'lucide-react';

const TestMultiplayerPage = () => {
    return (
        <div className="min-h-screen w-full bg-dark-purple text-white font-sans p-4 flex flex-col">
            <header className="flex-shrink-0 mb-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users /> Multiplayer Test Environment
                    </h1>
                    <Link to="/test" className="text-white/50 hover:text-white transition-colors bg-white/10 py-2 px-4 rounded-lg">
                        &larr; Back to Test Lab
                    </Link>
                </div>
                <p className="text-white/70 mt-2">
                    Use the two panels below to simulate a host and a player. Create a game in the "Host" panel, then use the generated PIN to join in the "Player" panel.
                </p>
            </header>
            <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/10 flex flex-col">
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-brand-pink"><Tv /> Host View</h2>
                    <iframe
                        src="/"
                        title="Host View"
                        className="w-full h-full rounded-lg border-2 border-brand-pink/50"
                        style={{ minHeight: '600px' }}
                    />
                </div>
                <div className="bg-black/20 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/10 flex flex-col">
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-brand-blue"><Gamepad2 /> Player View</h2>
                    <iframe
                        src="/"
                        title="Player View"
                        className="w-full h-full rounded-lg border-2 border-brand-blue/50"
                        style={{ minHeight: '600px' }}
                    />
                </div>
            </main>
        </div>
    );
};

export default TestMultiplayerPage;
