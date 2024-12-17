import React, { useState } from "react";
import styled from "styled-components";

// Styled Components
const BoardContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  justify-content: center;
`;

const Cell = styled.div.withConfig({
  // Prevent props like toggled, isFree, and isHighlighted from being passed to the DOM
  shouldForwardProp: (prop) =>
    !["toggled", "isFree", "isHighlighted"].includes(prop),
})`
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Impact, fantasy;
  border: ${({ toggled, isFree }) =>
    toggled || isFree ? "1px solid #7CFC00;" : "1px solid violet"};
  box-shadow: ${({ toggled, isFree }) =>
    toggled || isFree ? "0 0 20px #7CFC00;" : "0 0 20px violet"};
  border-radius: 8px;
  background-color: ${({ toggled, isFree }) =>
    toggled || isFree ? "#32CD32;" : "#fff"};
  color: ${({ toggled, isFree }) =>
    toggled || isFree ? "#white;" : "darkslategrey"};
  cursor: ${({ isFree }) => (isFree ? "default" : "pointer")};
  font-weight: ${({ isFree }) => (isFree ? "bold" : "normal")};

  /* Highlight current number with a red circle */
  &::after {
    content: "";
    display: ${({ isHighlighted }) => (isHighlighted ? "block" : "none")};
    position: absolute;
    width: 80%;
    height: 80%;
    border: 3px solid red;
    border-radius: 50%;
    pointer-events: none; /* Allow clicks to pass through */
  }
`;



const GameBoard = ({ board, socket, currentNumber, setIsWinCondition }) => {
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
      const messagePayload = { action: "submit" };
      socket.send(JSON.stringify(messagePayload));
    } else {
      alert("WebSocket is not connected or has been closed.");
      console.error("Attempted to send a message on a closed WebSocket.");
    }
  };

  const toggleCell = (rowIndex, colIndex) => {
    if (boardArray[rowIndex][colIndex] === "FREE") return; // Prevent toggling "FREE" cells

    setToggled((prev) => {
      const newToggled = prev.map((row, rIdx) =>
        row.map((cell, cIdx) =>
          rIdx === rowIndex && cIdx === colIndex ? !cell : cell
        )
      );
      return newToggled;
    });
  };

  const checkWinCondition = () => {
    for (let i = 0; i < 5; i++) {
      if (
        toggled[i].every((cell) => cell) || // Check row
        toggled.map((row) => row[i]).every((cell) => cell) // Check column
      ) {
        return true;
      }
    }

    // Check diagonals
    const diagonal1 = toggled.map((row, idx) => row[idx]).every((cell) => cell);
    const diagonal2 = toggled.map((row, idx) => row[4 - idx]).every((cell) => cell);

    return diagonal1 || diagonal2;
  };

  const hasWon = checkWinCondition();

  if (hasWon) {
    setIsWinCondition(true)
  }
 else {
  setIsWinCondition(false)
 }
  
  return (
    <BoardContainer>
      <Grid>
        {boardArray.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              toggled={toggled[rowIndex][colIndex]}
              isFree={cell === "FREE"}
              isHighlighted={cell.toString() === currentNumber.toString()} 
              // Highlight if matches currentNumber
              onClick={() => toggleCell(rowIndex, colIndex)}
            >
              {cell}
            </Cell>
          ))
        )}
      </Grid>
      
    </BoardContainer>
  );
};

export default GameBoard;
