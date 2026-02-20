import Session from "../models/sessionModel.js";
import {v4 as uuidv4} from "uuid";

const roomId = uuidv4();

export const createSession = async (req, res) =>{
    try{
        const{ name, participants = []} = req.body;
        const ownerId = req.user._id;

        if(!participants.includes(ownerId.toString())){
            participants.push(ownerId);
        }
        const newSession = await Session.create({
            roomId,
            name, 
            owner: ownerId,
            participants
        });
        res.status(201).json(newSession);
    } catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
};

export const getSessions = async (req, res) =>{
    try{
        const{ id } = req.params;
        const session = await Session.findById(id)
        .populate("owner", "username email")
        .populate("participants", "username email");

        if(!session){
            return res.status(404).json({
                message: "Session Not Found"
            });
        }
        return res.json(session);
    } catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
};

export const updateSession = async (req, res) =>{
    try{
        const { id } = req.params;
        const updates = req.body;

        const session = await Session.findById(id);
        if(!session){
            return res.status(404).json({
                message: "Session Not Found"
            });
        }
        if(session.owner.toString() !== req.user._id.toString()){
            return res.status(403).json({
                message: "Not Authorized"
            });
        }
        Object.assign(session, updates);
        await session.save();
        return res.json(session);
    } catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
};

export const deleteSession = async (req, res) =>{
    try{
        const { id } = req.params;

        const session = await Session.findById(id);
        if(!session){
            return res.status(404).json({
                message : "Session Not Found"
            });
        }
        await session.deleteOne();
        return res.json({
            message: "Session Deleted Successfully"
        });
    } catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
};

export const getUserSession = async (req, res) =>{
    try{
        const userId = req.user._id;
        const session = await Session.find({
            participants: userId
        })
        .populate("owner", "username email")
        .populate("participants", "username email")

        return res.json(session);
    } catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
};