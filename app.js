const express = require('express');
const bodyParser =require('body-parser');
 const date=require (__dirname + '/date.js');
 
const ejs =require ('ejs');

const _= require("lodash");
const app =express();
const mongoose = require('mongoose');
const { toArray, forEach } = require('lodash');
const e = require('express');



app.set('view engine' , 'ejs');
app.use(express.static ('public'));
app.use(bodyParser.urlencoded({extended:true}));

let formDatejs =date.getDate();

// mongodb+srv://admin-bashir:<password>@cluster0.e4sek.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://admin-bashir:admin123@cluster0.e4sek.mongodb.net/todolistDB', {useNewUrlParser:true, useUnifiedTopology: true })

const todoItemSchema={
    name:String
};

const Todo =mongoose.model('Todo', todoItemSchema);

const todo1 = new Todo({
    name:'Make a Note'
});



const todoArrey = [todo1];

const listSchema={
    name:String,
    items:[todoItemSchema]
};
const List=mongoose.model('List', listSchema);




app.get('/' , function(req,res){

  Todo.find({}, function(err, foundTodo){
      if(foundTodo.length === 0){
          Todo.insertMany(todoArrey, function(err){
              if(err){
                  console.log(err);
              }else{
                  console.log("Items succesfully added");
              }
          });
      }else{
        res.render("list", {todoTitle:'Welcome', dateToday:formDatejs,   myList:foundTodo}); 
      }
  });
});

// app.get('register', function(req,res){
//     res.render('register');
// });

app.post('/', function(req , res){

    const postTodo= req.body.newItems;
    const listName = req.body.list;
   
    

    const item=new Todo({
        name:postTodo,
       
    });

   if(listName === "Welcome"){
        item.save();
        res.redirect('/');
     }else{
        List.findOne({name:listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect('/' + listName);
        });
     }

});


app.get('/delete', function(req,res){
    res.render('delete');
});

app.post('/delete', function(req,res){

const deleteCheckedBox =req.body.checkBox;
const hiddenInputName = req.body.hiddenInputName;
if(hiddenInputName === "Welcome"){
    Todo.findByIdAndRemove(deleteCheckedBox, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("item successfully deleted");
            res.redirect('/');
        }
     });
}else{

List.findOneAndUpdate({name: hiddenInputName}, {$pull: {items: {_id:deleteCheckedBox}}}, function(err, foundList){
if(!err){
    res.redirect('/' +  hiddenInputName);
}
   
});
}

});


app.get('/:customNameroute', function(req ,res){
    
    const customNameroute =_.capitalize(req.params.customNameroute);

     List.findOne({name: customNameroute}, function(err, foundList){
       if(!err){
           if(!foundList){
            console.log("Doesn't exist");
            const list = new List({
                name:customNameroute,
                items:todoArrey
            });
            list.save();
            res.redirect('/' + customNameroute);
           }else{
         
      res.render('list',{dateToday:formDatejs,  todoTitle:foundList.name,  myList:foundList.items});
    }
       }
       
});

});











app.get('/work', function(req,res){
    res.render('list' , {newListItems:formDatejs ,  myList: defaultItems });
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){

    console.log("the server will be start on port 300");
    
});

