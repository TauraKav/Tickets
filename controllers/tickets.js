const uniqid = require ("uniqid");
const ticketModel = require("../models/tickets");
const userModel = require("../models/user");

module.exports.INSERT_TICKET = async (req, res) => {
    try {
      const ticket = new ticketModel({    
        id: uniqid(),
        title: req.body.title,
        ticket_price: req.body.ticket_price, 
        from_location: req.body.from_location,
        to_location: req.body.to_location,
        to_location_photo_url: req.body.to_location_photo_url

      });
  
      await ticket.save();
  
      return res.status(200).json({ response: "Ticket was created" });
    } catch (err) {
      console.log("err", err);
      return res.status(500).json({ response: "ERROR" });
    }
  };


  module.exports.BUY_TICKET = async (req, res) => {
try {

  const user = await userModel.findOne({id: req.body.userId });
  const ticket = await ticketModel.findOne({id: req.body.ticketId });

if (user.money_balance < ticket.ticket_price) {
 
  return res.status(400).json({ response: "Price is too high" })
} else { 
  userModel.updateOne(
    { id: req.body.userId },
    { $push: { bought_tickets: ticket.id } }
  ).exec();

  userModel.updateOne(
    { id: req.body.userId },
    { $set: {money_balance: user.money_balance - ticket.ticket_price} }
  ).exec();

  res.status(200).json({ response: "You bought a ticket"});
};

} catch (err) {
    console.log("err", err);
    return res.status(500).json({ response: "ERROR" });
  }};


  


