const express = require('express');
const router  = express.Router();       // router for all api/v1.. requests

// till api/v1 reqeust comes to `router` then according next route, they goes to next created routes:

// creating a route for all ../user/.... reqeusts, 
// route for user reqeusts, these requests goes to userRouter handler
const userRouter = require('./user');
const accountRouter = require('./account');


router.use('/user', userRouter);
router.use('/account', accountRouter);

module.exports = router;
// all api starts from:
// /api/v1/user ...