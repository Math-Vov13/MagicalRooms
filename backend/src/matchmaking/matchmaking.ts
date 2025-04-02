import { Queue } from "./queue_class";

const RoomsQueue = new Queue();

export function addClientToQueue(user_id: string, ws_session_id: string, express_sessions_id: string) {
    RoomsQueue.enqueue({
        "ws_sessionID": ws_session_id,
        "api_sessionID": express_sessions_id,
        "clientID": user_id
    });
}

export function makeMatchs() {
    // Matchmaking logique
    // (très basique...)
    const Results = [];

    while ( RoomsQueue.getSize() > 1 ) {
        const user1 = RoomsQueue.dequeue()
        const user2 = RoomsQueue.dequeue()

        removeClientFromQueue(user1.clientID)
        removeClientFromQueue(user2.clientID)

        Results.push([user1, user2]); // Récupère 2 clients par Room
    }

    return Results;
}

export function removeClientFromQueue(user_id: string) {
    RoomsQueue.remove("clientID", user_id);
}