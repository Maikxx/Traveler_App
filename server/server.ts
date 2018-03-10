import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as multer from 'multer'

console.log('Re(starting)')

import indexRoute from './routes/index'
import chatRoute from './routes/chat'
import chatsRoute from './routes/chats'
import matchProfileRoute from './routes/match_profile'
import matchesOverviewRoute from './routes/matches_overview'
import myProfileRoute from './routes/my_profile'
import questionaireRoute from './routes/questionaire'

import signInController from './controllers/sign_in'
import signUpController from './controllers/sign_up'
import logOutController from './controllers/log_out'
import sendMessageController from './controllers/send_message'
import profileEditController from './controllers/profile_edit'
import saveEditedProfileController from './controllers/save_edited_profile'
import deleteAccountController from './controllers/delete_account'
import questionaireSaveController from './controllers/questionaire_save'

import { FileType } from 'server/types/fileType'

const app = express()

// Define that the images need to be stored on a DISK, not in the memory and pass an object with options to it.
const storage = multer.diskStorage({
    destination: (request: object, file: FileType, callback: any) => {
        // Define a place to save the uploaded images.
        callback(null, 'public/visitorProfileImages/')
    },
    filename: (request: object, file: FileType, callback: any) => {
        const {
            originalname,
        } = file

        // Create a good filename to save, by checking if there is a space in the file and replacing it with an underscore.
        // Then paste the date of creation before it with an underscore and continue the process in the callback.
        const newDate = new Date().toISOString()
        const fileNameToSave = originalname.replace(/ /g, '_')

        callback(null, `${newDate}_${fileNameToSave}`)
    },
})

// Function which filters out the passable filetypes.
const fileFilter = (request: object, file: FileType, callback: any) => {
    const {
        mimetype,
    } = file

    // Check if the mimetype of the passed file matches, what the API accepts.
    // If it does, continue the flow, else stop the flow and eventually throw an error.
    if (mimetype === 'image/jpeg' ||
        mimetype === 'image/jpg' ||
        mimetype === 'image/png') {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

// Upload parameters for uploading files to multer, via FormData.
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
})

// Setup
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Get Routes
app.get('/', indexRoute)
app.get('/chat/:id', chatRoute)
app.get('/chats', chatsRoute)
app.get('/match_profile/:id', matchProfileRoute)
app.get('/matches_overview', matchesOverviewRoute)
app.get('/my_profile', myProfileRoute)
app.get('/questionaire', questionaireRoute)

// Post Endpoints
app.post('/sign_in', signInController)
app.post('/sign_up', signUpController)
app.post('/log_out', logOutController)
app.post('/send_message', sendMessageController)
app.post('/edit_profile', profileEditController)
app.post('/save_edited_profile', saveEditedProfileController)
app.post('/delete_account', deleteAccountController)
app.post('/questionaire_save', upload.single('questionaire-profile-image'), questionaireSaveController)

// Serving
app.listen(8000)
