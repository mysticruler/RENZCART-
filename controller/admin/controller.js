var database = require('../../config/database');
var mongo = require('mongodb')

exports.dashboardIndex = (req, res) => {
    res.render('admin/dashboard', { admin: true })
}
exports.adminIndex = (req, res) => {
    database.then((dbs) => {
        dbs.collection('products').find({}).toArray().then((output) => {
            res.render('admin/category', { admin: true, output })

        })
    })
}

exports.loginIndex = (req, res) => {
    res.render('login/login')
}


exports.editIndex = (req, res) => {
    let upidedit = req.params.id;
    database.then((editup) => {
        editup.collection('products').findOne({ _id: new mongo.ObjectId(upidedit) }).then((outputM) => {
            res.render('admin/edit', { admin: true, outputM })
        })
    })

}





exports.subeditIndex = (req, res) => {
    let subupidedit = req.params.id
    database.then(async (dbdb) => {
        const pro = await dbdb.collection('products').find({}).toArray()
        const subb = await dbdb.collection('subproducts').findOne({ _id: new mongo.ObjectId(subupidedit) })
        console.log(subb)



        res.render('admin/subedit', { admin: true, pro, subb })
    })
}





exports.selectIndex = (req, res) => {
    database.then(async (db) => {
        const cate = await db.collection('products').find({}).toArray()

        const sub = await db.collection('subproducts').aggregate([

            { "$addFields": { "parentCategory": { "$toObjectId": "$parentCategory" } } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'parentCategory',
                    foreignField: '_id',
                    as: 'joinCategory'

                }
            },


            { $unwind: '$joinCategory' }
        ]).toArray()


        res.render('admin/sub-category', { admin: true, cate, sub })

    })
}

exports.productsIndex = (req, res) => {
    database.then(async (propro) => {
        const cata = await propro.collection('products').find({}).toArray()

        const subcata = await propro.collection('subproducts').find({}).toArray()


        const itemsss = await propro.collection('items').aggregate([

            { "$addFields": { "category": { "$toObjectId": "$category" } } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'itemcategory'

                }
            },

            { "$addFields": { "subcategory": { "$toObjectId": "$subcategory" } } },
            {
                $lookup: {
                    from: 'subproducts',
                    localField: 'subcategory',
                    foreignField: '_id',
                    as: 'itemcategorysub'

                }
            },


            { $unwind: '$itemcategory' }, { $unwind: '$itemcategorysub' }

        ]).toArray()
        console.log(itemsss)



        res.render('admin/products', { admin: true, cata, subcata, itemsss })

    })
}






exports.proeditIndex = (req, res) => {
    let proedit = req.params.id;

    database.then(async (dbdbdb) => {
        const propro = await dbdbdb.collection('products').find({}).toArray()

        const subsub = await dbdbdb.collection('subproducts').find({}).toArray()
        console.log(subsub);

        const itemitem = await dbdbdb.collection('items').findOne({ _id: new mongo.ObjectId(proedit) })

        res.render('admin/proedit', { admin: true, propro, subsub, itemitem })
    })



}


//DEMO//

exports.demoIndex = (req, res) => {
    res.render('demo/demo', { demo: true })
}

exports.regIndex = (req, res) => {
    res.render('admin/reg')
}