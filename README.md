console.log("内容");
wx.showToast({
  title: '标题',
  icon: 'success', // 'loading'
  duration: 2000
})
wx.showModal({
  title: '标题',
  content: '内容',
  showCancel: false,
  confirmText: '确定'
})

