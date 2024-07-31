import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { authOptions } from "../../lib/auth";
import { signIn } from "next-auth/react";

export const GET = async () => {
    const session = await getServerSession(authOptions);
    if (session.user) {
        return NextResponse.json({
            user: session.user
        })
    }
    signIn();
    return NextResponse.json({
        message: "You are not logged in"
    }, {
        status: 403
    })
}