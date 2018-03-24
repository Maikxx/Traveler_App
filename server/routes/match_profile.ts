import * as express from 'express'
import Profile from '../models/profile'
import Chat from '../models/chat'
import handleHttpError from '../utils/handleError'
import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'
import { ChatType } from 'server/types/chatType'

function renderMatchProfile (req: express.Request & {session: SessionType}, res: express.Response) {
    if (req.session && req.session.userId) {
        const { _id } = req.params

        if (_id) {
            Profile.find({ _id })
                .then((result: ProfileType[]) => {
                    req.session.error = null

                    const currentResult = result[0]

                    const profileData = {
                        _id: currentResult._id,
                        firstName: currentResult.firstName,
                        fullName: currentResult.fullName,
                        ownGender: currentResult.ownGender,
                        birthdate: currentResult.birthdate,
                        age: currentResult.age,
                        profileImages: currentResult.profileImages &&
                            currentResult.profileImages.map(profileImage => profileImage && profileImage.replace('public', '')),
                        description: currentResult.description,
                        hasTraveledTo: currentResult.hasTraveledTo,
                        favouriteHolidayDestination: currentResult.favouriteHolidayDestination,
                        favouriteHolidayTypes: currentResult.favouriteHolidayTypes,
                        plansHolidaysAhead: currentResult.plansHolidaysAhead,
                        likesToHike: currentResult.likesToHike,
                        prefersInterContinental: currentResult.prefersInterContinental,
                        wantsToVisitSoon: currentResult.wantsToVisitSoon,
                        hasVisitedThisMuchDestinations: currentResult.hasVisitedThisMuchDestinations,
                        favouriteOverallTravelTime: currentResult.favouriteOverallTravelTime,
                        wantsToTravelQuickly: currentResult.wantsToTravelQuickly,
                        mostImportantInRelationShip: currentResult.mostImportantInRelationShip,
                        wantsToMarry: currentResult.wantsToMarry,
                        foremostRelationshipMotivation: currentResult.foremostRelationshipMotivation,
                        wantsToOrAlreadyHasChildren: currentResult.wantsToOrAlreadyHasChildren,
                        drinksAlcohol: currentResult.drinksAlcohol,
                        smokes: currentResult.smokes,
                        likesToBeInNature: currentResult.likesToBeInNature,
                        favouriteMusicGenre: currentResult.favouriteMusicGenre,
                        yearlyEarns: currentResult.yearlyEarns,
                        livesIn: currentResult.livesIn,
                        jobTitle: currentResult.jobTitle,
                        lengthInCm: currentResult.lengthInCm,
                        chatId: null,
                    }

                    Chat.findOne({ ownUserId: req.session.userId, chatWithId: currentResult._id })
                        .then((result: ChatType) => {
                            if (result) {
                                profileData.chatId = result._id
                            } else {
                                req.session.lastMatchId = profileData._id
                            }

                            res.render('match_profile.ejs', { profileData })
                        })
                        .catch(error => {
                            console.error(error)
                            console.log('Error in match profile chat query!')
                            handleHttpError(req, res, 500, 'Internal Server Error', '/matches_overview')
                        })
                })
                .catch(error => {
                    console.error(error)
                    console.error('Invalid id passed in!')
                    handleHttpError(req, res, 400, 'Bad Request', '/matches_overview')
                })
        } else {
            console.error('No id passed in to the url!')
            handleHttpError(req, res, 400, 'Bad Request', '/matches_overview')
        }
    } else {
        console.error('You are not logged in!')
        handleHttpError(req, res, 401, 'Credentials Required', '/')
    }
}

export default renderMatchProfile
