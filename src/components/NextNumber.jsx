import React from "react";
import styled from "styled-components";

// Styled Component for Displaying the Current Number
const NumberDisplay = styled.div`
  margin: 20px auto;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  background-color: #32CD32;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
`;

const NextNumber = ({ currentNumber }) => {
  return (
    <NumberDisplay>
      {currentNumber ? currentNumber : "N/A"}
    </NumberDisplay>
  );
};

export default NextNumber;
