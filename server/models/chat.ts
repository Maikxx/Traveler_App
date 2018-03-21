import * as mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    chatWithName: String,
    ownUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    chatWithId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    messages: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Message' } ],
})

export default mongoose.model('Chat', chatSchema)
