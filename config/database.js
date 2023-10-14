var mongo=require('mongodb').MongoClient

var client=new mongo('mongodb://0.0.0.0:27017')


function data(){
    return client.connect()
    .then((db)=>{
        var dbo=db.db("MyCart")
        return dbo
    })
}

module.exports=data()