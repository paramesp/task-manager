const mongoose=require('../mongoose');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const validator=require('validator');
const Task = require('./task');
const { request } = require('express');
const { Binary } = require('mongodb');

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        reuired:true,
        trim:true
    },
    age:{
        type:Number,
        default:0
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
               throw new Error('not an valid email')    
            } 
        }
    },
    password:{
            type:String,
            required:true,
            trim:true,
            minlength:7,
            validate(value){
                if (value.includes('password')) {
                    throw new Error('Password errorr');
                }  
            }
    },
    tokens:[{
        token: {
            type: String,
            required: true
        }
    }],
    avatar:{
        type: Buffer
    }
});
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

//instance methods
userSchema.methods.generateToken=  function(){
    var token =  jwt.sign({ data: this.username }, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
    return token;
}

//Method added to task as static method (static methods)
userSchema.statics.verifyPassword=async (emailId,password)=>{
    
    const user = await User.findOne({email:emailId});
    if (!user) throw Error('Unable to login');

    const isValid=await bcrypt.compare(password,user.password);     
    if (!isValid) throw Error('Unable to login');
    return user;
}

userSchema.methods.generatePassword=async function(){
    try{
        const saltRounds = 10;
        const hash=await bcrypt.hash(this.password, saltRounds);
        this.password=hash;
        
    }catch(e){
        console.log("error",e)
    }
}

//
userSchema.pre('save',async function(next){
    try{
        // const saltRounds = 10;
        // const hash=await bcrypt.hash(this.password, saltRounds);
        // this.password=hash;
    }catch(e){
        console.log("error",e)
    }
    next();
})

userSchema.pre('remove',async function(next){
    try{
       await Task.deleteMany({"owner":this._id})
    }catch(e){
        console.log("error",e)
    }
    next();
})


const User = mongoose.model('User',userSchema);

module.exports=User;