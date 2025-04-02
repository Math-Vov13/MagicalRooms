import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../security/jwt";


declare global {
    namespace Express {
        interface Request {
            userid?: string;
        }
    }
}


export const verify_token = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ detail: "You need to add a valid credentials!" });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        if (! decoded) { // Token invalide ou expiré
            res.status(401).json({detail: "Your credentials is not valid or is expired!"});
            return; 
        }

        req.userid = decoded
        next();

    } catch (error) {
        res.status(401).json({detail: "Your credentials is not valid or is expired!"});
        return;
    }
}