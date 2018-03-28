import * as express from 'express'
import * as fs from 'fs'

import Profile from '../models/profile'

import { MulterFile } from '../types/multerFileType'
import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

import handleHttpError from '../utils/handleError'

/*
Controller which handles saving of the edited profile page.

Check if the user has a userId session.
Then check if the Profile is really existing, based on this users id.
Then there is a lot of form validation.
The .trim().split(/,?\s+/) function in the validation is a regex, that splits values into an array, per , and optionally a space after it.
If all the required fields are filled in correctly (including the amount of images),
their profile (as created in the Sign Up controller) will be updated with the new values.
*/

function handleSaveEditedProfile (req: express.Request & {session: SessionType} & {files: MulterFile[]}, res: express.Response) {
    if (req.session && req.session.userId) {
        const { userId } = req.session

        Profile.findById(userId)
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
                        handleHttpError(
                            req,
                            res,
                            400,
                            '/my_profile/edit',
                            'save_edited_profile',
                            'Not all required fields of the questionaire are filled in!'
                        )
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
                        handleHttpError(
                            req,
                            res,
                            400,
                            '/my_profile/edit',
                            'save_edited_profile',
                            'Too much images passed!'
                        )
                    } else if (req.files) {
                        Promise.all(req.files.map((file: MulterFile, i: number) => {
                            return fs.rename(file.path, `${file.destination}/${userId}_${i}.jpg`, (error: NodeJS.ErrnoException) => {
                                if (!error) {
                                    queryData.profileImages.push(`${file.destination}/${userId}_${i}.jpg`)
                                } else {
                                    fs.unlink(file.path, (error: NodeJS.ErrnoException) => {
                                        if (error) {
                                            handleHttpError(
                                                req,
                                                res,
                                                500,
                                                '/my_profile/edit',
                                                'save_edited_profile',
                                                'Images unlinking error!',
                                                false,
                                                error
                                            )
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
                                    .catch(error => {
                                        handleHttpError(
                                            req,
                                            res,
                                            500,
                                            '/my_profile/edit',
                                            'save_edited_profile',
                                            'Could not find a profile!',
                                            false,
                                            error
                                        )
                                    })
                            })
                            .catch(error => {
                                handleHttpError(
                                    req,
                                    res,
                                    500,
                                    '/my_profile/edit',
                                    'save_edited_profile',
                                    'There was an uncaught error in the server!',
                                    false,
                                    error
                                )
                            })
                    }
                }
            })
            .catch(error => {
                console.error(error)
                console.error('Something went wrong with getting the id of a Profile!')
                handleHttpError(
                    req,
                    res,
                    500,
                    '/my_profile/edit',
                    'save_edited_profile',
                    'Something went wrong with getting the id of a Profile!',
                    false,
                    error
                )
            })
    }
}

export default handleSaveEditedProfile
