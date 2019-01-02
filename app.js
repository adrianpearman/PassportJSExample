// NPM Modules
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const app = express()

// 
require('./config/passport')(passport)

// EJS Middleware
app.use(expressLayouts)
app.set('view engine', 'ejs')

// BodyParser
app.use(express.urlencoded({ extended: false }))

// Express Session Middlewares
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    // cookies: { secure: true }
}))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Adding in the flash middleware
app.use(flash())

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

// Environment Variables
const PORT = process.env.PORT || 3000
const db = require('./config/keys').MongoURI

// connecting MongoDB
mongoose.connect(db, { useNewUrlParser: true})
.then(() => {
    console.log('Connected to MongoDB')
})
.catch(err => console.log(err))

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.listen(PORT, (err, res) => {
    if(err)throw err
    console.log(`Listening on PORT ${PORT}`)
})

