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
    Post.find({ isVerfied: true })
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

module.exports.listByUser = (req,res) => {
	const userId = req.user._id
	Post.find({userId})
	.then(response => {
		res.json(response)
	})
	.catch(err => res.json(err))
}
