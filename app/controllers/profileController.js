const Profile = require('../models/profile')

module.exports.list = function (req,res){
    const id = req.params.id
    Profile.findById(id)
    .then(profile => {
        res.status(200).json(profile)
    })
    .catch(err => {
        res.status(501).json(err)
    })
}

module.exports.create = function (req,res){
    const avatar = req.files.path
    const userId = req.user._id
    const username = req.body
    const profile = new Profile(avatar,userId,username)
    profile.save()
    .then(profile => {
        res.status(201).json(profile)
    })
    .catch(err => {
        res.status(501).json(err)
    })
}

module.exports.update = function (req,res){
    const userId = req.user._id
    const avatar = req.files.path
    Profile.findOneAndUpdate({userId},{avatar})
    .then(profile =>{
        res.status(201).json(profile)
    })
    .catch(err => {
        res.status(501).json(err)
    })
}

module.exports.ban = function(req,res){
    const userId = req.user._id
    const userToBeBanned = req.body.userId
    Profile.findOneAndUpdate({userId:userToBeBanned},{isBanned:true,bannedBy:userId})
    .then(profile => {
        res.status(201).json(profile)
    })
    .catch(err =>  {
        res.status(501).json(err)
    })
}
