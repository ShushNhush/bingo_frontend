import React, { useState, useEffect, useMemo } from "react";
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

const Cell = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Impact, fantasy;

  /* Dynamic Styling */
  border: ${({ state }) =>
    state === "highlighted"
      ? "2px solid red"
      : state === "toggled"
      ? "2px solid #7CFC00"
      : "2px solid violet"};

  background-color: ${({ state }) =>
    state === "highlighted"
      ? "#FFDDDD"
      : state === "toggled"
      ? "#32CD32"
      : "#fff"};

  box-shadow: ${({ state }) =>
    state === "highlighted" ? "0 0 10px red" : "none"};

  color: ${({ state }) =>
    state === "toggled" ? "white" : "darkslategrey"};

  border-radius: 8px;
  cursor: ${({ isFree }) => (isFree = "pointer")};
`;

const GameBoard = ({ board, currentNumber, setIsWinCondition }) => {
  if (!board) return <p>No board data available</p>;

  // Memoize boardArray to prevent unnecessary recreation
  const boardArray = useMemo(() => JSON.parse(board), [board]);

  // State to manage cell states: 'default', 'highlighted', or 'toggled'
  const [cellStates, setCellStates] = useState(
    boardArray.map((row) =>
      row.map((cell) => (cell === "FREE" ? "toggled" : "default")) // Set "FREE" as "toggled"
    )
  );

  // Update highlight state when currentNumber changes
  useEffect(() => {
    setCellStates((prev) =>
      prev.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isCurrentNumber =
            boardArray[rowIndex][colIndex].toString() === currentNumber?.toString();
          return isCurrentNumber && prev[rowIndex][colIndex] !== "toggled"
            ? "highlighted"
            : prev[rowIndex][colIndex];
        })
      )
    );
  }, [currentNumber, boardArray]);

  // Handle cell click
  const handleCellClick = (rowIndex, colIndex) => {
    if (boardArray[rowIndex][colIndex] === "FREE") return; // Prevent clicks on FREE cells

    setCellStates((prev) =>
      prev.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          if (rIdx === rowIndex && cIdx === colIndex) {
            return cell === "toggled" ? "default" : "toggled";
          }
          return cell;
        })
      )
    );
  };

  // Check for a win condition (row, column, diagonal)
  useEffect(() => {
    const checkWinCondition = () => {
      // Check rows
      for (let i = 0; i < 5; i++) {
        if (cellStates[i].every((state) => state === "toggled")) return true;
      }

      // Check columns
      for (let i = 0; i < 5; i++) {
        if (cellStates.map((row) => row[i]).every((state) => state === "toggled"))
          return true;
      }

      // Check diagonals
      const diagonal1 = cellStates.map((row, idx) => row[idx]);
      const diagonal2 = cellStates.map((row, idx) => row[4 - idx]);
      if (
        diagonal1.every((state) => state === "toggled") ||
        diagonal2.every((state) => state === "toggled")
      )
        return true;

      return false;
    };

    // Update win condition in parent
    const hasWon = checkWinCondition();
    setIsWinCondition(hasWon);
  }, [cellStates, setIsWinCondition]);

  return (
    <BoardContainer>
      <Grid>
        {boardArray.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              state={cellStates[rowIndex][colIndex]}
              isFree={cell === "FREE"}
              onClick={() => handleCellClick(rowIndex, colIndex)}
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
