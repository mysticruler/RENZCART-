var express = require('express')
var router = express.Router();
var controller = require('./controller')
var database = require('../../config/database');
var mongodb = require('mongodb')


router.get('/user', controller.userIndex)


router.get('/', function(req, res) {
    req.session.destroy().then((err)=>{
       if(err){
          console.log(err);
       }else{
          
           req.end();
           res.redirect('/');
       }
    });
  
  });






  router.get('/item/:id', controller.itemIndex)
  router.post('/item/:id', (req, res) => {
   const mycart = {
       proid: req.params.id,
       status: 0
   }

   console.log('Before database operation');
   
   database.then((dbb) => {
       console.log('Database connected');
       dbb.collection('mycart').insertOne(mycart).then((ress) => {
         console.log('Item inserted:', ress);
         res.redirect(`/item/${req.params.id}`);
       }).catch(err => {
         console.log('Database error:', err);
         res.redirect('/error');
       });
   }).catch(err => {
       console.log('Database connection error:', err);
       res.redirect('/error');
   });
});




  router.get('/cart', controller.cartIndex)





  router.get('/democart', controller.democartIndex)


module.exports = router