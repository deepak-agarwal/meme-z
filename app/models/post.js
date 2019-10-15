const mongoose = require("mongoose")
const Schema = mongoose.Schema

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
	isVerified: {
		type: Boolean,
		default: false
    },
    verifierIds :[{
        userId :{
            type:Schema.Types.ObjectId,
            required:true
        },
        createdAt:{
            type:Date,
            default:Date.now()
        }
    }],
    comment:[commentSchema]
})

upVotesSchema.pre('save',function(next){
    const upVotes = this 

})

const Post = mongoose.Schema("Post", postSchema)

module.exports = Post
