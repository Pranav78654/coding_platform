import Chat from "../models/chatModel.js";

export const sendMessage = async (req, res) => {
    try {
        const { workspaceId, message } = req.body;
        if (!workspaceId || !message) {
            return res.status(400).json({
                message: "Workspace ID and Message are required"
            });
        }

        const chat = await Chat.create({
            workspaceId,
            senderId: req.user._id,
            message
        });

        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const getMessagesByWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const messages = await Chat.find({ workspaceId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const chat = await Chat.findById(messageId);
        if (!chat) {
            return res.status(404).json({
                message: "Message not found"
            });
        }
        if (chat.senderId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Delete Your Own Message Only"
            });
        }
        chat.isDeleted = true;
        chat.message = "This message has been deleted";
        await chat.save();

        res.json({
            message: "Message deleted successfully", chat
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};