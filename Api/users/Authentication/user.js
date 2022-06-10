const router = require("express").Router();
const bcrypt = require("bcrypt");
const { json } = require("express/lib/response");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../../../config/user")
const auth = require("./jwt_auth")

router.get("/", (req, res) => {
    res.send("user auth path")
})
//---------------------register-----------------------
router.post("/register", async (req, res) => {
    const { username, email, pword } = req.body
    console.log(req.body)
    try {
        const hashP = await bcrypt.hash(email, 10)
        await User.create({
            username: username,
            email: email,
            pword: hashP
        })
        res.send({
            msg: "user created successfully"
        })
    } catch {
        res.status(400).send({
            msg: "email is already in use"
        })
    }

}
)

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.KEY)

}
//--------------------------------login---------------------------------
router.post("/login", async (req, res) => {
    const { email, pword } = req.body;
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
        return res.status(400).send(
            {
                msg: "User not found:(",
            }
        );
    }

    const token = await generateToken(user)
    bcrypt.compare(pword, user.pword, async (err, r) => {
        console.log(req.body.pword);
        console.log(user.pword);
        if (err) {
            return res.status(401).send(
                {
                    msg: "Incorrect password",
                }
            );
        }

        res.send({
            msg: "logged in successfully",
            user,
            token: token
        })


    })
})
//-------------get all users--------------------
router.get("/all", async (req, res) => {
    const users = await User.findAll()
    res.send(users)
})

//----------------get user by id------------------
router.get("/:id", async (req, res) => {
    const user = await User.findByPk(req.params.id);
    console.log(user)

    if (!user) {
        return res.status(404).send({
            msg: "User not found:("
        });
    }
    res.send(JSON.stringify(user, null, 2));
})

//------------------delete user by id-------------------------
router.delete("/delete",auth, async (req, res) => {
    const user = await User.findByPk(req.id);
    if(!user)
    {
        return res.send("You are not authorized")
    }
    console.log(req.id)
    await user.destroy();
    res.send({
        msg: "User is deleted"
    });
})

//-------------update password---------------
router.put("/update/password",auth,async (req, res) => {
    console.log("==============================",req.id)
    const user = await User.findByPk(req.id);
    console.log(user)
    const { oldPassword, newPassword } = req.body;
    const verify_oldPassword = bcrypt.compare(oldPassword, user.pword);
    if (!verify_oldPassword) {
        return res.status(400).send({
            message: "Old password is incorrect!"
        });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    await user.update({ pword: hash }, {
        where: {
            id: req.params.id
        }
    });
    res.send({
        message: "Password updated successfully!",
        user: user
    });
});

router.get("/", (req, res) => {
    res.send("This is user page");
});




module.exports = router