import mongoose from "mongoose"

const { Schema } = mongoose;

const sessionnSchema = new Schema({
    roomId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    ],
},
    { timestamps: true }
)

export default mongoose.model("Session", sessionnSchema);