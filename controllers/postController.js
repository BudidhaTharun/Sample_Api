const User =  require('../models/User');
const jwt= require('jsonwebtoken');
const Post = require('../models/Post');
require("dotenv").config();
const postContent = async (req, res) => {
    const { content, title } = req.body;
    const token = req.token;
    if (!content || !title) {
        return res.status(400).json({ message: "Content and title are required" });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    }
    catch(error){
        console.error("Token verification failed:", error);
        res.status(401).json({ message: "Invalid token" });
    }
    
    const post = new Post({
        content, title, author: req.user.id
    });
    await post.save();
    res.status(201).json({ message: "Post created successfully", post });
}
 const getPosts = async (req, res) =>{
      const token = req.token;
        if (!token) {
            return res.status(401).json({ message: "Token is required" });
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({ message: "Invalid token" });
        }
         const posts = await Post.find({author:decoded.id}).populate('author');
        res.status(200).json({ message: "Posts fetched successfully", posts: posts });
 }
  const UpdateContent = async (req, res) => {
      const token = req.token;
        if (!token) {
            return res.status(401).json({ message: "Token is required" });
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({ message: "Invalid token" });
        }
        const { content } = req.body;
        const { id } = req.params;
        const userId = decoded.id;
         const post = await Post.updateOne({ author: userId ,_id :id }, { $set: { content : content}});
         if(post.modifiedCount > 0){
             return res.status(200).json({ message: "Post updated successfully" });
         }
         res.status(404).json({ message: "Post not found or not authorized" });
  }
   const DeleteContent = async (req,res) => {
    const token = req.token;
        if (!token) {
            return res.status(401).json({ message: "Token is required" });
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({ message: "Invalid token" });
        }
        const userId = decoded.id;
        const { id } = req.params;
         const post = await Post.deleteOne({ author: userId , _id: id });
         if(post.deletedCount > 0){
             return res.status(200).json({ message: "Post deleted successfully" });
         }
         res.status(404).json({ message: "Post not found or not authorized" });
   }
module.exports = { 
    postContent,
    getPosts,
    UpdateContent,
    DeleteContent
}