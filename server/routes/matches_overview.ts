import Profile from '../models/profile'
import handleHttpError from '../utils/handle_error'

function renderMatchesOverview (req: any, res: any) {
    if (req.session.error) {
        console.log(req.session.error)
    }

    if (req.session.userId) {
        Profile.find({ '_id': { $ne: req.session.userId } })
            .limit(10)
            .exec()
            .then(results => {
                req.session.error = null

                const overviewData = results.map((result: any) => {
                    const data = {
                        _id: result._id,
                        firstName: result.firstName,
                        fullName: result.fullName,
                        profileImages: result.profileImages.map(profileImage => profileImage.replace('public', '')),
                        age: result.age,
                        ownGender: result.ownGender,
                        description: result.description,
                        favouriteHolidayDestination: result.favouriteHolidayDestination,
                        likesToHike: result.likesToHike,
                        favouriteOverallTravelTime: result.favouriteOverallTravelTime,
                    }

                    return data
                })

                res.render('matches_overview.ejs', { overviewData })
            })
            .catch(error => {
                console.error(error)
                handleHttpError(req, res, 500, 'Internal Server Error', '/matches_overview')
            })
    } else {
        console.log('You are not logged in!')
        handleHttpError(req, res, 401, 'Credentials Required', '/')
    }
}

export default renderMatchesOverview
