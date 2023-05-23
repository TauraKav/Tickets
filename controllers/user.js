const uniqid = require("uniqid");
const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.INSERT_USER = async (req, res) => {
    try {
if ( req.body.email.includes('@') && /\d/.test(req.body.password) ) {
    bcrypt.genSalt(10, (err, salt) => {
        console.log(req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1));
        bcrypt.hash(req.body.password, salt, async (err, hash) => {
          const user = new UserModel({
            id: uniqid(),
            name: req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1),
            email: req.body.email,
            password: hash,
            bought_tickets: [],
            money_balance: req.body.money_balance
          });
  
          await user.save();
        });
      });
      
      return res.status(200).json({ response: "User was saved successfully"});

} else {res.status(400).json({ response: "bad validation" })}

    } catch (err) {
      res.status(500).json({ response: "User was not saved, please try later" });
    }
  };

  
  module.exports.LOGIN = async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email });
  
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
            { expiresIn: "24h" },
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
  const refreshToken =  req.headers.jwtRefreshToken;
  console.log("as cia");

  console.log(refreshToken );

  if (req.headers.jwtRefreshToken) {
   jwt.verify(req.headers.jwtRefreshToken, process.env.JWT_SECRET_REFRESH, (err, decoded) => {
      if (err) {
      console.log("o gal cia");

        return res.status(400).json({ response: "You have to login again" });
      } else {
        console.log("o gal ir cia");

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

  }
} catch (err) {
  console.log("ERR", err);
  res.status(500).json({ response: "ERROR, please try later" });
}
};

module.exports.GET_ALL_USERS = async (req, res) => {
  try {
    const users = await UserModel.find();
    
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
    const user = await UserModel.findOne({ id: req.params.id });
    res.status(200).json({ user: user });
  } catch (err) {
    console.log("ERR", err);
    res.status(404).json({ response: "User was not found" });
  }
};