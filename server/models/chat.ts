import * as mongoose from 'mongoose'

// Create a Mongoose Schema for a chat type. A Schema is a blueprint, of which real entries in the DB are created.
// This Schema has an array of Mongoose ObjectId's which correspond to the participants of a chat.

const chatSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    chatParticipants: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' } ],
    messages: [
        {
            messageById: String,
            messageText: String,
        },
    ],
})

export default mongoose.model('Chat', chatSchema)
