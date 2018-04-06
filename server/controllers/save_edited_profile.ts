import * as express from 'express'
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

// tslint:disable-next-line:ter-max-len
async function handleSaveEditedProfile (req: express.Request & {session: SessionType} & {files: MulterFile[]}, res: express.Response, next: express.NextFunction) {
    const cusErr = {
        code: 500,
        redirectTo: '/my_profile/edit',
        scope: 'save_edited_profile',
        message: '',
        logOut: false,
    }

    if (req.session && req.session.userId) {
        const { userId } = req.session

        try {
            const myProfile = await Profile.findOne({ _id: userId }) as ProfileType

            if (!myProfile.hasFinishedQuestionaire) {
                res.status(409).redirect('/questionaire')
            } else {
                if (!myProfile.hasFinishedQuestionaire) {
                    cusErr.message = 'You have not yet filled in the questionaire!'

                    handleHttpError(req, res, 403, '/questionaire', cusErr.scope, cusErr.message, cusErr.logOut)
                } else {
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
                        hasTraveledTo: myProfile.hasTraveledTo,
                        favouriteHolidayDestination: myProfile.favouriteHolidayDestination,
                        favouriteHolidayTypes: myProfile.favouriteHolidayTypes,
                        plansHolidaysAhead: myProfile.plansHolidaysAhead,
                        likesToHike: myProfile.likesToHike,
                        prefersInterContinental: myProfile.prefersInterContinental,
                        wantsToVisitSoon: myProfile.wantsToVisitSoon,
                        hasVisitedThisMuchDestinations: myProfile.hasVisitedThisMuchDestinations,
                        favouriteOverallTravelTime: myProfile.favouriteOverallTravelTime,
                        wantsToMarry: myProfile.wantsToMarry,
                        foremostRelationshipMotivation: myProfile.foremostRelationshipMotivation,
                        wantsToOrAlreadyHasChildren: myProfile.wantsToOrAlreadyHasChildren,
                        drinksAlcohol: myProfile.drinksAlcohol,
                        smokes: myProfile.smokes,
                        likesToBeInNature: myProfile.likesToBeInNature,
                        favouriteMusicGenre: myProfile.favouriteMusicGenre,
                        yearlyEarns: myProfile.yearlyEarns,
                        birthdate: myProfile.birthdate,
                        livesIn: myProfile.livesIn,
                        jobTitle: myProfile.jobTitle,
                        lengthInCm: myProfile.lengthInCm,
                        description: myProfile.description,
                        mostImportantInRelationShip: myProfile.mostImportantInRelationShip,
                        wantsToTravelQuickly: myProfile.wantsToTravelQuickly,
                        matchSettings: {
                            lookingForGender: myProfile.matchSettings.lookingForGender,
                            matchHasToLikeToBeInNature: myProfile.matchSettings.matchHasToLikeToBeInNature,
                            maxMatchDistance: myProfile.matchSettings.maxMatchDistance,
                            minSearchAge: myProfile.matchSettings.minSearchAge,
                            maxSearchAge: myProfile.matchSettings.maxSearchAge,
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
                        queryData.matchSettings.maxMatchDistance = parseInt(maxMatchDistance, 10)
                        queryData.matchSettings.minSearchAge = parseInt(minSearchAge, 10)
                        queryData.matchSettings.maxSearchAge = parseInt(maxSearchAge, 10)
                    }

                    if (queryData.matchSettings.minSearchAge < 18 || queryData.matchSettings.maxSearchAge < 18) {
                        cusErr.message = 'You can not search for people who are less than 18 years old!'

                        handleHttpError(req, res, 400, cusErr.redirectTo, 'questionaire', cusErr.message, cusErr.logOut)
                    }

                    if (queryData.matchSettings.minSearchAge > queryData.matchSettings.maxSearchAge) {
                        cusErr.message = 'Your minimal search age must be higher than your maximal search age!'

                        handleHttpError(req, res, 400, cusErr.redirectTo, 'questionaire', cusErr.message, cusErr.logOut)
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
                        handleHttpError(req, res, 400, cusErr.redirectTo, cusErr.scope, 'Too much images passed!', cusErr.logOut)
                    } else if (req.files && req.files.length) {
                        await Promise.all(req.files.map(async (file: MulterFile, i: number) => {
                            await fs.rename(file.path, `${file.destination}/${userId}_${i}.jpg`, async (error: NodeJS.ErrnoException) => {
                                if (!error) {
                                    // tslint:disable-next-line:ter-max-len
                                    await Profile.update({ _id: userId }, { $push: { profileImages: `${file.destination}/${userId}_${i}.jpg` } })
                                } else {
                                    fs.unlink(file.path, (error: NodeJS.ErrnoException) => {
                                        if (error) {
                                            next(error)
                                        }
                                    })
                                }
                            })
                        }))

                        await Profile.update({ _id: userId }, queryData)

                        res.status(200).redirect('/my_profile')
                    } else {
                        await Profile.update({ _id: userId }, queryData)

                        res.status(200).redirect('/my_profile')
                    }
                }
            }
        } catch (error) {
            next(error)
        }
    } else {
        cusErr.code = 401
        cusErr.redirectTo = '/'
        cusErr.logOut = true
        cusErr.message = 'You need to be logged in to save this questionaire!'

        next(cusErr)
    }
}

export default handleSaveEditedProfile
