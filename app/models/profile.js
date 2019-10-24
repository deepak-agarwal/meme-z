const mongoose = require('mongoose')
const Schema = mongoose.Schema
const profileSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:true
    },
    karma:{
        type:Number,
        default:true
    },
    isMod:{
        type:Boolean,
        default:false
    },
    isBanned:{
        type:Boolean,
        default:false
    },
    bannedBy:{
        type:Schema.Types.ObjectId,
        ref: 'Users',
        default:null
    }
})

profileSchema.methods.makeMod = function(){
    const profile = this
    if(profile.karma >= 5000){
        profile.isMod = true
        return profile.save()
        .then(profile => Promise.resolve(profile))
        .catch(err => Promise.reject(err))
    }
}

const Profile = mongoose.model('Profile',profileSchema)



module.exports = Profile