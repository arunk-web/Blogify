const {createHmac, randomBytes} = require("crypto");
const {Schema,model} = require('mongoose');
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
        default: "/images/default.png",
    },
    role:{
        type:String,
        enum : ["USER","ADMIN"],    //IT means that we cannt assign any value apart from these two values
        default: "USER",
    }

}, {timestamps : true}
);

userSchema.pre("save", function(next){
    const user = this;

    if(!user.isModified("password")) return ;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256",salt)   //in this (algotihm,key)jisko use krke password hash krna hh)
        .update(user.password)
        .digest("hex")      //GIVE IT TO ME HEX FORM

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

const User = model('user',userSchema);

module.exports = User;