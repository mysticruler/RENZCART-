var database = require('../../config/database');
var mongo = require('mongodb')



exports.userIndex = (req, res) => {
    database.then(async (userpro) => {
        const usercata = await userpro.collection('products').find({}).toArray()

        const usersubcata = await userpro.collection('subproducts').find({}).toArray()


        const useritems = await userpro.collection('items').aggregate([

            { "$addFields": { "category": { "$toObjectId": "$category" } } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'useritemcategory'

                }
            },

            { "$addFields": { "subcategory": { "$toObjectId": "$subcategory" } } },
            {
                $lookup: {
                    from: 'subproducts',
                    localField: 'subcategory',
                    foreignField: '_id',
                    as: 'useritemcategorysub'

                }
            },


            { $unwind: '$useritemcategory' }, { $unwind: '$useritemcategorysub' }

        ]).toArray()
        console.log(useritems)



        res.render('user/user', { user: true, usercata, usersubcata, useritems })

    })
}




exports.itemIndex = (req,res)=>{
    let clickid = req.params.id;
    database.then((db)=>{
        db.collection('items').findOne({_id:new mongo.ObjectId(clickid)}).then((itemC)=>{
            console.log(itemC);
            res.render('user/item',{itemC})
        })
    })
}








exports.cartIndex = (req, res) => {
    res.render('user/cart')
}

exports.democartIndex = (req, res) => {
    res.render('user/democart')
}