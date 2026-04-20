const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklist = require('../models/blacklist.model');
const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function userRegister(req, res) {
    const { username, email, password } = req.body;
    
    const existingUser = await userModel.findOne({ email });
    if(existingUser) {
        return res.status(400).json({
            message: 'User already exists',
            success:'failed'
        })}
        const hashpassword = await bcrypt.hash(password,10);
        const user = await userModel.create({
            username,
            email,
            password: hashpassword
        })
        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET, { expiresIn: '1d' });
         res.cookie('token',token)

         return res.status(201).json({
            message: 'User registered successfully',
            success:'true',
             user: {
                id: user._id,
                username: user.username,
                email: user.email
             }
         })
        
        }

async function login(req, res) {

  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "invalid email" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "invalid password" });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/"
  });

  const { password: _, ...safeUser } = user._doc;

  res.json({
    user: safeUser
  });
}





async function googleLogin(req, res) {
  try {
    const { token } = req.body;

    // ✅ Verify token from Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, picture } = payload;

    // ✅ Check if user exists
    let user = await userModel.findOne({ email });

    // ✅ If not, create new user
    if (!user) {
      user = await userModel.create({
        email,
        username: name,
        password: null, // no password for Google users
        avatar: picture
      });
    }

    // ✅ Create JWT (same as your normal login)
    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    res.cookie("token", jwtToken);

    res.status(200).json({
      message: "Google login successful",
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });

  } catch (error) {
    console.error(error);
    res.status(401).json({
      message: "Invalid Google token"
    });
  }
}

async function logout(req,res){
    const token = req.cookies.token
    if(!token){
        return res.status(400).json({
            message:'token not found'
        })
    }
    if(token){
        await blacklist.create({token})
}
     res.clearCookie('token')
     return res.status(200).json({
        message:'user logout successfully'
     })
}

async function getme(req,res){
    const user =await userModel.findById(req.user.id)

    return res.status(200).json({
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}





module.exports = {
    userRegister,
    login,
    logout,
    getme,
    googleLogin
}