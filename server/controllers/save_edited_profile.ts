import * as express from 'express'
import * as mongoose from 'mongoose'
import * as fs from 'fs'

import Profile from '../models/profile'

import { MulterFile } from '../types/multerFileType'
import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

import handleHttpError from '../utils/handleError'

/*
Controller which handles saving of the edited profile page.

1. Check if the user has a userId session.
2. Then check if the Profile is really existing, based on this users id.
3. Then there is a lot of form validation.
4. The .trim().split(/,?\s+/) function in the validation is a regex, that splits values into an array,
per , and optionally a space after it.
5. If all the required fields are filled in correctly (including the amount of images),
their profile (as created in the Sign Up controller) will be updated with the new values.
*/

function handleSaveEditedProfile (req: express.Request & {session: SessionType} & {files: MulterFile[]}, res: express.Response) {
    const cusErr = {
        redirectTo: '/my_profile/edit',
        scope: 'save_edited_profile',
        message: '',
        logOut: false,
    }

    if (req.session && req.session.userId) {
        const { userId } = req.session

        Profile.findOne({ _id: userId })
            .then((profile: ProfileType) => {
                if (profile) {
                    req.session.error = null

                    // New data, passed in by the form.
                    const {
                        hasTraveledTo,
                        favouriteHolidayDestination,
                        favouriteHolidayTypes,
                        plansHolidaysAhead,
                        likesToHike,
                        prefersInterContinental,
                        wantsToVisitSoon,
                        hasVisitedThisMuchDestinations,
                        favouriteOverallTravelTime,
                        wantsToMarry,
                        foremostRelationshipMotivation,
                        wantsToOrAlreadyHasChildren,
                        drinksAlcohol,
                        smokes,
                        likesToBeInNature,
                        favouriteMusicGenre,
                        yearlyEarns,
                        livesIn,
                        jobTitle,
                        lengthInCm,
                        description,
                        matchHasToLikeToBeInNature,
                        mostImportantInRelationShip,
                        maxMatchDistance,
                        minSearchAge,
                        maxSearchAge,
                        wantsToTravelQuickly,
                    } = req.body

                    // Default data, already known from the user.
                    const queryData = {
                        profileImages: profile.profileImages,
                        hasTraveledTo: profile.hasTraveledTo,
                        favouriteHolidayDestination: profile.favouriteHolidayDestination,
                        favouriteHolidayTypes: profile.favouriteHolidayTypes,
                        plansHolidaysAhead: profile.plansHolidaysAhead,
                        likesToHike: profile.likesToHike,
                        prefersInterContinental: profile.prefersInterContinental,
                        wantsToVisitSoon: profile.wantsToVisitSoon,
                        hasVisitedThisMuchDestinations: profile.hasVisitedThisMuchDestinations,
                        favouriteOverallTravelTime: profile.favouriteOverallTravelTime,
                        wantsToMarry: profile.wantsToMarry,
                        foremostRelationshipMotivation: profile.foremostRelationshipMotivation,
                        wantsToOrAlreadyHasChildren: profile.wantsToOrAlreadyHasChildren,
                        drinksAlcohol: profile.drinksAlcohol,
                        smokes: profile.smokes,
                        likesToBeInNature: profile.likesToBeInNature,
                        favouriteMusicGenre: profile.favouriteMusicGenre,
                        yearlyEarns: profile.yearlyEarns,
                        birthdate: profile.birthdate,
                        livesIn: profile.livesIn,
                        jobTitle: profile.jobTitle,
                        lengthInCm: profile.lengthInCm,
                        description: profile.description,
                        mostImportantInRelationShip: profile.mostImportantInRelationShip,
                        wantsToTravelQuickly: profile.wantsToTravelQuickly,
                        matchSettings: {
                            matchHasToLikeToBeInNature: profile.matchSettings.matchHasToLikeToBeInNature,
                            maxMatchDistance: profile.matchSettings.maxMatchDistance,
                            minSearchAge: profile.matchSettings.minSearchAge,
                            maxSearchAge: profile.matchSettings.maxSearchAge,
                        },
                    }

                    // Required Fields
                    if (
                        !hasTraveledTo || !hasTraveledTo.length ||
                        !favouriteHolidayDestination || !favouriteHolidayDestination.length ||
                        !favouriteHolidayTypes || !favouriteHolidayTypes.length ||
                        !plansHolidaysAhead || !plansHolidaysAhead.length ||
                        !likesToHike || !likesToHike.length ||
                        !prefersInterContinental || !prefersInterContinental.length ||
                        !wantsToVisitSoon || !wantsToVisitSoon.length ||
                        !hasVisitedThisMuchDestinations || !hasVisitedThisMuchDestinations.length ||
                        !favouriteOverallTravelTime || !favouriteOverallTravelTime.length ||
                        !wantsToTravelQuickly || !wantsToTravelQuickly.length ||
                        !likesToBeInNature || !likesToBeInNature.length ||
                        !matchHasToLikeToBeInNature || !matchHasToLikeToBeInNature.length ||
                        !maxMatchDistance ||
                        !minSearchAge ||
                        !maxSearchAge
                    ) {
                        cusErr.message = 'Not all required fields of the questionaire are filled in!'

                        handleHttpError(req, res, 400, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut)
                        return
                    } else {
                        queryData.hasTraveledTo = hasTraveledTo.trim().split(/,?\s+/)
                        queryData.favouriteHolidayDestination = favouriteHolidayDestination
                        queryData.favouriteHolidayTypes = favouriteHolidayTypes
                        queryData.plansHolidaysAhead = plansHolidaysAhead
                        queryData.likesToHike = likesToHike
                        queryData.prefersInterContinental = prefersInterContinental
                        queryData.wantsToVisitSoon = wantsToVisitSoon.trim().split(/,?\s+/)
                        queryData.hasVisitedThisMuchDestinations = hasVisitedThisMuchDestinations
                        queryData.favouriteOverallTravelTime = favouriteOverallTravelTime
                        queryData.wantsToTravelQuickly = wantsToTravelQuickly
                        queryData.likesToBeInNature = likesToBeInNature
                        queryData.matchSettings.matchHasToLikeToBeInNature = matchHasToLikeToBeInNature
                        queryData.matchSettings.maxMatchDistance = maxMatchDistance
                        queryData.matchSettings.minSearchAge = minSearchAge
                        queryData.matchSettings.maxSearchAge = maxSearchAge
                    }

                    // Not required fields
                    if (description && description.length) {
                        queryData.description = description
                    }

                    if (wantsToMarry && wantsToMarry.length) {
                        queryData.wantsToMarry = wantsToMarry
                    }

                    if (foremostRelationshipMotivation && foremostRelationshipMotivation.length) {
                        queryData.foremostRelationshipMotivation = foremostRelationshipMotivation
                    }

                    if (wantsToOrAlreadyHasChildren && wantsToOrAlreadyHasChildren.length) {
                        queryData.wantsToOrAlreadyHasChildren = wantsToOrAlreadyHasChildren
                    }

                    if (drinksAlcohol && drinksAlcohol.length) {
                        queryData.drinksAlcohol = drinksAlcohol
                    }

                    if (smokes && smokes.length) {
                        queryData.smokes = smokes
                    }

                    if (mostImportantInRelationShip && mostImportantInRelationShip.length) {
                        queryData.mostImportantInRelationShip = mostImportantInRelationShip
                    }

                    if (favouriteMusicGenre && favouriteMusicGenre.length) {
                        queryData.favouriteMusicGenre = favouriteMusicGenre
                    }

                    if (yearlyEarns && yearlyEarns.length) {
                        queryData.yearlyEarns = yearlyEarns
                    }

                    if (livesIn && livesIn.length) {
                        queryData.livesIn = livesIn
                    }

                    if (jobTitle && jobTitle.length) {
                        queryData.jobTitle = jobTitle
                    }

                    if (lengthInCm && lengthInCm.length) {
                        queryData.lengthInCm = lengthInCm
                    }

                    if (req.files && req.files.length > 4) {
                        cusErr.message = ''

                        handleHttpError(req, res, 400, cusErr.redirectTo, cusErr.scope, 'Too much images passed!', cusErr.logOut)
                    } else if (req.files) {
                        Promise.all(req.files.map((file: MulterFile, i: number) => {
                            return fs.rename(file.path, `${file.destination}/${userId}_${i}.jpg`, (error: NodeJS.ErrnoException) => {
                                if (!error) {
                                    queryData.profileImages.push(`${file.destination}/${userId}_${i}.jpg`)
                                } else {
                                    fs.unlink(file.path, (error: NodeJS.ErrnoException) => {
                                        if (error) {
                                            cusErr.message = 'Images unlinking error!'

                                            handleHttpError(req, res, 500, cusErr.redirectTo,
                                                cusErr.scope, cusErr.message, cusErr.logOut, error)
                                        }
                                    })
                                }
                            })
                        }))
                            .then(() => {
                                Profile.findOneAndUpdate({ _id: userId }, queryData)
                                    .exec()
                                    .then((result: ProfileType) => {
                                        req.session.error = null
                                        res.status(200).redirect('/my_profile')
                                    })
                                    .catch((error: mongoose.Error) => {
                                        cusErr.message = 'Could not find a profile!'

                                        handleHttpError(req, res, 500, cusErr.redirectTo,
                                            cusErr.scope, cusErr.message, cusErr.logOut, error)
                                    })
                            })
                            .catch((error: mongoose.Error) => {
                                cusErr.message = 'There was an uncaught error in the server!'

                                handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
                            })
                    }
                }
            })
            .catch((error: mongoose.Error) => {
                cusErr.message = 'Something went wrong with getting the id of a Profile!'

                handleHttpError(req, res, 500, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut, error)
            })
    }
}

export default handleSaveEditedProfile
