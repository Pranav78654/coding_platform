import Chat from "../models/chatModel.js";

export const sendMessage = async (req, res) => {
  // Log 1: Check if the controller is being hit at all
  console.log("🎯 sendMessage controller hit. Body:", req.body);

  try {
    const { workspaceId, message } = req.body;
    if (!workspaceId || !message) {
      console.error("❌ Error: Missing workspaceId or message.");
      return res.status(400).json({
        message: "Workspace ID and Message are required"
      });
    }

    let chat = await Chat.create({
      workspaceId,
      senderId: req.user._id,
      message
    });

    chat = await chat.populate("senderId", "username");

    const io = req.app.get("io");

    // Log 2: This is the log that wasn't appearing before
    console.log(`✅ Emitting 'new-message' to workspace room: ${workspaceId}`);
    io.to(workspaceId).emit("new-message", chat);

    res.status(201).json(chat);
  } catch (error) {
    // Log 3: If there's a crash, this will tell us why
    console.error("🔥 CRASH in sendMessage:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

export const getMessagesByWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const messages = await Chat.find({ workspaceId })
            .populate("senderId", "username")
            .sort({ createdAt: 1 });
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
req.app.get("io").to(chat.workspaceId.toString()).emit("message-deleted", {
            _id: chat._id,
            message: chat.message,
            isDeleted: chat.isDeleted
        });
        res.json({
            message: "Message deleted successfully", chat
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};