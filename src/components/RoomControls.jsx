import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import styled from "styled-components";
import ToggleSwitch from "./ToggleSwitch";

const MainContent = styled.div`
  display: flex;
  color: white;
  flex-direction: column; /* Stack children vertically */
  align-items: center; /* Center horizontally */
  padding: 20px;
  text-align: center;
  background: rgb(255,0,93);
  background: linear-gradient(34deg, rgba(255,0,93,1) 0%, rgba(0,212,255,1) 100%);
  border-radius: 20px;
  border: 2px solid violet;
  box-shadow: 0 0 10px violet;
  width: 100%;
  max-width: 400px;
  margin: 0 auto; /* Center horizontally in the viewport */
  height: 50vh;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  div {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px; /* Space between input groups */
  }

  label {
    margin-bottom: 5px; /* Space between label and input field */
    font-weight: bold;
  }

  input {
    color: white;
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

  input:active {
    
    box-shadow: 2px 2px 15px #8707ff inset;
  }

  button {
    padding: 10px 20px;
    border: unset;
    border-radius: 15px;
    color: #212121;
    z-index: 1;
    background: #e8e8e8;
    position: relative;
    font-weight: 1000;
    font-size: 16px;
    transition: all 250ms;
    overflow: hidden;
  }

  button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0;
    border-radius: 15px;
    background-color: rgba(0,212,255,1);
    z-index: -1;
    transition: all 250ms;
  }

  button:hover {
    color: #e8e8e8;
  }

  button:hover::before {
    width: 100%;
  }
`;


const RoomControls = ({
  redirectToRoom,
}) => {

  const [formType, setFormType] = useState("create");

  const handleFormSwitch = () => {
    setFormType((prev) => (prev === "create" ? "join" : "create"));
  };

  const createRoom = async(e) => {

    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form)

    const formJson = Object.fromEntries(formData.entries());
    const {hostName, rules = "Default rules"} = formJson


    try {
      const response = await fetch("https://bingoapi.gudbergsen.com/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room: { rules }, player: { name: hostName } }),
      });

      const data = await response.json();

       // Save token only
      localStorage.setItem("token", data.token);

      const decodedToken = jwtDecode(data.token);

      redirectToRoom(decodedToken.roomNumber);
  
    } catch(error) {
      console.log("Error in create room" + error.message);
    }
      
    };

    const joinRoom = async(e) => {

      e.preventDefault();
  
      const form = e.target;
      const formData = new FormData(form)
  
      const formJson = Object.fromEntries(formData.entries());
      const {playerName, roomNumberInput} = formJson
  
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
        
        const data = await response.json();
        console.log("API response:", data)
  
        localStorage.setItem("token", data.token);
  
        const decodedToken = jwtDecode(data.token);
  
        redirectToRoom(decodedToken.roomNumber);
      } catch (error) {
        console.error("Error joining room:", error.message);
        alert(error.message);
      }
    };
 

  return (
    <>

    <MainContent>
    <h1>Bingo</h1>
    <ToggleSwitch activeForm={formType} onToggle={handleFormSwitch} />

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
      </FormContainer>
    )}
</MainContent>
    </>
  );

}
export default RoomControls;
