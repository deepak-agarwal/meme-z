const express = require('expresss')
const router = express.Router()
const postCotroller = require('../app/controllers/postController')
const auth = require('../app/middlewares/auth')
const categoryController = require('../app/controllers/categoryController')
const multer = require('multer')
const userController = require('../app/controllers/userController')


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

router.get('/posts',postCotroller.list)
router.get('/user/posts',auth.authenticate,postCotroller.listByUser)
router.post('/posts',auth.authenticate,upload.single('photo'),postCotroller.create)
router.delete('/posts',auth.authenticate,postCotroller.destroy)
router.put('/posts',auth.authenticate,postCotroller.update)

//listing of category , will be allowed to ALL.
router.get('/category',categoryController.list)
router.post('/category',auth.authenticate,auth.authoriseAdmin,categoryController.create)
router.put('/category',auth.authenticate,auth.authoriseAdmin,categoryController.update)


router.post('/register',userController.register)
router.post('login',userController.login)
router.delete('/logout',auth.authenticate,user.logout)