import * as mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    chatParticipants: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' } ],
    ownUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    chatWithId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    messages: [
        {
            messageById: String,
            messageText: String,
        },
    ],
})

export default mongoose.model('Chat', chatSchema)
