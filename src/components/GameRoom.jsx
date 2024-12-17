import React from "react";
import HostControls from "./HostControls";
import GameBoard from "./GameBoard";
import Chat from "./Chat";
import Notifications from "./Notifications";
import { useEffect, useState} from "react";
import { jwtDecode } from "jwt-decode";
import {useNavigate, useParams } from "react-router-dom";
import NextNumber from "./NextNumber";
import "../styles/GameRoom.css";
import styled from "styled-components";
import Loader from "../assets/Loader";

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

const GameRoom = () => {

  
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [player, setPlayer] = useState(null);
  const [host, setHost] = useState(null);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [isWinCondition, setIsWinCondition] = useState(false);

  const submit = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const messagePayload = { action: "submit" };
      socket.send(JSON.stringify(messagePayload));
    } else {
      alert("WebSocket is not connected or has been closed.");
      console.error("Attempted to send a message on a closed WebSocket.");
    }
  };

  const pullNumber = () => {
    if (socket && isConnected) {
      socket.send(
        JSON.stringify({
          action: "pullNumber",
          player: { id: player.id, name: player.name },
        })
      );
    } else {
      alert("WebSocket is not connected");
    }
  };

  const addNotification = (message) => {
    setCurrentNotification(message); // Send only the latest message
  };

  const navigate = useNavigate();
  const { urlNumber } = useParams();

  useEffect(() => { 

    const token = localStorage.getItem("token");
  
    if(!token) {
      navigate("/")
    }
    const decodedToken = jwtDecode(token);

    if (decodedToken.roomNumber != urlNumber) {
      navigate("/")
    }
    
      try {
        const currentTime = Math.floor(Date.now() / 1000);
  
        if (decodedToken.exp > currentTime) {
          const wsURL = `wss://bingoapi.gudbergsen.com/api/rooms/${decodedToken.roomNumber}`;
          const playerData = {id: decodedToken.id, name: decodedToken.sub};
          
          setPlayer(playerData);
          setCurrentNumber(urlNumber);
          initializeWebSocket(wsURL, playerData)

          // Fetch the board
          fetchBoard(decodedToken.roomNumber, decodedToken.id);
        } else {
          // Token expired
          console.warn("Token has expired.");
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Invalid token:", err.message);
        localStorage.removeItem("token");
      }
    
  }, []);

  const initializeWebSocket = (wsURL, playerData) => {
  
    const ws = new WebSocket(wsURL);
    console.log("websocketurl in App initialize: " + wsURL);
  
    ws.onopen = () => {
      console.log("WebSocket connected successfully");
      ws.send(JSON.stringify({ action: "connect", player: playerData }));
      setIsConnected(true);
      setSocket(ws);
    };
  
    ws.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);

      const response = JSON.parse(event.data);

      switch(response.type) {

        case "join":
          const playerJoined = response.payload.playerName + " joined the room"
          addNotification(playerJoined);
          break;
          
        case "chat":
            
            const message = response.payload.sender + ": " + response.payload.message;
            setMessages((prevMessages) => [...prevMessages, message]);
            break;

        case "nextNumber":
              const nextNumber = response.payload.nextNumber;
              setCurrentNumber(nextNumber); // Set the current number
              // addNotification(`Next number: ${nextNumber}`);
              break;

          case "submit-result":
            const isWinner = response.payload.isWinner;
            const submitMessage = response.payload.message;
      
            if (isWinner) {
              alert(submitMessage); // Display a message to the winner
              addNotification(submitMessage); // Notify the room
            } else {
              alert(submitMessage); // Notify the submitter only
              addNotification(submitMessage);
            }
            break;
          
        case "host-update":
          const host = "Room host: " + response.payload.hostName;
          setHost({id: response.payload.hostId, name: response.payload.name})
          

        default:
          console.warn("Unknown message Type:", response.type);

      }
    };
  
    ws.onclose = (event) => {
      console.log("WebSocket disconnected:", event);
    
        // setRoomNumber(null);
        setPlayer(null);
        setIsConnected(false);
        setSocket(null);
    };
  
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };
  };

  const fetchBoard = async (roomNumber, playerId) => {
    try {
      const response = await fetch(
        `https://bingoapi.gudbergsen.com/api/rooms/${roomNumber}/players/${playerId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch board");
      }
  
      const data = await response.json();
      setPlayer((prevPlayer) => ({ ...prevPlayer, board: data.board }));
    } catch (error) {
      console.error("Error fetching board:", error.message);
    }
  };
  return (
    <>
    <video className="video-background" autoPlay loop muted playsInline>
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    
      
      {isConnected ? (
    <div className="main-container">
        <>
        <NextNumber
          currentNumber={currentNumber}
        />
          
          <Notifications newMessage={currentNotification}/>
          <GameBoard board={player.board} socket={socket} currentNumber={currentNumber} setIsWinCondition={setIsWinCondition} />
        
          <div className="button-container">

          
         

          {player && host && player.id === host.id && (
        <button onClick={pullNumber} className="pull">Pull Number</button>
      )}
       {isWinCondition && <button onClick={submit} className="submit">Submit Bingo!</button>}
          </div>
        </>
    </div>
      ) : (
      <Loader></Loader>
      )}
    </>
  );
};

export default GameRoom;
