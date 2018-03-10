function handleSignIn (req: any, res: any) {
    // Verify the user here
    res.redirect('/matches_overview')
}

export default handleSignIn
