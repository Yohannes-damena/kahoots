import { useState } from "react";

const JoinPage = () => {
  const [gamePin, setGamePin] = useState("");
  const [name, setName] = useState("");
  
  const handleJoinGame = (e) => {
    e.preventDefault();
    // Add your join logic here
  };

  return (
    <form onSubmit={handleJoinGame} className="flex flex-col gap-4 w-full">
      <h2 className="text-2xl font-bold text-white text-center">Join Game</h2>
      <input
        type="text"
        placeholder="Enter Game PIN"
        value={gamePin}
        onChange={(e) => setGamePin(e.target.value.toUpperCase())}
        className="p-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-blue"
      />
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-blue"
      />
      <button
        type="submit"
        className="p-3 bg-brand-blue text-white font-bold rounded-lg hover:bg-opacity-80 transition-colors"
      >
        Join
      </button>
    </form>
  );
};

export default JoinPage;
