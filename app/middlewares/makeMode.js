const Profile = require('../models/profile')

const makeMod = function(req,res,next){
    const userId = req.user._id
    Profile.findOne({userId})
    .then(profile=>{
        if(profile.karma > 5000){
            profile.isMod = true
            Profile.save()
        }
    })
}