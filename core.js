(function () {
    window['M'] = window['M'] || {};

    // 加载js文件
    M.loadJS = function (src, callback, errCallback) {
        if (!src) {
            return;
        }
        var e = document.createElement('script');
        e.setAttribute('type', 'text/javascript');
        e.setAttribute('charset', 'utf-8');
        e.setAttribute('src', src);
        document.getElementsByTagName('head')[0].appendChild(e);
        if (typeof errCallback === 'function') {
            e.onerror = errCallback;
        }
        e.onload = function () {
            if (typeof callback === 'function') {
                callback();
            }
        };
    };

    // 隐藏分享按钮
    M.hideShare = function () {
        function hide () {
            try {
                wx.hideOptionMenu();
                wx.hideAllNonBaseMenuItem();
            } catch (e) {

            }
        }
        try {
            wx.config({
                jsApiList: [
                    'hideOptionMenu',
                    'hideAllNonBaseMenuItem',
                ]
            })
            wx.ready(function () {
                console.log('ready');
                hide();
            })
        } catch (e) {

        }


    };

    // 设置返回
    M.setBack = function (backUrl) {
        if (!backUrl) {
            return false;
        }
        var fn = arguments.callee;
        if (fn.hasInit) {
            return false;
        }
        fn.hasInit = true;
        setTimeout(function () {
            history.pushState(history.length + 1, 'back', (location.href + '#' + new Date().getTime()))
        }, 100);
        window.onhashchange = function () {
            location.href = backUrl;
        }
    };


    M.getParam = function (name, url) {
        var r = new RegExp('(\\?|#|&)' + name + '=(.*?)(#|&|$)');
        var m = (url || location.href).match(r);
        return (m ? m[2] : '');
    };


    M.resetFont = function () {
        function setFont () {
            var clientWidth = document.documentElement.clientWidth;
            document.documentElement.style.fontSize = parseFloat(clientWidth / 3.75) + 'px';
        };

        window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', setFont, false);
        document.addEventListener('DOMContentLoaded', setFont, false);

        setTimeout(setFont, 100)
    };

}());

