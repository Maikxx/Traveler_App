// Immediately load the dotenv file.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}

import * as helmet from 'helmet'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as multer from 'multer'
import * as mongoose from 'mongoose'
import * as session from 'express-session'

console.log('(Re)starting...')

// Start a connection to the database with enviroment variables.
mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`)

// Import all the routes.
import indexRoute from './routes/index'
import createChatRoute from './routes/createChat'
import chatRoute from './routes/chat'
import chatsRoute from './routes/chats'
import matchProfileRoute from './routes/match_profile'
import matchesOverviewRoute from './routes/matches_overview'
import myProfileRoute from './routes/my_profile'
import myProfileEditRoute from './routes/my_profile_edit'
import notFoundRoute from './routes/not_found'
import questionaireRoute from './routes/questionaire'
import logOutRoute from './routes/log_out'
import deleteAccountRoute from './routes/delete_account'

// Import the controllers (mainly used for forms).
import signInController from './controllers/sign_in'
import signUpController from './controllers/sign_up'
import sendMessageController from './controllers/send_message'
import saveEditedProfileController from './controllers/save_edited_profile'
import deleteChatController from './controllers/delete_chat'
import questionaireSaveController from './controllers/questionaire_save'
import handleErrors from './controllers/handle_errors'

// Import a TS type for files.
import { FileType } from './types/fileType'

// Start an express app.
const app = express()

// Upload parameters for uploading files to multer, via FormData.
const upload = multer({
    dest: 'public/visitorProfileImages',
    fileFilter: (request: object, file: FileType, callback: any) => {
        const {
            mimetype,
        } = file

        callback(null, mimetype === 'image/jpeg' || mimetype === 'image/jpg' || mimetype === 'image/png')
    },
})

// Setup
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(helmet())
app.use(express.static('public'))
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    maxAge: 3600000,
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Get Routes
app.get('/', indexRoute)
app.get('/chat', createChatRoute)
app.get('/chat/:_id', chatRoute)
app.get('/chats', chatsRoute)
app.get('/match_profile/:_id', matchProfileRoute)
app.get('/matches_overview', matchesOverviewRoute)
app.get('/my_profile', myProfileRoute)
app.get('/my_profile/edit', myProfileEditRoute)
app.get('/questionaire', questionaireRoute)
app.get('/log_out', logOutRoute)
app.get('/delete_account', deleteAccountRoute)

// Post Endpoints
app.post('/sign_in', signInController)
app.post('/sign_up', signUpController)
app.post('/send_message/:_id', sendMessageController)
app.post('/save_edited_profile', upload.array('profileImages', 4), saveEditedProfileController)
app.post('/delete_chat/:_id', deleteChatController)
app.post('/questionaire_save', upload.array('profileImages', 4), questionaireSaveController)

// Route for handling not founds.
app.use(notFoundRoute)
app.use(handleErrors)

// Serving
app.listen(8000)
