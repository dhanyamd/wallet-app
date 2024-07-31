import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import { JWT_PMERCHANT, JWT_USER } from "./config"

export const merchantauthMidlleware = (req : Request, res: Response, next : NextFunction) => {

    const token  = req.headers['authorization'] as string

    const verified = jwt.verify(token, JWT_PMERCHANT)
    if(verified){
        //@ts-ignore
        req.id = verified.id
        next();
    }
    else{
        return res.status(403).json({
          message : 'Not authorized'
        })
    }
}

export const userauthMidlleware = (req : Request, res: Response, next : NextFunction) => {

    const token  = req.headers['authorization'] as string

    const verified = jwt.verify(token, JWT_USER)
    if(verified){
        //@ts-ignore
        req.id = verified.id
        next();
    }
    else{
        return res.status(403).json({
          message : 'Not authorized'
        })
    }

}


