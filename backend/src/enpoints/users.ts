import { Request, Response, Router } from "express";
import { z } from "zod";

import { verify_token } from "../middlewares/token_headers";
import { body_schema_validation } from "../middlewares/validate_schema";
import { createAccount, getAccount, getAccount_by_id, updateAccount } from "../models/users_db";
import { UserEditable_schema, UserLogin_schema, UserRegister_schema } from "../schemas/users.schema";
import { generateToken } from "../security/jwt";


const router = Router();




router.get("/profile/:userid", verify_token, (req: Request, res: Response) => {
    let user = getAccount_by_id(req.session?.user_id as string);
    if (!user) {
        res.status(401).send({ detail: "Your Session ID has expired! Connect you again" });
        return;
    }

    const { userid } = req.params;
    if (userid !== "me") {
        user = getAccount_by_id(userid);

        if (!user) {
            res.status(404).send({
                "message": "User not found!",
                "userid": userid
            });
            return;
        }
    }

    res.json({
        "username": user.name,
        "description": user.description,
        "avatar": user.avatar,
        "createdAt": user.createdAt
    });
})

router.post("/register", body_schema_validation(UserRegister_schema), (req: Request<{}, {}, z.infer<typeof UserRegister_schema>, {}>, res: Response) => {
    if (req.body.username === undefined || req.body.email === undefined || req.body.password === undefined) {
        res.sendStatus(400);
        return;
    }
    const new_user_id = createAccount(req.body.username, req.body.email, req.body.password);

    if (!new_user_id) {
        res.sendStatus(409);
        return;
    }

    req.session.user_id = new_user_id
    req.session.connected = true
    res.sendStatus(200);
})

router.post("/logout", (req: Request, res: Response) => {
    req.session.destroy(function (err) {
        // cannot access session here
    })
})

router.post("/login", body_schema_validation(UserLogin_schema), (req: Request<{}, {}, z.infer<typeof UserLogin_schema>>, res: Response) => {
    if (req.body.email === undefined || req.body.password === undefined) {
        res.sendStatus(400);
        return;
    }

    const user = getAccount(req.body.email, req.body.password)
    if (!user) {
        res.sendStatus(404);
        return;
    }

    req.session.user_id = user.id
    req.session.connected = true
    res.status(200).json({
        "xx-authorization": "Bearer",
        "token": generateToken(user.id)
    });
})

router.patch("/update", verify_token, body_schema_validation(UserEditable_schema), (req: Request<{}, {}, z.infer<typeof UserEditable_schema>>, res: Response) => {
    if (req.body.username || req.body.description || req.body.avatar) {
        res.sendStatus(400);
        return;
    }

    const user = getAccount_by_id(req.userid as string)
    if (!user) {
        res.sendStatus(404);
        return;
    }

    const new_name = req.body.username;
    const new_desc = req.body.description;
    const new_avatar = req.body.avatar;

    if (!new_name && !new_desc && !new_avatar) {
        res.sendStatus(400);
        return;
    }

    if (!updateAccount(user.id, req.body)) {
        res.sendStatus(409);
        return;
    }
    res.sendStatus(200);
})

export default router;