var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var path = require('path');
var fs = require('fs');

var mkdirp = require('mkdirp');


app.get('/', function(req, res) {


      res.send("爬虫页面gogogo");


      for(let i=0;i<10;i++){

      var url = "url"+i+".html"; 
      reptile(url,getlist);

      }



});

function reptile(url,callback){//基本的架子


  request({url:url,encoding: null  }, function(error, response, body) {

  	if(error){
    console.error(error);
    }else if (response.statusCode == 200) {
        var html = iconv.decode(body, 'utf-8')
        var $ = cheerio.load(html, {decodeEntities: false});
        //获取了所有的html代码
        callback($);//回调操作具体逻辑
       }
  })

};

//getlist
function getlist($){


//循环获取每个列表页的链接入口，拼接后得到完整的页面url,直接调用getdata生成了数据 
     for(let i=0;i<$('.goods-pic > a').length;i++){

       var url=$('.goods-pic > a').eq(i).attr('href');
    
         reptile(url,getdata);
      
       }

  };




//
function getdata($){

  //创建文件夹
       var title=$('head title').text().trim();
       var dir='./pic/'+title;
          mkdirp(dir, function(err) {
          if(err){
          console.log(err);
          }
          else {

            //console.log(dir+'创建成功')
          }
          });

var imgLength=$('.ncs-goods-info-content .default img').length;
for(let i=0;i<imgLength;i++){
var imgsrc=$('.ncs-goods-info-content .default img').eq(i).attr('src');
 var filename = parseUrlForFileName(imgsrc);  //生成文件名
    downloadImg(imgsrc,filename,'./pic/'+title,function() {
  

});

}





};


//
function parseUrlForFileName(address) {
    var filename = path.basename(address);
    return filename;
}

//
var downloadImg = function(uri, filename, dir, callback){
      request({uri: uri, encoding: 'binary'}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
      if(!body)  console.log("(╥╯^╰╥)哎呀没有内容。。。")
      fs.writeFile(dir+'/'+filename, body, 'binary', function (err) {
      if (err) {console.log(err);}
   
      });
}
});
};





var server = app.listen(3000, function() {
  console.log('listening at 3000');
});