import React from "react";
import GameBoard from "./GameBoard";
import Chat from "./Chat";
import Notifications from "./Notifications";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import NextNumber from "./NextNumber";
// import "../styles/GameRoom.css";
import styled from "styled-components";
import Loader from "../assets/Loader";
import GameOver from "./GameOver";
import { House, MessageCircle, MessageCircleOff} from 'lucide-react';

import {
  Page,
  MainContainer,
  VideoBackground,
  ButtonContainer,
  PullButton,
  SubmitButton,
  HomeButton,
  ChatButton,
} from "../styles/GameRoomStyles";

// const SubmitButton = styled.button`
//   margin-top: 20px;
//   padding: 10px 20px;
//   font-size: 16px;
//   cursor: pointer;
// `;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BASE_WS_URL = import.meta.env.VITE_WS_API_URL;

const GameRoom = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [player, setPlayer] = useState(null);
  const [host, setHost] = useState(null);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [isWinCondition, setIsWinCondition] = useState(false);
  const [gameOver, setGameOver] = useState(null);
  const [winnerMessage, setWinnerMessage] = useState("");
  const [pulledNumbers, setPulledNumbers] = useState(0);
  const [activateChat, setActivateChat] = useState(false);

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

    if (!token) {
      navigate("/");
    }
    const decodedToken = jwtDecode(token);

    if (decodedToken.roomNumber != urlNumber) {
      navigate("/");
    }

    try {
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp > currentTime) {
        const wsURL = `${BASE_WS_URL}/rooms/${decodedToken.roomNumber}`;
        const playerData = { id: decodedToken.id, name: decodedToken.sub };

        setPlayer(playerData);
        setCurrentNumber(urlNumber);


        try {
          initializeWebSocket(wsURL, playerData);
          // Fetch the board
          fetchBoard(decodedToken.roomNumber, decodedToken.id);
        } catch (error) {
          console.error("Error initializing WebSocket:", error.message);
          navigate("/"); // Redirect if WebSocket initialization fails
        }
      } else {
        // Token expired
        console.warn("Token has expired.");
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (err) {
      console.error("Invalid token:", err.message);
      localStorage.removeItem("token");
      navigate("/");
    }
  }, []);

  const initializeWebSocket = (wsURL, playerData) => {
    const ws = new WebSocket(wsURL);
    // console.log("websocketurl in App initialize: " + wsURL);

    ws.onopen = () => {
      console.log("WebSocket connected successfully");
      ws.send(JSON.stringify({ action: "connect", player: playerData }));
      setIsConnected(true);
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);

      const response = JSON.parse(event.data);

      switch (response.type) {
        case "join":
          const playerJoined = response.payload.playerName + " joined the room";
          // console.log(response.payload)
          addNotification(playerJoined);
          break;

        case "chat":
          
          const message = {
            "sender": response.payload.sender,
            "message": response.payload.message
          }
          
          response.payload.message;
          setMessages((prevMessages) => [...prevMessages, message]);
          break;

        case "nextNumber":
          const nextNumber = response.payload.nextNumber;
          setCurrentNumber(nextNumber); // Set the current number
          // addNotification(`Next number: ${nextNumber}`);
          break;

        case "pulledNumbers":
        console.log(response.payload)
        const pulledNumbers = response.payload.pulledNumbers;
        setPulledNumbers(pulledNumbers)
        break;
        case "submit-result":
          const isWinner = response.payload.isWinner;
          const submitMessage = response.payload.message;

          if (isWinner) {
            setGameOver(true);
            setWinnerMessage(submitMessage);
          
          } else {
            alert(submitMessage); // Notify the submitter only
            addNotification(submitMessage);
          }
          break;

        case "host-update":
          const host = "Room host: " + response.payload.hostName;
          setHost({ id: response.payload.hostId, name: response.payload.name });

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
        `${BASE_URL}/rooms/${roomNumber}/players/${playerId}`,
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

  const toggleChat = () => {

    {activateChat === true ? setActivateChat(false) : setActivateChat(true)}
    
  }
  return (
    <>
      <VideoBackground autoPlay loop muted playsInline>
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </VideoBackground>

      {gameOver ? (
        <GameOver
          winnerMessage={winnerMessage}
          socket={socket}
          navigate={navigate}
        />
      ) : isConnected ? (
        <Page isChat={activateChat}>
          <MainContainer isChat={activateChat}>
            <HomeButton onClick={() => navigate("/")}>
              <House />
            </HomeButton>
            <ChatButton onClick={() => toggleChat()}>
              {activateChat === false ? <MessageCircle/> : <MessageCircleOff/>}
            </ChatButton>
            <NextNumber currentNumber={currentNumber} />
            <GameBoard
              board={player.board}
              socket={socket}
              currentNumber={currentNumber}
              setIsWinCondition={setIsWinCondition}
              pulledNumbers={pulledNumbers}
            />
            <ButtonContainer>
              {player && host && player.id === host.id && (
                <PullButton onClick={pullNumber}>Pull Number</PullButton>
              )}
              {isWinCondition && (
                <SubmitButton onClick={submit}>Submit Bingo!</SubmitButton>
              )}
            </ButtonContainer>
          </MainContainer>
          {activateChat && <Chat messages={messages} socket={socket} />}
          
          <Notifications newMessage={currentNotification} />
        </Page>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default GameRoom;
