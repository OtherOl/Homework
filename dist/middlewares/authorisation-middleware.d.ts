import { NextFunction, Response, Request } from "express";
export declare const authorisationMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
