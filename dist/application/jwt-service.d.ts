import { userModel } from "../models/user-model";
import { ObjectId } from "mongodb";
export declare const jwtService: {
    createJWT(user: userModel): Promise<{
        accessToken: string;
    }>;
    getUserIdByToken(token: string): Promise<false | ObjectId>;
    getUserByToken(token: string): Promise<false | {
        email: any;
        login: any;
        userId: any;
    }>;
};
