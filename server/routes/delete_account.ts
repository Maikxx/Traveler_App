import Profile from '../models/profile'
import handleHttpError from '../utils/handleError'

function handleDeleteAccount (req: any, res: any) {
    if (req.session && req.session.userId) {
        Profile.find({ _id: req.session.userId })
            .remove(result => console.log(reuslt))
            .catch(error => {
                console.error(error)
                console.error('No such user exists!')
                handleHttpError(req, res, 401, 'Authentication Failed', '/')
            })
    } else {
        console.error('You are not logged in!')
        handleHttpError(req, res, 401, 'Creditentials Required', '/')
    }
}

export default handleDeleteAccount
