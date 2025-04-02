import express, { Request, Response } from 'express';
import session, { MemoryStore } from 'express-session';
import morgan from 'morgan';
import cors from "cors";

import router from './enpoints/users';

const app = express();

declare module "express-session" {
  interface SessionData {
    connected: boolean,
    ws_session_id: string
    user_id: string,
    room_id: string
  }
}

export const sessionStorage = new MemoryStore();
export const sessionMiddleware = session({
  secret: "Woaw-its-a-very-good-secret-phrase",
  store: sessionStorage,
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, secure: false, maxAge: 5*60*1000 }, // 1 minute
})


/// --------------- REST API --------------- ///
// Middlewares
app.use(cors({ // CORS POLICY
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(morgan('dev')); // LOGGER
app.use(express.json()); // JSON PARSER
app.use(sessionMiddleware) // SESSIONS STORAGE
app.use((req, res, next) => { // SET HEADERS FOR CORS
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header(
    'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Credentials', "true");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  next();
});


// Routers
app.use("/api/users", router);


// Route
app.get("/", (request: Request, response: Response) => {
  console.log("Session id:", request.sessionID);
  response.send("Welcome Devs! Good job, you've just found our API root. O-O");
})

export default app;