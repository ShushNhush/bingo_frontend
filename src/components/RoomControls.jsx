import { jwtDecode } from "jwt-decode";

const RoomControls = ({
  redirectToRoom,
}) => {
  const createRoom = async () => {
    const hostName = prompt("Enter your name:");
    const rules = "Default game rules";

    if (!hostName) {
      alert("Host name is required!");
      return;
    }

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
      console.log("Error in create room" + error.message)
    }
      
    };


  const joinRoom = async () => {
    const roomNumberInput = prompt("Enter Room Number:");
    const playerName = prompt("Enter your name:");

    if (!roomNumberInput || !playerName) {
      alert("Room number and name are required!");
      return;
    }

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

      localStorage.setItem("token", data.token);

      const decodedToken = jwtDecode(data.token);

      redirectToRoom(decodedToken.roomNumber);
    } catch (error) {
      console.error("Error joining room:", error.message);
      alert(error.message);
    }
  };

  

  return (
    <div>
      <button onClick={createRoom}>Create Room</button>
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
};


export default RoomControls;
