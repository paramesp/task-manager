const express=require('express');
const Task = require('../model/task');
const User = require('../model/user');
const auth = require('../middleware/auth');
const demo = require('../model/demo');

const multer=require('multer');
const sharp = require('sharp');


const router=new express.Router();

router.get('/test',function(req,res){
    res.send('from a file');
})

// 1. Create a new user and send back the user with tokens
// 2. when login, check the username and pwd and then send back the tokens
// 3. After login, all the further request cache the token and send back the tokens
// 4. After login all the request will be validated by Middleware.
// 5. Middleware (auth.js) will check the tokens and then the request will be processed

router.post('/user/new', async function(req,res){
    try{
       const user= new User(req.body)
       let token=user.generateToken();
       await user.generatePassword();
       user.tokens=user.tokens.concat({token});
       let me=await user.save();
       res.status(200).send(me);
    }catch(e){
       res.status(404).send(e.message);
    }
});
//middleware not needed
router.post('/user/login', async function(req,res){
    try{
        let user = await User.verifyPassword(req.body.email,req.body.password);
        let token=user.generateToken();
        user.tokens=user.tokens.concat({token});
        let loginUser=await user.save();
        res.status(200).send({"token":token});
    }catch(e){
       res.status(404).send(e.message);
    }
});

router.post('/user/logout', auth, async function(req,res){
    try{

       req.user.tokens = req.user.tokens.filter((token)=>{
           return token.token !==req.token;
       })
       await req.user.save();
       res.status(200).send('Logged Out');
    }catch(e){
       res.status(404).send(e.message);
    }
});


router.get('/',function(req,res){
    let desc=req.headers['description'] || 'desc';
    const me= new Task({description:desc})
    res.send(`${desc}  ${req.body}`);
   // me.save().then((r)=>{res.send(r)}).catch(e=>res.status(400).send(e.errors.description.message));
    //res.send('<html><head><title>Demo</title></head><body><p>Server is running!</p></body></html>')
});


router.post('/tasks', auth, async function(req,res){
    try{
         const me= new Task({...req.body,owner:req.user._id})
         let task=await me.save();
       res.send(task);
    }catch(e){
       res.status(400).send(e.message);
    }
    //res.send('<html><head><title>Demo</title></head><body><p>Server is running!</p></body></html>')
});

router.get('/tasks',auth, async function(req,res){
    try{
        //let tasks=await Task.find({owner:req.user._id});
        const match={};
        const sort={};
        if (req.query.completed){
            match.completed=(req.query.completed==='true');
        }
        if (req.query.sortBy){
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = (parts[1]==='dsc'?-1:1);
        }
        await req.user.populate({
            path:'tasks',
            match,
            options:{  
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
        }).execPopulate();
        
        res.status(200).send(req.user.tasks);
    }catch(e){
        res.status(404).send(e);
    }
    // .then((tasks)=>{
    //     if (!tasks){
    //        // res.status(404).send('An error occured');
    //         return;
    //     }
    //     res.status(200).send(tasks);
    // }).catch((e)=>{
    //     res.status(404).send(e);
    // })

    //res.send('<html><head><title>Demo</title></head><body><p>Server is running!</p></body></html>')
 });

router.get('/task/:id', auth, async function(req,res){

    try{
        let _id=req.params.id;
        //let task=await Task.findById(_id);
        // await task.populate('owner').execPopulate();
        const task = await Task.findOne({_id,owner:req.user._id})
       
        if (task){
            res.status(200).send(task);
        }else{
            res.status(404).send(`${_id} not found`); 
        }
    }catch(e){
        res.status(500).send(e);
    }
});


router.patch('/task/:id', auth, async function(req,res){
    try{
      
      let _id=req.params.id;
      let inputKeys=Object.keys(req.body);
      let validVals=['completed','description'];
      let isValid = inputKeys.every((v)=>{
          return validVals.includes(v);
      })
     
      //refactor it by using 'find' and 'save' method
      if (isValid){
            //   let tasks=await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true});
            //   res.status(200).send(tasks);
            // above 2 lines were updated as below using async  
              //let task = await Task.findById(_id);
              
              const task = await Task.findOne({_id,owner:req.user._id})
              inputKeys.forEach(v=>task[v]=req.body[v]);
         
              let updatedTask=await task.save();
              res.status(200).send(updatedTask);
      }else{
          res.status(400).send('Contains invalid attributes');
      }       
  }catch(e){
        res.status(404).send(e.message);
  }
});

router.delete('/task/:id', auth, async function(req,res){
  try{
      let _id=req.params.id;  
      //let tasks=await Task.findByIdAndDelete(_id);
      const tasks=await Task.findOneAndDelete({_id,owner:req.user._id})

      if (tasks){ 
          res.status(200).send(tasks);  
      }else{
          res.status(400).send(`${_id} not found`); 
      }
  }catch(e){
      res.status(404).send(e);
  }
});

router.delete('/user/me', auth, async function(req,res){
    try{
        await req.user.remove();
        res.send(req.user.name);
    }catch(e){
        res.status(404).send(e);
    }
  });

router.post('/demo', async function(req,res){
    try{
        const d= new demo({name:'this is demo'});
        d.save();
        res.send(d);
    }catch(e){
        res.status(404).send(e);
    }
});

var upload = multer({ 
    limits: {fileSize:1000000},
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(jpeg|jpg)/g)){
            return cb(Error('Upload a different file'))
        }
        cb(undefined,true)
    }
 });
//CRUD - user profile image avatar.
router.post('/users/me/avatar',auth, upload.single('avatar'), async function(req,res){
        //console.log(req.file)
        const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
        //req.user.avatar=req.file.buffer;
        req.user.avatar = buffer;
        req.user.save();
        res.status(200).send('OK')
       
},function(error,req,res,next){res.send(error.message)});

router.get('/users/:id/avatar',  async function(req,res){
   
    const user = await User.findById(req.params.id);
    res.set('Content-Type','image/png');
    res.status(200).send(user.avatar)
   
},function(error,req,res,next){res.send(error.message)});


router.delete('/users/me/avatar',auth, function(req,res){
    //console.log(req.file)
    req.user.avatar=undefined;
    req.user.save();
    res.status(200).send('OK')
   
});


module.exports=router;
