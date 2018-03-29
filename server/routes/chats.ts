import * as express from 'express'
import * as mongoose from 'mongoose'

import Profile from '../models/profile'
import Chat from '../models/chat'

import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/profileType'
import { ChatType } from '../types/chatType'

import handleHttpError from '../utils/handleError'

/*
Route for showing the users chats.

1. THe code looks for a valid profile and gets it from the database.
2. Get the chats of this user.
3. Then the chats are being requested from the database.
4. Check where the participant is not equal to the current user and find this persons profile in the database.
5. Return the data required for showing up this chat correctly in the overview.
6. The rawData gets filtered, so that only items which are not undefined are sent to the template.
*/

function renderChats (req: express.Request & {session: SessionType}, res: express.Response) {
    const cusErr = {
        redirectTo: '/',
        scope: 'chats',
        message: '',
        logOut: false,
    }

    if (req.session && req.session.userId) {
        const { userId } = req.session

        Profile.findOne({ _id: userId })
            .then((myProfile: ProfileType) => {

                if (myProfile.chats && myProfile.chats.length) {

                    Promise.all(myProfile.chats.map((chatId: string, i) => {

                        return Chat.findOne({ _id: chatId })
                            .then((chatResult: ChatType) => {

                                for (let i = 0; i < chatResult.chatParticipants.length; i++) {

                                    // tslint:disable-next-line:triple-equals
                                    if (chatResult.chatParticipants[i] != userId) {

                                        return Profile.findOne({ _id: chatResult.chatParticipants[i] })
                                            .then((chatWithProfile: ProfileType) => ({
                                                _id: chatResult._id,
                                                fullName: chatWithProfile.fullName,
                                                profileImageUrl: chatWithProfile.profileImages
                                                    && chatWithProfile.profileImages.length
                                                    && chatWithProfile.profileImages[0].replace('public', ''),
                                            }))
                                            .catch((error: mongoose.Error) => {
                                                cusErr.message = 'Something went wrong with getting the profile of a chat!'

                                                handleHttpError(req, res, 500, cusErr.redirectTo,
                                                    cusErr.scope, cusErr.message, cusErr.logOut, error)
                                            })
                                    }
                                }
                            })
                            .catch((error: mongoose.Error) => {
                                cusErr.message = 'Something went wrong with getting the profile of a chat!'

                                handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
                            })
                    }))
                        .then(rawData => {
                            const openChatsData = rawData.filter(data => data !== undefined)
                            res.status(200).render('chats.ejs', { openChatsData })
                        })
                        .catch((error: mongoose.Error) => {
                            cusErr.message = 'Boiled up error in the Promise.all!'

                            handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
                        })
                }
            })
            .catch((error: mongoose.Error) => {
                cusErr.message = 'Invalid Own User ID!'

                handleHttpError(req, res, 409, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
            })
    } else {
        cusErr.message = 'You need to be logged in to view your chats!'

        handleHttpError(req, res, 403, cusErr.redirectTo, cusErr.scope, cusErr.message, true)
    }
}

export default renderChats
