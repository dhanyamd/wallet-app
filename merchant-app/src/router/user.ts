import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'
import { JWT_USER } from "../config";

const prismaClient = new PrismaClient()

export const userRouter = Router();

userRouter.post('/signup', async(req, res) => {
    const {name, username, password} = await req.body;
      
    try{
        await prismaClient.user.create({
            data: {
             name,
             username,
             password
            }
         })
         res.json({
             message : 'Signed up'
         })
        
    }catch(e) {
        return res.status(403).json({
            message : "Error while signing up"
        })
    }

})

userRouter.post('/signin', async(req, res) => {
    const { username, password} = req.body;
   
    const merchant = await prismaClient.user.findFirst({
      where:{
          username,
          password
      }
    })
     if(!merchant){
      res.status(403).json({
          message : 'Unable to log you in'
      })
     }
  
     const token = jwt.sign({
      id : merchant?.id
     }, JWT_USER)
  
     return res.json({token})
})