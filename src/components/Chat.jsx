import React, { useState } from "react";
import {
  ChatContainer,
  ChatHeader,
  ChatMessages,
  ChatInputContainer,
  ChatInput,
  ChatButton,
  ToggleChatButton,
  ChatMessage,
  ChatMessageText,
  SenderName
} from "../styles/ChatStyles"

const Chat = ({ messages, socket, isConnected }) => {
  // const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const messagePayload = {
        action: "chat",
        message,
      };
      socket.send(JSON.stringify(messagePayload));
      setMessage("");
    } else {
      alert("WebSocket is not connected or has been closed.");
      console.error("Attempted to send a message on a closed WebSocket.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage(); // Call sendMessage if "Enter" key is pressed
    }
  };

  return (
    <>
      <ChatContainer>
        <ChatHeader>Chat</ChatHeader>
        <ChatMessages>
  {messages.map((msg, index) => (
    <ChatMessage key={index} isCurrentUser={msg.sender === "You"}>
      <SenderName>{msg.sender}</SenderName>
      <ChatMessageText>{msg.message}</ChatMessageText>
    </ChatMessage>
  ))}
</ChatMessages>
        <ChatInputContainer>
          <ChatInput
            type="text"
            value={message}
            placeholder="Type a message"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <ChatButton onClick={sendMessage}>Send</ChatButton>
        </ChatInputContainer>
      </ChatContainer>
    </>
  );
};

export default Chat;
