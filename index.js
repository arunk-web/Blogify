const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const userRoute = require('./routes/user');

const app = express();
const PORT = 8000;

mongoose.connect('mongodb://localhost:27017/blogify').then((e)=> console.log('mongodb connected'))

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false}));     //ye middleware h jo form se data ko read krne me help krta h. jab bhi koi form submit hota h toh uska data urlencoded format me hota h aur ye middleware usko read krne me help krta h. extended:false ka matlab h ki hum sirf simple data ko read krna chahte h, agar hum extended:true kar dete toh hum complex data ko bhi read kr sakte the.
// app.use(express.json());

app.get("/", (req,res) => {
    res.render("home");
})

app.use("/user",userRoute);


app.listen(PORT , () => console.log(`Server started at PORT : ${PORT}`));