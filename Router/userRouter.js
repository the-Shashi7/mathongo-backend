const express = require('express');
const userRouter = express.Router();
const {Sigin,Sigup,Signout} = require('../Controller/userController');
const auth = require('../Middleware/authMiddleware');

userRouter.post('/sigup',Sigup)
userRouter.post('/sigin',Sigin)
userRouter.post('/signout',auth,Signout)

module.exports = userRouter;