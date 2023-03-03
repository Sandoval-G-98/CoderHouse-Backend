const {userModel} = require('./models/user.model')

class UserManager {

    async getUser(email, password) {

        const user = await userModel.find({ email: email, password:password})

        console.log(user)

        if(user.length > 0)
            return user

        return "User not found"
    }

    async addUser(first_name, last_name, email, age, password) {

        await userModel.create({ 
            first_name:first_name, 
            last_name:last_name, 
            age:age, 
            email: email, 
            password: password,
        })
        
    }

}

const userManager = new UserManager()

module.exports = {
    userManager
}