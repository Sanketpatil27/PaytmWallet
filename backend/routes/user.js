const express = require('express');
const { User, Account } = require("../db");           // userModel
const userRouter = express.Router();    // creating a route for user
const zod = require('zod');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');
const { authMiddleware } = require('../middleware');


// creating zod schema for signup
const signupSchema = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
});

// creating zod schema for signin
const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

// creating updation schema (all fields are optional, username shouldn't updated)
const updateSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

// api: api/v1/user/signup
userRouter.post('/signup', async (req, res) => {
    const userBody = req.body;
    const signup = signupSchema.safeParse(userBody);

    if(!signup.success)
        return res.status(411).json({msg: "invalid credentials!"});

    const findUser = await User.findOne({username: userBody.username});
    if(findUser)
        return res.status(411).json({msg: "Email already exists!!!"});


    const newUser = await User.create({
        username: userBody.username,
        firstName: userBody.firstName,
        lastName: userBody.lastName,
        password: userBody.password  
    });

    // giving bank balance to user as signup gift
    await Account.create({
        userId: newUser._id,
        balance: Math.floor(Math.random() * 10000000)
    })

    // creating token for user after signup
    const token = jwt.sign({
        userId: newUser._id
    }, JWT_SECRET);

    res.status(200).json({
        msg: "User created successfully!",
        token: token
    })
});

userRouter.post('/signin', async (req, res) => {
    const userBody = req.body;

    const isValid = signinSchema.safeParse(userBody);
 
    if(!isValid.success)
        return res.status(411).json({msg: "Invalid Credentials!"});
        
    const user = await User.findOne({
        username: userBody.username,
        password: userBody.password
    });

    if(user)
    {
        const token = jwt.sign({userId: user._id}, JWT_SECRET);
        return res.status(200).json({token});
    }
    
    res.status(411).json({msg: "Username not found!"});
});

userRouter.put('/', authMiddleware, async (req, res) => {
    const toUpdate = req.body;

    const isValidUpdation = updateSchema.safeParse(toUpdate);

    if(!isValidUpdation.success)
        return res.status(411).json({msg: "Updation is invalid!"});

    // This not working
    // await User.updateOne(toUpdate, {
    //     _id: req.userId      // we stored it in req in authMiddleware
    // })
    // OR: 
    const userId = req.userId;      // we stored it in req in authMiddleware
    const user = await User.findOne({_id: userId});

    // to update all properties of user that he passed to toUpdate
    // work like old name: {user.prop = username}, new name: {toupdate.prop = toupudate.username}
    for (const prop in toUpdate) {
        console.log(prop + "  " + user[prop] + "  " + toUpdate[prop]);
        user[prop] = toUpdate[prop];
        // await user.update({prop: toUpdate.prop});
    }

    await user.save();
    res.status(200).json({msg: "User Updated successfully!"});
});

userRouter.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
    // const users = User.find({firstName: name});
    const users = await User.find({
        $or: [{
                firstName: {
                    "$regex": filter     // used to match `substring`
                }
        },  {
                lastName: {
                    "$regex": filter
                }
        }]
    });   

    // res.status(200).json({users: users});
    // Don't return password to the user!
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = userRouter;