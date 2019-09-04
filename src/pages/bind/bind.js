/* eslint-disable */
import '../../common/css/reset.css'
import './bind.css';
import '../../common/css/dialog.css'
import {getQueryString, jsonp, dialogs} from '../../common/js/util.js'
let pmhUserId = getQueryString('userid')
let button = document.querySelector('.button')
// 获取用户余额
dialogs.showLoading('拼命加载中...')
getUserCount()
function getUserCount () {
  jsonp({
    url: 'http://appapi.baomihua.com/AppInterface/PayInterface/Pay.ashx',
    type: "GET",
    context: this,
    data: {
      dataType: 'getAllMoney',
      pmhUserId
    },
    dataType: "jsonp",
    jsonp: ('m' + (new Date().getTime())),
    success: function (data) {
      dialogs.hideLoading()
      if (data.state === '1') {
        money.innerHTML = data.allmoney
      }else{
        dialogs.toast('用户金额获取失败~', 'none', 2000)
      }
    },
    error: function(){
      dialogs.toast('加载失败~', 'error', 2000)
    }
  })
}
button.addEventListener('click', function(){
  window.android_xx.androidGotBindingWechat()
})
//没有认证通知app隐藏提现记录入口
//显示头部提现记录入口 
window.android_xx.androidHideTXJL(1)