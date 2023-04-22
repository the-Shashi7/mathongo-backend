const userModel = require('../Model/userSchema');
const bcrypt = require('bcrypt');
const jwtwebtoken = require('jsonwebtoken');
const SECRET_KEY = "Shashi";

const Sigup = async (req,res)=>{
    const {name,email,password} = req.body;
    //Exiting user check
    try {
        const existingUser = await userModel.findOne({email:email})
        if(existingUser){
            return res.status(400).json({message:"User already exits"});
        }else{
            //Hashed Password
            const hashedPassword = await bcrypt.hash(password,10);
            //User Creaction
            const result = await userModel({
                name:name,
                password:hashedPassword,
                email:email,
            })
            //Token Generation
            result.save();
            const token = jwtwebtoken.sign({email:result.email,id:result._id},SECRET_KEY)  
            res.status(201).json({user:result,token:token});
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Server error user not created'})
    }

}

const Sigin = async (req,res)=>{
    const {email,password} = req.body;
    try {
        //check user exit
        const existingUser = await userModel.findOne({email:email});
        if(!existingUser){
            return res.status(404).json({message:"User not exits"});
        }else{
            //validate crediential
            const matchedPassword = await bcrypt.compare(password,existingUser.password);
            if(!matchedPassword){
                return res.status(400).json({message:'Invalid Credentials'})
            }
            const token = jwtwebtoken.sign({email:existingUser.email,id:existingUser._id},SECRET_KEY);
            existingUser.isLogined=true;
            existingUser.isLoginedAt = Date.now().toString();
            await existingUser.save();
            res.status(201).json({user:existingUser,token:token});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:'Error in login'
        })
    }
}


const Signout = async (req,res)=>{
    const {email} = req.body;
    try {
        //check user exit
        const existingUser = await userModel.findOne({email:email});
        if(!existingUser){
            return res.status(404).json({message:"User not exits"});
        }else{
            //validate crediential
            if(existingUser.isLogined){
                existingUser.isLogined=false;
                existingUser.isLoginedAt = '';
            }
            await existingUser.save()
            res.status(201).json({message:'Successfully logout'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:'Error in logout'
        })
    }
}

module.exports = {Sigin,Sigup,Signout};