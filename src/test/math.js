const fahrenheitToCelsius = (temp) => {
    return (temp - 32) / 1.8
}

// const celsiusToFahrenheit = (temp) => {
//     return (temp * 1.8) + 32
// }

// async function* demo(){
//     for(let i=0;i<5;i++){
//         await new Promise(function(r,e){setTimeout(function(){r('done')},2000)})
//         yield i;
//     }
// }
// async function test(){
//       for await (let v of demo()) {
//           return v;
//       }
// }

// const add = (x,y)=>{
//     return new Promise(function(resolve,reject){
//         setTimeout(function(){resolve(x+y)},2000)
//     });
// }



module.exports={fahrenheitToCelsius,celsiusToFahrenheit,add}