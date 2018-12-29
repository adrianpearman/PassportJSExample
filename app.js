// NPM Modules
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()

// EJS Middleware
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Environment Variables
const PORT = process.env.PORT || 3000

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.listen(PORT, (err, res) => {
    if(err)throw err
    console.log(`Listening on PORT ${PORT}`)
})

