import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { UserDB_schema, UserEditable_schema } from '../schemas/users.schema';

const fake_db: Array<z.infer<typeof UserDB_schema>> = []




/**
 * Get an Account with id
 * 
 * @param user_id 
 * @returns 
 */
export function getAccount_by_id(
    user_id: z.infer<typeof UserDB_schema>["id"]

): z.infer<typeof UserDB_schema> | null {

    for (let element of fake_db) {
        if (element.id === user_id) {
            return element;
        }
    }
    return null;
}


/**
 * Get an Account with email
 * 
 * @param email 
 * @returns 
 */
function getAccount_by_email(
    email: z.infer<typeof UserDB_schema>["email"]

): z.infer<typeof UserDB_schema> | null {
    
    for (let element of fake_db) {
        if (element.email === email) {
            return element;
        }
    }
    return null;
}


/**
 * Get an Account with email and password
 * 
 * @param email 
 * @param password 
 * @returns 
 */
export function getAccount(
    email: z.infer<typeof UserDB_schema>["email"],
    password: z.infer<typeof UserDB_schema>["password"]

): z.infer<typeof UserDB_schema> | null {

    for (let element of fake_db) {
        if (element.email === email && element.password === password) {
            return element;
        }
    }
    return null;
}


/**
 * Create a new Account
 * 
 * @param name 
 * @param email 
 * @param password 
 * @returns 
 */
export function createAccount(
    name: z.infer<typeof UserDB_schema>["name"],
    email: z.infer<typeof UserDB_schema>["email"],
    password: z.infer<typeof UserDB_schema>["password"]

): z.infer<typeof UserDB_schema>["id"] | null {

    if (getAccount_by_email(email)) {
        return null;
    }

    const user_id = uuidv4();
    fake_db.push({
        id: user_id,
        createdAt: new Date(),

        name: name,
        description: null,
        avatar: null,

        password: password,
        email: email
    })
    console.log("Compte créé:", getAccount_by_id(user_id));
    return user_id;
}


/**
 * Update an Account
 * 
 * @param user_id 
 * @param changes 
 * @returns 
 */
export function updateAccount(
    user_id: z.infer<typeof UserDB_schema>["id"],
    changes: z.infer<typeof UserEditable_schema>

): boolean {

    const account = getAccount_by_id(user_id);

    if (!account) {
        return false;
    }

    account.name = changes.username || account.name;
    account.description = changes.description || account.description;
    account.avatar = changes.avatar || account.avatar;

    return true;
}