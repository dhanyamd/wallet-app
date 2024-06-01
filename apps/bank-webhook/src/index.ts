import express from "express"
import db from "@repo/db/client";
const app = express();

app.post('/hdfcWebhook', async(req, res)=> {
    const paymentInformation = {
        token : req.body.token,
        userId : req.body.user._identifier,
        amount : req.body.amount
    }

try{

 await db.$transaction([
    db.balance.updateMany({
        where: {
            userId : paymentInformation.userId
        },
        data: {
            amount : {
                increment : paymentInformation.amount
            } 
        }
     })
 ])

  
 await db.onRampTransaction.updateMany({
    where:{
        token : paymentInformation.token
    },
    data: {
        status: "Success"
    }
 })

 res.status(200).json({message : "captured"})
}catch(error){
  console.log(error)
  res.status(411).json({
    message : "Error while processing your webhook"
  })
  
}
});

