/**
 * 
 */
function signup() {
    if (csdn.doing) return false;
    clearError();
    if (!chk_sign()) return false;
    var data = "un=" + csdn.val2("un");
    data += "&p=" + csdn.val2("p1");
    data += "&em=" + csdn.val2("em");
    data += "&g=" + escape($("input[name=gender]")[1].checked ? "2" : "1");
    csdn.doing = true;
    csdn.loading($("#aReg")[0]);
    $.get(csdn.acc_handler + "?t=reg&r="+Math.random(), data, function(data) {
        csdn.doing = false;
        csdn.loaded();
        data = csdn.toJSON(data);
        if (data[0].Status == "1") {alert("注册成功！");location = "../account/PersonalM.aspx";return;}
        if (data[0].Error.indexOf("-") == 2) {
            var arr = data[0].Error.split("-"); removeError($("#" + arr[0])); showerr($("#" + arr[0]), arr[1]); $("#" + arr[0]).select(); alert("注册失败，" + data[0].Error); //if (arr[0] == "cd")$("#vcImg").attr("src", csdn.vc_handler + "?r=" + Math.random());} else {alert("注册失败，" + data.error);
        }
    });
}
function showerr(e, err) {
    var p = document.createElement("span");
    p.className = "error_one";
    p.innerHTML = '<span>' + err + '</span>';
    e.parent().append(p);
}
function showok(e) {
    var p = document.createElement("span");
    p.className = "error_one";
    p.innerHTML = '<img src="../../Tpl/images/pic_03.gif" />';
    e.parent().append(p);
}
function clearError() {
    $(".error_one").each(function () {
        this.parentNode.removeChild(this);
    });
}
function removeError(e) {
    e.parent().children().each(function () {
        if (this.className == "error_one") {
            this.parentNode.removeChild(this);
            return;
        }
    });
}

$(function() {
    $("#aRecode").click(function() {
        $("#vcImg").attr("src", csdn.vc_handler + "?r=" + Math.random()); return false;
    });
    $("#aReg").click(function() {
        signup(); return false;
    });
    $("#em")[0].onchange = function() {
        var e = $(this); removeError(e); check_em(e);
    };
    $("#un")[0].onchange = function() {
        var e = $(this); removeError(e); check_un(e);
    };
    $("#p1")[0].onchange = function() {
        var e = $(this); removeError(e); chk_p1(e);
    };
    $("#p2")[0].onchange = function() {
        var e = $(this); removeError(e); chk_p2(e);
    };

    $("#un").focus();
});

