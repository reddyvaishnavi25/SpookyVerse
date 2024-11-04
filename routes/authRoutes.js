const express=require('express')
const router=express.Router();
const cors=require('cors')
const {test,registerUser,loginUser}=require('../controllers/authController')

const app = express();


router.get('/',test)
router.post('/login',loginUser)
router.post('/register',registerUser)

module.exports=router