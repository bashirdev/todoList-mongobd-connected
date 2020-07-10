 module.exports.getDate = getDate;

 function getDate(){

let today=new Date();
let options={
    weekday:'long',
    day:'numeric',
    month:'long'
};

var day=today.toLocaleDateString(undefined, options);
return day;

}




     


    
      
      



