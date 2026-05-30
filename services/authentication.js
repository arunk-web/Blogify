const JWT = require('jsonwebtoken');

const secret = "$uperMan@123";     //ye secret rakhna hh

function createTokenForUser(user){
    const payload = {
        _id : user._id,
        fullName: user.fullName,
        email : user.email,
        profileImageURL : user.profileImageURL,
        role: user.role,
    };

    const token = JWT.sign(payload,secret);      //hm esme token ki expiry date bhi rkh skte hhh
    return token;
}

function validateToken(token){
    const payload = JWT.verify(token,secret);
    return payload;
}


module.exports = {
    createTokenForUser,
    validateToken,
};
