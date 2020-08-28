// const jwt=require('jsonwebtoken');

// var token = jwt.sign({data: 'param@gmail.com'}, 'secret value',{ expiresIn: '1d' });
// console.log(token);
// try{
//     var decoded = jwt.verify(token,'secret value');
//     console.log(decoded)
//  let timediff = decoded.exp - decoded.iat;

// }catch(e){
//     console.log(e.message)
// }

// let a=[1,2,3];

// let b=[...a,5];
// console.log(b);

let O={
    x:1,
    y:2,
    toJSON(){
        return this.x;
    }
}

let s=JSON.stringify(O)

console.log(s);