"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";
import { redirect } from "next/navigation";

export default function Page(): JSX.Element {
  const session = useSession();
  if(session.data?.user){
      redirect('/dashboard')
  }
  return (
   <div>
    hii from the / page
   </div>
  );
}