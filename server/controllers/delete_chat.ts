import * as express from 'express'

import Chat from '../models/chat'
import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ChatType } from '../types/chatType'

/*
Controller which handles deleting chats.

Note: The reason this is either a post request or a delete has to do with the fact this has to be working without JS.
1. Check if the user has a userId session.
2. Find a chat which corresponds with the id given by req.params.
3. Update both the profiles, which are linked to this chat, so that they no longer contain this chatId.
4. If deleting succeeds, navigate to the chats overview.
*/

async function handleDeleteChat (req: express.Request & {session: SessionType}, res: express.Response, next: express.NextFunction) {
    const cusErr = {
        req,
        res,
        code: 401,
        redirectTo: '/',
        scope: 'delete_chat',
        message: 'You need to be logged in to delete a chat!',
        logOut: true,
    }

    const { _id: chatId } = req.params

    if (req.session && req.session.userId) {
        try {
            const chatResult = await Chat.findOne({ _id: chatId }) as ChatType

            await Promise.all(chatResult.chatParticipants.map(async (participantId: string) => {
                await Profile.update({ _id: participantId }, { $pullAll: { chats: [ chatResult._id ] } })
            }))

            await Chat.remove({ _id: chatResult._id })

            res.status(200).redirect('/chats')
        } catch (error) {
            next(error)
        }
    } else {
        next(cusErr)
    }
}

export default handleDeleteChat
