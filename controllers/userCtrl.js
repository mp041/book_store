const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCtrl = {

  //Register
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already registered" });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password is at least 6 characters" });
      }

      //Password encrypt
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: passwordHash,
      });
      await newUser.save();

      //create jwt
      const accessToken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });
      // console.log(accessToken, refreshToken, "tokensss")

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });

      res.status(201).json({ message: "Registration successfully", accessToken });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },



  //LOGIN
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user)
        return res.status(400).json({ message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const accessToken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });
      // console.log(accessToken, refreshToken, "tokensss")

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });

      res.status(200).json({ message: "Login successfully", accessToken });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

//LOGOUT
logout : async(req,res) => {
  try {
    res.clearCookie('refreshtoken',{path:'/user/refresh_token'})

    return res.json({message: 'Loggod Out'})
  }catch(err) {
    return res.status(500).json({ message: err.message });

  }
},

getUser: async(req, res) => {
  try{
    console.log("userrr")
    const user = await  User.findById(req.user.id).select('-password');

    if(!user) return res.status(400).json({message:"User Not Exist"});

    res.json(user);
  }catch(err) {
    return res.status(500).json({ message: err.message });

  }

},




  //REFRESHTOKEN
  refreshToken: (req, res) => {
    try {
      console.log(req.cookies.refreshtoken)
      const rf_token = req.cookies.refreshtoken;
      console.log(rf_token)
      if (!rf_token) {
        return res.status(400).json({ message: "Please Login" });
        console.log("hellloooww")
      }
      console.log("rf_token2")
      jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) return res.status(400).json({ message: "Please Login" });

        const accesstoken = createAccessToken({ id: user.id });

        console.log("token get")
        res.json({ accesstoken });
      });

    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};

module.exports = userCtrl;
