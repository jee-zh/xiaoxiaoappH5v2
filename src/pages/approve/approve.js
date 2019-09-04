/* eslint-disable */
import '../../common/css/reset.css'
import '../../common/css/border.css'
import './approve.css';
import '../../common/css/dialog.css'
import {jsonp, getQueryString, dialogs, publicPath} from '../../common/js/util.js'
let approve = document.querySelector('.approve-succ')
let pmhUserId = getQueryString('userid');
//用户没有认证标记
let status = getQueryString('status') || '-2'
// let publicPath = '../'
function safe (start, end, idStr) {
  let charArr = idStr.split("")
  let result = charArr.reduce((arr, next, index)=>{
    (index>start&&index<end)?arr.push("*"):arr.push(next)
    return arr
  }, [])
  return result.join("")
}

//获取用户审核状态
getUserInfos()
function getUserInfos() {
  dialogs.showLoading('拼命加载中...');
  let data = {
    dataType: 'GetAuthenInfo',
    userId: pmhUserId
  }
  jsonp({
    url: 'http://appapi.baomihua.com/AppInterface/UsersInterface/UserLogin.ashx',
    type: "GET",
    context: this,
    data,
    dataType: "jsonp",
    jsonp: ('zepto' + (new Date().getTime())),
    success: function (data) {
      //1=未审核；2=已通过；3=已拒绝；
      if (data.state === '-1'){//尚未提交认证，提示去认证
        var error = document.querySelector('.approve-no-data')
        var url = `${publicPath}authPersonal.html?userid=${pmhUserId}`
        error.style.display = 'block'
        error.querySelector('.again-btn') && error.querySelector('.again-btn').addEventListener('click', function(){
          location.href = url
        })
      }else if(data.state === '1'){//认证审核中
        document.querySelector('.approve-wait').style.display = 'block'
        // document.querySelector('.approve-wait .again-btn') && document.querySelector('.approve-wait .again-btn').addEventListener('click', function(){
        //   location.href = url
        // })
      }else if (data.state === '2') {//认证成功
        let infos = data.data,
        html = ''
        if (infos.maintype === '1') {//显示个人认证信息
          html = setPersonHtml(infos.operatorname, infos.idcard, infos.telephone)
          approve.innerHTML = html
        }else{//显示企业认证信息
          html = setGroupHtml(infos.operatorname, infos.operatorcompany, infos.idcard, infos.telephone)
          approve.innerHTML = html
        }
      }else if (data.state === '3'){//认证失败，提示重新认证
        var error = document.querySelector('.approve-error')
        var url = data.data.maintype === '1' ? `${publicPath}authPersonal.html?userid=${pmhUserId}&type=again&status=${status}` : `${publicPath}authGroup.html?userid=${pmhUserId}&type=again&status=${status}`
        error.querySelector('.desc').innerHTML = data.msg
        error.style.display = 'block'
        error.querySelector('.again-btn') && error.querySelector('.again-btn').addEventListener('click', function(){
          location.href = url
        })
      }
      dialogs.hideLoading()
    },
    error: function(){
      sumbitFlag = true
      dialogs.hideLoading()
      dialogs.toast('获取用户失败~', 'success', 2000);
    }
  })
}

function setPersonHtml(name, cardid, tel) {
  var html = `<div class="list border-bottom">
  <span class="name">姓名</span>
  <span class="value">${name}</span>
</div>\
<div class="list border-bottom">
  <span class="name">身份证号</span>
  <span class="value">${cardid}</span>
</div>\
<div class="list border-bottom">
  <span class="name">手机号</span>
  <span class="value">${tel}</span>
</div>`
return html
}
function setGroupHtml(name, user, cardid, tel) {
  var html = `<div class="list border-bottom">
  <span class="name">企业名称</span>
  <span class="value">${name}</span>
</div>
<div class="list border-bottom">
  <span class="name">运营者姓名</span>
  <span class="value">${user}</span>
</div>
<div class="list border-bottom">
  <span class="name">运营者身份证号</span>
  <span class="value">${cardid}</span>
</div>
<div class="list border-bottom">
  <span class="name">运营者手机号</span>
  <span class="value">${tel}</span>
</div>`
return html
}
//显示头部提现记录入口 
window.android_xx.androidHideTXJL(1)
