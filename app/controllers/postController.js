const Post = require("../models/post")

module.exports.create = function(req, res) {
	const userId = req.user._id
	const body = ({ caption, image, category } = req.body)
	const post = new Post({ userId, ...body })
	post
		.save()
		.then(post => {
			res.json(post)
		})
		.catch(err => {
			res.json(err)
		})
}

//authorise the user before update , only isVerified field can be updated.
module.exports.update = function(req, res) {
	const verifierIds = req.user._id
	const _id = req.body.postId
	Post.findOneAndUpdate({ _id }, { isVerfied: true, ...{ verifierIds } })
		.then(post => res.json(post))
		.catch(err => res.json(err))
}

//list posts based on if verifier length > 1,and isVerifiedtrue.
module.exports.list = function(req, res) {
	Post.find({ isVerfied: true ,isDeleted:false})
		.populate(userId)
		.then(posts => {
			res.json(posts)
		})
		.catch(err => res.json(err))
}

module.exports.addComment = function(req, res) {
	const { userId } = req.user._id
	const { postId, comment } = req.body
	Post.findOneById(postId)
		.then(post => {
			post.comment.push({ comment, userId })
			post.save().then(post => res.json(post))
		})
		.catch(err => res.json(err))
}
module.exports.increaseVote = function(req, res) {
	const { userId } = req.user._id
	const { postId } = req.body
	Post.findOneById(postId)
		.then(post => {
			if (post.upVotes.find(upvote => upvote.userId === userId)) {
				res.json({ message: "Already Upvoted" })
			} else {
				post.upVotes.push({ userId })
				post
					.save()
					.then(post => res.json(post))
					.catch(err => res.json({ error: "Upvote error" }))
			}
		})
		.catch(err => {
			res.json(err)
		})
}

module.exports.decreaseVote = function(req, res) {
	const { postId, userId } = req.body
	Post.findOneById(postId)
		.then(post => {
			if (post.downVotes.find(downvote => downVotes.userId === userId)) {
				res.json({ message: "Already DownVoted" })
			} else {
				post.downVotes.push({ userId })
				post
					.save()
					.then(post => res.json(post))
					.catch(err => res.json({ error: "Downvote error" }))
			}
		})
		.catch(err => {
			res.json(err)
		})
}

module.exports.listByUser = (req, res) => {
	const userId = req.user._id
	Post.find({ userId })
		.then(response => {
			res.json(response)
		})
		.catch(err => res.json(err))
}


// to destroy the post, we have to compare if its the user who created it and then soft destroy it
module.exports.destroy = (req, res) => {
	const userId = req.user._id
	const _id = { _id } = req.body
	Post.findOne({ _id })
		.then(post => {
			if (post.userId === userId) {
				post.isDeleted = true
				post.save()
				.then(post => {
					res.json({message:'Delete Successsful'})
				})
			}
		})
		.catch(err => res.json(err))
}


//post can only be updated before they are verified. a delay of 10 min to be added before post are sent for verification.

module.exports.update = (req,res) => {
	const {_id , caption , category , image}= req.body
	Post.findOne({_id})
	.then(post =>{
		if(post.isVerfied){
			res.json({error :'Cannot Edit after Verification.'})
		}
		else{
			Post.findOneAndUpdate({_id},{caption,category,image})
			.then(post => {
				res.json(post)
			})
		}
	})
	.catch(err => res.json(err))
}