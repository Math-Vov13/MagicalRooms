import { z } from "zod";

export const UserDB_schema = z.object({
    id: z.string().uuid(),
    createdAt: z.date(),

    name: z.string().min(6),
    password: z.string().min(6),
    email: z.string().email("Invalid email!"),

    description: z.string().max(150).nullable(),
    avatar: z.string().url().nullable()
})

export const UserRegister_schema = z.object({
    username: UserDB_schema.shape.name,
    password: UserDB_schema.shape.password,
    email: UserDB_schema.shape.email,
})

export const UserLogin_schema = z.object({
    password: UserDB_schema.shape.password,
    email: UserDB_schema.shape.email,
})


export const UserEditable_schema = z.object({
    username: UserDB_schema.shape.name,
    description: UserDB_schema.shape.description,
    avatar: UserDB_schema.shape.avatar
}).partial()