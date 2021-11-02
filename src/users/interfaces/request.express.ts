import { Request } from "express";
import { User } from "../user.entity";

export interface ExtendedRequest extends Request {
    user: User
    token: string
}