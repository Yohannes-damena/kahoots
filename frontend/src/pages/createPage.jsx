import { useState } from "react";
import { useNavigate } from "react-router-dom";
const createPage = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleCreateGame = (e) => {
    e.preventDefault();
    if (name.trim()) {
      socket.emit("host:create-game", { name });
    }
  };
  return (
    <form onSubmit={handleCreateGame} className="flex flex-col gap-4 w-full">
      <h2 className="text-2xl font-bold text-white text-center">Create Game</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-pink"
      />
      <button
        type="submit"    
        onClick={() => navigate("/create-quiz")}
        className="p-3 bg-brand-pink text-white font-bold rounded-lg hover:bg-opacity-80 transition-colors"
      >
        Let's Go!
      </button>
    </form>
  );
};

export default createPage;
