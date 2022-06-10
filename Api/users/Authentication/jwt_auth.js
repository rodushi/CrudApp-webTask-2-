const jwt = require("jsonwebtoken");
const User = require("../../users/Authentication/user");



const user_auth = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["authorization"];
    console.log(token)
    try {
        const decode = jwt.verify(token, process.env.KEY)
        const email = decode.email;
        const id = decode.id;
        console.log(email,id)
        if (!email) {
            return res.status(401).json({message: 'No email!'});
        }
        req.id = id;
        req.email = email;
        console.log(id,email)
        next();
    } catch (error) {
        return res.status(401).json({message: 'You are not authorized!',
        error: error
    });
    }

   
  };

  module.exports = user_auth;
  // ========