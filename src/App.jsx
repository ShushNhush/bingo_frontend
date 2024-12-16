import RoomControls from "./components/RoomControls";
import "./App.css";
import { useNavigate} from "react-router-dom";


const App = () => {

  const navigate = useNavigate();

  const redirectToRoom = (roomNumber) => {
    navigate(`/rooms/${roomNumber}`);
  };


  return (
    <div style={{ padding: "20px" }}>
      <h1>Bingo Game</h1>
      
        <RoomControls
          redirectToRoom={redirectToRoom}
        />
      
    </div>
  );
}
  export default App;
