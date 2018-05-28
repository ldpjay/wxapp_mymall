var config = require('../../../config.js')
var http = require('../../../utils/httpHelper.js')
//index.js
//获取应用实例
var app = getApp()
var sta = require("../../../utils/statistics.js");
Page({
  data: {
    address:''
  },
  //事件处理函数
  onLoad: function (options) {
    var that = this;
    app.getUserInfo(function (userInfo){
        that.setData({userInfo:userInfo});
    })
    //添加地址
    var id = options.id;
    //var openid = this.data.userInfo.openid;
    if(id != ''){
      var data = {appid:config.APPID, userid:this.data.userInfo.id, id:id};
      http.httpGet("?c=user&a=getAddrInfo", data, function(res, err){
        if(res){
          if(res.code == 200 && res.msg == 'success'){
            var address = res.data;
            that.setData({address:{id:id, name:address.name, address:addr.addr, tel:address.tel}})
          }
          console.log(res);
        }else{
          console.log(err);
        }
      });
    }
  },
  onShow:function (){
      sta();
  },

  // 提交
  formSubmit: function (e){
    //提交表单
    var val = e.detail.value;
    if(this.data.address != ''){
      var data = {appid:config.APPID, userid:this.data.userInfo.id, id:this.data.address.id, 
                  username:val.name, mobile:val.tel, address:val.addr}
      http.httpGet("?c=user&a=editAddress" ,data,function(res){
        if(res.code == 200 && res.msg == 'success'){
          wx.navigateBack();
          wx.showModal({ content: '编辑地址成功', showCancel: false })
        }else{
          //wx.navigateBack();
          wx.showModal({ content: '编辑地址失败', showCancel: false })
        }
      });
    }else{
      var data = {appid:config.APPID, userid:this.data.userInfo.id, username:val.name,
                  mobile:val.tel, address:val.addr};
      console.log(data);
      http.httpGet("?c=user&a=addAddress" ,data,function(res){
        if(res.code == '200' && res.msg == 'success'){
          wx.navigateBack();
          //wx.showToast({ title: '删除地址成功！', icon: 'success' })
          wx.showModal({ content: '添加地址成功', showCancel: false })
        }else{
          //wx.navigateBack();
          wx.showModal({ content: '添加地址失败', showCancel: false })
        }
      });
    }
  },

  // 删除
  deleteAddress:function(){
    if((this.data.address!='')&& (this.data.address.id!='')){
      var id = this.data.address.id;
      var data = {appid:config.APPID,userid:this.data.userInfo.id,id:id};
      console.log(data);
      http.httpGet("?c=user&a=deleteAddr" ,data,function(res){
        if(res.code == 200 && res.msg == 'success'){
          wx.navigateBack();
          wx.showModal({ content: '删除地址成功', showCancel: false })
        }else{
          //wx.navigateBack();
          wx.showModal({ content: '删除地址失败', showCancel: false })
        }
      });
    }else{
      wx.showModal({ content: '删除地址失败', showCancel: false })
    }
  }
})
