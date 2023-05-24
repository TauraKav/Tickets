const uniqid = require("uniqid");
const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

module.exports.INSERT_USER = async (req, res) => {
    try {
if ( req.body.email.includes('@') && /\d/.test(req.body.password) && req.body.password.length >= 6 ) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, async (err, hash) => {
          const user = new userModel({
            id: uniqid(),
            name: req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1),
            email: req.body.email,
            password: hash,
            bought_tickets: [],
            money_balance: req.body.money_balance
          });
  
          const token = jwt.sign(
            {
              email: user.email,
              userId: user.id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" },
            {
              algorithm: "RS256",
            }
          );

          const refreshToken = jwt.sign(
            {
              email: user.email,
              userId: user.id,
            },
            process.env.JWT_SECRET_REFRESH,
            { expiresIn: "1d" },
            {
              algorithm: "RS256",
            }
          );
          await user.save();
      
          return res.status(200).json({ response: "User was saved successfully", token, refreshToken });
        });
      });
    

} else {res.status(400).json({ response: "bad validation" })}

    } catch (err) {
      res.status(500).json({ response: "User was not saved, please try later" });
    }
  };

  module.exports.LOGIN = async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.body.email });
  
      if (!user) {
        return res.status(404).json({ response: "Bad data" });
      }
  
      bcrypt.compare(req.body.password, user.password, (err, isPasswordMatch) => {
        if (isPasswordMatch) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user.id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" },
            {
              algorithm: "RS256",
            }
          );

          const refreshToken = jwt.sign(
            {
              email: user.email,
              userId: user.id,
            },
            process.env.JWT_SECRET_REFRESH,
            { expiresIn: "1d" },
            {
              algorithm: "RS256",
            }
          );

          return res.status(200).json({ response: "You logged in", token, refreshToken });
        } else {
          return res.status(404).json({ response: "Bad data" });
        }
      });
    } catch (err) {
      console.log("ERR", err);
      res.status(500).json({ response: "ERROR, please try later" });
    }
  };

  module.exports.NEW_JWT_TOKEN =  async (req, res) => {
try {
  const refreshToken = req.headers.jwt_refresh_token;
  if (refreshToken) {
   jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, (err, decoded) => {
    if (err) {
        return res.status(400).json({ response: "You have to login again" });
      } else {
        const token = jwt.sign(
          {
            email: decoded.email,
            userId: decoded.userId,
          },
          process.env.JWT_SECRET,
          { expiresIn: "2h" },
          {
            algorithm: "RS256",
          }
        );

        return res.status(200).json({ token, refreshToken });
      }
    });

  } else return res.status(400).json({ response: "no refresh token given" });
} catch (err) {
  console.log("ERR", err);
  res.status(500).json({ response: "ERROR, please try later" });
}
};

module.exports.GET_ALL_USERS = async (req, res) => {
  try {
    const users = await userModel.find();
    
    users.sort((a, b) => {
    const nameA = a.name.toLowerCase();
  const nameB = b.name.toLowerCase();

  if (nameA < nameB) {
    return -1;
  } else if (nameA > nameB) {
    return 1;
  }
  return 0;
});

    res.status(200).json({ users: users });
  } catch (err) {
    console.log("ERR", err);
    res.status(500).json({ response: "ERROR, please try later" });
  }
};


module.exports.GET_USER_BY_ID = async (req, res) => {
  try {
    const user = await userModel.findOne({ id: req.params.id });
    res.status(200).json({ user: user });
  } catch (err) {
    console.log("ERR", err);
    res.status(404).json({ response: "User was not found" });
  }
};

module.exports.GET_ALL_USERS_WITH_TICKETS = async (req, res) => {
  try {
    const aggregatedUserData = await userModel.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "id",
          as: "user_tickets",
        },
      }
    ]).exec();
    res.status(200).json({ users: aggregatedUserData });
  } catch (err) {
    console.log("ERR", err);
    res.status(404).json({ response: "User was not found" });
  }
};

module.exports.GET_USER_WITH_TICKETS_BY_ID = async (req, res) => {
  try {
    const aggregatedUserData = await userModel.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "id",
          as: "user_tickets",
        },
      },
      { $match: { id: req.params.id} },
    ]).exec();
   
    res.status(200).json({ user: aggregatedUserData });
  } catch (err) {
    console.log("ERR", err);
    res.status(404).json({ response: "User was not found" });
  }
};

