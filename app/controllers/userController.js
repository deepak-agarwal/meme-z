const User = require("../models/user")

module.exports.register = (req, res) => {
	const body = ({ email, password } = req.body)
	const user = new User(body)
	user
		.save()
		.then(user => {
			res.json(user)
		})
		.catch(err => console.log(err))
}

module.exports.login = (req, res) => {
	const body = req.body
	const ip = req.ip
	User.findByCredentials(body.email, body.password)
		.then(user => {
			console.log(user)
			if (!user.ips.includes(ip)) {
				return user.generateToken()
			} else {
				res.json(user)
			}
		})
		.then(user => {
			user.ips.push(ip)
			return user.save()
		})
		.then(user => {
			res.set("x-auth", user.tokens[user.tokens.length - 1].token).json(user)
		})
		.catch(err => {
			res.send(err)
		})
}

module.exports.update = (req, res) => {
	User.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
		.then(user => {
			res.json(user)
		})
		.catch(err => {
			console.log(err)
		})
}

module.exports.logout = (req, res) => {
	const { user, token } = req
	User.findByIdAndUpdate(user._id, { $pull: { tokens: { token: token } } })
		.then(user => res.send("Sucessfully logout"))
		.catch(err => res.send(err))
}
