import { userViewModel } from "../models/user-model";
import { paginationModel } from "../models/pagination-model";
export declare const usersService: {
    getAllUsers(sortBy: string, sortDirection: string, pageNumber: number, pageSize: number, searchLoginTerm: string, searchEmailTerm: string): Promise<paginationModel<userViewModel>>;
    createUser(login: string, password: string, email: string): Promise<{
        id: string;
        login: string;
        email: string;
        createdAt: string;
    }>;
    _generateHash(password: string, salt: string): Promise<string>;
    deleteUser(id: string): Promise<boolean>;
    checkCredentials(loginOrEmail: string, password: string): Promise<false | import("../models/user-model").userModel>;
    findUserById(userId: any): Promise<import("mongodb").WithId<import("../models/user-model").userModel> | null>;
};
