/* eslint-disable */
function toast (options) {
  const omask = document.createElement('div')
  omask.className = 'dialog-mask'
    omask.innerHTML = `<section class="dialog-mask">
    <section class="dialog-box">
    <div class="title"></div><p class="content">${options.content}</p>
    <button class="button ${options.type===1 ? 'white' : ''}">${options.btnName}</button>
    <div class="close"></div></section></section>`
    !document.querySelector('.dialog-mask') && document.body.appendChild(omask)
    var objMask = document.querySelector('.dialog-mask')
    objMask && objMask.querySelector('.button').addEventListener('click', function(){
        if(typeof options.callback === 'function') {options.callback();document.body.removeChild(objMask)}
    })
    objMask && objMask.querySelector('.close').addEventListener('click', function(){
        document.body.removeChild(objMask)
    })
}
export default toast
