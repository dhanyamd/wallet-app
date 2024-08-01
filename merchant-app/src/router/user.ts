import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'
import { JWT_USER } from "../config";
import { userauthMidlleware } from "../middeware";

const prismaClient = new PrismaClient()

export const userRouter = Router();

userRouter.post('/signup', async (req, res) => {
    const { name, username, password } = await req.body;

    try {
        await prismaClient.$transaction(async tx => {
            const user = await tx.user.create({
                data: {
                    name,
                    username,
                    password
                }
            })

            await tx.userAccount.create({
                data: {
                    userId: user.id
                }
            })
            res.json({
                message: 'Signed up'
            })
        })



    } catch (e) {
        return res.status(403).json({
            message: "Error while signing up"
        })
    }

})

userRouter.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    const user = await prismaClient.user.findFirst({
        where: {
            username,
            password
        }
    })
    if (!user) {
        res.status(403).json({
            message: 'Unable to log you in'
        })
    }

    const token = jwt.sign({
        id: user?.id
    }, JWT_USER)

    return res.json({ token })
})


userRouter.post('/onramp', async (req, res) => {
    const { userId, amount } = req.body;


    await prismaClient.userAccount.update({
        where: {
            userId: userId,
        },
        data: {
            balance: {
                increment: amount
            }
        }
    })

    return res.json({
        message: 'onramp done!'
    })
})

userRouter.post('/transfer', userauthMidlleware, async (req, res) => {
    const { merchantId, amount } = req.body;

    //@ts-ignore
    const userId = req.id 

   console.log('user balance checked');
    //locking the user balance
  const paymentDone = await prismaClient.$transaction(async tx => {
        const userAccount = await tx.userAccount.findFirst({
            where: {
                userId
            }
        })

        if ((userAccount?.balance || 0) < amount) {
            return false;
        }


        Error.stackTraceLimit = Infinity;
        await new Promise((r) => setTimeout(r, 10000))

        console.log('uer balance passed') 
       
        await tx.userAccount.update({
            where:{
                userId
            }, 
            data: {
                balance : {
                    decrement : amount
                }
            }
        })

        await tx.merchantAccount.update({
            where:{
                  merchantId
            }, 
            data : {
                 balance :{
                    increment : amount
                 }
            }
        })
        console.log('transaction done');
        return true 
    },{
        maxWait : 50000,
        timeout : 100000
    });

    if(paymentDone){
         return res.json({
            message : 'payment is done'
         })
    } else{
        return res.status(411).json({
            message : 'payment not succeded'
        })
    }
})