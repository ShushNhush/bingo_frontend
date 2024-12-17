import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import styled from "styled-components";
import ToggleSwitch from "./ToggleSwitch";

const MainContent = styled.div`
  display: flex;
  color: white;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Center content vertically */
  padding: 20px;
  text-align: center;
  background: linear-gradient(34deg, rgba(255, 0, 93, 1) 0%, rgba(0, 212, 255, 1) 100%);
  border-radius: 20px;
  border: 2px solid violet;
  box-shadow: 0 0 10px violet;

  /* Fixed size */
  width: 400px; /* Set a fixed width */
  height: 500px; /* Set a fixed height */

  margin: 0 auto; /* Center horizontally in the viewport */
  overflow: hidden; /* Prevent content overflow */
`;

const ToggleSwitchWrapper = styled.div`
  display: flex;
  justify-content: space-around; /* Spread buttons evenly */
  align-items: center;
  width: 100%; /* Make sure it uses the full width of MainContent */
  margin: 10px 0; /* Add spacing above and below the toggle */
`;


const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  div {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
  }

  label {
    margin-bottom: 5px;
    font-weight: bold;
  }

  input {
    outline: none;
    border: 2px solid violet;
    box-shadow: 0 0 10px violet;
    border-radius: 10px;
    padding: 10px 25px;
    background-color: white;
    color: #213547;
    font-size: 16px;
    font-weight: bold;
    font-family: inherit;
    max-width: 190px;
  }

  button {
    padding: 10px 20px;
    border: unset;
    border-radius: 15px;
    color: #212121;
    background: #e8e8e8;
    font-weight: 1000;
    font-size: 16px;
    transition: all 250ms;
    position: relative;
    overflow: hidden;
    z-index: 1;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 0;
      border-radius: 15px;
      background-color: rgba(0, 212, 255, 1);
      z-index: -1;
      transition: all 250ms;
    }

    &:hover {
      color: #e8e8e8;
    }

    &:hover::before {
      width: 100%;
    }
  }

  .error-message {
    margin-top: 10px;
    color: #ff4d4d;
    font-size: 14px;
    font-weight: bold;
  }
`;

const RoomControls = ({ redirectToRoom }) => {
  const [formType, setFormType] = useState("create");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const handleFormSwitch = () => {
    setFormType((prev) => (prev === "create" ? "join" : "create"));
    setErrorMessage(""); // Clear error when switching forms
  };

  const createRoom = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const { hostName, rules = "Default rules" } = formJson;

    try {
      const response = await fetch("https://bingoapi.gudbergsen.com/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room: { rules }, player: { name: hostName } }),
      });

      const data = await response.json();
      localStorage.setItem("token", data.token);

      const decodedToken = jwtDecode(data.token);
      redirectToRoom(decodedToken.roomNumber);
    } catch (error) {
      console.error("Error creating room:", error.message);
      setErrorMessage("Failed to create room. Please try again.");
    }
  };

  const joinRoom = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const { playerName, roomNumberInput } = formJson;

    try {
      const roomNumber = parseInt(roomNumberInput, 10);
      const response = await fetch(
        `https://bingoapi.gudbergsen.com/api/rooms/${roomNumber}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: playerName }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.noRoom || "Please check the room number is correct.");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      const decodedToken = jwtDecode(data.token);
      redirectToRoom(decodedToken.roomNumber);
    } catch (error) {
      console.error("Error joining room:", error.message);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <MainContent>
      <h1>Bingo</h1>
      <ToggleSwitchWrapper>
  <ToggleSwitch activeForm={formType} onToggle={handleFormSwitch} />
</ToggleSwitchWrapper>


      {formType === "create" ? (
        <FormContainer>
          <form onSubmit={createRoom}>
            <h3>Create Room</h3>
            <div>
              <label htmlFor="hostName">Your Name</label>
              <input
                type="text"
                id="hostName"
                name="hostName"
                placeholder="Enter your name"
                required
              />
            </div>
            <button type="submit">Create Room</button>
          </form>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </FormContainer>
      ) : (
        <FormContainer>
          <form onSubmit={joinRoom}>
            <h3>Join Room</h3>
            <div>
              <label htmlFor="playerName">Your Name</label>
              <input
                type="text"
                id="playerName"
                name="playerName"
                placeholder="Enter your name"
                required
              />
              <label htmlFor="roomNumber">Room Number</label>
              <input
                type="text"
                id="roomNumber"
                name="roomNumberInput"
                placeholder="Enter room number"
                required
              />
            </div>
            <button type="submit">Join Room</button>
          </form>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </FormContainer>
      )}
    </MainContent>
  );
};

export default RoomControls;
