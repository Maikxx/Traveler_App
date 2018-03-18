import handleHTTPError from './handle_error'

function handleSignUp (req: any, res: any) {
    const signUpData = {}
    const emailRegex = /^\w+@\w+\..{2,3}(.{2,3})?$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,}$/

    if (req.body) {
        const {
            name,
            email,
            password,
            repeatPassword,
            ownGender,
            lookingForGender,
        } = req.body

        if (
            name.length &&
            (email.length && emailRegex.test(email)) &&
            (password.length && passwordRegex.test(password) && repeatPassword === password) &&
            (ownGender === 'Male' || ownGender === 'Female') &&
            (lookingForGender === 'Male' || lookingForGender === 'Female')
        ) {
            req.body = JSON.parse(JSON.stringify(req.body))

            for (const property in req.body) {
                if (req.body.hasOwnProperty(property)) {
                    signUpData[property] = req.body[property]
                }
            }

            res.redirect('/questionaire')
        } else {
            handleHTTPError(res, 422, 'Unprocessable Entity')
        }
    }
}

export default handleSignUp
