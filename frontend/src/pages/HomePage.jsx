import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "../context/SocketContext";
import { Users, Crown } from "lucide-react";
import JoinPage from "./joinPage";
import CreatePage from "./createPage";
const HomePage = () => {
    const [view, setView] = useState("main"); // 'main', 'create', 'join'
  const [name, setName] = useState("");
  const [gamePin, setGamePin] = useState("");
  const [error, setError] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleGameCreated = ({ game }) => {
      navigate(`/lobby/${game.pin}`, { state: { isHost: true, game } });
    };

    const handleJoinSuccess = ({ game, playerId }) => {
      navigate(`/lobby/${game.pin}`, {
        state: { isHost: false, game, playerId },
      });
    };

    const handleJoinError = ({ message }) => {
      setError(message);
      alert("Error joining the game");
    };

    socket.on("host:game-created", handleGameCreated);
    socket.on("player:join-success", handleJoinSuccess);
    socket.on("player:join-error", handleJoinError);

    return () => {
      socket.off("host:game-created", handleGameCreated);
      socket.off("player:join-success", handleJoinSuccess);
      socket.off("player:join-error", handleJoinError);
    };
  }, [socket, navigate]);

  const handleCreateGame = async () => {
    const storedHost = localStorage.getItem("hostName") || name;
    if (!storedHost) return;
    try {
      // Fetch a quiz by code or create one first via Create flow.
      // Here we assume the host already created a quiz and stored its code in localStorage.
      const quizId = localStorage.getItem("quizId");
      const hostName = storedHost;
      if (!quizId) return;
      socket.emit("host:create-game", { name: hostName, quizId });
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinGame = (e) => {
    e.preventDefault();
    if (name.trim() && gamePin.trim()) {
      socket.emit("player:join-game", { name, pin: gamePin });
    }
  };

  const renderContent = () => {
    switch (view) {
      case "create":
        return <CreatePage />;
      case "join":
        return <JoinPage />;
      default: // default create and join page buttons
        return (
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={() => setView("create")}
              className="flex-1 p-6 bg-brand-pink text-white font-bold rounded-lg text-xl hover:scale-105 transition-transform"
            >
              <Crown className="mx-auto mb-2" size={32} />
              Create Game
            </button>
            <button
              onClick={() => setView("join")}
              className="flex-1 p-6 bg-brand-blue text-white font-bold rounded-lg text-xl hover:scale-105 transition-transform"
            >
              <Users className="mx-auto mb-2" size={32} />
              Join Game
            </button>
          </div>
        );
    }
  };

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
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl md:text-8xl font-extrabold tracking-tighter"
        >
          Quiz<span className="text-brand-pink">Whiz</span>
        </motion.h1>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="text-lg text-white/70 mt-2"
        >
          The ultimate real-time trivia challenge!
        </motion.p>
      </div>

      <motion.div
        layout
        className="w-full max-w-md bg-black/20 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
        {(view === "create" || view === "join") && (
          <button
            onClick={() => {
              setView("main");
              setError("");
            }}
            className="mt-4 text-white/50 hover:text-white transition-colors w-full"
          >
            Back
          </button>
        )}
      </motion.div>
      {error && (
        <p className="mt-4 text-brand-pink bg-pink-900/50 p-3 rounded-lg">
          {error}
        </p>
      )}
    </motion.div>
  );
};

export default HomePage;
