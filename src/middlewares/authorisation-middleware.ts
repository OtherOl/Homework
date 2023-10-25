import {NextFunction, Response, Request} from "express";

export const authorisationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).send('Authorisation required')
    }

    const [authType, base64Credentials] = authHeader.split(' ')

    if (authType !== 'Basic') {
        return res.status(401).send('Invalid credentials')
    }

    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
    const [username, password] = credentials.split(':')

    if (username === 'super admin' && password === 'qwerty') {
        next()
    } else {
        return res.status(401).send('Invalid credentials')
    }
}