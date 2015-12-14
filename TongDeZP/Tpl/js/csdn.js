/**
 * 
 */
var csdn = function () { };

csdn.doing = false;
csdn.acc_handler = "index.php/Login/emailCheck";
csdn.ck_un = "UserName";
csdn.ck_user = "UserInfo";

csdn.ie6 = navigator.userAgent.toUpperCase().indexOf("MSIE 6.0") > 0;

csdn.val = function (e) {
    return $.trim(((typeof e == "string") ? $("#" + e) : e).val());
};
csdn.val2 = function (e) {
    return escape(csdn.val(e));
};
csdn.hasVal = function (e) {
    var v = csdn.val(e);
    return (v != "" && v != "请选择" && v != "选择或填写");
};

csdn.checkUN = function(un) {
    return false; ///^[a-z],{2,10}$/i.test(un);
};
csdn.checkUN = function(un) {
    return /^[a-z][a-z0-9_]{4,19}$/i.test(un);
};
csdn.checkEM = function (em) {
    return /^([a-z0-9][a-z0-9_\-\.]+)@([a-z0-9][a-z0-9\.\-]{0,20})\.([a-z]{2,4})$/i.test(em); 
};
csdn.checkPW = function (pw) {
    if (pw.length < 5) return 1;
    var c = 0;
    if (/[a-z]+/.test(pw)) c++;
    if (/[A-Z]+/.test(pw)) c++;
    if (/[0-9]+/.test(pw)) c++;
    if (/[^a-zA-Z0-9]+/.test(pw)) c++;
    if (c < 2) {
        var s = "0123456789abcdefghigklmnopqrstuvwxyz";
        var arr = pw.toLowerCase().split('');
        var idx = s.indexOf(arr[0]);
        if (idx > -1) {
            var arr2 = s.split('');
            for (var i = 0; i < arr.length; i++) {
                if (idx + 1 >= arr2.length || arr[i] != arr2[idx + i]) {
                    c++;
                    break;
                }
            }
        }
    }
    if (c > 1) {
        if (pw.length > 7) c++;
        if (/[^a-zA-Z0-9]+/.test(pw)) c++;
    }
    if (pw.replace(/(.)\1+/, "").length == 0) {
        c = 1;
    }
    if (c > 4) c = 4;

    return c;
};
/*判断URL中是否包含字符串s*/
csdn.urlHas = function (s) {
    return window.location.href.toLowerCase().indexOf(s.toLowerCase()) > 0;
};
/*获取一个指定长度随机数*/
csdn.random = function (len) {
    if (!len) len = 5;
    var r = Math.random().toString();
    return r.substr(r.length - len);
};

csdn.parent = (parent || top || window);
csdn.toJSON = function (data) {
    if (typeof data == "string") data = eval("(" + data + ")");
    return data;
};
/*q:参数名; url:可选*/
csdn.getQuery = function (q, url) {
    if (!url) url = window.location + '';
    else url += '';
    var reg = new RegExp("[?&](" + q + ")=([^&]+)", "i");
    var re = reg.exec(url);
    if (re) return unescape(re[2]);
    else return "";
};
/*判断是否按下了enter键*/
csdn.isEnter = function (ev) {
    ev = ev || window.event;
    var code = (ev.keyCode || ev.which);
    return (code == 10 || code == 13);
};