import * as fs from 'fs'
import Profile from '../models/profile'
import handleHTTPError from '../utils/handle_error'
import getAge from '../utils/getAge'

function handleQuestionaireSave (req: any, res: any) {
    const { _id } = req.params

    Profile.count({ _id }, (error, count) => {
        if (error) {
            console.error('Something went wrong with getting the id of a Profile!')
            handleHTTPError(res, 500, 'Internal Server Error')
        } else if (count > 0) {
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
                birthDate,
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
                birthDate: null,
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
                (!birthDate || !birthDate.length) ||
                (!matchHasToLikeToBeInNature || !matchHasToLikeToBeInNature.length) ||
                (!maxMatchDistance || !maxMatchDistance.length) ||
                (!minSearchAge || !minSearchAge.length) ||
                (!maxSearchAge || !maxSearchAge.length)
            ) {
                console.error('Not all required fields of the questionaire are filled in!')
                handleHTTPError(res, 422, 'Unprocessable Entity')
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
                queryData.birthDate = birthDate
                queryData.age = getAge(birthDate)
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

            if (req.files && req.files.length > 5) {
                console.error('Too much images passed!')
                handleHTTPError(res, 422, 'Unprocessable Entity')
            } else if (req.files) {
                req.files.forEach((file, i) => {
                    try {
                        fs.renameSync(file.path, `${file.destination}/${_id}_${i}.jpg`)
                        queryData.profileImages.push(`${file.destination}/${_id}_${i}.jpg`)
                    } catch (error) {
                        fs.unlinkSync(file.path)
                        console.error('Images Error!')
                        handleHTTPError(res, 500, 'Internal Server Error')
                    }
                })
            } else {
                console.error('No images passed!')
                handleHTTPError(res, 422, 'Unprocessable Entity')
            }

            Profile.findOneAndUpdate({ _id }, queryData)
                .exec()
                .then(doc => console.log('Success!'))
                .catch(error => {
                    console.error(error)
                    handleHTTPError(res, 500, 'Internal Server Error')
                })
        }
    })
}

export default handleQuestionaireSave
