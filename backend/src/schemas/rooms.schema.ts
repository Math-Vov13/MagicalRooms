import { z } from "zod";

export const MessageDB_schema = z.object({
    id: z.string().uuid(),
    room_id: z.string().uuid(),
    createdAt: z.date(),

    author: z.string().uuid(),
    content: z.string().min(5).max(100)
})

export const RoomDB_schema = z.object({
    id: z.string().uuid(),
    createdAt: z.date(),

    user1: z.string().uuid(),
    user2: z.string().uuid()
})