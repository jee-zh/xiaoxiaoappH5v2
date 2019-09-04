/* eslint-disable */
import '../../common/css/reset.css'
import '../../common/css/border.css'
import './auth.css';
import '../../common/css/dialog.css'
import {getUserInfos, handleSumbitAjax} from '../../common/js/public.js'
import {idcard, trim, getQueryString, jsonp, dialogs, publicPath} from '../../common/js/util.js'
let lists = document.querySelectorAll('.list-enter');
let username = document.querySelector('.username'),
creditNum = document.querySelector('.creditNum'),
groupname = document.querySelector('.groupname'),
cardid = document.querySelector('.cardid'),
telphone = document.querySelector('.telphone'),
beforeAvatar = document.querySelector('.before .image'),
button = document.querySelector('.area .button'),
pmhUserId = getQueryString('userid'),
jump = document.querySelector('.jump'),
isAgain = getQueryString('type') || '',
sumbitFlag = true;
//用户没有认证标记
let status = getQueryString('status') || '-2'
// let publicPath = '../'
//调用获取用户信息
getUserInfos(pmhUserId, isAgain, function(state){
  if (state === '-1' || state === '3' || state === '-2') {//尚未提交信息或者认证失败，则显示个人认证入口
    jump.style.display = 'block'
    handleJumpClick(state)
  }
})

button.addEventListener('click', handleButtonClick, false)
allowClick()
//跳转切换
function handleJumpClick (state) {
  jump.addEventListener('click', function(){
    if (state === '3') {
      location.href = `${publicPath}authPersonal.html?userid=${pmhUserId}&type=again&status=${status}`
    }else{
      location.href = `${publicPath}authPersonal.html?userid=${pmhUserId}&status=${status}`
    }
  }, false)
}
//遍历
for (let k=0; k<lists.length; k++) {
  lists[k].querySelector('input').onkeyup = function(){
    allowClick()
  }
}

//触发点击回调
function handleButtonClick(){
  if(validate() && sumbitFlag){
    //校验通过
    sumbitFlag = false
    handleSumbitAjax({
      dataType: 'OpenRouting',
      userId: pmhUserId,
      mainType: 2,
      companyName: trim(groupname.value),
      creditCode: trim(creditNum.value),
      mhName: trim(username.value),
      mhIdCode: trim(cardid.value),
      Telephone: trim(telphone.value),
      fileupload1: beforeAvatar.getAttribute('src')
    }, function(){
      sumbitFlag = true
    })
  }
  
}

//申请操作
// function handleSumbitAjax (options) {
//   dialogs.showLoading('提交中...');
//   let data = {
//     dataType: 'OpenRouting',
//     userId: pmhUserId,
//     mainType: 2,
//     mhName: options.username,
//     mhIdCode: options.cardid,
//     Telephone: options.telnum,
//     idCardImageFace: options.beforeFace,
//     idCardImageBack: options.afterFace
//   }
//   jsonp({
//     url: pubUrl,
//     type: "GET",
//     context: this,
//     data,
//     dataType: "jsonp",
//     jsonp: ('zepto' + (new Date().getTime())),
//     success: function (data) {
//       sumbitFlag = true
//       dialogs.hideLoading()
//       if(data.state === 1){
//         dialogs.toast('提交成功~', 'success', 2000);
//       }else{
//         var info = ''
//         if (data.state === -1){
//           info = '已申请，请勿重复提交~'
//         }else if(data.state === -2){
//           info = '开通账号数已达上限~'
//         }else if(data.state === 0){
//           info = '注册失败~'
//         }
//         dialogs.toast(info, 'error', 2000);
//       }
      
//     },
//     error: function(){
//       sumbitFlag = true
//       dialogs.hideLoading()
//       dialogs.toast('提交失败，请重试~', 'error', 2000);
//     }
//   })
// }

//判断是否都填写了，都填写了就允许点击
function allowClick () {
  if (trim(creditNum.value).length && trim(groupname.value).length && trim(username.value).length && trim(cardid.value).length && trim(telphone.value).length && beforeAvatar.getAttribute('src')){
    button.classList.remove('disabledClick')
    button.disabled = ''
  }else{
    button.classList.add('disabledClick')
    button.disabled = 'disabled'
  }
}

//校验
function validate (){
  if(checkCreditNum() && checkCard() && verifyTel()){
    return true
  }
  return false
}

