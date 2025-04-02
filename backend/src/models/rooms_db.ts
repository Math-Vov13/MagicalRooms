import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { RoomDB_schema } from '../schemas/rooms.schema';


const rooms_db: Array<z.infer<typeof RoomDB_schema>> = [];


/**
 * Create a Room
 * 
 * @param users 
 * @returns 
 */
export function createRoom(
    users: Array<z.infer<typeof RoomDB_schema.shape.user1>>

): string {

    const roomID = uuidv4();

    rooms_db.push({
        "id": roomID,
        "createdAt": new Date(),
        "user1": users[0],
        "user2": users[1]
    })
    return roomID;
}


/**
 * Delete a Room
 * 
 * @param roomID 
 * @returns 
 */
export function destroyRoom(
    roomID: z.infer<typeof RoomDB_schema.shape.id>

) {
    const room = getRoom_byId(roomID);
    if (!room) {
        return false;
    }

    rooms_db.splice(rooms_db.indexOf(room), 1);
    return true;
}


/**
 * Get Room with ID
 * 
 * @param roomID 
 * @returns 
 */
export function getRoom_byId(
    roomID: z.infer<typeof RoomDB_schema.shape.id>

): z.infer<typeof RoomDB_schema> | null {

    for (const room of rooms_db) {
        if (room.id === roomID) {
            return room;
        }
    }
    return null;
}