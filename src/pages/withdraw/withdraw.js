/* eslint-disable */
import '../../common/css/reset.css'
import './withdraw.css';
import '../../common/css/dialog.css'
import '../../common/css/toast.css'
import {getUserInfos} from '../../common/js/public.js'
import {getQueryString, jsonp, dialogs, publicPath} from '../../common/js/util.js'
import toast from '../../common/js/toast.js'
let pmhUserId = getQueryString('userid')
let appsystem = getQueryString('appsystem')
let sign = getQueryString('code')
let deviceId = getQueryString('deviceId')
// 开发中注释
let choiceList = document.querySelectorAll('.select-count .item')
let withdrawBtn = document.querySelector('.foot .btn')
let money = document.querySelector('#money')
//当前选择的提现金额
let slelctCount = 0

getUserInfos(pmhUserId, 'again', function(state){
  if (state === '-1') {//认证失败跳往认证页面
    // dialogs.confirm('温馨提示：','尚未实名认证，去实名认证', [{
    //   txt: '取消',
    //   callback: function(){
    //   }
    // },{
    //   txt: '去认证',
    //   color: 'red',
    //   callback: function(){
    //     window.android_xx.androidGotBindingPersonData()
    //     //location.href = `${publicPath}authPersonal.html?userid=${pmhUserId}&status=0`
    //   }
    // }])
    toast({
      content:'为了保障您的账户安全，提现需要进行身份认证',
      btnName: '去认证',
      callback: function(){
        window.android_xx.androidGotBindingPersonData()
      }
    })
  }else if (state === '1' || state === '3') {//认证中或者认证失败跳往认证结果页
    // dialogs.confirm('温馨提示：','实名认证审核未成功，去查看认证情况？', [{
    //   txt: '取消',
    //   callback: function(){
    //   }
    // },{
    //   txt: '去查看',
    //   color: 'red',
    //   callback: function(){
    //     location.href = `${publicPath}approve.html?userid=${pmhUserId}&status=0`
    //   }
    // }])
    toast({
      content:'实名认证审核未成功，审核通过后即可进行提现',
      btnName: '查看审核状态',
      type:1,
      callback: function(){
        location.href = `${publicPath}approve.html?userid=${pmhUserId}&status=0`
      }
    })
  }else {
    // var build = document.createElement("div");
    // build.className="withdraw-build";
    // build.innerHTML='<img src="data:image/png;base64,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" width="72"><p class="msg">提现功能正在开发中</p>'
    // document.body.appendChild(build)
  }
})
// 获取用户余额
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
      if (data.state === '1') {
        money.innerHTML = data.allmoney
        handleWithdrawClick(data.allmoney)
      }else{
        dialogs.toast('用户金额获取失败~', 'error', 2000)
      }
    },
    error: function(){
      dialogs.toast('网络异常~', 'error', 2000)
    }
  })
}

//提现
function handleWithdrawClick (money) {
  withdrawBtn.addEventListener('click', function(){
    if (withdrawBtn.classList.contains('disabled')) {return}
    if (parseInt(money) < 1) {
      dialogs.toast('余额小于最小提现金额~', 'error', 2000)
      return
    }
    if (parseInt(money) < parseInt(slelctCount)) {
      dialogs.toast('余额小于提现金额~', 'error', 2000)
      return
    }
    handleWithdrawClickFuc(slelctCount, appsystem, pmhUserId, sign)
  })
}
function handleWithdrawClickFuc(amount, wxNumber, pmhUserId, sign) {
  dialogs.showLoading('申请提现中...')
  jsonp({
    url: 'http://appapi.baomihua.com/AppInterface/PayInterface/Pay.ashx',
    type: "GET",
    context: this,
    data: {
      dataType: 'withDrawaXX',
      amount,
      wxNumber,
      pmhUserId,
      sign,
      deviceId
    },
    dataType: "jsonp",
    jsonp: ('m' + (new Date().getTime())),
    success: function (data) {
      setTimeout(function(){
        dialogs.hideLoading()
        if (data.state === '1') {
          dialogs.toast('提现申请成功~', 'success', 2000)
          // 成功后再获取一次接口
          getUserCount()
        }else if (data.state === '-100') {
          // dialogs.toast('请先提交实名认证~', 'error', 2000)
          // setTimeout(function(){
          //   location.href = `${publicPath}authPersonal.html?userid=${pmhUserId}`
          // },2500)
          toast({
            content: '请先提交实名认证，审核成功后才可提现',
            btnName: '去认证',
            callback: function(){
              location.href = `${publicPath}authPersonal.html?userid=${pmhUserId}`
            }
          })
        }else if (data.state === '-101') {
          dialogs.toast('请先绑定微信~', 'error', 2000)
          // setTimeout(function(){
          //   location.href = `${publicPath}bind.html?userid=${pmhUserId}`
          // },2500)
          toast({
            content: '请先绑定微信，绑定微信成功后才可提现',
            btnName: '去绑定',
            callback: function(){
              location.href = `${publicPath}bind.html?userid=${pmhUserId}`
            }
          })
        }else if (data.state !== '1') {
          dialogs.toast(data.msg, 'error', 2000)
        }
      },300)
    },
    error: function(){
      dialogs.toast('网络异常~', 'error', 2000)
    }
  })
}
//金额选择
handleChoiceClick()
function handleChoiceClick () {
  for (let i=0; i<choiceList.length; i++) {
    choiceList[i].addEventListener('click', function(){
      for (let k=0; k<choiceList.length; k++) {
        choiceList[k].classList.remove('active')
      }
      this.classList.add('active')
      slelctCount = this.getAttribute('count')
      if (withdrawBtn.classList.contains('disabled')) {
        withdrawBtn.classList.remove('disabled')
      }
    })
  }
}
// window.onpageshow = function (event) {
//   if (event.persisted) {
//     dialogs.toast('监测到返回', 'none', 2000)
//     window.android_xx.androidHideTXJL(0)
//   }
// }
// dialogs.toast('监测到返回！', 'none', 2000)
// 显示提现入口
window.android_xx.androidHideTXJL(0);
