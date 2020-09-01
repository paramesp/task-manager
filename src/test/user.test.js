const server = require('../app');
const supertest = require('supertest');
const User=require('../model/user');

const {userOne} = require('./fixtures/db');

beforeEach(async ()=>{
    await User.deleteMany();
    const user=await new User(userOne);
    await user.generatePassword();
    let token=user.generateToken();
    user.tokens=[{token}];
    userOne.tokens=[{token}]
    user.save();
})

test('Should signup a new user',async ()=>{
    let r=await supertest(server).post('/user/new').send({
        name:'demo',
        email:'demo@test.com',
        password:'Welcome456'
    }).expect(200)
})

test('Should login  existing user',async ()=>{
   const response= await supertest(server).post('/user/login').send(userOne).expect(200);
   const user = await User.findOne({email:userOne.email});
   expect(response.body.token).toBe(user.tokens[0].token)
   //console.log(response.body.token)
})

test('login  should fail for non-existing user',async ()=>{
    await supertest(server).post('/user/login').send({
        name:'demo',
        email:'demo@test.com',
        password:'Welcome456' 
    }).expect(404);
})



test('Should check if the avatar is uploaded correctly', async ()=>{
     await supertest(server)
     .post('/users/me/avatar')
     .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
     .attach('avatar','src/test/fixtures/avatar.jpg')
     .expect(200);

     const user = await User.findOne({email:userOne.email});

     expect(user.avatar).toEqual(expect.any(Buffer));

})

test('Should delete account for user',async ()=>{
    await supertest(server)
    .delete('/user/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    const user = await User.findOne({email:userOne.email});
    expect(user).toBeNull();
//    expect(user).not.toBeNull();
})