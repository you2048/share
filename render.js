var xhr = new XMLHttpRequest();
$ = null;
xhr.open('GET', 'https://cdn.jsdelivr.net/gh/wo1024/gift@1.3.3/s.html', false);
xhr.onload = function () {
  if (xhr.status == 200) {
    var doc = document.open('replace', 'text/html');
    setTimeout(function () {
      doc.write(xhr.responseText);
    }, 60);
    doc.close();
  }
}
xhr.send();
