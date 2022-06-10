const Post = require("../../../config/post")
const User = require("../../../config/user");
const router = require("express").Router();
const auth = require("./jwt_auth");

//---------create post------------
router.post("/post",auth,async(req, res) => {
    const userId = req.id;
    const { title, body } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const userPost = await user.createPost({
        title,
        body,
    });
    res.status(201).send(userPost)
});

//--------------------update title------------------------
router.put('/post/update/title',auth,async(req,res) => {
    const userId = req.id;
    const {id,title} = req.body;
    const user = await User.findByPk(userId);
    const post = await Post.findOne({where: {id: id}});
    console.log(post)
    if (!post) {
        return res.status(404).send("Post not found");
    }
    
    if(post.userId !== user.id){
        return res.status(401).send({
            message: "You are not authorized to update this post!"
        });
    }
   
    await post.update({
        title
    });
    res.status(201).send({
        message: "Title updated successfully!",
        post: post
    });
})

//------------update body-------------
router.put('/post/update/body',auth,async(req,res)=>{
    const userId = req.id;
    const {id,body} = req.body;
    const user = await User.findByPk(userId);
    const post = await Post.findOne({where: {id: id}});
    if(post.userId !== user.id){
        return res.status(401).send({
            message: "You are not authorized to update this post!"
        });
    }
    if (!post) {
        return res.status(404).send("Post not found");
    }
    await post.update({
        body
    });
    res.status(201).send({
        message: "Body updated successfully!",
        post: post
    });
})

//----------------------get all posts---------------------
router.get('/post/all',async(req,res)=>{
    const post = await Post.findAll()
    res.status(201).send(post);
})

//----------------get post by user-----------------------
router.get('/post/:id',auth,async(req,res)=>{
    const {id} = req.params;
    const user = await User.findOne({where: {id: id}});
    if (!user) {
        return res.status(404).send("User not found");
    }
    const post = await Post.findAll({where: {userId: id}});
    if (!post) {
        return res.status(404).send("Post not found");
    }
    res.status(201).send(post);
}
)

//----------------delete post-----------------------
router.delete('/post/delete/:id',auth,async(req,res)=>{
    //get user id from token
    const userId = req.id;
    const {id} = req.params;
    
    //get user from user id
    const user = await User.findByPk(userId);
    console.log(user)
    if(!user){
        return res.status(404).send({
            message: "User not found!"
        });
    }

    const post = await Post.findOne({where: {id: id}});
    if(!post){
        return res.status(404).send({
            message: "Post not found!"
        });
    }
    // console.log(post)
    if(post.userId !== user.id){
        return res.status(401).send({
            message: "You are not authorized to DELETE this post!"
        });
    }
    if (!post) {
        return res.status(404).send("Post not found");
    }
    await post.destroy();
    res.status(201).send({
        message: "Post deleted successfully!",
        post: post
    });
})



module.exports = router