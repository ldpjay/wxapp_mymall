var config = require('../../config.js')
var util = require('../../utils/util.js');
var http = require('../../utils/httpHelper.js')

//index.js
//获取应用实例
var app = getApp()
var sta = require("../../utils/statistics.js");

Page({
  data: {
    indicatorDots: false,//是否显示面板指示点
    autoplay: false,  //是否自动切换
    current:0,      //当前所在index
    interval: 0, //自动切换时间
    duration: 200,  //滑动时间
    clas:["action"]
  },

  onLoad:function(){
      console.log("onLoad");
      var that = this;
      app.getUserInfo(function(userInfo){
        console.log("getUserInfo");
        that.setData({userInfo:userInfo});
      })
      //获取商品信息
      that.getGoodsType();
      //获取Banner
      http.post({ model: "image", func: "getBanner" }, function (res) {
        if (res) {
          if (res.code == 200 && res.info == 'success') {
            that.setData({
              bander:res.data
            });
          }
        }
      });
      //获取商品列表
      that.getGoodsList("",'1,2',function(list){
        that.setData({
          IndexList:list
        });
      })
  },

  onShow:function(){
    console.log("onShow");
    sta();
    app.getAppInfo(
      function (appInfo){
        wx.setNavigationBarTitle({
          title: appInfo.title
        })
      }
    );
  },

  //获取商品类型
  getGoodsType:function(){
    var that = this;
    http.post({ model: "goods", func: "getTypeList" }, function (res, err) {
      //请求返回（res = res.data）
      if(res){
        if(res.code == 200 && res.info == 'success'){
          var list = res.data;
          var goodsData = [{types: 0, title: "全部"}];
          for(var i = 1; i < list.length + 1; i++){
            goodsData[i]= {types: list[i-1].id, title: list[i-1].typename};
          }
          that.setData({goodsData: goodsData});
          that.loadTabGoodsList(0);
        }
      }else{
        console.log(err);
      }
    });
  },

  //获取商品列表
  getGoodsList:function(types,status,callback){
    var that = this;
    http.post({ model: "goods", func: "getGoodsList", types: types}, function (res, err) {
      if(res){
        if(res.code == 200 && res.info == 'success'){
          var list = res.data;
          typeof callback == "function" && callback(list)
        }
      }else{
        console.log(err);
      }
    });
  },

  //
  loadTabGoodsList:function(index){
    var that = this;
    var goodsData = that.data.goodsData;
    if(goodsData[index].banner == undefined || goodsData[index].list ==undefined){
      var types = goodsData[index].types;
      //获取推荐商品
      this.getGoodsList(types,'2',function(list) {
        var goods = that.data.goodsData;
        goods[index].banner = list;
        that.setData({goodsData: goods});
      })
      //获取商品列表
      this.getGoodsList(types,'1,2',function(list) {
        var goods = that.data.goodsData;
        goods[index].list = list;
        that.setData({goodsData: goods});
      })
    }   
  },

  //事件处理函数
  switchs: function(e) {
    var index = e.detail.current;
    this.loadTabGoodsList(index);
    this.setData({clas:[]});

    var data = [];
    data[index] = "action";
    this.setData({clas:data });
  },
  xun:function (e){
      var index = e.target.dataset.index;
      this.setData({current:index });
      //this.loadTabGoodsList(index);
  },
  todetail:function(e){
        var id = e.currentTarget.id;
        wx.navigateTo({
          url: '../detail/index?id='+id,
          success: function(res){
            // success
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
  },
  //处理分页
  bindlower:function(e){
    console.log(e)
  }
  
})
