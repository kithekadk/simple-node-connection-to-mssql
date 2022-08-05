import { sqlConfig } from "../config/config";
import bcrypt from 'bcrypt'

import {v4 as uid} from 'uuid'
import mssql from 'mssql'
import { Request, Response } from "express";
import { userSchema } from "../helper/validators";
import { User } from "../interfaces/interfaces";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {Data} from '../interfaces/interfaces'

interface Extended extends Request{
    info?:Data
}

interface customRequest extends Request{
    body:{
        email:string;
        password:string;
    }
}
export const registerUser = async(req:customRequest,res:Response)=>{
    try {
        
        const id=uid();

        const{email, password}= req.body
        const{error, value}= userSchema.validate(req.body)
        if(error){
            return res.json({error})
        }
        const hashedPassword = await bcrypt.hash(password,9);
        const pool = await mssql.connect(sqlConfig)
        if(pool.connected){
            console.log(" db connected...");
            
        }

        await pool.request()

        .input('id', mssql.VarChar, id)
        .input('email', mssql.VarChar, email)
        .input('password', mssql.VarChar, hashedPassword)

        .execute('insertUser')

        

       return res.json({message:"user created succcessfully"})
    } catch (error) {
       return res.json({error:"email taken"})
    }
}


export const loginUser = async(req:customRequest, res:Response)=>{
    try {
        const {email, password}=req.body
        const {error, value}= userSchema.validate(req.body)
        if(error){
            return res.json({error:error.details})
        }
        const pool = await mssql.connect(sqlConfig)

        if(pool.connected){
            console.log('connection established')
        }
        const user:User[] = await (await pool.request()
        .input('email', mssql.VarChar, email)
        .execute("getUser")).recordset

        if(!user){
            res.json({message:"no such user"})
        }
        const correctPassword = await bcrypt.compare(password,user[0].password)
        if (!correctPassword){
            return res.json({message:"invalid password"})
        }
        const payload = user.map((item)=>{
            const{password,...rest}=item;
            return rest;
        })
        const token = jwt.sign(payload[0], process.env.KEY as string,{expiresIn:'30s'})
        res.json({message:"logged in",token})

    } catch (error) {
        res.json({error})
    }
}

export const getHomepage = async(req:Extended, res:Response)=>{
if(req.info){
    return res.json({message:`Welcome to the Homepage${req.info.email}`})
}
}
