const HostControls = ({ player, host, socket, isConnected }) => {
  
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

  return (
    <>
      {player && host && player.id === host.id && (
        <button onClick={pullNumber}>Pull Number</button>
      )}
    </>
  );
};

export default HostControls;
