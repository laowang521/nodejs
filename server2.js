var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var fs=require('fs');


app.get('/', function(req, res) {


res.send("爬虫页面")
 var url = "http://www.ltaaa.com/wtfy/22339.html"; 
 

reptile(url,110);




//


});

function reptile(url,num){


   request({url:url,encoding: null  }, function(error, response, body) {

  	if(error){

  		console.error(error);

  	}else if (response.statusCode == 200) {
        var html = iconv.decode(body, 'gb2312')
        var $ = cheerio.load(html, {decodeEntities: false});

		 var news_item = {//取得数据
		          title: $('.contnt_title').text().trim(),
		          info:$('.des').text().trim(),
		          content:$('.contact_con >div').text().trim(),
                  nexturl:'http://www.yxhs360.com'+$('.prev a').attr('href')
		   };

    
       //存储文件
		fs.appendFile('./data/'+news_item.title+'.txt', news_item.title+'\n'+news_item.info+'\n'+news_item.content,'utf-8', function (err) {
		  if (err) {
		  	console.error(err);
		  }else{
         console.log('成功了'+news_item.nexturl);
       
                if(num<=1) {
                	return 1;
                }else{

                	return num * reptile(news_item.nexturl,num-1); 
                }
         

		  }
		 
		});



    }
  })


};







var server = app.listen(3000, function() {
  console.log('listening at 3000');
});