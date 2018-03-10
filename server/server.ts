import * as express from 'express'
import * as bodyParser from 'body-parser'

console.log('Re(starting)')

const app = express()

// Setup
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Get Routes
app.get('/', renderIndex)
app.get('/chat/:id', renderChat)
app.get('/chats', renderChats)
app.get('/match_profile/:id', renderMatchProfile)
app.get('/matches_overview', renderMatchesOverview)
app.get('/my_profile', renderMyProfile)
app.get('/questionaire', renderQuestionaire)

// Post Endpoints
app.post('/sign_in', handleSignIn)
app.post('/sign_up', handleSignUp)
app.post('/log_out', handleLogOut)
app.post('/send_message', handleSendMessage)
app.post('/edit_profile', handleProfileEdit)
app.post('/save_edited_profile', handleSaveEditedProfile)
app.post('/delete_account', handleDeleteAccount)
app.post('/handle_questionaire_save', handleQuestionaireSave)

// Serving
app.listen(8000)

// Get Routes
function renderIndex (req: any, res: any) {
    res.render('index.ejs')
}

function renderChat (req: any, res: any) {
    // Needs to be :id
    res.render('chat.ejs')
}

function renderChats (req: any, res: any) {
    res.render('chats.ejs')
}

function renderMatchProfile (req: any, res: any) {
    // Needs to be :id
    res.render('match_profile.ejs')
}

function renderMatchesOverview (req: any, res: any) {
    res.render('matches_overview.ejs')
}

function renderMyProfile (req: any, res: any) {
    res.render('my_profile.ejs')
}

function renderQuestionaire (req: any, res: any) {
    res.render('questionaire.ejs')
}

// Post Endpoints
function handleSignUp (req: any, res: any) {
    // Verify the user here
    res.redirect('/questionaire')
}

function handleSignIn (req: any, res: any) {
    // Verify the user here
    res.redirect('/matches_overview')
}

function handleQuestionaireSave (req: any, res: any) {
    // Todo
    res.redirect('/matches_overview')
}

function handleLogOut (req: any, res: any) {
    // Todo
}

function handleSendMessage (req: any, res: any) {
    const message = req.body['tl-chat-input']
    console.log(message)

    res.redirect('/chat/1')
}

function handleProfileEdit (req: any, res: any) {
    // Todo
}

function handleSaveEditedProfile (req: any, res: any) {
    // Todo
}

function handleDeleteAccount (req: any, res: any) {
    // Todo
}
