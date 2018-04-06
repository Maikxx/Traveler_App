import * as express from 'express'

import Chat from '../models/chat'
import Profile from '../models/profile'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'
import { ChatType, MessageType } from '../types/chatType'

// import handleHttpError from '../utils/handleError'

/*
Route for handling /chat requests.

1. Checks if the user exists and is logged in, then it will get the chat requested (via params) from the database.
2. It will then loop over all the chat participantsIds and get their profiles.
3. This needs to be done in order for the chatData to be complete (you need a name of the person you chat with etc.)
*/

async function renderChat (req: express.Request & {session: SessionType}, res: express.Response, next: express.NextFunction) {
    const cusErr = {
        req,
        res,
        code: 401,
        redirectTo: '/',
        scope: 'chat',
        message: 'You need to be logged in to see this chat!',
        logOut: true,
    }

    if (req.session && req.session.userId) {
        const { _id: chatId } = req.params

        try {
            const myProfile = await Profile.findOne({ _id: req.session.userId }) as ProfileType

            if (!myProfile.hasFinishedQuestionaire) {
                res.status(409).redirect('/questionaire')
            }

            const chatResult = await Chat.findOne({ _id: chatId }) as ChatType
            const otherUserId = chatResult.chatParticipants.filter((participantId: string) => {
                // tslint:disable-next-line:triple-equals
                return req.session.userId != participantId
            })
            const chatWithProfile = await Profile.findOne({ _id: otherUserId[0] }) as ProfileType

            res.render('chat.ejs', {
                chatData: {
                    chatId,
                    chatWithName: chatWithProfile.firstName,
                    chatWithId: chatWithProfile._id,
                    messages: chatResult.messages
                        && chatResult.messages.length
                        && chatResult.messages.map((message: MessageType) => ({
                            messageById: message.messageById,
                            messageText: message.messageText,
                            sentByWho: req.session.userId === message.messageById ? 'me' : 'them',
                        })),
                },
            })
        } catch (error) {
            next(error)
        }
    } else {
        cusErr.code = 401
        cusErr.message = 'You need to be logged in to send a message!'

        next(cusErr)
    }
}

export default renderChat
