import React, { useEffect, useRef, useState } from 'react';
import io from "socket.io-client";

import { useChrono } from '../Contexts/ChronoContext';
import { useAuth } from '../Contexts/AuthContext';
import BlurOverlay from '../Components/BlurOverlay.jsx';
import { Wave } from '../Components/room/Wave.jsx';
import { useNavigate } from 'react-router';

function MatchMaking() {
    const { chrono, isActive, activeChrono } = useChrono();
    const [serverConnected, setServerConnected] = useState(false);
    const [clientConnected, setClientConnected] = useState(false);
    const [roomFound, setRoomID] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();
    const socketRef = useRef();
    document.title = "Searching a room..."

    useEffect(() => {
        if (chrono >= 120) {
            if (isActive) {
                activeChrono(false);
                window.location.reload(false); // Reloads the page from the cache
            }
        }
    }, [chrono])

    // Initialisation du socket
    useEffect(() => {
        if (!token) { return }

        try {
            socketRef.current = io('http://localhost:3000/matchmaker', { withCredentials: true, auth: (cb) => { cb({ "token": token }); } });
            setServerConnected(true);
        } catch {
            console.error("Server is disconnected!")
        }

        socketRef.current.on('connect', (data) => {
            console.log(data)
            console.warn('Connected to server');
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

                default:
                    setServerConnected(false);
                    console.log("Internal Server Error");
            }

            console.warn('An error has occured!', err_mess);
        });
        socketRef.current.on('disconnect', (data) => {
            console.log(data)
            console.warn('Disconnected from server');
            setClientConnected(false);
        });
        socketRef.current.on('reconnect', (data) => {
            console.log(data)
            console.warn('Reconnected to server');
        });

        // Pour l'authentification avec le WebSocket
        // socketRef.current.on("auth", (callback) => {
        //     console.log("Acknowledge received!")
        //     callback({
        //         token: token
        //     })
        // })

        socketRef.current.on('message', (data) => {
            const roomId = data.id;
            if (!roomId) {
                return; // ERREUR ????
            }
            setRoomID(roomId);
            setTimeout(() => {
                navigate(`/room/${roomId}`);
            }, 2000);
        });

        // Nettoyage à la déconnexion
        return () => {
            socketRef.current.disconnect();
        };
    }, [token]);


    return (
        <div>
            <Wave />
            {!token ? <BlurOverlay title="Les ROOMS sont réservées à nos membres" link="/register" linktitle="Rejoins-nous pour en profiter !" /> : null}
            {token && !serverConnected ? <BlurOverlay title="Une erreur interne est survenue ! Nous faisons tout notre possible pour la régler au plus vite" link="/" linktitle="Retour" /> : null}
            {token && serverConnected && !clientConnected ? <BlurOverlay title="Vous avez été déconnecté" link="/register" linktitle="(Re)Connectez-vous !" /> : null}

            {roomFound ? <><h1>Nous avons trouvé une Room pour vous !</h1><br/><i>Connexion à la Room [id: {roomFound}]</i></> : (<>
            <h1>En attente d'une Room...</h1>
            <br />
            <i>temps d'attente actuel ( {chrono > 60 ? `0${Math.floor(chrono / 60)}: ` : null} {chrono % 60}s )</i></>)}
        </div>
    )
}

export default MatchMaking;