(function () {

    String.prototype.jstpl_format = function (ns) {
        function fn (w, g) {
            if (g in ns) {
                return ns[g];
            } else {
                return '';
            }
        };
        return this.replace(/%\(([A-Za-z0-9_|.]+)\)/g, fn);
    };

    var config = {
        tpl: {
            _alerttpl: [
                '<div id="js_mod_dialog" class="mod-popup %(popupClass)">',
                '  <div class="popup-body">',
                '    <h3 class="popup-title">%(title)</h3>',
                '    <div class="popup-cont">%(message)</div>',
                '    <div class="popup-btn">%(btnhtml)</div>',
                '  </div>',
                '</div>',
            ].join('')
        }
    };

    var hasInsetCSS = false;
    var g_js_dialogCb = null;
    var g_js_cancel_dialogCb = null;

    window.g_js_dialog = function (type) {
        close();
        if (typeof g_js_dialogCb === 'function') {
            g_js_dialogCb(type);
        }
    };
    window.g_js_cancel_dialog = function (type) {
        close();
        if (typeof g_js_cancel_dialogCb === 'function') {
            g_js_cancel_dialogCb(type);
        }
    };

    function __insetCss () {
        hasInsetCSS = true;
        var text = '.mod-popup{z-index:10000;width:100%;position:absolute;top:0;left:0;height:100%;background:rgba(0,0,0,.5)}.popup-body{position:absolute;width:3rem;margin-top:1.25rem;border-radius:6px;background:#fff;left:50%;margin-left:-1.5rem}.popup-body .popup-title{color:#000;font-size:.2rem;margin-top:.2rem;text-align:center}.popup-body .popup-cont{padding:.12rem .24rem .2rem;font-size:.16rem;color:rgba(0,0,0,.54);text-align:center}.popup-body .popup-btn{width:100%;border-top:1px solid rgba(0,0,0,.08);font-size:0}.double-btn-popup .popup-btn a{display:inline-block;width:50%;color:#009688;font-weight:700;text-align:center;font-size:.18rem;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:.16rem 0}.double-btn-popup .popup-btn a+a{border-left:1px solid rgba(0,0,0,.08)}.single-btn-popup a{display:block;width:100%;color:#009688;font-weight:700;text-align:center;font-size:.18rem;padding:.16rem 0}';
        var s = document.createElement('style');
        s.innerHTML = text;
        document.head.appendChild(s);
        s = null;
    };

    function close () {
        var d = document.getElementById('js_mod_dialog');
        if (d) {
            document.body.removeChild(d);
            d = null;
        }
    };

    function alert (p) {

        if (!hasInsetCSS) {
            __insetCss();
        }
        close();
        g_js_dialogCb = null;

        var opt = {
            title: '温馨提示',
            message: '',
            btn: '知道了',
            cb: null
        };

        if (typeof p === 'string') {
            opt.message = p;
        } else if (typeof p === 'object') {
            opt = $.extend(opt, p);
        } else {
            opt.message = typeof p;
            if (opt.message === 'boolean') {
                if (p) {
                    opt.message = 'true';
                } else {
                    opt.message = 'false';
                }
            }
        }

        opt.btnhtml = '<a class="js_global_dialog_submit_btn" href="javascript:;" data-value="0"><span>' + (opt.btn) + '</span></a>';

        opt.popupClass = makePopupType(opt);
        var html = config.tpl._alerttpl.jstpl_format(opt);
        g_js_dialogCb = opt.cb;
        setTimeout(function () {
            document.body.insertAdjacentHTML("beforeEnd", html);
        }, 200);
    };

    function makePopupType (opt) {
        var type = 'single-btn-popup';
        if (opt && opt.btn && typeof opt.btn !== 'string' && opt.btn.length > 1 && typeof opt.btn.push === 'function') {
            type = 'double-btn-popup';
        }
        return type;
    }

    function confirm (p) {

        if (!hasInsetCSS) {
            __insetCss();
        }
        close();
        g_js_dialogCb = null;
        g_js_cancel_dialogCb = null;
        var opt = {
            title: '温馨提示',
            message: '',
            btn: ['取消', '确定'],
            cb: null,
            cancelCb: null,
            href: ''
        };

        if (typeof p === 'string') {
            opt.message = p;
        } else if (typeof p === 'object') {
            opt = $.extend(opt, p);
        } else {
            return;
        }

        opt.btnhtml = '<a class="js_global_dialog_cancel_btn" href="javascript:;"><span>' + opt.btn[0] + '</span></a>';
        opt.btnhtml += '<a class="' + (opt.href ? '' : 'js_global_dialog_submit_btn') + '" href="' + (opt.href ? opt.href : 'javascript:;') + '" data-value="1"><span>' + (opt.btn[1]) + '</span></a>';

        opt.popupClass = makePopupType(opt);
        var html = config.tpl._alerttpl.jstpl_format(opt);
        g_js_dialogCb = opt.cb;
        g_js_cancel_dialogCb = opt.cancelCb;

        setTimeout(function () {
            document.body.insertAdjacentHTML("beforeEnd", html);
        }, 200);
    };

    window.g_dialog = {
        close: close,
        alert: alert,
        confirm: confirm,
    };

    $(function () {
        document.body.onclick = function () {
        }
        $(document.body).on('click', '.js_global_dialog_cancel_btn', function (event) {
            event.preventDefault();
            g_js_cancel_dialog(0);
            return false;
        });

        $(document.body).on('click', '.js_global_dialog_submit_btn', function (event) {
            event.preventDefault();
            var $this = $(this);
            var value = parseInt($this.attr('data-value'));
            g_js_dialog(value);
            return false;
        });
    });

})();
