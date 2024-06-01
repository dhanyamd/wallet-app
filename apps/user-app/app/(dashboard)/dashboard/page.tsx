import { Appbar } from "@repo/ui/appbar";
import { redirect } from "next/navigation";

export default function () {
 return <div className="w-full">
   <div className="flex flex-col justify-between">
        <Appbar onSignin={(
             redirect('/api/auth/signin')
        )} />
       
    </div>
    </div>
   
      
}