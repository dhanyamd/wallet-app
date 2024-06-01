import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions} from "../../lib/auth";
import { OnRampTransactions } from "../../components/OnRampTransactions";

async function getOnRampTransactions(status : any){
   const session = await getServerSession(authOptions);
   const txs = await prisma.onRampTransaction.findMany({
    where: {
        userId : Number(session?.user?.id),
        status : status
    }
   })
   return txs.map((t)=> ({
     time : t.startTime,
     amount : t.amount,
     provider: t.provider,
     status: t.status
   }))
}

async function getP2Ptransactions(){
    const session = await getServerSession(authOptions);
    const txs = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: Number(session?.user?.id)
        }
    })
    return txs.map((t)=> ({
        time: t.timestamp,
        amount: t.amount,
        provider: t.toUserId,
        status: "Success"
    }))
}

async function recieveP2Ptransfer(){
    const session = await getServerSession(authOptions);
    const txs = await prisma.p2pTransfer.findMany({
        where: {
            toUserId : Number(session?.user?.id)
        }
    })
    return txs.map((t)=> ({
        time: t.timestamp,
        provider: t.fromUserId,
        amount: t.amount,
        status: "Success"
    }))
}
 
 export default async function Transactions() {
    const successTransactions = await getOnRampTransactions("Success")
    const processingTransactions = await getOnRampTransactions("Processing")
    const failureTransactions = await getOnRampTransactions("Failure")
    const sentTransactions: any = await getP2Ptransactions()
    const receivedTransactions: any = await recieveP2Ptransfer()

    return (
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Transactions
          </h1>
    
          <div className="w-[80vw] grid grid-cols-1 md:grid-cols-2 px-10 gap-3">
            <h1 className="text-2xl text-[#6a51a6] pt-2 font-bold col-span-2">
              P2P Transactions
            </h1>
            <div>
              <OnRampTransactions
                title={"Sent transactions"}
                transactions={sentTransactions}
              />
            </div>
            <div>
              <OnRampTransactions
                title={"Received transactions"}
                transactions={receivedTransactions}
              />
            </div>
          </div>
    
          <div className="w-[80vw] grid grid-cols-1 md:grid-cols-2 px-10 gap-3">
            <h1 className="text-2xl text-[#6a51a6] pt-2 font-bold col-span-2">
              Wallet Transactions
            </h1>
            <div>
              <OnRampTransactions
                title={"Successfull transactions"}
                transactions={successTransactions}
              />
            </div>
    
            <div>
              <OnRampTransactions
                title={"Processing Transactions"}
                transactions={processingTransactions}
              />
            </div>
    
            <div>
              <OnRampTransactions
                title={"Failure Transactions"}
                transactions={failureTransactions}
              />
            </div>
          </div>
        </div>
    )
}
