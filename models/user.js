const mongoose=require('mongoose')
const {Schema}=mongoose

const userSchema=new Schema({
    firstName:String,
    lastName:String,
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    } 
})

const UserModel=mongoose.model('User',userSchema);
module.exports=UserModel