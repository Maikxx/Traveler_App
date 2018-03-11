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
            repeat_password,
            own_gender,
            looking_for_gender,
        } = req.body

        if (
            name.length &&
            (email.length && emailRegex.test(email)) &&
            (password.length && passwordRegex.test(password) && repeat_password === password) &&
            (own_gender === 'male' || own_gender === 'female') &&
            (looking_for_gender === 'male' || looking_for_gender === 'female')
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
