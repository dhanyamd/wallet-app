"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client";

export async function p2ptransfer(to:string, amount: number) {
  const session = await getServerSession(authOptions)
  const from = session?.user?.id;

  if(!from){
    return {
        message: "User is not logged in"
    }
  }
  const to_user = await prisma.user.findFirst({
    where: {
        number: to
    }
  });
  if (!to_user){
   return {
    message : "User not found"
   }
  }

  await prisma.$transaction(async(tx)=> {
    await tx.$queryRaw`SELECT * FROM "BALANCE" WHERE "userId" = ${Number(from)} FOR UPDATE `

   const fromBalance = await tx.balance.findUnique({
    where : {userId : Number(from)}
   })
   if(!fromBalance || fromBalance.amount < amount){
    throw new Error("Insufficient funds!!")
   }

    await tx.balance.update({
        where : {userId: Number(from)},
        data : {
            amount : {decrement : amount} 
        }
    })

     await tx.balance.update({
        where: {userId : to_user.id},
        data : {
            amount: {
                increment : amount
            }
        }
     })
    
    await tx.p2pTransfer.create({
        data: {
           fromUserId : Number(from),
           toUserId : to_user.id,
           amount,
           timestamp: new Date()
        }
    })

  })

}