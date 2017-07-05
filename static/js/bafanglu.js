(function($, doc) {

				$.init({
					swipeBack: true, //启用右滑关闭功能
					gestureConfig: {
						doubletap: true
					}

				});

				var contentWebview = null;
				if(document.querySelector('header')){
				document.querySelector('header').addEventListener('doubletap', function() {
					if(contentWebview == null) {
						contentWebview = plus.webview.currentWebview().children()[0];
					}
					contentWebview.evalJS("mui('#pullrefresh').pullRefresh().scrollTo(0,0,100)");
				});
				};

				$('body').on('tap', 'a:not(.mui-control-item)', function() {
					var id = this.getAttribute("href");
                    var href = this.href;
               if(!id){
               		mui.trigger(this,'click');
						
					}else{
						mui.openWindow({
						id: id,
						url: href

					});
						
					}
			
				});

				$('.mui-scroll-wrapper').scroll({
					scrollX: false, //是否横向滚动
					deceleration: 0.0034, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
					indicators: true, //是否显示滚动条
					bounce: false //是否启用回弹
				});
				//焦点图
				(function(){
				var slider = $("#slider");
				slider.slider({
					interval: 5000
				});
 
                var notice = $("#notice");
				notice.slider({
					interval: 4000
				});
					
				})();

//底部导航
function bottom_tab(){

var this_path=window.location.pathname;// 例如/about/1.html
var this_path_array=this_path.split("/");// 切成数组
var this_column=this_path_array[1];//  about
var tab_btn=$('.mui-bar-tab a');

for(var i=0;i<tab_btn.length;i++){
	tab_btn[i].classList.remove("mui-active");
 	if(this_column==tab_btn[i].getAttribute('href')){
 		
 		tab_btn[i].classList.add("mui-active");
 	}else{
 		
 		tab_btn[i].classList.remove("mui-active");
 		
 	};

};	



 if(this_column==""){ //index.html默认

	tab_btn[0].classList.add("mui-active");}	


};			

bottom_tab();


//




})(mui, document);
		