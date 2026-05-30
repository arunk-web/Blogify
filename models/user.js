const {createHmac, randomBytes} = require("crypto");
const {Schema,model} = require('mongoose');
const { createTokenForUser } = require("../services/authentication");
//this schema is used to create the user collection in the database. It has only one field fullName which is of type string and is required. We can add more fields to this schema as per our requirement.
//this is used when we use mongodb in any project
const userSchema = new Schema({
    fullName : {
        type : String,
        required : true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt:{     //used for password hashing
        type:String,
    },
    password:{
        type: String,
        required : true,
    },
    profileImageURL:{
        type: String,
        default: "/images/default.jpg",
    },
    role:{
        type:String,
        enum : ["USER","ADMIN"],    //IT means that we cannt assign any value apart from these two values
        default: "USER",
    }

}, {timestamps : true}
);

// userSchema.pre("save", function(next){
//     const user = this;

//     if(!user.isModified("password")) return next();

//     if(!user.password) return next(new Error("Password is required"));    //ye new add kiya ac to claude ai, ye check krne ke liye ki password field empty toh nahi h, agar empty h toh error throw kr denge

//     const salt = randomBytes(16).toString("hex");
//     const hashedPassword = createHmac("sha256",salt)   //in this (algotihm,key)jisko use krke password hash krna hh)
//         .update(user.password)
//         .digest("hex")      //GIVE IT TO ME HEX FORM

//     this.salt = salt;
//     this.password = hashedPassword;

//     next();
// });
//aync type use kiya coz upr wala kaam ni kr rha 
userSchema.pre("save", async function() {
    const user = this;

    if(!user.isModified("password")) return;
    if(!user.password) throw new Error("Password is required");

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256",salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
});

userSchema.static("matchPasswordAndGenerateToken",  async function(email,password){
    const user = await this.findOne({ email });
    if(!user) throw new Error("User not found!");      //agr user ni mila toh false return kr denge
    
    console.log(user);
    const salt = user.salt;
    const hashedPassword = user.password;
    
    const userProvideHash = createHmac("sha256", salt)      //it is the user provided hash password
        .update(password)
        .digest("hex");
        
        if(hashedPassword !== userProvideHash)  
            throw new Error("Incorrect password!");     
        //agr password match ni krta toh error throw kr denge

                                             // return hashedPassword === userProvideHash;     //agr ye shi h toh means user ne shi password provide kiya h toh true return kr denge otherwise false return kr denge
        const token = createTokenForUser(user);
        return token;

});




const User = model('user',userSchema);

module.exports = User;