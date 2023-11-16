export type userModel = {
    id: string,
    login: string,
    email: string,
    passwordHash: string;
    createdAt: string
}

export type createUserModel = {
    id: string,
    login: string,
    email: string,
    passwordHash: string;
    passwordSalt: string,
    createdAt: string
}

export type createNewUserModel = {
    id: string,
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: string,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: any
    },
    isConfirmed: boolean
}

export type userViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

