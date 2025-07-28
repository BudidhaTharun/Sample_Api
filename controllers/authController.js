
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter the correct details" });
    }
    const existingUser = await User.findOne({ email });
    if(existingUser){
       return res.status(400).json({message:"User already exists"});
    }
     const hashedPassword = await bcrypt.hash(password,10);
     const newUser = new User({
       name,
       email,
       password: hashedPassword
     });
    
     await newUser.save();
      const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET , {
        expiresIn:'1h'
     } );
     return res.status(201).json({message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Server error"});
  }
}
 const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please enter the correct details" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1h'});
        return res.status(200).json({
  message: "Login successful",
  token,
  user, // send user document
});

        // Add your authentication logic here (e.g., check user, compare password, generate token)
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = {register ,login}