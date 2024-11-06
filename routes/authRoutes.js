const express=require('express')
const router=express.Router();
const cors=require('cors')
const {test,registerUser,loginUser}=require('../controllers/authController')
const {searchUsers} =require("../controllers/searchController");

const app = express();


router.get('/',test)
router.post('/login',loginUser)
router.post('/register',registerUser)
router.post('/searchuser',searchUsers)




module.exports=router