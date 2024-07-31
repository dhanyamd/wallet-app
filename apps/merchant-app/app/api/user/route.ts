import { NextResponse } from "next/server"
//@ts-ignore
import {PrismaClient} from '@repo/db/client'

const client = new PrismaClient();

export const GET = async () => {
    await client.user.create({
        data : {
            email: "asd",
            name: "adsads"
        }
    })
    return NextResponse.json({
        message: "hi there"
    })
}