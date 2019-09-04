/* eslint-disable */
import '../../common/css/reset.css'
// import '../../common/css/border.css'
import './godVideo.css';
import '../../common/css/dialog.css';
import { dialogs, jsonp, getQueryString } from '../../common/js/util.js'
const videoBox = document.querySelector('.my-video-box')
const noData = document.querySelector('.no-data')
const pmhUserId = getQueryString('userid') || 1
const BATHURL = 'http://smallvideo.wenzhiji.com/api/v1/User/'
dialogs.showLoading('加载中...')


// 获取用户数据
getUserData()
function getUserData () {
  let data = {
    uid: pmhUserId
  }
  jsonp({
    url: `${BATHURL}GetActitvtyVideoInfos`,
    type: 'GET',
    context: this,
    data,
    dataType: 'jsonp',
    jsonp: 'm'+(new Date().getTime()),
    success: function (data) {
      if (data.Code === 1 && data.Body.length > 0) {// 查询数据成功 并且有数据
        let html = setList(data.Body)
        videoBox.innerHTML = html
        videoBox.style.display = 'flex'
      }else{
        noData.style.display = 'block'
      }
      dialogs.hideLoading();
    },
    error: function () {
      dialogs.hideLoading()
      setTimeout(function () {
        dialogs.toast('信息获取失败~', 'error', 2000);
      }, 50)
    }
  })
}

function setList (datas) {
  if (!datas.length) {
    return
  }
  let html = ''
  datas.forEach((item) => {
    html += `<div class="list">
    <div class="inner">
      <div class="box">
        <img src="${item.imgurl}" class="poster">
      `
    if (item.auditstatus == '-1') {
      html += `<p class="status">未通过</p>`
    }else{
      if (item.appauditstatus == '-1') {
        html += `<p class="status">未通过</p>`
      }else if (item.appauditstatus == '0') {
        html += `<p class="status">审核中</p>`
      }
    }
    html += `</div>
        </div>
      </div>`
  })
  return html
}