import { v4 as uuidv4 } from 'uuid';
import { z } from "zod";
import { MessageDB_schema, RoomDB_schema } from "../schemas/rooms.schema";
import { getRoom_byId } from "./rooms_db";

const messages_db: Array<z.infer<typeof MessageDB_schema>> = []


/**
 * Get all Messages from a Room with ID
 * 
 * @param roomID 
 * @returns 
 */
export function getMessages_byRoomID(
    roomID: z.infer<typeof RoomDB_schema.shape.id>

): typeof messages_db | null {
    const room = getRoom_byId(roomID)
    if (!room) {
        return null;
    }

    const Messages = [];
    for (const mess of messages_db) {
        if (mess.room_id === roomID) {
            Messages.push(mess);
        }
    }

    return Messages;
}

/**
 * Get a Message by ID
 * 
 * @param message_id 
 * @returns 
 */
export function getMessage_byId(
    message_id: z.infer<typeof MessageDB_schema.shape.id>
) : z.infer<typeof MessageDB_schema> | null {

    for (const mess of messages_db) {
        if (mess.id === message_id) {
            return mess;
        }
    }
    return null;
}

/**
 * Save Message in DB
 * 
 * @param roomID 
 * @param author_id 
 * @param message 
 * @returns 
 */
export function saveMessage(
    roomID: z.infer<typeof RoomDB_schema.shape.id>,
    author_id: z.infer<typeof RoomDB_schema.shape.user1>,
    message: string

): string | null {
    const room = getRoom_byId(roomID)
    if (!room) {
        return null;
    }

    const messID = uuidv4();

    messages_db.push({
        "id": messID,
        "room_id": roomID,
        "createdAt": new Date(),

        "author": author_id,
        "content": message
    })

    return messID;
}