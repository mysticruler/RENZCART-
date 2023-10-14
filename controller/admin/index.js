var express = require('express')
var router = express.Router();
var controller = require('./controller')
var database = require('../../config/database');
var mongodb = require('mongodb')
var bcrypt = require('bcrypt')
var alert = require('alert')




router.get('/dashboard', controller.dashboardIndex)


router.get('/category', controller.adminIndex)
router.post('/category', (req, res) => {
    let upload = {
        category: req.body.cate,
        description: req.body.dess,
        image: req.files.img.name
    };
    database.then((imgs) => {
        imgs.collection('products').insertOne(upload).then((result) => {
            const fileUpload = req.files.img
            fileUpload.mv('./public/images/' + upload.image).then((data) => {
                console.log(req.files.img)
                console.log(data);

            })
        })
    }).catch(err => { console.log(err) })
    res.redirect('/category')
})

router.get('/category/:id', (req, res) => {
    let deletelid = req.params.id;
    database.then((db) => {
        db.collection('products').deleteOne({ _id: new mongodb.ObjectId(deletelid) })
            .then((data) => {
                console.log(data);
                res.redirect('/category');
            })
    })
})


router.get('/', controller.loginIndex)

router.get('/edit/:id', controller.editIndex)
router.post('/edit/:id', (req, res) => {
    let edit = {

        category: req.body.cate,
        description: req.body.dess,
        image: req.files?.image.name

    }
    let editidup = req.params.id

    let newdata = ''

    if (req.files?.image) {
        newdata = {
            category: edit.category,
            description: edit.description,
            image: edit.image
        }
        let fileUpdate = req.files.image


        fileUpdate.mv('./public/images/' + edit.image)
    }
    else {
        newdata = {
            category: edit.category,
            description: edit.description

        }
    }
    database.then((dbedit) => {
        dbedit.collection('products').updateOne({ _id: new mongodb.ObjectId(editidup) },
            { $set: newdata }).then((res) => {
                // console.log(res)
            })

    }).catch(err => { console.log(err) })
    res.redirect('/category')
})



router.post('/sub-category', (req, res) => {
    let products = {
        parentCategory: req.body.parC,
        subcategory: req.body.subC
    }

    database.then((dbb) => {
        dbb.collection('subproducts').insertOne(products, function (req, ress) {
            // console.log(ress)
        })
    }).catch(err => { console.log(err) })
    res.redirect('/sub-category')
})



router.get('/sub-category/:id', (req, res) => {
    let deletelidsub = req.params.id;
    database.then((db) => {
        db.collection('subproducts').deleteOne({ _id: new mongodb.ObjectId(deletelidsub) })
            .then((data) => {
                
                res.redirect('/sub-category');
            })
    })
})


router.get('/subedit/:id', controller.subeditIndex)


router.post('/subedit/:id', (req, res) => {
    let updateProduct = {

        parentCategory: req.body.parC,
        subcategory: req.body.subC
    }
    let editid = req.params.id
    database.then((db) => {
        db.collection('subproducts').updateOne({ _id: new mongodb.ObjectId(editid) }
            , { $set: updateProduct }).then((res) => {
               
            })
    }).catch(err => { console.log(err) })
    res.redirect('/sub-category')
})


router.get('/sub-category', controller.selectIndex)




router.get('/products', controller.productsIndex)
router.post('/products', (req, res) => {
    let productupload = {
        category: req.body.cates,
        subcategory: req.body.subcates,
        productname: req.body.pname,
        price: req.body.pricee,
        quantity: req.body.qty,
        description: req.body.dessss,
        image: req.files.picture.name
    };
    database.then((pro) => {
        pro.collection('items').insertOne(productupload).then((result) => {
            const fileUpload = req.files.picture
            fileUpload.mv('./public/images/' + productupload.image).then((data) => {
                

            })
        })
    }).catch(err => { console.log(err) })
    res.redirect('/products')
})


router.get('/products/:id', (req, res) => {
    let deletelidproducts = req.params.id;
    database.then((items) => {
        items.collection('items').deleteOne({ _id: new mongodb.ObjectId(deletelidproducts) })
            .then((data) => {
                // console.log(data);
                res.redirect('/products');
            })
    })
})





router.get('/proedit/:id', controller.proeditIndex)
router.post('/proedit/:id', (req, res) => {
    let proedit = {

        category: req.body.cates,
        subcategory: req.body.subcates,
        productname: req.body.pname,
        price: req.body.pricee,
        quantity: req.body.qty,
        description: req.body.dessss,
        image: req.files?.picture.name

    }
    let proeditup = req.params.id

    let pronewdata = ''

    if (req.files?.image) {
        pronewdata = {
            category: proedit.category,
            subcategory: proedit.subcategory,
            productname: proedit.productname,
            price: proedit.price,
            quantity: proedit.quantity,
            description: proedit.description,
            image: proedit.picture
        }
        let profileUpdate = req.files.picture


        profileUpdate.mv('./public/images/' + proedit.picture)
    }
    else {
        pronewdata = {
            category: proedit.category,
            subcategory: proedit.subcategory,
            productname: proedit.productname,
            price: proedit.price,
            quantity: proedit.quantity,
            description: proedit.description

        }
    }
    database.then((prodbedit) => {
        prodbedit.collection('items').updateOne({ _id: new mongodb.ObjectId(proeditup) },
            { $set: pronewdata }).then((res) => {
               
            })

    }).catch(err => { console.log(err) })
    res.redirect('/products')
})

//DEMO//
router.get('/demo', controller.demoIndex)
//DEMO


router.get('/reg', controller.regIndex)
router.post('/reg', (req, res) => {
    let products = {
        username: req.body.user,
        useremail: req.body.email,
        password: req.body.pass,
        usertype:1
    }

    database.then((dbb) => {
        bcrypt.hash(req.body.pass,10).then((hashs)=>{
            products.password=hashs
            dbb.collection('registration').insertOne(products, function (req, ress) {
                console.log(ress)
            })
            
        })
        
    }).catch(err => { console.log(err) })
    res.redirect('/')
})


router.post('/',(req,res)=>{

    let logg={
    useremail: req.body.email,
    password:req.body.pass
    }

    database.then((dd)=>{
        dd.collection('registration').findOne({useremail:logg.useremail}).then((ress)=>{
           
            
            if(logg){
                bcrypt.compare(logg.password,ress.password).then((pass)=>{
                    if(pass){
                        if(ress.usertype==0){
                            req.session=ress
                            

                            res.redirect('/dashboard')
                            
                        }
                        else{
                            req.session=ress
                            res.redirect('/user')
                            
                        }
                    }else{
                        alert("wrong password")
                        res.redirect('/')
                    }
                })


          
                

            }
        })
        
    }).catch(err => { console.log(err) })
    
})


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









module.exports = router