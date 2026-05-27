const {Router} = require("express");
const User = require('../models/user');

const router = Router();


//ye hmare 2 page haii and agr koi signin pe koi req aayegi toh signin page render kr denge
router.get("/signin" , (req,res) => {
    return res.render("signin");
});

router.get("/signup" ,(req,res)=>{
    return res.render("signup");
});

router.post("/signup", async(req,res)=>{
    const { fullName,email,password } = req.body;
    await User.create({    
        fullName,
        email,
        password,
    });
    return res.redirect("/");     //signup hone ke baad hme home page pe bhej denge
});

module.exports = router;