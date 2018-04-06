import * as express from 'express'
import * as fs from 'fs'

import Profile from '../models/profile'

import { MulterFile } from '../types/multerFileType'
import { SessionType } from '../types/SessionType'

import getAge from '../utils/getAge'
import handleHttpError from '../utils/handleError'

/*
Controller which handles saving of the questionaire page.

1. Check if the user has a userId session.
2. Then check if the Profile is really existing, based on this users id.
3. Then there is a lot of form validation.
4. The .trim().split(/,?\s+/) function in the validation is a regex, that splits values into an array,
per , and optionally a space after it.
5. If all the required fields are filled in correctly (including the amount of images),
their profile (as created in the Sign Up controller) will be updated with the new values.
*/

// tslint:disable-next-line:ter-max-len
async function handleQuestionaireSave (req: express.Request & {session: SessionType} & {files: MulterFile[]}, res: express.Response, next: express.NextFunction) {
    const cusErr = {
        code: 500,
        redirectTo: '/questionaire',
        scope: 'questionaire_save',
        message: '',
        logOut: false,
    }

    if (req.session && req.session.userId) {
        const _id = req.session.userId

        try {
            const count = await Profile.count({ _id }) as number

            if (count > 0) {
                req.session.error = null

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
                    birthdate,
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

                const queryData = {
                    age: null,
                    profileImages: [],
                    hasTraveledTo: null,
                    favouriteHolidayDestination: null,
                    favouriteHolidayTypes: null,
                    plansHolidaysAhead: null,
                    likesToHike: null,
                    prefersInterContinental: null,
                    wantsToVisitSoon: null,
                    hasVisitedThisMuchDestinations: null,
                    favouriteOverallTravelTime: null,
                    wantsToMarry: null,
                    foremostRelationshipMotivation: null,
                    wantsToOrAlreadyHasChildren: null,
                    drinksAlcohol: null,
                    smokes: null,
                    likesToBeInNature: null,
                    favouriteMusicGenre: null,
                    yearlyEarns: null,
                    birthdate: null,
                    livesIn: null,
                    jobTitle: null,
                    lengthInCm: null,
                    description: null,
                    mostImportantInRelationShip: null,
                    wantsToTravelQuickly: null,
                    matchSettings: {
                        matchHasToLikeToBeInNature: null,
                        maxMatchDistance: null,
                        minSearchAge: null,
                        maxSearchAge: null,
                    },
                    hasFinishedQuestionaire: false,
                }

                // Required Fields
                if (
                    (!hasTraveledTo || !hasTraveledTo.length) ||
                    (!favouriteHolidayDestination || !favouriteHolidayDestination.length) ||
                    (!favouriteHolidayTypes || !favouriteHolidayTypes.length) ||
                    (!plansHolidaysAhead || !plansHolidaysAhead.length) ||
                    (!likesToHike || !likesToHike.length) ||
                    (!prefersInterContinental || !prefersInterContinental.length) ||
                    (!wantsToVisitSoon || !wantsToVisitSoon.length) ||
                    (!hasVisitedThisMuchDestinations || !hasVisitedThisMuchDestinations.length) ||
                    (!favouriteOverallTravelTime || !favouriteOverallTravelTime.length) ||
                    (!wantsToTravelQuickly || !wantsToTravelQuickly.length) ||
                    (!likesToBeInNature || !likesToBeInNature.length) ||
                    (!birthdate || !birthdate.length) ||
                    (!matchHasToLikeToBeInNature || !matchHasToLikeToBeInNature.length) ||
                    (!maxMatchDistance || !maxMatchDistance.length) ||
                    (!minSearchAge || !minSearchAge.length) ||
                    (!maxSearchAge || !maxSearchAge.length)
                ) {
                    cusErr.message = 'Not all required fields of the questionaire are filled in!'

                    handleHttpError(req, res, 400, cusErr.redirectTo, 'questionaire', cusErr.message, cusErr.logOut)
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
                    queryData.birthdate = birthdate
                    queryData.age = getAge(birthdate)
                    queryData.matchSettings.matchHasToLikeToBeInNature = matchHasToLikeToBeInNature
                    queryData.matchSettings.maxMatchDistance = parseInt(maxMatchDistance, 10)
                    queryData.matchSettings.minSearchAge = parseInt(minSearchAge, 10)
                    queryData.matchSettings.maxSearchAge = parseInt(maxSearchAge, 10)
                }

                if (queryData.age < 18) {
                    cusErr.message = 'You must be at least 18 years old to use Traveler!'

                    handleHttpError(req, res, 400, cusErr.redirectTo, 'questionaire', cusErr.message, cusErr.logOut)
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
                    cusErr.message = 'Too much images passed!'

                    handleHttpError(req, res, 400, cusErr.redirectTo, cusErr.scope, cusErr.message, cusErr.logOut)
                } else if (req.files && req.files.length) {
                    await Promise.all(req.files.map(async (file: MulterFile, i: number) => {
                        await fs.rename(file.path, `${file.destination}/${_id}_${i}.jpg`, async (error: NodeJS.ErrnoException) => {
                            if (error) {
                                await fs.unlink(file.path, (error: NodeJS.ErrnoException) => {
                                    if (error) {
                                        next(error)
                                    }
                                })
                            } else {
                                await Profile.update({ _id } , { $push: { profileImages: `${file.destination}/${_id}_${i}.jpg` } })
                            }
                        })
                    }))

                    queryData.hasFinishedQuestionaire = true

                    await Profile.update({ _id }, queryData)

                    res.status(200).redirect('/matches_overview')
                    req.session.error = null
                } else {
                    cusErr.message = 'You must submit an image before you are alowed to continue!'

                    handleHttpError(req, res, 400, cusErr.redirectTo, 'questionaire', cusErr.message, cusErr.logOut)
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

export default handleQuestionaireSave
