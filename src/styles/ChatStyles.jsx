import styled from "styled-components";

export const ChatContainer = styled.div`

grid-column: 3 / -1;
  display: flex;
  flex-direction: column;
  /* position: absolute; */
  margin-left: 20px;
  justify-self: flex-start;
  align-self: center;
  width: 20vw;
  height: 70vh;
  min-width: 270px;
  background-color: rgba(0, 0, 0, 0.8);
  border: 1px solid #444;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  overflow: hidden;


  @media (min-width: 900px) and (max-width: 1346px) {
    grid-column: 2 / -1;
  }

  @media (max-width: 899px) {
    display: none;
  }
`;

export const ChatHeader = styled.div`
  padding: 10px;
  background-color: #333;
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #444;
`;

export const ChatMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #222;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  word-wrap: break-word; /* Ensures long words wrap */
  overflow-wrap: break-word; /* Ensures long words wrap */
  white-space: pre-wrap;
   /* Preserves line breaks */
  color: white;
  max-width: 90%; /* Limit the width of the bubble */
  position: relative;

  /* Align message to the right for the current user */
  align-self: ${({ isCurrentUser }) => (isCurrentUser ? "flex-end" : "flex-start")};
  background: ${({ isCurrentUser }) =>
    isCurrentUser ? "rgba(98, 0, 234, 0.8)" : "#333"};
`;

export const SenderName = styled.span`
  font-size: 12px;
  font-weight: bold;
  color: #bbb;
  margin-bottom: 5px;
`;

export const ChatMessages = styled.div`
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ChatMessageText = styled.span`
  font-size: 14px;
  color: white;
`;

export const ChatInputContainer = styled.div`
  display: flex;
  padding: 10px;
  background: #333;
  border-top: 1px solid #444;
`;

export const ChatInput = styled.input`
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #555;
  border-radius: 5px;
  background: #222;
  color: white;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #6200ea;
  }
`;

export const ChatButton = styled.button`
  margin-left: 10px;
  padding: 8px 12px;
  background-color: #03a9f4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #009be3;
  }
`;

export const ToggleChatButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 10px 15px;
  background-color: #6200ea;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: #3700b3;
  }
`;
