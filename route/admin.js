const express=require('express');
const common=require('../libs/common');
const mysql=require('mysql');
const pathLib=require('path');
var fs=require('fs');
var db=mysql.createPool({host: 'localhost', user: 'root', password: '', database: 'user'});

module.exports=function (){
  var router=express.Router();

  //检查登录状态
  router.use((req, res, next)=>{
    if(!req.session['admin_id'] && req.url!='/login'&&req.url!='/reg'){ //没有登录
      res.redirect('/admin/login');
    }else{
      next();
    }
  });


  router.get('/login',(req,res)=>{
  
     
      res.render('admin/login.ejs',{title:'登录',cookies:req.cookies.user});
    

  
  
    
  });




//

  router.post('/login', (req, res,next)=>{
   
    var username=req.body.username;

    var password=common.md5(req.body.password+common.MD5_SUFFIX);
     res.cookie("user", {username: username,password:req.body.password}, {maxAge: 600000000000 , httpOnly: true});


    db.query(`SELECT * FROM user WHERE userName='${username}'`, (err, data)=>{
      if(err){
        console.error(err);
        res.status(500).send('database error').end();

      }else{
       
        if(data.length==0){
        
          res.send('{"ok": false, "msg": "用户名或密码有误"}').end();
          
        
           
        }else{
         
          //console.log(data[0].userName,data[0].passWord);
         // console.log(password);
          if(data[0].passWord==password){
            //成功
           
             req.session.admin_id=data[0].ID;
             req.session.user=data[0].userName;    
             req.session.isAdmin=data[0].isAdmin;  
        
          
          res.status(200).send('{"ok": true, "msg": "登录成功"}');

          }else{
            res.send('{"ok": false, "msg": "密码有误"}').end();
            
            
          }
        }
      }
    });
  });







  router.get('/reg',(req,res)=>{
   // console.log('进入注册页面');
    res.render('admin/reg.ejs',{title:'注册'});
  });



   router.post('/reg', (req, res,next)=>{
    //console.log(req.body.username);
    var username=req.body.username;

    var password=common.md5(req.body.password+common.MD5_SUFFIX);
    //console.log(username,password);
    if(username==''||req.body.password==''){

     res.send('{"ok": false, "msg": "不能为空"}').end();

            return;
      
    };

    db.query(`SELECT * FROM user WHERE userName='${username}'`,(err,data)=>{

        if(err){
          console.error(err);
          res.status(500).send('database error').end();

        }else{
          if(data.length==0){//没找到重名的用户名，未注册过

            db.query(`INSERT INTO user(userName,passWord) VALUES('${username}','${password}')`, (err, data)=>{
                  if(err){
                    console.error(err);
                    res.status(500).send('database error').end();
                  }else{
                    //console.log('用户注册成功');
                    db.query(`SELECT * FROM user WHERE userName='${username}'`,(err,data)=>{
                        if(err){
                                   console.error(err);
                                res.status(500).send('database error').end();


                        }else{
                             req.session['admin_id']=data[0].ID;
                            req.session.user=data[0].userName;

                             res.send('{"ok":true,"msg":"注册成功"}').end();
                             return;
         
                       

                          }


                    })
        
                    }

              });

          }else{

             res.send('{"ok":false,"msg":"用户名已存在，请更改"}').end();

               }

        }


    });


});


  router.get('/', (req, res)=>{
 res.render('admin/index.ejs', {userName:req.session.user,userID:req.session.admin_id,isAdmin:req.session.isAdmin,act:req.query.act});

           
  });
  router.post('/', (req, res)=>{
     var oldPw=common.md5(req.body.oldPw+common.MD5_SUFFIX);
     var repeatPw=common.md5(req.body.repeatPw+common.MD5_SUFFIX);
     var newPw=common.md5(req.body.newPw+common.MD5_SUFFIX);
    
    var admin_id=req.body.admin_id;
    var isAdmin=req.body.isAdmin;


    if(req.body.repeatPw==''||req.body.repeatPw==''||req.body.newPw==''){

        res.send('{"ok": false, "msg": "*不能为空"}').end();
        return false;

    };

      db.query(`SELECT *FROM user WHERE ID=${admin_id}`,(err,data)=>{

            if(err){

              console.error(err);
              res.status(500).send('database error').end();
            }else{

              if(newPw!=repeatPw){

                res.send('{"ok":false,"msg":"两次密码不一致"}').end();
                return;
              }else if(oldPw!=data[0].passWord){
             
                res.send('{"ok":false,"msg":"密码错误"}').end();
                return;

              }else{

                 
                  //
                 db.query(`UPDATE user SET passWord='${newPw}' WHERE ID=${admin_id}`,(err,data)=>{
                    if(err){

                      console.error(err);
                      res.status(500).send('database error').end();
                    }else{

                    res.send('{"ok":true,"msg":"修改成功"}').end();
             

                    }


                 });

                 //

              }
          }

      })   



  });






//
  router.get('/banners', (req, res)=>{

    switch(req.query.act){
      case'add':
      res.redirect('./add');
      break;

      case'mod':
var id=req.query.id;
       res.redirect('./mod?id='+id);
      break;

      case'del':
     var id=req.query.id;
        db.query(`SELECT * FROM banner_table WHERE ID=${id}`,(err,data)=>{
           if(err){
            console.err(err);
            res.status(500).send('database err').end();
           }else{
            if(data[0].length==0){
              console.error(err);
              res.status(404).send('no this id').end();

            }else{
              console.log(data[0]);
              fs.unlink('static/upload/'+data[0].href,(err,data)=>{
               if(err){
                console.error(err);
                res.status(404).send('not this file').end();

               }else{
               // console.log('图片删除了');
                  db.query(`DELETE FROM banner_table WHERE ID=${id}`,(err,data)=>{

                     if(err){

                      console.error(err);
                      res.status(500).send('database error').end();
                     }else{

                      res.redirect('/admin/banners');
                     }


                  })

               }


              })


            }



             

           }
   

        });
      break;

      default:
          db.query(`SELECT * FROM banner_table`,(err,data)=>{

            if(err){
               console.err(err);
               res.status(500).send('database err').end();
            }else{

               res.render('admin/banners.ejs', {banners:data})
            }

          });


    }

    
  });
//
    router.get('/add', (req, res)=>{
   

    res.render('admin/add.ejs', {});
  });

        router.post('/add', (req, res)=>{

                 if(req.files[0]){

                           var title=req.body.title;
                           var txt=req.body.txt;
                           var ext=pathLib.parse(req.files[0].originalname).ext;//扩展名
                           console.log(req.files[0]);
                           var oldpath=req.files[0].path;//老路径带名字
                           var newpath=req.files[0].path+ext;//新路径带名字
                           var newfilename=req.files[0].filename+ext;//新文件名，XXXXXXX.jpg
                        
                      //console.log(title,txt,href);
                      if(!title||!txt||!newfilename){
                      res.status(500).send('不能为空').end();

                      }else{



                          fs.rename(oldpath,newpath,(err)=>{
                            if(err){
                              console.error(err);
                              res.status(500).send('file error').end();
                            }else{

                               db.query(`INSERT INTO banner_table(title,txt,href) VALUES('${title}','${txt}','${newfilename}')`,(err,data)=>{

                                            if(err){

                                              console.error(err);
                                              res.status(500).send('database err').end();
                                            }else{

                                            res.redirect('./banners');


                                            }

                                    });

                            }

                          })
                           
                         };


}else{

res.status(500).send('info is not complete').end();

}




  });

    router.get('/mod', (req, res)=>{

      var id=req.query.id;

      db.query(`SELECT * FROM banner_table WHERE ID='${id}'`,(err,data)=>{
        if(err){

          console.error(err);
         res.status(500).send('database err').end();
        }else{
              if(data.length==0){

                res.status(404).send('no this id').end();
             }else{
            
                  res.render('admin/mod.ejs', {mod_data:data[0]});

             }

        };

      });
 
  });

  router.post('/mod',(req,res)=>{
var id=req.body.id;
var title=req.body.title;
var txt=req.body.txt;
 if(req.files[0]){//如果有图片文件上传
  db.query(`SELECT href FROM banner_table WHERE ID=${id}`,(err,data)=>{
     if(err){
      console.error(err);
      res.status(500).send('database error').end();
     }else{

console.log(data[0].href);
 fs.unlink('static/upload/'+data[0].href,(err)=>{
    if(err){
       console.error(err);
       res.status(500).send('file err').end();

    }else{

                      var ext=pathLib.parse(req.files[0].originalname).ext;//扩展名
                      var oldpath=req.files[0].path;//老路径带名字
                      var newpath=req.files[0].path+ext;//新路径带名字
                      var newfilename=req.files[0].filename+ext;//新文件名，XXXXXXX.jpg
                          if(!title||!txt||!newfilename){
                       res.status(500).send('不能为空').end();
                       

                      }else{
                            fs.rename(oldpath,newpath,(err)=>{
                                if(err){

                                  console.error(err);
                                  res.status(500).send('file error').end();
                                }else{
                                   db.query(`UPDATE banner_table SET title='${title}',txt='${txt}',href='${newfilename}' WHERE ID=${id}`,(err,data)=>{
                                      if(err){
                                        console.error(err);
                                        res.status(500).send('database error22').end();
                                      }else{

                                             res.redirect('./banners');
                                           }

                                      });


                                }

                            })
                          
                       }

  


    }



  })




     }


  });


    }else{
       
     var newfilename=null;

      if(!title||!txt){
     res.status(500).send('不能为空').end();
     

    }else{
   

                 db.query(`UPDATE banner_table SET title='${title}',txt='${txt}' WHERE ID=${id}`,(err,data)=>{
                    if(err){
                      console.error(err);
                      res.status(500).send('database error22').end();
                    }else{

                           res.redirect('./banners');
                         }

                    });
          }

    }

  });
 





  return router;
};
