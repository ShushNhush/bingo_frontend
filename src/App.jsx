import RoomControls from "./components/RoomControls";
import "./App.css";
import { useNavigate} from "react-router-dom";
import "./Background.css";


const App = () => {

  const navigate = useNavigate();

  const redirectToRoom = (roomNumber) => {
    navigate(`/rooms/${roomNumber}`);
  };


  return (

    <>

      <video className="video-background" autoPlay loop muted playsInline>
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    <div>
      
        <RoomControls
          redirectToRoom={redirectToRoom}
          />
      
    </div>
    </>
  );
}
  export default App;

