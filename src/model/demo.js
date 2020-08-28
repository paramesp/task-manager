const mongoose = require('mongoose');

const demoSchema = new mongoose.Schema({
    name:{type:String}
},{timestamps:true})

const demo=mongoose.model('demo',demoSchema);
module.exports=demo;