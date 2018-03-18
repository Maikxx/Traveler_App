import Profile from '../models/profile'
import handleHTTPError from './handle_error'

function handleQuestionaireSave (req: any, res: any) {
    const { _id } = req.params

    const queryData = {
        matchSettings: {},
        age: null,
    }

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

    function getAge (birthdate: string) {
        if (birthdate && birthdate.length) {
            const today = new Date()
            const birthDate = new Date(birthdate)
            let age = today.getFullYear() - birthDate.getFullYear()
            const m = today.getMonth() - birthDate.getMonth()

            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--
            }

            return age
        }
    }

    // Required Fields
    if (
        (hasTraveledTo && hasTraveledTo.length) &&
        (favouriteHolidayDestination && favouriteHolidayDestination.length) &&
        (favouriteHolidayTypes && favouriteHolidayTypes.length) &&
        (plansHolidaysAhead && plansHolidaysAhead.length) &&
        (likesToHike && likesToHike.length) &&
        (prefersInterContinental && prefersInterContinental.length) &&
        (wantsToVisitSoon && wantsToVisitSoon.length) &&
        (hasVisitedThisMuchDestinations && hasVisitedThisMuchDestinations.length) &&
        (favouriteOverallTravelTime && favouriteOverallTravelTime.length) &&
        (wantsToTravelQuickly && wantsToTravelQuickly.length) &&
        (likesToBeInNature && likesToBeInNature.length) &&
        (birthDate && birthDate.length) &&
        (matchHasToLikeToBeInNature && matchHasToLikeToBeInNature.length) &&
        (maxMatchDistance && maxMatchDistance.length) &&
        (minSearchAge && minSearchAge.length) &&
        (maxSearchAge && maxSearchAge.length)
    ) {
        queryData[hasTraveledTo] = hasTraveledTo.trim().split(/,?\s+/)
        queryData[favouriteHolidayDestination] = favouriteHolidayDestination
        queryData[favouriteHolidayTypes] = favouriteHolidayTypes
        queryData[plansHolidaysAhead] = plansHolidaysAhead
        queryData[likesToHike] = likesToHike
        queryData[prefersInterContinental] = prefersInterContinental
        queryData[wantsToVisitSoon] = wantsToVisitSoon.trim().split(/,?\s+/)
        queryData[hasVisitedThisMuchDestinations] = hasVisitedThisMuchDestinations
        queryData[favouriteOverallTravelTime] = favouriteOverallTravelTime
        queryData[wantsToTravelQuickly] = wantsToTravelQuickly
        queryData[likesToBeInNature] = likesToBeInNature
        queryData[birthDate] = birthDate
        queryData.age = getAge(birthDate)
        queryData.matchSettings[matchHasToLikeToBeInNature] = matchHasToLikeToBeInNature
        queryData.matchSettings[maxMatchDistance] = maxMatchDistance
        queryData.matchSettings[minSearchAge] = minSearchAge
        queryData.matchSettings[maxSearchAge] = maxSearchAge
    } else {
        console.error('Not all required fields of the questionaire are filled in!')
        handleHTTPError(res, 422, 'Unprocessable Entity')
        return
    }

    // Not required fields
    if (description && description.length) {
        queryData[description] = description
    }

    if (wantsToMarry && wantsToMarry.length) {
        queryData[wantsToMarry] = wantsToMarry
    }

    if (foremostRelationshipMotivation && foremostRelationshipMotivation.length) {
        queryData[foremostRelationshipMotivation] = foremostRelationshipMotivation
    }

    if (wantsToOrAlreadyHasChildren && wantsToOrAlreadyHasChildren.length) {
        queryData[wantsToOrAlreadyHasChildren] = wantsToOrAlreadyHasChildren
    }

    if (drinksAlcohol && drinksAlcohol.length) {
        queryData[drinksAlcohol] = drinksAlcohol
    }

    if (smokes && smokes.length) {
        queryData[smokes] = smokes
    }

    if (mostImportantInRelationShip && mostImportantInRelationShip.length) {
        queryData[mostImportantInRelationShip] = mostImportantInRelationShip
    }

    if (favouriteMusicGenre && favouriteMusicGenre.length) {
        queryData[favouriteMusicGenre] = favouriteMusicGenre
    }

    if (yearlyEarns && yearlyEarns.length) {
        queryData[yearlyEarns] = yearlyEarns
    }

    if (livesIn && livesIn.length) {
        queryData[livesIn] = livesIn
    }

    if (jobTitle && jobTitle.length) {
        queryData[jobTitle] = jobTitle
    }

    if (lengthInCm && lengthInCm.length) {
        queryData[lengthInCm] = lengthInCm
    }

    Profile.update({ _id }, { $set: queryData })
        .exec()
        .then(result => console.log(result))
        .catch(error => console.error(error))
}

export default handleQuestionaireSave
