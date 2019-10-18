const  User  = require('../models/user')

const authenticate = function (req, res, next) {
    const token = req.header('x-auth')
    if(token){
    User.findByToken(token)
        .then((user) => {
            if (user) {
                req.user = user
                req.token = token
                req.role = user.role
                next()
            }
            else {
                res.status('401').send({ notice: 'token not available' })
            }
        })
        .catch((err) => {
            res.status('401').send(err)
        })
    }else{
        res.status('401').send({ error: 'token not available' })
    }
}

const authoriseMod  = function(req,res,next){
    if(req.role == 'Moderator'){
        next()
    }
    else{
        res.status('403').send({
            error: 'User not authorised'
        })
    }
}

const authoriseAdmin = function(req,res,next)
{
    if(req.role === 'Admin'){
        next()
    }
    else {
        res.status('403').send({error:'User not Authorised'})
    }
}




module.exports = {
    authenticate,
    authoriseMod,
    authoriseAdmin
}