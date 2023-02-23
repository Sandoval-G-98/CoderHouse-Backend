const mongoose = require('mongoose')

const userCollection = "users"

const userSchema = new mongoose.Schema({
    user: { 
        String,
        unique: true
    },
    message: String
})

export const userModel = mongoose.model(userCollection, userSchema)