/* eslint-disable */
import '../../common/css/reset.css'
import '../../common/css/border.css'
import './record.css';
import '../../common/css/dialog.css'
// import {getUserInfos} from '../../common/js/public.js'
import {getQueryString, jsonp, dialogs, publicPath} from '../../common/js/util.js'
let scrollTimer = null
let scrollFlag = true
let loading = true
let loadpage = 1
let pmhUserId = getQueryString('userid')
let more = document.querySelector('.weui-loadmore')
let listWrap = document.querySelector('.list-wrap')
let noRecord = document.querySelector('.no-record')
dialogs.showLoading('拼命加载中...')
loadMore()
document.addEventListener('scroll',function () {
  if (scrollFlag) {
    scrollFlag=false
    //var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    //if(docHeight <= wHeight + scrollTop + 30 ) {
      console.log(getScrollHeight(), getDocumentTop() + getWindowHeight())
    if(getScrollHeight() <= getDocumentTop() + getWindowHeight() + 50){
      if (loading) {
        loading = false
        loadMore()
      }
      
    }
    scrollTimer = setTimeout(function(){
      scrollFlag = true
    },16)
  }
})
function loadMore(){
  jsonp({
    url: "//appapi.baomihua.com/AppInterface/PayInterface/Pay.ashx",
    type: "GET",
    context: this,
    data: {
      dataType: 'getDrawaRecordsXX',
      pmhuserid: pmhUserId,
      pageIndex: loadpage,
      pageSize: 15
    },
    dataType: "jsonp",
    jsonp: ('zepto' + (new Date().getTime())),
    success: function (data) {
      if (data.state == '1') {
        dialogs.hideLoading()
        if (data.data.length === 0) {
          if (loadpage === 1) {
            noRecord.style.display="block"
            return
          }
          more.innerHTML = '已经加载完啦~'
          return
        }
        if(loadpage === 2) {
          more.style.display="block"
        }
        var html = setDomHtml(data.data)
        listWrap.innerHTML = listWrap.innerHTML + html
      }
      loadpage++
      loading = true
    },
    error: function() {
      loading = true
    }
  })

}

function setDomHtml (rets) {
  var html = '';
  for (let k=0; k<rets.length; k++) {
    html += '<div class="list border-bottom">\
    <div class="content">\
      <span class="name">'+rets[k].remark+'</span><span class="count"><em>'+rets[k].amount+'</em>元</span>\
    </div>\
    <div class="infos">\
      <span class="time">'+rets[k].createtime+'</span>'
    if(rets[k].status === '-1' || rets[k].status === '0'){
      html += '<span class="state waitting">'+rets[k].stacon+'</span>'
    }else{
      html += '<span class="state">'+rets[k].stacon+'</span>'
    }
  
    html += '</div></div>'
  }
  return html
}
function getDocumentTop () {
  var scrollTop = 0,
    bodyScrollTop = 0,
    documentScrollTop = 0;
  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
  return scrollTop;
}
function getWindowHeight() {
  var windowHeight = 0;
  if (document.compatMode == "CSS1Compat") {
    windowHeight = document.documentElement.clientHeight;
  } else {
    windowHeight = document.body.clientHeight;
  }
  return windowHeight;
}
function getScrollHeight() {
  var scrollHeight = 0,
    bodyScrollHeight = 0,
    documentScrollHeight = 0;
  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight;
  }
  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight;
  }
  scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
  return scrollHeight;
}
//显示头部提现记录入口 
window.android_xx.androidHideTXJL(1)
