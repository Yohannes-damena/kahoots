import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");

export default function Leaderboard({ code }) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.on("update-leaderboard", (data) => {
      const sorted = [...data].sort((a, b) => b.score - a.score);
      setPlayers(sorted);
    });
    return () => socket.off("update-leaderboard");
  }, []);

  return (
    <div className="p-6 bg-black/30 rounded-xl mt-6 text-white">
      <h2 className="text-2xl font-bold mb-3 text-center">🏆 Leaderboard</h2>
      <ul>
        {players.map((p, i) => (
          <li
            key={i}
            className="flex justify-between border-b border-white/20 py-1"
          >
            <span>
              {i + 1}. {p.name}
            </span>
            <span>{p.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
