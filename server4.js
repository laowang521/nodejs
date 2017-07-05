var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var fs=require('fs');

//爬取豆瓣电影top250
app.get('/', function(req, res) {


      res.send("爬虫gogoing");


		for(let i=0;i<10;i++){
		  var url = "https://movie.douban.com/top250?start="+i*25+"&filter="; 
		      reptile(url,getlist,i*25);


		}
    
  



});

function reptile(url,callback,i){//基本的架子



  request({url:url,encoding: null  }, function(error, response, body) {

  	if(error){
    console.error(error);
    }else if (response.statusCode == 200) {
        var html = iconv.decode(body, 'utf-8')
        var $ = cheerio.load(html, {decodeEntities: false});
        //获取了所有的html代码
        callback($,i);//回调操作具体逻辑
       }
  })

};

//getlist
function getlist($,j){


//循环获取每个列表页的链接入口，拼接后得到完整的页面url,直接调用getdata生成了数据 
     for(let i=0;i<$('.grid_view > li').length;i++){

           var data = {//取得数据
              title: $('.grid_view > li').eq(i).find('.hd span').eq(0).text().trim(),
              info:$('.grid_view > li').eq(i).find('.bd p').eq(0).text().trim(),
              star:$('.grid_view > li').eq(i).find('.bd .rating_num').text().trim(),
              content:$('.grid_view > li').eq(i).find('.quote').text().trim()
              };

                    //存储文件
          fs.appendFile('./data/'+(i+1+j)+'.'+data.title+'.txt', data.title+'\n'
            +data.info+'\n'+data.star+'\n'+data.content,'utf-8', function (err) {
            if (err) {
              console.error(err);
            }else{
              
            }
           
          });

          //
         fs.appendFile('./data/img/'+(i+1+j)+'.'+data.title+'.txt', data.title+'\n'
            +data.info+'\n'+data.star+'\n'+data.content,'utf-8', function (err) {
            if (err) {
              console.error(err);
            }else{
              
            }
           
          });
      
       }
};













var server = app.listen(3000, function() {
  console.log('listening at 3000');
});