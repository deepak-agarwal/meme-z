const express = require('express')
const router = express.Router()
const postController = require('../app/controllers/postController')
const auth = require('../app/middlewares/auth')
const categoryController = require('../app/controllers/categoryController')
const multer = require('multer')
const userController = require('../app/controllers/userController')
const profileController = require('../app/controllers/profileController')

//Types of user using the app. 
//ALL - content accessible to all. 
//Admin - coontent accessible to Admins (that is the developer)
//Mod - content routes for the moderator.
//User - Logged in user.

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
})
const upload = multer({storage: storage})

router.get('/posts',postController.list)
router.get('/user/posts',auth.authenticate,postController.listByUser)
router.post('/posts',auth.authenticate,upload.single('photo'),postController.create)
router.delete('/posts',auth.authenticate,postController.destroy)
router.put('/posts',auth.authenticate,postController.update)


//profile.
router.get('/profile/:id',profileController.list)
router.post('/profile',auth.authenticate,upload.single('avatar'),postController.create)
router.put('/profile',auth.authenticate,upload.single('avatar'),postController.update)
router.delete('/profile',auth.authenticate,auth.authoriseMod,profileController.ban)


//listing of category , will be allowed to ALL.
router.get('/category',categoryController.list)
//only admin can create a category
router.post('/category',auth.authenticate,auth.authoriseAdmin,categoryController.create)
//only adin can update a catergory
router.put('/category',auth.authenticate,auth.authoriseAdmin,categoryController.update)


router.post('/register',userController.register)
router.post('login',userController.login)
router.delete('/logout',auth.authenticate,userController.logout)

module.exports = router