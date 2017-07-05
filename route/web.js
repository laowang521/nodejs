const express=require('express');
const mysql=require('mysql');

var db=mysql.createPool({host: 'localhost', user: 'root', password: '', database: 'user'});


module.exports=function (){
  var router=express.Router();
//接口
 router.get('/getbannerdata', (req, res,next)=>{
  	db.query(`SELECT * FROM banner_table`,(err,data)=>{


  		if(err){
  			console.error(err);
  			res.status(500).send('databse err').end();
  		}else{

         res.send(data).end();
  		}
  	})
   
  });





//--------
  router.get('/', (req, res,next)=>{
    db.query(`SELECT * FROM banner_table`,(err,data)=>{


      if(err){
        console.error(err);
        res.status(500).send('databse err').end();
      }else{

        res.redirect('./index.html');
      }
    })
   
  });



//----------------------------
 router.get('/getvuedata', (req, res,next)=>{
    db.query(`SELECT * FROM vuedata`,(err,data)=>{


      if(err){
        console.error(err);
        res.status(500).send('databse err').end();
      }else{

         res.send(data).end();
      }
    })
   
  });

 //----------------------------
 router.post('/vueOrder', (req, res)=>{

  var order_data={
        id:[],
        count:[]


  };
    for(let i=0;i<req.body.order_data.length;i++){

       order_data.id.push(req.body.order_data[i].goodsId);
       order_data.count.push(req.body.order_data[i].count)
    }
  

   var order_time=new Date().getTime();


      db.query(`INSERT INTO vue_order(order_data,order_time) VALUES('${order_data}','${order_time}')`,(err,data)=>{


      if(err){
        console.error(err);
        res.status(500).send('databse err').end();
      }else{

         res.send('success').end();
      }
    })
   
  });


  return router;
};
