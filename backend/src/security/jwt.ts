import jwt, { JsonWebTokenError } from 'jsonwebtoken';

const SECRET_KEY = "its_a_very_good_secret_key__Dont_steal_it"

/**
 * Generate a JWT with content in payload
 * 
 * @param content 
 * @returns 
 */
export function generateToken(content: string) {
    return jwt.sign({ sub: content },
        SECRET_KEY, { expiresIn: '1h' })
}

/**
 * Verify JWT validity and get payload
 * 
 * @param token 
 * @returns 
 */
export function verifyToken(token: string): string | null {
    try {
        const token_json = jwt.verify(token, SECRET_KEY)
        return typeof token_json.sub === "string"? token_json.sub : null
    } catch (err: unknown) {
        if (typeof err === typeof JsonWebTokenError) {
            console.warn('Token verification failed:', (err as JsonWebTokenError).message);
        } else {
            console.error(err)
        }
        return null;
    }
}