const express = require('express');
const accountRouter = express.Router();
const { Account, User } = require('../db');
const { authMiddleware } = require('../middleware');
const mongoose = require('mongoose');


// creating zod schema for transfer route, yet to design
// const transferSchema = zod.object({
//     username: zod.string().email(),
//     amount: zod.string()
// });

accountRouter.get('/balance', authMiddleware, async (req, res) => {
    const account = await Account.findOne({userId: req.userId});
    if(!account)
        return res.status(411).json({msg: "Your Account doesn't exist!"});

    res.status(200).json({balance: account.balance});
})

// bad solution:
// accountRouter.post('/transfer', authMiddleware, async (req, res) => {
//     const { amount, to } = req.body;

//     // zod input validation should be done here!!! *******************************
    
//     const fromAccount = await Account.findOne({userId: req.userId});
//     const toAccount = await Account.findOne({userId: to});

//     if(!fromAccount)
//         return res.status(411).json({msg: "Your Account doesn't exist!"});

//     if(fromAccount.balance < amount) {
//         return res.status(411).json({msg: "Insufficient balance"});
//     }
    
//     if(!toAccount) {
//         return res.status(400).json({msg: "Invalid account"});
//     }

//     // transaction: 
//     await Account.updateOne({
//             userId: req.userId          // this is current user(sender) id we set from authmiddleware
//         }, {
//             $inc: {
//                 balance: -amount        // its will increment balance by -amount
//             }
//         }
//     );

//     await Account.updateOne({
//             userId: to
//         }, {
//             $inc: {
//                 balance: amount         // here balance incremese by +amount
//             }
//         }
//     );

//     res.status(200).json({msg: "Transaction successful"});
// })

// good solution using transactions in databases
accountRouter.post('/transfer', authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // fetch account with transaction
    const fromAccount = await Account.findOne({userId: req.userId}).session(session);
    console.log(`SenderId: ${fromAccount.userId}`);

    if(!fromAccount)
        return res.status(411).json({msg: "Your Account doesn't exist!"});

    if(fromAccount.balance < amount)
    {
        await session.abortTransaction();
        return res.status(400).json({msg: "insufficient balance"});
    }

    const toAccount = await Account.findOne({userId: to}).session(session);
    console.log(`ReceiverId: ${toAccount.userId}`);

    if(!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({msg: "invalid account"});
    }

    // Perform the transfer
    await Account.updateOne({
            userId: req.userId          // this is current user(sender) id we set from authmiddleware
        }, {
            $inc: {
                balance: -amount        // its will increment balance by -amount
            }
        }
    ).session(session);

    await Account.updateOne({
            userId: to
        }, {
            $inc: {
                balance: amount         // here balance incremese by +amount
            }
        }
    ).session(session);

    // commit the transaction 
    await session.commitTransaction();
    res.json({msg: "Transfer successful"});
})

module.exports = accountRouter;