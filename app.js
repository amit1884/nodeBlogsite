var express =require('express');
var path=require('path');
var methodOverride=require("method-override");
var bodyparser=require('body-parser');
var mongoose =require('mongoose');
var sanitizer=require("express-sanitizer")
var app =express();
mongoose.connect('mongodb://localhost/nodeblog',{useNewUrlParser: true,useUnifiedTopology: true });
app.set("view engine","ejs");
app.set('views',path.join(__dirname,'views'));
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(sanitizer());    //always after bodyparser

///branch first portion
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);

//Routes
app.get("/",(req,res)=>{
    res.redirect("/blogs");
});
app.get("/blogs",(req,res )=>{
    Blog.find({},(err,blogs)=>{
        if(err)
        console.log(err);
        else{
            res.render("index",{blogs:blogs});
        }
    })

});

app.get("/blogs/new",function(req,res){
    res.render("new");
})
app.post("/blogs",(req,res)=>{
    // req.body.blog.body=req.sanitize(req.body,blog.body);
    Blog.create(req.body.blog,(err,newBlog)=>{
        if(err)
        {
        console.log(err);
        }
        else {
        res.redirect("/blogs");
        }
    });
});
app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("show",{blog:foundBlog});
        }
    })
})

app.get("/blogs/:id/edit",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err)
        console.log(err);
        else
        res.render("edit",{Blog:foundBlog});
    })
})
app.put("/blogs/:id",(req,res)=>{
     Blog.findByIdAndUpdate(dreq.params.i,req.body.blog,(err,updatedblog)=>{
         if(err){
             console.log("updated Blog")
        res.redirect("/blogs");
         }
         else{
             res.redirect("/blogs/"+req.params.id)
         }

     })
})


app.delete("/blogs/:id",(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,(err)=>{
        if(err)
        res.redirect("/blogs");
        else
        res.redirect("/blogs");
    })
})

app.listen(3000,()=>{
    console.log('server started');
});