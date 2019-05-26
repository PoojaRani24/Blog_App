var express       =  require('express'),
 bodyParser       =  require('body-parser'),
 expressSanitizer =  require('express-sanitizer'),
methodOverride    =  require('method-override'),
    mongoose      =  require('mongoose'),
    app           =  express();


 //APP CONFIG
 mongoose.connect("mongodb://localhost:27017/restful_blog_app",{useNewUrlParser: true});
 app.set("view engine","ejs");
 app.use(express.static("public"));
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(expressSanitizer());
 app.use(methodOverride('_method'))

//MONGO CONFIG
var blogSchema= new mongoose.Schema({
	title:String,
	image:String,
	body: String,
	date: {type:Date,default:Date.now}
});

var blog=mongoose.model("blog",blogSchema);

//blog.create({
//	title:"Snowy",
//	image:"https://images.unsplash.com/photo-1514571948039-d3cb9e8f9750?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//	body:"This is my first Snowman"
//});

// RESTFUL ROUTES
app.get("/",function(req,res){
	res.redirect("/blogs");
})
//INDEX ROUTE
app.get("/blogs",function(req,res){
	blog.find({},function(err,blogs){
		if(err){
			console.log("Error");
		}
		else{
			res.render("index1",{blogs:blogs});
		}
	});
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
	res.render("new");
})

//CREATE ROUTE
app.post("/blogs",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body)
	blog.create(req.body.blog,function(err,retdata){
		if(err){
			res.render("new");
		}
		else{
			res.redirect("/blogs");
		}
	})
})

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
	blog.findById(req.params.id,function(err,retpost){
        if(err){
        	
        	res.redirect("/blogs")
        	
        }
        else{
        	res.render("show",{blog:retpost})
        }

	})
})

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
	blog.findById(req.params.id,function(err,retpost){
		if(err){
			console.log(err)
			res.redirect("/blogs")
		}
		else{
			res.render("edit",{blog:retpost})
		}

	})
})

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body)
     blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,retupdatedpost){
     	if(err){
     		res.redirect("/blogs");
     	}
     	else{
     		res.redirect("/blogs/"+ req.params.id);
     	}
     })
})

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
	blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs/"+ req.params.id)
		}
		else{
			res.redirect("/blogs");
		}
	})
})

app.listen(3000,function(){
	console.log("Blog Server has started !!");
})