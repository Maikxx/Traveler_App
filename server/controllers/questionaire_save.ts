import handleHTTPError from './handle_error'

function handleQuestionaireSave (req: any, res: any) {
    const questionaireData = {}
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

    if (
        !hasTraveledTo.length ||
        !favouriteHolidayDestination.length ||
        !favouriteHolidayTypes.length ||
        !plansHolidaysAhead.length ||
        !likesToHike.length ||
        !prefersInterContinental.length ||
        !wantsToVisitSoon.length ||
        !hasVisitedThisMuchDestinations.length ||
        !favouriteOverallTravelTime.length ||
        !wantsToMarry.length ||
        !foremostRelationshipMotivation.length ||
        !wantsToOrAlreadyHasChildren.length ||
        !drinksAlcohol.length ||
        !smokes.length ||
        !likesToBeInNature.length ||
        !favouriteMusicGenre.length ||
        !yearlyEarns.length ||
        !birthDate.length ||
        !livesIn.length ||
        !jobTitle.length ||
        !lengthInCm.length ||
        !description.length ||
        !matchHasToLikeToBeInNature.length ||
        !mostImportantInRelationShip.length ||
        !maxMatchDistance.length ||
        !minSearchAge.length ||
        !maxSearchAge.length ||
        !wantsToTravelQuickly.length
    ) {
        console.error('Not all fields are filled in')
        handleHTTPError(res, 422, 'Unprocessable Entity')
        return
    } else {
        req.body = JSON.parse(JSON.stringify(req.body))

        for (const property in req.body) {
            if (req.body.hasOwnProperty(property)) {
                questionaireData[property] = req.body[property]
            }
        }

        console.log(questionaireData)
        res.redirect('/matches_overview')
    }
}

export default handleQuestionaireSave
