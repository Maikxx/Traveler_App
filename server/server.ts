import * as express from 'express'

console.log('Re(starting)')

const app = express()

// Setup
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.static('public'))

// Routes
app.get('/', renderIndex)
app.get('/chat', renderChat)
app.get('/chats', renderChats)
app.get('/match_profile', renderMatchProfile)
app.get('/matches_overview', renderMatchesOverview)
app.get('/my_profile', renderMyProfile)
app.get('/questionaire', renderQuestionaire)

// Serving
app.listen(8000)

function renderIndex (req: any, res: any) {
    res.render('index.ejs')
}

function renderChat (req: any, res: any) {
    res.render('chat.ejs')
}

function renderChats (req: any, res: any) {
    res.render('chats.ejs')
}

function renderMatchProfile (req: any, res: any) {
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