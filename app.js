require("dotenv").config();


const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');

const Blog = require('./models/blog')

const {checkForAuthenticationCookie} = require("./middlewares/authentication");

///this is an index.js file but it is renamed as app.js at the time of deployment
const app = express();
const PORT = process.env.PORT || 8000;

// normally jb hm project bna rhe honge toh y link rhegiii mongo ki pr deploy krne se phle changee ho jayegii   ye => ('mongodb://localhost:27017/blogify')
mongoose.connect(process.env.MONGO_URL).then((e)=> console.log('mongodb connected'))

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false}));     //ye middleware h jo form se data ko read krne me help krta h. jab bhi koi form submit hota h toh uska data urlencoded format me hota h aur ye middleware usko read krne me help krta h. extended:false ka matlab h ki hum sirf simple data ko read krna chahte h, agar hum extended:true kar dete toh hum complex data ko bhi read kr sakte the.
app.use(express.json());  
//ye new add kiya ac to claude ai
app.use(cookieParser());     //ye middleware h jo cookies ko read krne me help krta h. jab bhi koi request aati h toh usme cookies hoti h aur ye middleware usko read krne me help krta h. iske baad hum req.cookies ke through cookies ko access kar sakte h.
app.use(checkForAuthenticationCookie("token"));     
//ye middleware h jo check krta h ki kya request me authentication cookie hai ya nahi. agar hai toh usko validate krke req.user me user ka payload rakh deta h. iske baad hum req.user ke through user ke data ko access kar sakte h.
app.use(express.static(path.resolve('./public')));
//it means ki public folder ke andr jo bhi hai usko tm statically serve kr doo bydefault express hme static assests aise ni deti

app.get("/", async (req,res) => {
    const allBlogs = await Blog.find({});
    res.render("home",{
        user: req.user,    //object
        blogs: allBlogs,
    });
})


app.use("/user",userRoute);
app.use("/blog",blogRoute);


app.listen(PORT , () => console.log(`Server started at PORT : ${PORT}`));