//校验信用代码
function checkCreditNum () {
  if (!CheckSocialCreditCode(trim(creditNum.value))) {
    dialogs.toast('社会信用代码格式不正确', 'none', 2000);
    return false
  }
  return true
}


//校验手机号
function verifyTel() {
  var telTxt = trim(telphone.value)
  if (!(/^1[34578]\d{9}$/.test(telTxt))) {
    dialogs.toast('手机号码有误~', 'none', 2000,);
    return false;
  }
  return true
}
function CheckSocialCreditCode(Code) {
  var patrn = /^[0-9A-Z]+$/;
  //18位校验及大写校验
  if ((Code.length != 18) || (patrn.test(Code) == false)) {
    // console.info("不是有效的统一社会信用编码！");
    return false;
  }
  else {
    var Ancode;//统一社会信用代码的每一个值
    var Ancodevalue;//统一社会信用代码每一个值的权重 
    var total = 0;
    var weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];//加权因子 
    var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
    //不用I、O、S、V、Z 
    for (var i = 0; i < Code.length - 1; i++) {
      Ancode = Code.substring(i, i + 1);
      Ancodevalue = str.indexOf(Ancode);
      total = total + Ancodevalue * weightedfactors[i];
      //权重与加权因子相乘之和 
    }
    var logiccheckcode = 31 - total % 31;
    if (logiccheckcode == 31) {
      logiccheckcode = 0;
    }
    var Str = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
    var Array_Str = Str.split(',');
    logiccheckcode = Array_Str[logiccheckcode];
 
 
    var checkcode = Code.substring(17, 18);
    if (logiccheckcode != checkcode) {
      console.info("不是有效的统一社会信用编码！");
      return false;
    }else{
      console.info("yes");
    }
    return true;
  }
}

//校验身份证
function checkCard (){
  var cardidTxt = trim(cardid.value)
  if (idcard(cardidTxt)){
    return true
  }else{
    dialogs.toast('身份证号有误~', 'none', 2000,);
    return false
  }
}






