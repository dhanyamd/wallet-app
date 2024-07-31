import { Router } from "express";
import {PrismaClient} from '@prisma/client'
import jwt from 'jsonwebtoken'
import { JWT_PMERCHANT } from "../config";
export const merchantRouter = Router(); 

const prismaClient = new PrismaClient()

merchantRouter.post('/signup',async (req, res) => {
    const {name, username, password} = await req.body;
      
    try{
        await prismaClient.merchant.create({
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

merchantRouter.post('/signin', async(req, res) => {
  const { username, password} = req.body;
   
  const merchant = await prismaClient.merchant.findFirst({
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
   }, JWT_PMERCHANT)

   return res.json({token})
})