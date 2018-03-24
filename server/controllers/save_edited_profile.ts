import * as express from 'express'
import * as fs from 'fs'
import Profile from '../models/profile'
import handleHttpError from '../utils/handleError'
import { MulterFile } from '../types/multerFileType'
import { SessionType } from '../types/SessionType'
import { ProfileType } from '../types/ProfileType'

function handleSaveEditedProfile (req: express.Request & {session: SessionType} & {files: MulterFile[]}, res: express.Response) {
    const { userId } = req.session

    if (userId) {
        Profile.findById(userId)
            .then((profile: ProfileType) => {
                if (profile) {
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
                        req.files.forEach((file, i) => {
                            try {
                                fs.renameSync(file.path, `${file.destination}/${userId}_${i}.jpg`)
                                queryData.profileImages.push(`${file.destination}/${userId}_${i}.jpg`)
                            } catch (error) {
                                fs.unlinkSync(file.path)
                                handleHttpError(
                                    req,
                                    res,
                                    500,
                                    '/my_profile/edit',
                                    'save_edited_profile',
                                    'Images unlinking error!'
                                )
                            }
                        })
                    }

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
                                error
                            )
                        })
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
                    error
                )
            })
    }
}

export default handleSaveEditedProfile
