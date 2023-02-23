const express = require('express')
const chatsRouter = express.Router()


chatsRouter.get('/', (req, res) => { 
    res.render("chat")
})

module.exports = {
    chatsRouter,
}