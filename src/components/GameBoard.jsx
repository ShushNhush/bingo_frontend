import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";

// Styled components stay the same...
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

  color: ${({ state }) => (state === "toggled" ? "white" : "darkslategrey")};

  border-radius: 8px;
  cursor: ${({ isFree }) => (isFree ? "default" : "pointer")};
`;

const GameBoard = ({ board, currentNumber, setIsWinCondition, pulledNumbers }) => {
  if (!board) return <p>No board data available</p>;

  const boardArray = useMemo(() => JSON.parse(board), [board]);

  // Initialize cell states with proper type conversion
  const [cellStates, setCellStates] = useState(() => {
    console.log("Initializing with pulled numbers:", pulledNumbers);
    return boardArray.map((row) =>
      row.map((cell) => {
        if (cell === "FREE") return "toggled";
        // Convert cell to number before comparison
        const cellNumber = parseInt(cell, 10);
        if (Array.isArray(pulledNumbers) && pulledNumbers.includes(cellNumber)) {
          console.log(`Setting ${cell} (${cellNumber}) as highlighted`);
          return "highlighted";
        }
        return "default";
      })
    );
  });

  // Rest of the component stays the same...
  useEffect(() => {
    if (!currentNumber) return;

    setCellStates((prev) =>
      prev.map((row, rowIndex) =>
        row.map((cellState, colIndex) => {
          if (cellState === "toggled") return cellState;
          
          const isCurrentNumber =
            boardArray[rowIndex][colIndex].toString() === currentNumber.toString();
          return isCurrentNumber ? "highlighted" : cellState;
        })
      )
    );
  }, [currentNumber, boardArray]);

  const handleCellClick = (rowIndex, colIndex) => {
    if (boardArray[rowIndex][colIndex] === "FREE") return;

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

    setIsWinCondition(checkWinCondition());
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