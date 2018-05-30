var config = require('../config.js')
var util = require('util.js');

function Get( url, data, cb ){
	wx.showNavigationBarLoading();
	wx.request({
    method:'GET',
		url: config.HTTP_BASE_URL + url,
		data: data,
		success: (res) => {
			typeof cb == "function" && cb(res.data,"");
			wx.hideNavigationBarLoading();
		},
		fail:(err) => {
			typeof cb == "function" && cb(null,err.errMsg);
			wx.hideNavigationBarLoading();
		}
	});
};

function Post( url, data, cb ){
	wx.request({
    method:'POST',
    url: config.HTTP_BASE_URL,
    data: data,
    //data: 'a=user&id=1', //参数为键值对字符串
    //data: { k: "!@#ldp#@!", t: "user", f: "getUserInfo" }, //参数为json格式数据
    header: {
      //设置参数内容类型为x-www-form-urlencoded
      //'content-type': 'application/x-www-form-urlencoded',
      //'Accept': 'application/json'
      //设置参数内容类型为json
      'content-type': 'application/json'
    },
		success: (res) => {
			typeof cb == "function" && cb(res.data,"");
		},
		fail:(err) => {
			typeof cb == "function" && cb(null,err.errMsg);
			console.log("http请求:"+config.HTTP_url);
			console.log(err)
		}
	});
};

function Upload( url ,file ,data, cb ){
	wx.uploadFile({
		url:  config.HTTP_BASE_URL + url,
		filePath: file,
		name:"file",
		formData:data,
		success: (res) => {
			if( typeof(res.data)=="string"  ){
				typeof cb == "function" && cb( JSON.parse(res.data),"");
			}else{
				typeof cb == "function" && cb(res.data,"");	
			}
		},
		fail:(err) => {
			typeof cb == "function" && cb(null,err.errMsg);
		}
	});
};


function post(data, fn) {
  data.token = util.getToken(data.model, data.func, config.SECRET_KEY);
  Post("", data, fn);
  //console.log(data);
}


module.exports = {
  httpGet:Get,
  httpPost:Post,
	httpUpload:Upload,
  post : post
};