var hexcase=0;var b64pad="";var chrsz=8;function hex_md5(s){return binl2hex(core_md5(str2binl(s),s.length*chrsz))}function b64_md5(s){return binl2b64(core_md5(str2binl(s),s.length*chrsz))}function str_md5(s){return binl2str(core_md5(str2binl(s),s.length*chrsz))}function hex_hmac_md5(key,data){return binl2hex(core_hmac_md5(key,data))}function b64_hmac_md5(key,data){return binl2b64(core_hmac_md5(key,data))}function str_hmac_md5(key,data){return binl2str(core_hmac_md5(key,data))}function md5_vm_test(){return hex_md5("abc")=="900150983cd24fb0d6963f7d28e17f72"}function core_md5(x,len){x[len>>5]|=128<<((len)%32);x[(((len+64)>>>9)<<4)+14]=len;var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;for(var i=0;i<x.length;i+=16){var olda=a;var oldb=b;var oldc=c;var oldd=d;a=md5_ff(a,b,c,d,x[i+0],7,-680876936);d=md5_ff(d,a,b,c,x[i+1],12,-389564586);c=md5_ff(c,d,a,b,x[i+2],17,606105819);b=md5_ff(b,c,d,a,x[i+3],22,-1044525330);a=md5_ff(a,b,c,d,x[i+4],7,-176418897);d=md5_ff(d,a,b,c,x[i+5],12,1200080426);c=md5_ff(c,d,a,b,x[i+6],17,-1473231341);b=md5_ff(b,c,d,a,x[i+7],22,-45705983);a=md5_ff(a,b,c,d,x[i+8],7,1770035416);d=md5_ff(d,a,b,c,x[i+9],12,-1958414417);c=md5_ff(c,d,a,b,x[i+10],17,-42063);b=md5_ff(b,c,d,a,x[i+11],22,-1990404162);a=md5_ff(a,b,c,d,x[i+12],7,1804603682);d=md5_ff(d,a,b,c,x[i+13],12,-40341101);c=md5_ff(c,d,a,b,x[i+14],17,-1502002290);b=md5_ff(b,c,d,a,x[i+15],22,1236535329);a=md5_gg(a,b,c,d,x[i+1],5,-165796510);d=md5_gg(d,a,b,c,x[i+6],9,-1069501632);c=md5_gg(c,d,a,b,x[i+11],14,643717713);b=md5_gg(b,c,d,a,x[i+0],20,-373897302);a=md5_gg(a,b,c,d,x[i+5],5,-701558691);d=md5_gg(d,a,b,c,x[i+10],9,38016083);c=md5_gg(c,d,a,b,x[i+15],14,-660478335);b=md5_gg(b,c,d,a,x[i+4],20,-405537848);a=md5_gg(a,b,c,d,x[i+9],5,568446438);d=md5_gg(d,a,b,c,x[i+14],9,-1019803690);c=md5_gg(c,d,a,b,x[i+3],14,-187363961);b=md5_gg(b,c,d,a,x[i+8],20,1163531501);a=md5_gg(a,b,c,d,x[i+13],5,-1444681467);d=md5_gg(d,a,b,c,x[i+2],9,-51403784);c=md5_gg(c,d,a,b,x[i+7],14,1735328473);b=md5_gg(b,c,d,a,x[i+12],20,-1926607734);a=md5_hh(a,b,c,d,x[i+5],4,-378558);d=md5_hh(d,a,b,c,x[i+8],11,-2022574463);c=md5_hh(c,d,a,b,x[i+11],16,1839030562);b=md5_hh(b,c,d,a,x[i+14],23,-35309556);a=md5_hh(a,b,c,d,x[i+1],4,-1530992060);d=md5_hh(d,a,b,c,x[i+4],11,1272893353);c=md5_hh(c,d,a,b,x[i+7],16,-155497632);b=md5_hh(b,c,d,a,x[i+10],23,-1094730640);a=md5_hh(a,b,c,d,x[i+13],4,681279174);d=md5_hh(d,a,b,c,x[i+0],11,-358537222);c=md5_hh(c,d,a,b,x[i+3],16,-722521979);b=md5_hh(b,c,d,a,x[i+6],23,76029189);a=md5_hh(a,b,c,d,x[i+9],4,-640364487);d=md5_hh(d,a,b,c,x[i+12],11,-421815835);c=md5_hh(c,d,a,b,x[i+15],16,530742520);b=md5_hh(b,c,d,a,x[i+2],23,-995338651);a=md5_ii(a,b,c,d,x[i+0],6,-198630844);d=md5_ii(d,a,b,c,x[i+7],10,1126891415);c=md5_ii(c,d,a,b,x[i+14],15,-1416354905);b=md5_ii(b,c,d,a,x[i+5],21,-57434055);a=md5_ii(a,b,c,d,x[i+12],6,1700485571);d=md5_ii(d,a,b,c,x[i+3],10,-1894986606);c=md5_ii(c,d,a,b,x[i+10],15,-1051523);b=md5_ii(b,c,d,a,x[i+1],21,-2054922799);a=md5_ii(a,b,c,d,x[i+8],6,1873313359);d=md5_ii(d,a,b,c,x[i+15],10,-30611744);c=md5_ii(c,d,a,b,x[i+6],15,-1560198380);b=md5_ii(b,c,d,a,x[i+13],21,1309151649);a=md5_ii(a,b,c,d,x[i+4],6,-145523070);d=md5_ii(d,a,b,c,x[i+11],10,-1120210379);c=md5_ii(c,d,a,b,x[i+2],15,718787259);b=md5_ii(b,c,d,a,x[i+9],21,-343485551);a=safe_add(a,olda);b=safe_add(b,oldb);c=safe_add(c,oldc);d=safe_add(d,oldd)}return Array(a,b,c,d)}function md5_cmn(q,a,b,x,s,t){return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b)}function md5_ff(a,b,c,d,x,s,t){return md5_cmn((b&c)|((~b)&d),a,b,x,s,t)}function md5_gg(a,b,c,d,x,s,t){return md5_cmn((b&d)|(c&(~d)),a,b,x,s,t)}function md5_hh(a,b,c,d,x,s,t){return md5_cmn(b^c^d,a,b,x,s,t)}function md5_ii(a,b,c,d,x,s,t){return md5_cmn(c^(b|(~d)),a,b,x,s,t)}function core_hmac_md5(key,data){var bkey=str2binl(key);if(bkey.length>16){bkey=core_md5(bkey,key.length*chrsz)}var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++){ipad[i]=bkey[i]^909522486;opad[i]=bkey[i]^1549556828}var hash=core_md5(ipad.concat(str2binl(data)),512+data.length*chrsz);return core_md5(opad.concat(hash),512+128)}function safe_add(x,y){var lsw=(x&65535)+(y&65535);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&65535)}function bit_rol(num,cnt){return(num<<cnt)|(num>>>(32-cnt))}function str2binl(str){var bin=Array();var mask=(1<<chrsz)-1;for(var i=0;i<str.length*chrsz;i+=chrsz){bin[i>>5]|=(str.charCodeAt(i/chrsz)&mask)<<(i%32)}return bin}function binl2str(bin){var str="";var mask=(1<<chrsz)-1;for(var i=0;i<bin.length*32;i+=chrsz){str+=String.fromCharCode((bin[i>>5]>>>(i%32))&mask)}return str}function binl2hex(binarray){var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var str="";for(var i=0;i<binarray.length*4;i++){str+=hex_tab.charAt((binarray[i>>2]>>((i%4)*8+4))&15)+hex_tab.charAt((binarray[i>>2]>>((i%4)*8))&15)}return str}function binl2b64(binarray){var tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var str="";for(var i=0;i<binarray.length*4;i+=3){var triplet=(((binarray[i>>2]>>8*(i%4))&255)<<16)|(((binarray[i+1>>2]>>8*((i+1)%4))&255)<<8)|((binarray[i+2>>2]>>8*((i+2)%4))&255);for(var j=0;j<4;j++){if(i*8+j*6>binarray.length*32){str+=b64pad}else{str+=tab.charAt((triplet>>6*(3-j))&63)}}}return str};
// 图片上传
;(function () {
  var uploadBtn = ['choiceBefore'];
  var crystr = hex_md5("pomoho"+pmhUserId);
  for (var i=0; i<uploadBtn.length; i++) {
    uploadFunc(i)
  }
  function uploadFunc (index) {
    var self = uploadBtn[index].toString();
    var uploader = new plupload.Uploader({
      browse_button : self,
      url : 'http://p001.baomihua.com/InsertImg.ashx',
      unique_names:true,
      filters: {
        mime_types : [
          { title : "Image files", extensions : "jpg,gif,png" }        ]
      },
      multi_selection:false,
      init:{
        FilesAdded: function(uploader,files){
          uploader.start();
        },
        BeforeUpload:function(uploader, files){
          uploader.settings.url = "http://p001.baomihua.com/InsertImg.ashx?crystr=" + crystr+'&userid='+pmhUserId;
          dialogs.showLoading('图片上传中...')
        },
        FileUploaded:function(uploader,file,responseObject){
          var data = JSON.parse(responseObject.response);
          if (responseObject.status != '200') {
            dialogs.toast(ret.reason+'，请重新上传', 'none', 2500)
            dialogs.showLoading('图片上传中...')
          } else {
            let oImg = null
            let obj = self === 'choiceBefore' ? '.before' : '.after'
            let parent = document.querySelector(obj)
            oImg = parent.querySelector('.image')
            oImg.setAttribute('src', data.items[0].FileUrl)
            oImg.style.display = 'block'
            parent.querySelector('button').className = 'uploaded'
            parent.querySelector('.desc').style.display = 'block'
            parent.querySelector('.desc').innerHTML = '重新上传'
            oImg.onload=function(){
              dialogs.hideLoading('上传中...')
              dialogs.toast('上传成功~', 'success', 1200);
            }
            allowClick()
          }
        },
        Error:function(uploader,errObject){
          var _error = ''
          if (errObject.code === -601) {
            _error = '上传文件类型不符合要求'
          }else if (errObject.code === -600) {
            _error = '图片太大了'
          }else if (errObject.code === -200) {
            _error = '网络错误'
          }else if (errObject.code === -700) {
            _error = '图片格式错误'
          }else{
            _error = '上传失败，请重试'
          }
          dialogs.toast(_error, 'error', 1500);
        }
      }
    }); 
    uploader.init();
  }
})();
//没有认证通知app隐藏提现记录入口
// if (status === '0') {//0代表没有认证成功，提现记录隐藏
//   //调用方法，0显示，1隐藏
//   window.android_xx.androidHideTXJL(1)
// }
//隐藏头部提现记录入口 
window.android_xx.androidHideTXJL(1)