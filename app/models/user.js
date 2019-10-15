const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    ips: [{
        type: String,
        default: ''
    }],
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'User'
    },
    tokens: [
        {
            token: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

userSchema.pre('save',function(next) {
    const user = this
    if (user.isNew) {
        bcryptjs.genSalt(10)
            .then((salt) => {
                bcryptjs.hash(user.password, salt)
                    .then((encryptedpass) => {
                        user.password = encryptedpass
                        console.log(user)
                        next()
                    })
            })
    } else {
        next()
    }

})

//own static method
userSchema.statics.findByCredentials = function (email, password) {
    const User = this
    return User.findOne({ email })
        .then((user) => {
            if (user) {
                return bcryptjs.compare(password, user.password)
                    .then((result) => {
                        if (result) {
                            return Promise.resolve(user)
                        } else {
                            return Promise.reject('invalid email / password')
                        }
                    })
            }
            else {
                return Promise.reject('invalid email / password')
            }
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}

//own instance method
userSchema.methods.generateToken = function () {
    const user = this
    const tokenData = {
        _id: user._id,
        username: user.username,
        createdAt: Number(new Date()),
        role: user.role
    }
    const token = jwt.sign(tokenData, 'jwt@123')
    user.tokens.push({
        token
    })

    return user.save()
        .then((user) => {
            return Promise.resolve(user)
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}

userSchema.statics.findByToken = function (token) {
    const user = this
    let tokenData
    try {
        tokenData = jwt.verify(token, 'jwt@123')
    }
    catch (err) {
        return Promise.reject(err)
    }
    return User.findOne({
        _id: tokenData._id,
        'tokens.token': token
    })
}
const User = mongoose.model('User',userSchema)
module.exports = User