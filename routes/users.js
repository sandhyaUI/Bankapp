var express = require('express');
var router = express.Router();
//db connection
var mongo = require("mongodb");
var dbhost = "127.0.0.1",
    dbport = 27017;
/* GET users listing.
router.get('/', function(req, res, next) {
    res.send('Banking Application');
});*/

var db=new mongo.Db("Bank-customers", new mongo.Server(dbhost,dbport, {}));
//customer signup
router.post('/signup',function(req,res){
    db.open(function (error) {
        db.collection("customers", function (error, collection) {
             if (collection) {
                 var num = Math.floor(Math.random() * 10000000000);
                 var user = req.query.customername;
                 collection.insert({
                     CustomerName: user,
                     SSN: req.query.ssn,
                     MobileNo: req.query.mobile,
                     EmailId: req.query.emailid,
                     Address: req.query.address,
                     Password: req.query.password,
                     AccountNo: num.toString()
                 });
                 collection.find({'CustomerName': user}).nextObject(function (error, result) {
                     if (result) {
                         res.send(result);
                     }
                     else {
                         res.send("Failure");
                     }
                 });
             }
        });
    });
});
//customer signin
router.post('/signin',function(req,res){
    var emailid= req.query.emailid;
    var password =req.query.password;
    db.open(function (error) {
        db.collection('customers',function (error, collection) {
            collection.find({'EmailId':emailid,'Password':password}).nextObject(function(error, result) {
                if (result){
                    res.send(" Signin Successfull.\r\n CustomerName: " +result.CustomerName + "\r\n AccountNo: " +result.AccountNo);
                }
                else{
                    res.send("Failure");
                }
            });
        });
    });
});
//Adding deposit
router.post('/deposit',function(req,res){
    var account = req.query.account;
    var amount = req.query.amount;
    db.open(function (error) {
        db.collection('customers',function (error, collection) {
            collection.update({'AccountNo':account},{$set:{"Amount":amount}},function(error, result) {
                if (result) {
                    res.send("Amount deposited succesfully");
                }
                else{
                    res.send("Failure");
                }
            });
        });
    });
});

router.get('/balance', function(req, res) {
    var account = req.query.account;
    var password =req.query.password;
    db.open(function (error) {
        db.collection('customers',function (error, collection) {
            collection.find({'AccountNo': account,'Password':password}).nextObject(function(error, result) {
                if(result){
                    res.send("AccountNo :" +result.AccountNo+ "\r\n Balance: " +result.Amount);
                }
                else{
                    res.send("AccountNo not found");
                }
            });
        });
    });
});
module.exports = router;