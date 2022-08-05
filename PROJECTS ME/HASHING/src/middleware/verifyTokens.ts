import dotenv from 'dotenv'
dotenv.config()
import {Data} from '../interfaces/interfaces'
import { NextFunction, Request, Response } from 'express'
import  Jwt  from 'jsonwebtoken';



interface Extended extends Request{
    info?:Data
}
export const verifyTokens= (req:Extended, res:Response, next:NextFunction)=>{

    try {
        const token = req.headers['token'] as string;
        // res.json({token})

        if (!token){
            return res.json({message:'no permission for you'})
        }

        const data = Jwt.verify(token, process.env.KEY as string) as Data
        req.info = data

    } catch (error) {
        return res.json({error})
    }
next()

}