import * as express from 'express'

import Profile from '../models/profile'
import Chat from '../models/chat'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/profileType'
import { ChatType } from '../types/chatType'

/*
Route for showing the users chats.

1. THe code looks for a valid profile and gets it from the database.
2. Get the chats of this user.
3. Then the chats are being requested from the database.
4. Check where the participant is not equal to the current user and find this persons profile in the database.
5. Return the data required for showing up this chat correctly in the overview.
6. The rawData gets filtered, so that only items which are not undefined are sent to the template.
*/

async function renderChats (req: express.Request & {session: SessionType}, res: express.Response, next: express.NextFunction) {
    const cusErr = {
        req,
        res,
        code: 401,
        redirectTo: '/',
        scope: 'chats',
        message: 'You need to be logged in to view your chats!',
        logOut: true,
    }

    if (req.session && req.session.userId) {
        const { userId } = req.session

        try {
            const myProfile = await Profile.findOne({ _id: userId }) as ProfileType

            if (!myProfile.hasFinishedQuestionaire) {
                throw new Error('You have not yet filled in the questionaire!')
            } else {
                if (myProfile.chats && myProfile.chats.length) {
                    const rawData = await Promise.all(myProfile.chats.map(async (chatId: string, i) => {
                        const chatResult = await Chat.findOne({ _id: chatId }) as ChatType

                        for (let i = 0; i < chatResult.chatParticipants.length; i++) {
                            // tslint:disable-next-line:triple-equals
                            if (chatResult.chatParticipants[i] != userId) {
                                const chatWithProfile = await Profile.findOne({ _id: chatResult.chatParticipants[i] }) as ProfileType

                                return {
                                    _id: chatResult._id,
                                    fullName: chatWithProfile.fullName,
                                    profileImageUrl: chatWithProfile.profileImages
                                        && chatWithProfile.profileImages.length
                                        && chatWithProfile.profileImages[0].replace('public', ''),
                                }
                            }
                        }
                    }))

                    const openChatsData = rawData.filter(data => data !== undefined)
                    res.status(200).render('chats.ejs', { openChatsData })
                } else {
                    res.status(200).render('chats.ejs', { openChatsData: null })
                }
            }
        } catch (error) {
            next(error)
        }
    } else {
        next(cusErr)
    }
}

export default renderChats
