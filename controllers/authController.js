import User from "../models.User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "7d"});
};

export const registerUser = async(req, res) =>{
    const {username, email, password} = req.body;
    try{
        const UserExists = await User.findOne({email});
        if(UserExists){
            return res.status(400).json({message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        res.status(201).json({
            _id: user._id,
            username : user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

export const loginUser = async(req, res) =>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(user && await compare(password, user.password)){
            res.json({
                _id : user.id,
                username: user.username,
                email:  user.email,
                token: generateToken(user._id),
            });
        } else{
            res.status(401).json({
                message: "Invalid Email or Password"
            });
        }
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

export const getAllUsers = async(req, res) =>{
    res.json(req.user);
};
