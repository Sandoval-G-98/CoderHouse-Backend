const fileUrlToPath = require('url')
const dirName = require('path')
const bcrypt = require('bcrypt')

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

const isValidPassword = (userPassword, password) => bcrypt.compareSync(userPassword, password)

module.exports = {
    createHash,
    isValidPassword,
}