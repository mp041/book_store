const User = require('../models/userModels');


const authAdmin = async (req,res,next) => {
  try {
    const user = await User.findOne({
      _id : req.user.id,
    })

    if(user.role === 0){
      return res.status(400).json({message: "admin resources access denied"})
    }

    next()
  }catch(err){
    return res.static(500).json({message: err.message});
  }
}

module.exports = authAdmin;
