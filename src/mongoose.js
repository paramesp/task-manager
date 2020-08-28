
const mongoose = require('mongoose');
const validator = require('validator');

const connectionURL=process.env.MONGODB_CONNECTION;

mongoose.connect(connectionURL,{useUnifiedTopology:true,useCreateIndex:true,useNewUrlParser: true})
module.exports=mongoose;

// const Task = mongoose.model('Task',{
//     description:{
//         type:String,
//         required:true,
//         trim: true
//        },
//     completed:{
//         type:Boolean,
//         default:false
//       }
// })

// const User = mongoose.model('Users',{
//         name:{
//             type:String,
//             reuired:true,
//             trim:true
//         },
//         age:{
//             type:Number
//         },
//         email:{
//             type:String
//         },
//         password:{
//             type:String,
//             required:true,
//             trim:true,
//             minlength:7,
//             validate(value){
//                 if (value.includes('password')) {
//                     throw new Error('Password errorr');
//                 }  
//             }
//         }
// })

// const me= new Task({description:'new desc'})
// me.save().then((r)=>{console.log(r)}).catch(e=>console.log(e.errors.description.message));

// const me = new User({name:'demo',password:'phone23'})
// me.save().then((r)=>{console.log(r)}).catch(e=>console.log(e));
