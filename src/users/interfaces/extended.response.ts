import { User } from "../user.entity";

export interface ExtendedResponse {
    user: User
    token: string
}