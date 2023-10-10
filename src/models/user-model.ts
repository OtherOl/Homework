export type userModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export type createUserModel = {
    login: string,
    password: string,
    email: string
}