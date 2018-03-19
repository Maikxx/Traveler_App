function handleHttpError (req, res, code, title, redirectToHere) {
    req.session.error = { code, title }
    res.status(code).redirect(redirectToHere)
}

export default handleHttpError
