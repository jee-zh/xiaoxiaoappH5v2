/* eslint-disable */
import '../../common/css/reset.css'
import './goddess.css';
import '../../common/css/dialog.css';
import { dialogs, jsonp, getQueryString, publicPath } from '../../common/js/util.js'
const rulesBtn = document.querySelector('.rules')
const copyBtn = document.querySelector('.copy')
const popupMask = document.querySelector('.popup-mask')
const popupClose = popupMask.querySelector('.popup-close')
const myVideo = document.querySelector('.mine-video')
const BATHURL = 'http://smallvideo.wenzhiji.com/api/v1/User/'
const pmhUserId = getQueryString('userid') || 1
dialogs.showLoading('加载中...')

// 获取用户数据
getUserData()
function getUserData () {
  let data = {
    uid: pmhUserId
  }
  jsonp({
    url: `${BATHURL}GetUserAmount`,
    type: 'GET',
    context: this,
    data,
    dataType: 'jsonp',
    jsonp: 'm'+(new Date().getTime()),
    success: function (data) {
      dialogs.hideLoading();
      if (data.Code === 1) {
        let {Totalamount, Availableamount, Frozenamount} = data.Body
        console.log(document.querySelector('#waitMoney'))
        document.querySelector('#waitMoney').innerHTML = Totalamount
        document.querySelector('#sucMoney').innerHTML = Availableamount
        document.querySelector('#failMoney').innerHTML = Frozenamount
      }else{
        setTimeout(function () {
          dialogs.toast('用户信息获取失败~', 'error', 2000);
        }, 50)
      }
    },
    error: function () {
      dialogs.hideLoading()
      setTimeout(function () {
        dialogs.toast('信息获取失败~', 'error', 2000);
      }, 50)
    }
  })
}




// 触发活动规则弹窗
handleRulesClick()
function handleRulesClick () {
  rulesBtn.addEventListener('click', function(){
    popupMask.style.display="block"
    stopBodyScroll(true)
  })
  popupClose.addEventListener('click', popupHideByClick)
}

function popupHideByClick () {
  popupMask.style.display="none"
  stopBodyScroll(false)
}

// 复制qq群号
handleCopyClick()
function handleCopyClick () {
  copyBtn.addEventListener('click', function(){
    var clipboard = new ClipboardJS('#copy');
    clipboard.on("success", function(e){
      dialogs.toast('复制成功~', 'success', 2000)
      e.clearSelection();
    });
    clipboard.on("error", function(e){
      dialogs.toast('复制失败~', 'error', 2000)
    });
  })
}

myVideo.addEventListener('click', () => {
  location.href = `${publicPath}godVideo.html?userid=${pmhUserId}`
})

function stopBodyScroll (isFixed) { //禁止页面滚动
  var bodyEl = document.body;
  if(isFixed) {
    // curTop = document.documentElement.scrollTop || document.body.scrollTop
    bodyEl.style.position = 'fixed'
    bodyEl.style.top = '0px'
  } else {
    bodyEl.style.position = ''
    bodyEl.style.top = ''
    window.scrollTo(0, 0) // 回到原先的top
  }
}
