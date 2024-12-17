import React from "react";
import styled from "styled-components";

// Styled Toggle Button
const ToggleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  width: 200px;
  height: 50px;
  background-color: #e8e8e8;
  border-radius: 25px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const ToggleOption = styled.div`
  flex: 1;
  text-align: center;
  z-index: 2;
  font-weight: bold;
  color: ${(props) => (props.active ? "#fff" : "#213547")};
  cursor: pointer;
  transition: color 0.3s ease;
`;

const ToggleSlider = styled.div`
  position: absolute;
  top: 0;
  left: ${(props) => (props.activeForm === "create" ? "0" : "50%")};
  width: 50%;
  height: 100%;
  background-color: rgba(255,0,93,1);
  border-radius: 25px;
  transition: left 0.3s ease;
`;

const ToggleSwitch = ({ activeForm, onToggle }) => {
  return (
    <ToggleContainer>
      {/* Slider */}
      <ToggleSlider activeForm={activeForm} />

      {/* Create Option */}
      <ToggleOption active={activeForm === "create"} onClick={() => onToggle("create")}>
        Create
      </ToggleOption>

      {/* Join Option */}
      <ToggleOption active={activeForm === "join"} onClick={() => onToggle("join")}>
        Join
      </ToggleOption>
    </ToggleContainer>
  );
};

export default ToggleSwitch;
