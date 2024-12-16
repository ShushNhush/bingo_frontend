const Chat = ({ messages, socket, isConnected }) => {
  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const messagePayload = {
            action: "chat",
            message,
        };
        socket.send(JSON.stringify(messagePayload));
    } else {
        alert("WebSocket is not connected or has been closed.");
        console.error("Attempted to send a message on a closed WebSocket.");
    }
};

  return (
    <div>
      <h2>Messages</h2>
      <input type="text" id="messageInput" placeholder="Type a message" />
      <button
        onClick={() => {
          const message = document.getElementById("messageInput").value;
          sendMessage(message);
        }}
      >
        Send Message
      </button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
