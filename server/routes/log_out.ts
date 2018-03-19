import handleHttpError from '../utils/handle_error'

function handleLogOut (req: any, res: any) {
    req.session.destroy(error => {
        if (error) {
            console.error(error)
            handleHttpError(req, res, 500, 'Internal Server Error', '/')
        } else {
            res.redirect('/')
        }
    })

    res.redirect('/')
}

export default handleLogOut
