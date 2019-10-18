const express = require('expresss')
const router = express.Router()
const postCotroller = require('../app/controllers/postController')
const auth = require('../app/middlewares/auth')
const categoryController = require('../app/controllers/categoryController')

router.get('/posts',postCotroller.list)
router.get('/user/posts',auth.authenticate,postCotroller.listByUser)


router.get('/category',categoryController.list)
router.post('/category',auth.authenticate,auth.authorise,categoryController.create)
