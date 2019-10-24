const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Profile = require('./profile')
const _ = require('lodash')

const commentSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
    },
    comment:{
        type:String,
        required:true
    },
	createdAt: {
		type: Date,
		default: Date.now()
	}
})

const upVotesSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
		ref: "User",
		required: true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const downVotesSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
		ref: "User",
		required: true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})
const postSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	caption: {
		type: String
    },
    category:{
        type:Schema.Types.ObjectId,
        required:true
    },
	image: {
		type: String,
		required: true
	},
	upVotes: [upVotesSchema],
	downVotes: [downVotesSchema],
    verifierIds :[{
        userId :{
            type:Schema.Types.ObjectId,
            required:true
        },
        isVerified:{
            type:Boolean,
            default:false
        }
    }],
    isVerified:{
        type:Boolean,
        default:false
    },
    comment:[commentSchema],
    isDeleted:{
        type:Boolean,
        default:false
    }
})

//for assigning mod using pre save
postSchema.pre('save',function(next){
    const post = this 
    if(!post.isNew && post.isVerified){
        const userId = post.userId
        Profile.findOneAndUpdate({userId},{$inc:{karma:5}})
        .then(profile =>{
            if(profile.karma >= 5000){
              profile.isMod = true
              profile.save()
              .then(profile => next())
            }
            else{
                next()
            }
        })
    }
    else if (post.isNew){
        //assign mod here.
        Profile.find({isMod:true})
        .then(profile =>{
            const mods = _.shuffle([...profile])
            post.verifierIds.push(mods[0],mods[1])
            next()
        })
    }
    else{
        next()
    }
})


postSchema.post('save', function (next){
    const post = this 
    if(post.isNew){
        const id = post.userId
        
    }
})

const Post = mongoose.model("Post", postSchema)

module.exports = Post