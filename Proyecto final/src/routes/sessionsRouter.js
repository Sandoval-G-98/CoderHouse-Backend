const express = require('express');
const {userManager} = require('../dao/UserManager')
const sessionsRouter = express.Router()

sessionsRouter.post('/login', async (req, res) => { 

    const {email, password} = req.body

    const response = await userManager.getUser(email, password)

    res.status(200).send({msg: "Success"})
})

sessionsRouter.post('/register', async (req, res) => { 

    const {firs_name, last_name, age, email, password} = req.body

    const response = await userManager.addUser(firs_name, last_name, email, age, password)

})

module.exports = {
    sessionsRouter,
}