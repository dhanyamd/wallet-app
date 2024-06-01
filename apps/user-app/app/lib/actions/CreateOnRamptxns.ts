"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client";



export async function createOnrampTransaction(provider: string, amount: number) {
    const session = await getServerSession(authOptions);
    const token = (Math.random()*1000).toString()
    
    
    if(!session?.user || !session.user?.id){
        return {
            message : "User not logged in"
        }
    }

    await prisma.onRampTransaction.create({
        data: {
            userId : Number(session.user?.id),
            amount: amount * 100,
            provider,
            status: "Processing",
            startTime: new Date(),
            token : token       
        }
    })

    return {
        message : "Onramp transaction added",
    }
}