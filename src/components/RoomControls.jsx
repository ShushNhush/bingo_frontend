import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import styled from "styled-components";
import ToggleSwitch from "./ToggleSwitch";
import { MainContent, ToggleSwitchWrapper, FormContainer} from "../styles/HomeStyle";


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
