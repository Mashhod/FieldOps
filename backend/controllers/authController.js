import UserModel from "../models/UserModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const SECRET = process.env.JWT_SECRET;


export const signup = async(req, res) => {

    let reqBody = req.body;
    
    if(!reqBody.name || !reqBody.email || !reqBody.password|| !reqBody.role ){
        res.status(400).send({message: "Required Parameters Missing"})
        return;
    }

    reqBody.email = reqBody.email.toLowerCase();

    try {

        let user = await UserModel.findOne({email: reqBody.email});

        if(!user){
            let result = await UserModel.create({
                name: reqBody.name,
                email: reqBody.email,
                password:reqBody.password,
                role: reqBody.role
            })
            res.status(201).send({message: "User Created Successfully", result: result});

        }else{
            res.status(400).send({message: "User Already Exists"});

        }
        
    } catch (error) {
        console.log("Error", error);
        res.status(500).send({message: "Internal Server Error"});
        
    }

}

export const login = async(req, res) => {

    let reqBody = req.body;

    if(!reqBody.email || !reqBody.password){
        res.status(400).send({message: "Required Parameters Missing"});
        return;
    }

    reqBody.email = reqBody.email.toLowerCase();

    try {

        let user = await UserModel.findOne({email: reqBody.email});

        if(!user){
            res.status(400).send({message: "User Not Found With This Email"});
            return;
        }

        let isMatched = await bcrypt.compare(reqBody.password, user.password);

        if(!isMatched){
            res.status(401).send({message: "Password did not Match"});
            return
        }

         let token = jwt.sign({
            id: user._id,
            email: user.email,
            role: user.role,
            iat: Date.now() / 1000,
            exp: (Date.now() / 1000) + (60*60*24)
        

        }, SECRET);

        res.cookie('Token', token, {
            maxAge: 86400000, // 1 day
            httpOnly: true,
            secure: true

        });

        res.status(200).send({message: "User Logged In Successfully", user:{
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token: token
        })

        
    } catch (error) {
        console.log("Error", error);
        res.status(500).send({message: "Internal Server Error"});
        
    }

}

