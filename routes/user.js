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

//jb hm signin krenge toh hme form se data milega aur usko process krna hoga, toh uske liye post request banayenge
router.post('/signin', async(req,res) => {
    const {email,password} = req.body;
    // console.log(email,password);
    try {
        const token =await User.matchPasswordAndGenerateToken(email,password);

    // console.log("token", token);
        return res.cookie("token", token).redirect("/");    //now the user is loggedin
    } catch (error) {
        return res.render("signin" , {
            error : "Incorrect email or password",

        });
    }
});

router.get('/logout', (req,res) => {
    res.clearCookie("token").redirect("/")
    //logout me ye hoga kii token ko clear krna and redirect to homepageee...
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