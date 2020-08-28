const express=require('express');
const Task = require('./model/task');
const taskRouter=require('./router/router');

const server= express();

//middleware

// server.use((req,res,next)=>{
//     //res.status(503).send('Site is under Maintenance')
//     next();
// })

server.use(express.json())
server.use(taskRouter);

server.get('/help',function(req,res){
    console.log(req.query);

    res.send({
        lat:'latitude',
        long:'longitude'
    })
});


module.exports = server;