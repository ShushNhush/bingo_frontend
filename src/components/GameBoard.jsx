import React, { useState } from "react";

const GameBoard = ({ board, socket }) => {
  if (!board) {
    return <p>No board data available</p>;
  }

  // Parse the board string into a 2D array
  const boardArray = JSON.parse(board);

  // State to track toggled cells
  const [toggled, setToggled] = useState(
    boardArray.map((row) =>
      row.map((cell) => (cell === "FREE" ? true : false)) // "FREE" cells are toggled by default
    )
  );

  
    const submit = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
          const messagePayload = {
              action: "submit",
          };
          socket.send(JSON.stringify(messagePayload));
      } else {
          alert("WebSocket is not connected or has been closed.");
          console.error("Attempted to send a message on a closed WebSocket.");
      }
    }
  

  const toggleCell = (rowIndex, colIndex) => {
    // Prevent toggling the "FREE" slot
    if (boardArray[rowIndex][colIndex] === "FREE") return;

    setToggled((prev) => {
      const newToggled = [...prev];
      newToggled[rowIndex][colIndex] = !newToggled[rowIndex][colIndex];
      return newToggled;
    });
  };

  const checkWinCondition = () => {
    // Check rows and columns
    for (let i = 0; i < 5; i++) {
      if (
        toggled[i].every((cell) => cell) || // Check row
        toggled.map((row) => row[i]).every((cell) => cell) // Check column
      ) {
        return true;
      }
    }

    // Check diagonals
    const diagonal1 = toggled.map((row, idx) => row[idx]).every((cell) => cell); // Top-left to bottom-right
    const diagonal2 = toggled.map((row, idx) => row[4 - idx]).every((cell) => cell); // Top-right to bottom-left

    return diagonal1 || diagonal2;
  };

  const hasWon = checkWinCondition();

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
          justifyContent: "center",
          color: "black",
        }}
      >
        {boardArray.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => toggleCell(rowIndex, colIndex)} // Toggle cell on click
              style={{
                width: "60px",
                height: "60px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #ccc",
                backgroundColor:
                  toggled[rowIndex][colIndex] || cell === "FREE" ? "green" : "#fff",
                cursor: "pointer", // Disable cursor for "FREE"
                fontWeight: cell === "FREE" ? "bold" : "normal",
              }}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      {hasWon && (
        <button onClick={submit}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Submit Bingo!
        </button>
      )}
    </div>
  );
};

export default GameBoard;
