import React, { useEffect, useState } from "react";

const GameOver = ({ winnerMessage, socket, navigate }) => {
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close(); // Close WebSocket connection
      }
      navigate("/"); // Redirect to home or another page
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [socket, navigate]);

  return (
    <div className="main-container">
    <div className="game-over">
      <h1>{winnerMessage}</h1>
      <p>Returning to home in {countdown} seconds...</p>
      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
    </div>
  );
};

export default GameOver;
