const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Profile = require('./profile')

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
        createdAt:{
            type:Date,
            default:Date.now()
        },
        isVerified:{
            type:Boolean,
            default:false
        }
    }],
    comment:[commentSchema],
    isDeleted:{
        type:Boolean,
        default:false
    }
})

upVotesSchema.pre('save',function(next){
    const upVotes = this 

})

postSchema.pre('save', function(next){
    const post = this
    if(post.isNew){
        //assign mod here 
        Profile.find({isMod})
        .then(
            profiles => {
                const length = profiles.length
                const a = [0,0]
                const randValues = a.map(value => {
                    Math.random(length)
                })
            }
        )
        next()
    }
    else{
        next()
    }
})
const Post = mongoose.Schema("Post", postSchema)

module.exports = Post

