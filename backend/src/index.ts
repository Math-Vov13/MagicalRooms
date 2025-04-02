import { Server } from "socket.io";
import { createServer } from 'http';
import app, { sessionMiddleware, sessionStorage } from "./app";
import { Request } from "express";
import { verifyToken } from "./security/jwt";
import { addClientToQueue, makeMatchs, removeClientFromQueue } from "./matchmaking/matchmaking";
import { createRoom } from "./models/rooms_db";
import { getMessage_byId, saveMessage } from "./models/messages_db";
import { getAccount_by_id } from "./models/users_db";
import { SessionData } from "express-session";


const PORT = 3000
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Frontend URL
        methods: ['GET', 'POST', 'PUT'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});

/// --------------- WEBSOCKET.IO --------------- ///
io.engine.use(sessionMiddleware);
const matchmakerNamespace = io.of("/matchmaker")
const roomNamespace = io.of("/room")



/// -------> Matchmaking <------- ///
matchmakerNamespace.use((socket, next) => {
    const req = socket.request as Request;
    console.log("Session ID:", req.sessionID);
    const token = socket.handshake.auth.token;
    const token_decoded = verifyToken(token)

    // Si l'utilisateur n'est pas connecté
    if (!token_decoded) {
        next(new Error("User is not connected!"));
        console.log("[MIDDLEWARE]: Disconnected client (00)!");

    } else if (req.session?.user_id !== token_decoded) {
        next(new Error("User is not connected!"));
        console.log("[MIDDLEWARE]: Disconnected client (11)!");

    } else {
        next();
    }
})
matchmakerNamespace.on("connection", async (socket) => {
    const START_TAG = "MATCHMAKING"

    const req = socket.request as Request;
    console.log(`[${START_TAG}]: >>> New client connected ( ${socket.id} ) (( ${req.sessionID} ))`);

    addClientToQueue(req.session.user_id as string, socket.id as string, req.sessionID as string); // Ajoute le client à la fil d'attente

    // Récupère les matchs
    const Matchs = makeMatchs();

    // Créer les matchs
    for (const room of Matchs) {
        const RoomID = createRoom(room);
        console.log("Nouvelle Room créée:", RoomID)

        for (const ind in room) {
            const conn = room[ind];
            const client = matchmakerNamespace.sockets.get(conn.ws_sessionID); // get Socket

            if (client === undefined) {
                // Le Client s'est déconnecté
                break;
            }

            if (conn.api_sessionID === req.sessionID) {
                req.session.room_id = RoomID;
                req.session.save(() => {
                    client.emit("message", {
                        "id": RoomID,
                        "message": "You're invited to a new Room!",
                    })
                })
            } else {
                sessionStorage.get(conn.api_sessionID, (err, session) => {
                    if (err) {
                        console.error('Error retrieving session:', err);
                        return;
                    }
                    if (session) {
                        sessionStorage.set(conn.api_sessionID, {
                            "connected": session.connected,
                            "cookie": session.cookie,
                            "user_id": session.user_id,
                            "room_id": RoomID,
                            "ws_session_id": session.ws_session_id
                        } as SessionData, () => {
                            client.emit("message", {
                                "id": RoomID,
                                "message": "You're invited to a new Room!",
                            })
                        })
                    }
                });
            }
        }
    }

    socket.on("disconnect", async () => {
        removeClientFromQueue(req.session.user_id as string); // Enlève le client de la fil d'attente
        console.log(`[${START_TAG}]: < Client disconnected ( ${socket.id} )`)
    })
})


/// -------> Rooms <------- ///
roomNamespace.use((socket, next) => {
    const req = socket.request as Request;
    const auth_token = socket.handshake.auth.token;
    const auth_room = socket.handshake.auth.room;
    const token_decoded = verifyToken(auth_token);

    // Si l'utilisateur n'est pas connecté
    if (!token_decoded) {
        next(new Error("User is not connected!"));
        console.log("[MIDDLEWARE]: Disconnected client (1)!");

        // Si l'utilisateur n'est pas connecté
    } else if (req.session?.user_id !== token_decoded) {
        next(new Error("User is not connected!"));
        console.log("[MIDDLEWARE]: Disconnected client (2)!");

        // Si l'utilisateur n'a pas de room attitré
    } else if (req.session?.room_id === undefined) {
        next(new Error("User is not connected to a room!"))
        console.log("[MIDDLEWARE]: Disconnected client (3)!");

    } else if (req.session?.room_id !== auth_room) {
        next(new Error("User is not connected to a room!"))
        console.log("[MIDDLEWARE]: Disconnected client (4)!");

    } else {
        next();
    }
})
roomNamespace.on("connection", async (socket) => {
    const START_TAG = "ROOM"

    const req = socket.request as Request;
    console.log(`[${START_TAG}]: >>> New client connected ( ${socket.id} ) (( ${req.sessionID} ))`);

    const roomID = req.session.room_id as string
    socket.join(roomID); // Le Client est ajouté à la room


    socket.on("message", async (message) => {
        // Créer un schéma pour les messages
        console.log(message.content.length)
        console.log(message);

        const messID = saveMessage(roomID, req.session.user_id as string, message.content);
        const mess_db = getMessage_byId(messID as string);

        roomNamespace.to(roomID).emit("message", {
            "id": mess_db?.id,
            "text": message.content,
            "timestamp": message.timestamp,
            "sender": getAccount_by_id(mess_db?.author as string)?.name
        });
    })

    socket.on("disconnect", async () => {
        console.log(`[${START_TAG}]: < Client disconnected ( ${socket.id} )`)
    })
})


// io.on('connection', async (socket) => {
//     const req = socket.request as Request;
//     console.log(req.session.id)
//     console.log("Client session:", req.sessionID)
//     console.log('>>> New client connected (', socket.id, ')');

//     // Lorsqu'un utilisateur rejoint le chat
//     socket.on("message", async () => {
//         socket.emit("Hello");
//     });

//     // Lorsqu'un utilisateur se déconnecte
//     socket.on('disconnect', async () => {
//         console.log('< Client disconnected (', socket.id, ')');
//     });
// });


server.listen(PORT, () => {
    // if (err !== undefined) {
    //     console.error("[server]: Error while running server:", err);
    //     return;
    // }

    console.log(`[server]: Running Server on http://localhost:${PORT}`);
});