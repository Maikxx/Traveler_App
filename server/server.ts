import * as express from 'express'

console.log('Re(starting)')

const app = express()

// Setup
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.static('public'))

// Routes
app.get('/', renderIndex)

// Serving
app.listen(8000)

function renderIndex (req: any, res: any) {
    res.render('index.ejs');
}