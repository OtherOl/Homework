import { paginationModel } from "../models/pagination-model";
import { createUserModel, userModel, userViewModel } from "../models/user-model";
export declare const usersRepository: {
    getAllUsers(sortBy: string | undefined, sortDirection: string | undefined, pageNumber: number, pageSize: number, searchLoginTerm: string, searchEmailTerm: string): Promise<paginationModel<userViewModel>>;
    createUser(inputData: createUserModel): Promise<{
        id: string;
        login: string;
        email: string;
        createdAt: string;
    }>;
    deleteUser(id: string): Promise<boolean>;
    findByLoginOrEmail(loginOrEmail: string): Promise<userModel | null>;
    findUserById(userId: string): Promise<import("mongodb").WithId<userModel> | null>;
};
