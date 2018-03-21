import * as mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    messageById: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    },
    sentByWho: {
        type: String,
        enum: [ 'me', 'them' ],
    },
    sentBy: {
        type: String,
        enum: [ 'me', 'them' ],
        default: () => this.sentByWho && this.sentByWho === 'me' ? 'them' : 'me',
    },
    messageText: String,
})

export default mongoose.model('Message', messageSchema)
