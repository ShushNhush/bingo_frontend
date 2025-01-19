import React, { useEffect, useState } from "react";
import styled from "styled-components";

const NotificationsContainer = styled.div`
  position: absolute;
  top: 100px;
  right: 100px;
  max-width: 300px;
  width: 200px;
  z-index: 1000;

  @media (max-width: 480px) {

    display: none;
  }
`;

const NotificationItem = styled.li.withConfig({
    shouldForwardProp: (prop) => prop !== "fading", // Prevent `fading` from being forwarded to the DOM
  })`
    background: #333;
    color: #fff;
    padding: 10px;
    margin-bottom: 5px;
    border-radius: 5px;
    opacity: ${(props) => (props.fading ? 0 : 1)};
    transition: opacity 1s ease-in-out;
    list-style-type: none;
  `;

function Notifications({ newMessage }) {
  const [notifications, setNotifications] = useState([]);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!newMessage) return;

    // Add new notification
    setNotifications((prev) => [...prev, newMessage]);

    // Reset fading whenever a new message arrives
    setIsFading(false);

    // Start a timeout to fade and clear all notifications
    const clearTimeoutId = setTimeout(() => {
      setIsFading(true); // Start fading
      setTimeout(() => {
        setNotifications([]); // Clear all notifications after fading
      }, 1000); // Match the fade-out transition duration
    }, 3000); // Clear after 5 seconds of inactivity

    // Cleanup timeout on new messages or component unmount
    return () => clearTimeout(clearTimeoutId);
  }, [newMessage]);

  return (
    <NotificationsContainer>
      <ul>
        {notifications.map((text, index) => (
          <NotificationItem key={index} fading={isFading}>
            {text}
          </NotificationItem>
        ))}
      </ul>
    </NotificationsContainer>
  );
}

export default Notifications;