var showId;
function showCT(id) {
    hideCT(true, showId);
    showId = id;
    if (csdn.val(showId) == "选择或填写") $("#" + showId).val("");
    $("#" + showId).css("color", "#000");
    if ($("#" + showId + "arr")[0]) {
        hideSel();
        $("#" + showId + "arr").show();
        return;
    }
    var arr = [];
    if (showId == "ct")
        arr = "北京,上海,广州,深圳,杭州,南京,成都,武汉,西安,大连,青岛,济南,天津,沈阳,苏州,厦门,珠海".split(',');
    else if (showId == "job")
        arr = "CTO,产品总监,项目总监,产品经理,技术经理,项目经理,系统架构师,需求分析师,软件工程师,硬件工程师,数据库工程师,运維工程师,UI设计/制作,老师,学生".split(',');
    else if (showId == "hy")
        arr = "移动与手机应用,金融,电信,互联网,物流,电子政务,旅游,制造,教育,医疗,交通,嵌入式,网络游戏,咨询,餐饮零售,欧美外包,日本外包,原厂商,SOHO".split(',');

    var s = "";
    var a1 = "<a href='javascript:void(0);' onclick='javascript:getCT(this);return false;'>";
    for (var i = 0; i < arr.length; i++) {
        s += a1 + arr[i] + "</a>";
    }
    var d = document.createElement("div");
    d.id = showId + "arr";
    d.className = "ctarr";
    d.style.width = $("#" + showId)[0].offsetWidth - 2 + "px";
    var pos = $("#" + showId).position();
    d.style.left = pos.left + "px";
    d.style.top = pos.top + $("#" + showId)[0].offsetHeight + "px";
    d.innerHTML = s;
    hideSel();
    document.body.appendChild(d);
}
function hideCT(fast, id) {
    if (!id) return;
    if (fast) {
        $('#' + id + 'arr').hide();
        showSel();
        if (!csdn.hasVal(id)) {
            $("#" + id).val("选择或填写").css("color", "#999");
        }
    } else {
        setTimeout(function () {
            $('#' + id + 'arr').hide();
            showSel();
            if (!csdn.hasVal(id)) {
                $("#" + id).val("选择或填写").css("color", "#999");
            }
        }, 300);
    }
}
function hideSel() {
    if (!csdn.ie6) return;

    $("#jy").hide();
}
function showSel() {
    if (!csdn.ie6) return;

    $("#jy").show();
}
function getCT(e) {
    $("#" + showId).val(e.innerHTML);
    removeError($("#" + showId));
    showok($("#" + showId));
    hideCT();
}
function check_un(e) {
    if (!chk_un(e)) return;
//    $.get(csdn.acc_handler + "?t=chkun", "un=" + csdn.val2(e), function (data) {
//        data = csdn.toJSON(data);
//        if (data.status==1) showok(e);
//        else showerr(e, data.error);
//    });
}
function check_em(e) {
    if (!chk_em(e)) return;
    $.get(csdn.acc_handler + "?t=chkem", "email=" + csdn.val2(e), function(data) {
        if(data==1){
        	showerr(e,'该邮箱已经注册过');
        }
    	/*data = csdn.toJSON(data);
        if (data[0].Status == 1) showok(e);
        else showerr(e, data[0].Error);*/
    });
}

function chk_sign() {
	
    if (!chk_em($("#em"))) return false;

    if (!chk_p1($("#p1"))) return false;

    if (!chk_p2($("#p2"))) return false;

    if (!chk_un($("#un"))) return false;
    
   
    return true;
}
function chk_un(e) {
    if (!csdn.hasVal(e)) {
        showerr(e, "请输入姓名！");
        e.focus();
        return false;
//    } else if (!csdn.checkUN(e.val())) {
//        showerr(e, "姓名格式不正确！");
//        e.select();
//        return false;
    } else {
        showok(e);
    }
    return true;
}
function chk_p1(e) {

    e.next().hide();
    if (!csdn.hasVal(e)) {
        showerr(e, "请输入密码！");
        e.focus();
        return false;
    }
    var pwStrong = csdn.checkPW(e.val());
    if (pwStrong == 1) {
        showerr(e, "密码安全太低，建议使用数字字母混合，请重设！");
        e.focus();
        return false;
    } else {
        e.next().show();
        e.next().attr("class", "pwds" + (pwStrong - 1));
        e.next().children().each(function (i) {
            $(this).removeClass("currs");
            if (i == pwStrong - 2) $(this).attr("class", "currs");
        });
        showok(e);
    }
    return true;
}
function chk_p2(e) {
    if (!csdn.hasVal(e)) {
        showerr(e, "请再次输入密码！");
        e.focus();
        return false;
    } else if (e.val() != $("#p1").val()) {
        showerr(e, "两次输入密码不一致，密码大小写敏感。");
        e.select();
        return false;
    } else {
        showok(e);
    }
    return true;
}
function chk_em(e) {
    if (!csdn.hasVal(e)) {
        showerr(e, "请输入您的邮箱！");
        e.focus();
        return false;
    } else if (!csdn.checkEM(e.val())) {
        showerr(e, "请输入真实的Email地址！");
        e.select();
        return false;
    } else {
    	var flag = 0;
    	$.ajax({
    		url:'../Login/emailCheck',
    		async:false,
    		data:{email:e.val()},
    		success:function(data){
    			flag = data;
    		}
    	})
    	if(flag==1){
            showerr(e,'该邮箱已经注册过');
            e.focus();
            return false;
    	}
        //showok(e);
    }
    return true;
}
function chk_val(e, err) {
    if (!csdn.hasVal(e)) {
        showerr(e, err);
        return false;
    } else {
        showok(e);
    }
    return true;
}
