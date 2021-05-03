const express = require("express");
const ejs = require("ejs");
require("dotenv").config();
const bodyParser = require("body-parser");
const customers = require("./model/customers");
const transactions = require("./model/transactions");
const app = express();
const port = process.env.PORT || 3000;
//-------------------connection to mongoose --------------
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://aman28:Aman28@cluster0.ohyhb.mongodb.net/banking?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log(" mongoose connected ");
  })
  .catch((err) => {
    console.log(err);
  });
//----------------------------------middlewares-----------
app.use("/cssfiles", express.static(__dirname + "/cssfiles"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
//----------------get requests-------------------------
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/customers", (req, res) => {
  res.render("customers");
});
app.get("/transactions", (req, res) => {
  res.render("transaction");
});
//----------------------------api'sfor getting data------------
app.get("/api/customers", (req, res) => {
  customers.find({}, (err, data) => {
    if (!err) res.json(data);
    else console.log(err);
  });
});
app.get("/api/transactions", (req, res) => {
  transactions.find({}, (err, data) => {
    if (!err) res.json(data);
    else console.log(err);
  });
});
//----------post request to make transactions--------------------
app.post("/add", (req, res) => {
  const { from, to, card, amount } = req.body;
  const data = {
    from,
    to,
    card,
    amount,
  };
  new transactions(data).save((err, out) => {
    if (!err) {
      customers.find({ name: { $in: [from, to] } }, (err, data) => {
        if (!err) {
          if (data[0].name == from) {
            data[0].balance = data[0].balance - amount;
          } else data[0].balance = data[0].balance + amount;
          if (data[1].name == to) {
            data[1].balance = data[1].balance + amount;
          } else data[1].balance = data[1].balance - amount;

          data[0].save((err, result) => {
            if (err) console.log(err);
          });
          data[1].save((err, result) => {
            if (err) console.log(err);
          });
        }
      });
      res.json("success");
    }
  });
});
//-------------------listening to server-----------

app.listen(port, () => {
  console.log(" connected to server..." + port);
});
