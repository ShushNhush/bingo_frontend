import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";

// Keyframe animation for the pop effect, wrapped in `css`
const popAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1); /* Make the number larger */
  }
  100% {
    transform: scale(1);
  }
`;

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

  ${({ animate }) =>
    animate &&
    css`
      animation: ${popAnimation} 0.3s ease-in-out;
    `}
`;

const NextNumber = ({ currentNumber }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (currentNumber) {
      setAnimate(true); // Trigger animation when a new number is set
      const timer = setTimeout(() => {
        setAnimate(false); // Reset animation after it's done
      }, 500); // Duration of the animation (0.5s)
      return () => clearTimeout(timer);
    }
  }, [currentNumber]);

  return (
    <NumberDisplay animate={animate}>
      {currentNumber ? currentNumber : "N/A"}
    </NumberDisplay>
  );
};

export default NextNumber;
