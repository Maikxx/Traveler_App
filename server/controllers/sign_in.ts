import handleHTTPError from './handle_error'

function handleSignIn (req: any, res: any) {
    const signInData = {}
    const emailRegex = /^\w+@\w+\..{2,3}(.{2,3})?$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$/

    if (req.body) {
        const {
            email,
            password,
        } = req.body

        if (
            (email.length && emailRegex.test(email)) &&
            (password.length && passwordRegex.test(password))
        ) {
            req.body = JSON.parse(JSON.stringify(req.body))

            for (const property in req.body) {
                if (req.body.hasOwnProperty(property)) {
                    signInData[property] = req.body[property]
                }
            }

            res.redirect('/matches_overview')
        } else {
            handleHTTPError(res, 422, 'Unprocessable Entity')
        }
    }
}

export default handleSignIn
