import Profile from '../models/profile'

function renderIndex (req: any, res: any) {
    if (req.session.error) {
        console.error(req.session.error)
    }

    Profile.find()
        .limit(4)
        .then((results: [any]) => {
            if (results && results.length) {
                const availableTravelersData = results.map(result => ({
                    _id: result._id,
                    fullName: result.fullName,
                    profileImages: result.profileImages && result.profileImages[0],
                    profileDescription: result.description,
                }))

                res.render('index.ejs', { availableTravelersData })
            } else {
                res.status(500).render('index.ejs')
            }
        })
}

export default renderIndex
