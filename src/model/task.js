const mongoose=require('../mongoose');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');

const taskSchema= new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim: true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    }
    // password:{
    //         type:String,
    //         required:true,
    //         trim:true,
    //         minlength:7,
    //         validate(value){
    //             if (value.includes('password')) {
    //                 throw new Error('Password errorr');
    //             }  
    //         }
    // },
    // tokens:[{
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }]
},{timestamps:true});

//instance methods
taskSchema.methods.generateToken=async function(email){
    var token =  jwt.sign({data: 'param@gmail.com'}, 'secret value',{ expiresIn: '1d' });
    return token;
}

//Method added to task as static method (static methods)
taskSchema.statics.verifyPassword=async (task,password)=>{
     const isValid=await bcrypt.compare(password,task.password);     
    return isValid;
}

//
// taskSchema.pre('save',async function(next){
//     try{
//         const saltRounds = 10;
//         const hash=await bcrypt.hash(this.password, saltRounds);
//         this.password=hash;
//     }catch(e){
//         console.log("error",e)
//     }
//     next();
// })

const Task = mongoose.model('Task',taskSchema);

module.exports=Task;