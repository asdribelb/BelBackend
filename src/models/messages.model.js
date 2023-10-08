import mongoose from "mongoose"

const messagesCollection = "messages";

const messagesSchema = new mongoose.Schema({
    user: { type: String, max: 100, required: true},
    message: { type: String, max: 100, required: true},
});

export const messagesModel = mongoose.model(messagesCollection, messagesSchema)