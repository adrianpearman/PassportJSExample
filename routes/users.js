const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../models/User')

// Login Page
router.get('/login', (req, res) => {
    res.render('login')
})

// Register Page
router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const { name, password, password2} = req.body
    const email = req.body.email.toLowerCase()
    let errors = []

    // error handling
    if(!name || !email || !password || !password2){
        errors.push({ msg: 'Please fill in the fields'})
    }

    if(password !== password2){
        errors.push({ msg: 'Passwords do not match'})
    }

    if(password.length < 7){
        errors.push({ msg: 'Please enter in a password'})
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else{
        // Validation Successful
        User.findOne({ email: email })
            .then((user) => {
                if(user){
                    errors.push({ msg: 'Email is already registered'})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                }else{
                    const newUser = new User({
                        name,
                        email, 
                        password
                    })

                    // Hashing the password
                    bcrypt.genSalt(10, (err, salt) => {
                        if(err)throw err
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err)throw err
                            newUser.password = hash
                            newUser.save()
                                .then(() => {
                                    req.flash('success_msg', 'You are now registered and can now log in')
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        })
                    })
                }
            })
            .catch(err => console.log(err))
    }
})

module.exports = router