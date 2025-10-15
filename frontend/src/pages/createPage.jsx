import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
const CreatePage = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name  before continuing");
      return;
    }

    // Save to localStorage
    localStorage.setItem("hostName", name);

    // Navigate to create quiz page
    navigate("/create-quiz");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <h2 className="text-2xl font-bold text-white text-center">
          Create Game
        </h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
        <button
          type="submit"
          className="p-3 bg-brand-pink text-white font-bold rounded-lg hover:bg-opacity-80 transition-colors"
        >
          Let's Go!
        </button>
      </form>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default CreatePage;
