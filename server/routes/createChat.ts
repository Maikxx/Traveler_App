import * as express from 'express'
import * as mongoose from 'mongoose'

import Chat from '../models/chat'
import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'
import { ChatType } from '../types/chatType'

/*
Route for creating a new chat, if the user clicks on the chat button for the first time with someone.

1. THe code looks for a valid profile and gets it from the database.
2. Create a new chat instance and save it to the database.
3. Find this recently added chat and loop over its participants.
4. For each of these participants, their profile gets updated, with the chatId added to their array of chatIds.
*/

async function createChat (req: express.Request & {session: SessionType}, res: express.Response, next: express.NextFunction) {
    const cusErr = {
        req,
        res,
        code: 401,
        redirectTo: '/',
        scope: 'createChat',
        message: 'You need to be logged in to create a chat!',
        logOut: true,
    }

    if (req.session && req.session.userId && req.session.lastMatchId) {
        try {
            const myProfile = await Profile.findOne({ _id: req.session.userId }) as ProfileType
            const chatWithProfile = await Profile.findOne({ _id: req.session.lastMatchId }) as ProfileType

            const newChat = new Chat({
                _id: new mongoose.Types.ObjectId(),
                chatParticipants: [ myProfile._id, chatWithProfile._id ],
                messages: [],
            })

            await newChat.save()
            const chatResult = await Chat.findOne({ _id: newChat._id }) as ChatType

            await Promise.all(chatResult.chatParticipants && chatResult.chatParticipants.map(async (participantId: string) => {
                await Profile.update({ _id: participantId }, { $push: { chats: chatResult._id } })
            }))

            res.status(201).redirect(`/chat/${chatResult._id}`)
        } catch (error) {
            next(error)
        }
    } else {
        next(cusErr)
    }
}

export default createChat
