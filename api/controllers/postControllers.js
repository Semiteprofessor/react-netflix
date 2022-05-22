const Post = require('../models/Post');
const postData = require('../data/posts.js');
 
 const getAllPosts = async (req, res) => {
     try {
         const createPost = await Post.insertMany(postData);
         let query = await Post.find({});

         const page = parseInt(req.query.page) || 1;
         const pageSize = parseInt(req.query.limit) || 50;
         const skip = (page - 1) * pageSize;
         const total = await Post.countDocuments();

         const pages = Math.ceil(total / pageSize); 

         query = query.skip(skip).limit(pageSize);

         if(page > pages) {
             return res.status(404).json({
                 status: "Failed",
                 message: "No Page Found"
             });
         }
         
         const result = query;

         res.status(200).send({
             status: "success",
             count: result.length,
             createPost,
             page,
             pages,
             data: result
         });
     } catch(error) {
         res.status(500).json({
             status: 'error',
             message: "Server Error"
         });
     }
 };

 const getPostById = async (req, res) => {
    try {
        const property = await Post.findById({_id: req.param.id});

        res.json(property);
    } catch(error) {
        res.status(500).json({ message: 'Post not Found'})
    }
};



 module.exports = {
     getAllPosts,
     getPostById 
};