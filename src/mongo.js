//CREATE - operation
const mongodb=require('mongodb');

//const mongoClient = mongodb.MongoClient;

const {MongoClient:mongoClient,ObjectID}=mongodb;
//const id = new ObjectID();


const connectionURL = 'mongodb://127.0.0.1:27017';
const dbName = 'task-manager';

// mongoClient.connect(connectionURL,{useUnifiedTopology:true},function(error,client){
//     if(error){
//         console.log(error);
//         return;
//     }
//     const db=client.db(dbName);
//     db.collection('users').insertMany([{
//         name:'Demo2',
//         address:'South Jordan'
//     },
//     {
//         name:'Demo3',
//         address:'South Jordan'
//     }],function(e,r){
//         if (e){
//             console.log(e);
//             return;
//         }
//         console.log(r.insertedIds);
//     })
// })


//READ operation

// mongoClient.connect(connectionURL,{useUnifiedTopology:true},function(error,client){
//     const db=client.db(dbName);
//     //db.collection('users').findOne({name:'Demo'},(e,r)=>{console.log(r);})
//     //find returns a cursor
//     db.collection('users').find({name:'Demo2'}).toArray((e,r)=>{console.log(r);})


//UPDATE
//UpdateOne returns promises

//     mongoClient.connect(connectionURL,{useUnifiedTopology:true},function(error,client){
//         const db=client.db(dbName);
//         if (error) return;
//         //db.collection('users').findOne({name:'Demo'},(e,r)=>{console.log(r);})
//         //Update returns a promise
//         async function test(){
//             let result= await db.collection('users').updateOne({_id:new ObjectID('5f2ae7f4b82dc59f687bf007')},{$set:{name:'demo3'}});
//             console.log(result.modifiedCount)
//         }
//         test().catch(error=>{console.log(error)}).finally(()=>{console.log('done')})
//    });
   

//DELETE
//Delete returns promise
// mongoClient.connect(connectionURL,{useUnifiedTopology:true},function(error,client){
//             const db=client.db(dbName);
//             if (error) return;
//             //db.collection('users').findOne({name:'Demo'},(e,r)=>{console.log(r);})
//             //delete returns a promise
//             async function test(){
//                 let result= await db.collection('users').deleteMany({name:'Demo3'});
//                 console.log(result.deletedCount)
//             }
//             test().catch(error=>{console.log(error)}).finally(()=>{console.log('done')})
// });