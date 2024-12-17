import React from "react";
import styled, { keyframes } from "styled-components";

// Ripple Animation
const ripple = keyframes`
  0% {
    background-color: transparent;
  }
  30% {
    background-color: var(--cell-color);
  }
  60% {
    background-color: transparent;
  }
  100% {
    background-color: transparent;
  }
`;

// Loader Container
const LoaderContainer = styled.div`
  --cell-size: 52px;
  --cell-spacing: 1px;
  --cells: 3;
  --total-size: calc(var(--cells) * (var(--cell-size) + 2 * var(--cell-spacing)));

  display: flex;
  flex-wrap: wrap;
  width: var(--total-size);
  height: var(--total-size);
`;

// Cell Component
const Cell = styled.div`
  flex: 0 0 var(--cell-size);
  margin: var(--cell-spacing);
  background-color: transparent;
  box-sizing: border-box;
  border-radius: 4px;
  animation: ${ripple} 1.5s ease infinite;
  animation-delay: ${({ delay }) => delay || "0ms"};

  /* Set custom colors for each child */
  &:nth-child(1) {
    --cell-color: #00ff87;
  }
  &:nth-child(2) {
    --cell-color: #0cfd95;
  }
  &:nth-child(3) {
    --cell-color: #17fba2;
  }
  &:nth-child(4) {
    --cell-color: #23f9b2;
  }
  &:nth-child(5) {
    --cell-color: #30f7c3;
  }
  &:nth-child(6) {
    --cell-color: #3df5d4;
  }
  &:nth-child(7) {
    --cell-color: #45f4de;
  }
  &:nth-child(8) {
    --cell-color: #53f1f0;
  }
  &:nth-child(9) {
    --cell-color: #60efff;
  }
`;

const Loader = () => {
  return (
    <LoaderContainer>
      <Cell delay="0ms" />
      <Cell delay="100ms" />
      <Cell delay="200ms" />

      <Cell delay="100ms" />
      <Cell delay="200ms" />
      <Cell delay="200ms" />

      <Cell delay="300ms" />
      <Cell delay="300ms" />
      <Cell delay="400ms" />
    </LoaderContainer>
  );
};

export default Loader;
