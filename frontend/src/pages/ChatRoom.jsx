import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import "../assets/room.css";

import io from "socket.io-client";
import BlurOverlay from '../Components/BlurOverlay';
import { useAuth } from '../Contexts/AuthContext';
// const socket = io("http://localhost:3000");

const ChatRoom = () => {
  const { roomId } = useParams();
  const { token, profile } = useAuth();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(true);

  const [hasAccess, setAccess] = useState(true);
  const [serverConnected, setServerConnected] = useState(false);
  const [clientConnected, setClientConnected] = useState(false);

  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  document.title = `Room (${roomId})`


  // Set Profile
  useEffect(() => {
    const usrn = localStorage.getItem("Username");
    if (!usrn) {
      console.warn("User has not been registered before!");
      return;
    }

    console.log("Vous êtes :", usrn);
    setUsername(usrn);

  }, [profile])


  // Initialisation du socket
  useEffect(() => {
    if (!token) { return }
    // L'URL devra être modifiée pour correspondre à votre serveur
    socketRef.current = io('http://localhost:3000/room', {
      withCredentials: true,
      auth: (cb) => { cb({ "token": token, "room": roomId }) },

      reconnection: true, // Enable reconnection
      reconnectionAttempts: 3, // Number of reconnection attempts before giving up
      reconnectionDelay: 1000, // Time to wait before attempting a new reconnection (in ms)
      reconnectionDelayMax: 5000, // Maximum time to wait between reconnections (in ms)
      timeout: 20000 // Connection timeout before failing (in ms)
    });

    // Gestion des événements socket
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setClientConnected(true);
    });
    socketRef.current.on('connect_error', (err) => {
      const err_mess = err.message
      setServerConnected(true);
      setClientConnected(false);

      switch (err_mess) {
        case "User is not connected!":
          setClientConnected(false)
          break;

        case "User is not connected to a room!":
          setAccess(false);
          break;

        default:
          setServerConnected(false);
          console.log("Internal Server Error");
      }

      console.warn('An error has occured!', err_mess);
    });
    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
      setClientConnected(false);
    });
    socketRef.current.on('reconnect', (data) => {
      console.log(data)
      console.warn('Reconnected to server');
    });




    socketRef.current.on('message', (msg) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    // socketRef.current.on('user joined', (msg) => {
    //   setMessages(prevMessages => [...prevMessages, {
    //     id: Date.now(),
    //     text: `${msg.username} a rejoint le chat`,
    //     type: 'system'
    //   }]);
    // });

    // socketRef.current.on('user left', (msg) => {
    //   setMessages(prevMessages => [...prevMessages, {
    //     id: Date.now(),
    //     text: `${msg.username} a quitté le chat`,
    //     type: 'system'
    //   }]);
    // });

    // Nettoyage à la déconnexion
    return () => {
      socketRef.current.disconnect();
    };
  }, [token]);

  // Défilement automatique vers le bas lors de nouveaux messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const messageData = {
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    socketRef.current.emit('message', messageData);
    setNewMessage('');
  };

  return (
    // Add Navbar
    <div className="app">
      {!hasAccess ? <BlurOverlay title="Cette Room est privée. Vous n'y avez pas accès !" link="/room" linktitle="Chercher une Room pour moi" /> : null}
      {hasAccess && !clientConnected ? <BlurOverlay title="Vous êtes déconnecté !" link="/register" linktitle="(Re)Connectez-vous" /> : null}
      <div className="chat-container">
        <header className="chat-header">
          <h1>Chat Moderne</h1>
          <span className={`status-indicator ${clientConnected ? 'online' : 'offline'}`}>
            {clientConnected ? 'En ligne' : 'Déconnecté'}
          </span>
        </header>

        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === username ? 'user-message' :
                message.type === 'system' ? 'system-message' : 'other-message'}`}
            >
              {message.type !== 'system' && (
                <div className="message-header">
                  <span className="message-sender">{message.sender}</span>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
              <div className="message-text">{message.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="input-container" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Écrivez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="message-input"
            disabled={!clientConnected}
          />
          <button type="submit" className="send-button" disabled={!clientConnected}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;