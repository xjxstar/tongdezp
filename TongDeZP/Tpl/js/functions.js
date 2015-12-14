/**
 * 获取所有考勤选项
 */

var __URL__ = '/HospitalSchedule/index.php';
var checks = new Array();
$.ajax({
	async:false,
	url:__URL__+'/Common/getAllChecks',
	success:function(data){
		data = eval(data);
		for(var i=0;i<data.length;i++){
			 data[i]['deptType'] = data[i]['dept_type'];
		}
		checks = data;
	}
});
var Genders = [{ id: 1, text: '男' }, { id: 0, text: '女'}];
/*部门月考核状态*/
var checkStatus = [{id:0,text:'未提交'},{id:1,text:'已提交'},{id:2,text:'审核通过'},{id:3,text:'审核未通过'},{id:4,text:'已解锁'}];
var holidays = [{id:1,text:'元旦'},{id:2,text:'春节'},{id:3,text:'清明节'},{id:4,text:'劳动节'},
                {id:5,text:'端午节'},{id:6,text:'中秋节'},{id:7,text:'国庆节'},{id:8,text:'抗战胜利纪念日'}];
var userType = [{id:1,text:'正式'},{id:2,text:'协议'},{id:3,text:'退休返聘'},{id:4,text:'雷博托管'},{id:5,text:'外院规培'},{id:6,text:'本院规培'},{id:7,text:'外聘'}];
var checkUserType = [{id:2,text:'科室考勤员'},{id:3,text:'科室副主任'},{id:11,text:'科室主任'},{id:4,text:'副护士长'},{id:5,text:'副所长'},
                     {id:6,text:'副科长'},{id:7,text:'副社长'},{id:12,text:'负责人'},{id:13,text:'护士长'},{id:14,text:'社长'},{id:15,text:'所长'},
                     {id:16,text:'科长'},{id:0,text:'无'}];
var userRole = [{id:2,text:'科室考勤员'},{id:4,text:'科室主任'},{id:6,text:'人事专员'}];
var notifyContent = '主任，您好，您科室上月考勤信息还未提交，请及时提交！如有疑问，请询电话8100000。——同德医院人事科';
var checkTypes = [{id:1,text:'日班'},{id:2,text:'夜班'},{id:3,text:'请假休息'},{id:4,text:'其他情况'}];
var deptTypes = [{id:0,text:'行政后勤业务'},{id:1,text:'医生'},{id:2,text:'护理'},{id:3,text:'医技'}];
                 /*{id:32,text:'医技（检验科）'},{id:33,text:'医技(放射科)'},{id:34,text:'医技（超声科）'}];*/
/**
 * 获取当前时间前7天的日期
 */
function getWeekDate(){
	//var time = new Date(new Date().getTime()+24*3600*1000);
	var time = new Date();
	var week = time.getDay();
	var dates = new Array();
	var weeks = ['一','二','三','四','五','六','日'];
	for(i=6;i>=0;i--){
		var nowDate =new Date(time.getTime()-24*3600*1000*i);
		var year = nowDate.getFullYear();
		var month =nowDate.getMonth()+1;
	 	var day = nowDate.getDate();
	 	var w = nowDate.getDay();
	 	var show = month+"月"+((day+"").length<2?"0"+day:day)+"日"+'<br/>星期'+(w==0?weeks[6]:weeks[w-1]);
	 	dates.push(show);
	}
	return dates;
}
function getPreWeekDate(){
	//var time = new Date(new Date().getTime()+30*24*3600*1000);
	var time = new Date();
	var week = time.getDay();
	var dates = new Array();
	var weeks = ['一','二','三','四','五','六','日'];
	for(i=0;i<=6;i++){
		var nowDate =new Date(time.getTime()+24*3600*1000*i);
		var year = nowDate.getFullYear();
		var month =nowDate.getMonth()+1;
	 	var day = nowDate.getDate();
	 	var w = nowDate.getDay();
	 	var show = month+"月"+((day+"").length<2?"0"+day:day)+"日"+'<br/>星期'+(w==0?weeks[6]:weeks[w-1]);
	 	dates.push(show);
	}
	return dates;
}
function getSingleDay(data){
	var reg=/[0-9]+/g;
	var str = data.match(reg)[1];
	var day = str;
	if(str[0]=='0'){
		day = str[1];
	}
	return day;
}
/*
 * 根据年月获取该月每一天的信息。
 * @param str 代表年月的字符串，如;2015-7
 */
function getDaysInMonth(str){
	var arr = str.split("-");
	var month =parseInt(arr[1]);
	var year = arr[0];
	var temp = new Date(year,month,0);
	var days = temp.getDate();
	var weeks = ['一','二','三','四','五','六','日'];
	var dates = new Array();
	for(i=0;i<days;i++){
		var week = new Date(year,month-1,(i+1)).getDay();
		day = (i+1)>9?(i+1):('0'+(i+1));
		dates.push(month+'月'+day+'日<br/>星期'+(week==0?weeks[6]:weeks[week-1]))
	}
	return dates;
}

/**
 * 获取当前时间的年月
 */
function getYearMonth(){
	var date = new Date();
	var y = date.getFullYear();
	var m = date.getMonth()+1;
	return y+"-"+m;
}
/**
 * 生成年月下拉选择框
 * @param $container
 */
function selectYm($container){
		var year = new Date().getFullYear();
		var month = new Date().getMonth() + 1;
		var $s1 = $("<select id='year'></select>").appendTo($container);
		var $s2 = $("<select id='month'></select>").insertAfter($s1);
		$("<span style='margin:0px 5px;'>年</span>").insertAfter($s1);
		$("<span style='margin:0px 5px;'>月</span>").insertAfter($s2);
		for(i=0;i<20;i++){
			$("<option value='"+(year-i)+"'>"+(year-i)+"</option>").appendTo($s1);
		}
		if($s1.val()==year){
			for(i=month;i>0;i--){
				$("<option value='"+i+"'>"+i+"</option>").appendTo($s2);
			}
		}else{
			for(i=1;i<=12;i++){
				$("<option value='"+i+"'>"+i+"</option>").appendTo($s2);
			}
		}
		$s1.change(function(){
			$s2.get(0).options.length = 0;
			if($s1.val()==year){
 			for(i=month;i>0;i--){
 				$("<option value='"+i+"'>"+i+"</option>").appendTo($s2);
 			}
 		}else{
 			for(i=1;i<=12;i++){
 				$("<option value='"+i+"'>"+i+"</option>").appendTo($s2);
 			}
 		}
		});
	}
/**
 * 根据时间显示不同月份的日期列显示
 * @param 时间年月 2015-7 ym
 * @param 表格的列集合 columns
 * @returns 表格的新的列集合 columns
 */
function updateMDColumn(ym,columns,holidayData){
	var reg=/[0-9]+/g;
	for(i=1;i<columns.length;i++){
    	var field = columns[i].field;
    	if(field.indexOf('day')>=0){
    		columns.splice([i]);
    	} 
    }
    var dates = getDaysInMonth(ym);
		for(var i=0;i<dates.length;i++){
			var sday = getSingleDay(dates[i]);
			var str = 'day'+sday+'check';
			var daycheck = { header: dates[i],align:"center", field: str, width: 70,
	 				headerAlign: "center", allowSort: false,
	 				editor:{type: "textbox", style: "width:100%;"}}
			if(dates[i].indexOf('星期六')>=0||dates[i].indexOf('星期日')>=0){
 				daycheck['cellStyle'] = 'background:#e1e1e1';
 			}
			if(holidayData){
 				for(var j=0;j<holidayData.length;j++){
 					if(holidayData[j]['day']==sday){
 						daycheck['header'] = daycheck['header']+'('+getTextById(holidayData[j]['holiday'],holidays)+')';
 						daycheck['cellStyle'] = 'background:rgb(206,232,245)';
 					}
 				}
 			}
			columns.push(daycheck);
		}
		return columns;
}
/**
 * 打印指定标记之间的html内容
 */
function preview()
{
	bdhtml=window.document.body.innerHTML; 
	sprnstr="<!--startprint-->"; 
	eprnstr="<!--endprint-->"; 
	prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+17); 
	prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr)); 
	window.document.body.innerHTML=prnhtml; 
	window.print();  
	window.document.body.innerHTML = bdhtml;
	location.reload();
}
String.prototype.trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
 }
function delHtmlTag(str){  
    return str.replace(/<\/?.+?>/g,"");//去掉所有的html标记  
}
/**
 * 获取表的节假日列名
 * @param columns
 * @returns
 */
function getHolidayColumns(columns) {
     columns = columns.clone();
     var ths = new Array();
     for (var i = columns.length - 1; i >= 0; i--) {
         var column = columns[i];
         var header = column.header;
         if(header){
        	 if(header.indexOf('日')<0||(header.indexOf('日')>0&&(header.indexOf('节')>0||header.indexOf('元旦')>0))){
        		 var th = delHtmlTag(column.header.trim()).replace(/(\n)+|(\r\n)+/g,"").trim();
                 ths.push(th); 
        	 }
         }
     }
     return ths.reverse();
 }
/**
 * 获取表的列名
 * @param columns
 * @returns
 */
function getColumns(columns,flag) {
	var reg=/[0-9]+/g;
     columns = columns.clone();
     var ths = new Array();
     for (var i = columns.length - 1; i >= 0; i--) {
         var column = columns[i];
         if (!column.field) {        	 
             columns.removeAt(i);
         } else {
             var c = { header: column.header, field: column.field };
             columns[i] = c;
             var th = delHtmlTag(column.header.trim()).replace(/(\n)+|(\r\n)+/g,"").trim();
             if(th.match(reg) && th!=0 &&!flag){
            	 th = th.match(reg)[1];
             }
             ths.push(th);
         }
     }
     return ths.reverse();
 }
/**
 * 根据文件名以及导出Excel地址导出excel
 * @param filename
 * @param ideaUrl
 */
function eExcel(filename,ideaUrl,ym){
		var url = grid.url;
	    var columns = grid.getBottomColumns();
	    var ths = getColumns(columns);
	    var tableData = new Array();
	$.ajax({
		type:'post',
		url:url,
		data:{ym:ym},
		async:false,
		dataType:'json',
		success:function(data){
			tableData = data;
		}
	});
	$("#excelForm").attr("action",ideaUrl);
	$("#filename").val(filename);
	$("#ths").val(JSON.stringify(ths));
	$("#tableData").val(JSON.stringify(tableData));
	$("#excelForm").submit();
}
function printTable(filename,ideaUrl,ym){
	var url = grid.url;
    var columns = grid.getBottomColumns();
    var ths = getColumns(columns);
    var tableData = new Array();
    $.ajax({
		type:'post',
		url:url,
		data:{ym:ym},
		async:false,
		dataType:'json',
		success:function(data){
			tableData = data;
			$.ajax({
				type:'post',
				url:ideaUrl,
				async:false,
				data:{ths:JSON.stringify(ths),tableData:JSON.stringify(tableData),filename:filename},
				success:function(text){
			 		window.document.body.innerHTML=text; 
			 		window.print();  
			 		location.reload();
				}
			})
		}
    });
}
function printScheduleTable(filename,ideaUrl){
	var url = grid.url;
    var columns = grid.getBottomColumns();
    var flag =1;//不去月份
    var ths = getColumns(columns,flag);
    var tableData = new Array();
    $.ajax({
		type:'post',
		url:url,
		async:false,
		dataType:'json',
		success:function(data){
			tableData = data;
			$.ajax({
				type:'post',
				url:ideaUrl,
				async:false,
				data:{ths:JSON.stringify(ths),tableData:JSON.stringify(tableData),filename:filename},
				success:function(text){
			 		window.document.body.innerHTML=text; 
			 		window.print();  
			 		location.reload();
				}
			})
		}
    });
}
//配置网页打印的页眉页脚为空
function pagesetup_null(){   
    try{
        var RegWsh = new ActiveXObject("WScript.Shell");           
        hkey_key="header";           
        RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"");
        hkey_key="footer";
        RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"");
    }catch(e){}
}
/**
 * 选项卡改变时触发的时事件
 * @param e
 */
function changeTabs(e){
		if(e.tab.name=="night"){
			$(window.frames["iframe2"].document).contents().find("#flag").click();
		}
	}
Array.prototype.indexOf = function (val) {  
    for (var i = 0; i < this.length; i++) {  
        if (this[i] == val) {  
            return i;  
        }  
    }  
    return -1;  
};
/**
 * 在json数组中根据id 查找对应的text
 * @param sid   id
 * @param arr  json数组
 * @returns    text
 */
function getTextById(sid,arr){
	for(i=0;i<arr.length;i++){
		if(arr[i]['id']==sid){
			return arr[i]['text'];
		}
	}
	return '';
}
/**
 * 审核同意
 */
function agree(deptId){
	var flag = confirm("确认提交？");
	if(flag){
		var y = $("#year").val();
	    var m = $("#month").val();
	    var ym = y+"-"+m;
	    $.ajax({
	    	data:{ym:ym,deptId:deptId},
	    	url:__URL__+'/DeptHeader/checkAgree',
	    	type:'post',
	    	success:function(){
	    		alert('审核成功！');
	    		$(".button_area").addClass('hide');
	    		$(".top-tip").eq(1).addClass('hide');
	    		parent.location.reload();
	    	}
	    })
	}
}
/**
 * 审核退回
 */
	function reject(deptId){
		var y = $("#year").val();
		var m = $("#month").val();
		var ym = y+"-"+m;
		mini.open({
			url:__URL__+'/DeptHeader/checkReject/ym/'+ym+'/deptId/'+deptId,
			showMaxButton:false,
			title:'审核退回',
			width:400,
			height:200,
			ondestroy: function (action) { 
				if(action=='ok'){
					$(".button_area").addClass('hide');
					$(".top-tip").eq(1).addClass('hide');
					//parent.location.reload();
				}
			}
		})
	}
	/**
	 * 导出节假日考勤Excel
	 */
	function exportHolidayExcel(deptID){
 		var y = $("#year").val();
	    var m = $("#month").val();
	    var ym = y+"-"+m;
	    var filename = deptName+y+'年'+m+'月节假日正常考勤统计表';
	    var ths = grid.getBottomColumns();
	    var titles = getHolidayColumns(ths);
	    if(deptID){
	    	$("#excelForm").attr('action',__URL__+'/DeptHeader/exportHolidayExcel/deptID/'+deptID);
	    }else{
	    	$("#excelForm").attr('action',__URL__+'/DeptHeader/exportHolidayExcel');
	    }
	    $('#ths').val(titles);
	    $("#filename").val(filename);
	    $("#tableData").val(ym);//这里表格数据单独去，传递一个ym在后台取数据
	    $("#excelForm").submit();
 	}
	/**
	 * 将考勤全部设置为某个值
	 * @param 后台更改表格数据地址 url
	 * @param 设置的值 value
	 */
	function setAllCheck(url,value){
 		data = grid.data;
 		columns = grid.getColumns();
 		var arr = new Array();
 		for(i=0;i<columns.length;i++){
 			if(columns[i].readOnly==true){
 				arr.push(columns[i].field);
 			}
 		}
 		for(var i=0;i<data.length;i++){
 			for(var item in data[i]){
 				if(item.indexOf('day')>=0 && !data[i][item] && arr.indexOf(item)<0){
 					data[i][item] = value;
 				}
 			}
 		}
 		 var json = mini.encode(data); 
		    grid.loading("保存中，请稍后......");
		    $.ajax({
		        url: url,
		        data: { data: json },
		        type: "post",
		        success: function (text) {
		            grid.reload();
		        },
		        error: function (jqXHR, textStatus, errorThrown) {
		            alert(jqXHR.responseText);
		        }
		    }); 
 	}
	function onActionRenderer(e) {
 		var record = e.record;
 		var deptId = record.dept_id;
 		var flag = getYearMonth() == record.ym; 
 		var status = record.check_status;
 		if(flag){
 			$(".notifyAll").css('display','none');
 		}else{
 			$(".notifyAll").css('display','');
 		}
 		if((status==0||status==3||status==4||status==1) &&!flag){
 			var s = '<input type="button" value="短信提醒" style="width:80px;height:20px;" class="messagetip" onclick="sendMes('+deptId+',this)"/>';
 		}
 		return s;
    }
 	function sendMes(deptId,e){
 		$(e).val('已发送').attr('disabled',true);
 		$.ajax({
 			data:{deptId:deptId,content:notifyContent},
 			type:'post',
 			url:__URL__+'/Personnel/sendNotifyMessage',
 			success:function(data){
 				if(data==""||data==0){
 					alert('发送成功');
 				}
 			}
 		})
 	}
 	function notifyAll(){
 		$(".notifyAll").css('display','none');
 		$(".messagetip").each(function(){
 			$(this).click();
 		})
 	}
 	/**
 	 * 获取补登考勤情况
 	 * @param url
 	 */
 	function getRecheckStatus(url){
 		var flag;
 		$.ajax({
 			type:'post',
 			url:url,
 			async:false,
 			success:function(data){
 				if(data){
 					flag = 1;
 				}
 			}
 		})
 		return flag;
 	}
	
	function search() {
        var key = mini.get("key").getValue();
        if (key == "") {
            tree.clearFilter();
        } else {
            key = key.toLowerCase();                
            tree.filter(function (node) {
                var text = node.text ? node.text.toLowerCase() : "";
                if (text.indexOf(key) != -1) {
                    return true;
                }
            });
        }
    }
    function onKeyEnter(e) {
        search();
    }
    /**
     * 阻止试用框弹出，然并卵
     */
    var WinAlerts = window.alert;
    window.alert = function (e) {
    	e = e+'';
        if (e != null && e.indexOf("www.miniui.com")>-1) {
            //和谐了
        }else {
            WinAlerts (e);
        }
    };
    /*
     * 考勤选项数组转化为字符串
     */
    function checkArrayToString(arr){
    	var str = '';
    	for(var i=0;i<arr.length;i++){
    		if(arr[i]['remark']){
    			str = str +arr[i]['name']+':'+arr[i]['remark']+',';
    		}else{
    			str = str+arr[i]['name']+',';
    		}
    	}
    	return str.substr(0,str.length-1);
    }
   //判断json数组中的是否包含text属性为text的子元素
   function findTextInArr(arr,text){
	   for(var i=0;i<arr.length;i++){
		   if(arr[i]['name']==text) return true;
	   }
	   return false;
   }
   /**
    * 根据班次类型和科室类型获取考核选项
    * @param 班次类型 style
    * @param 科室类型 deptType
    * @param 科室类型为3即医技科室时需要具体部门ID deptId
    */
   function getChecksByStyleAndDeptType(style,deptType,deptId){
	   var arr = new Array();
	   var count = 0;
	   for(var i=0;i<checks.length;i++){
		   if(deptId){
			   if(checks[i]['style'] == style && checks[i]['deptType'] == deptType && checks[i]['dept_id']==deptId){
				   arr[count++] = checks[i];
			   }
		   }else{
			   if(checks[i]['style'] == style && checks[i]['deptType'] == deptType){
				   arr[count++] = checks[i];
			   }
		   } 
	   }
	   return arr;
   }
   function addSummaryColumn(columns,summaryChecks){
	   for(var i=0;i<summaryChecks.length;i++){
		   var checkSummary = { header: summaryChecks[i]['name']+'<br/>统计',align:"center", field: 'night'+summaryChecks[i]['id'], width: 40,
	 				headerAlign: "center", allowSort: false,autoShowPopup:true,
	 				editor:{type: "mini-text", style: "width:100%;"}};
		   columns.push(checkSummary);
	   }
	   return columns;
   }
   //对输入的考勤信息进行验证
   function onCellCommitEdit(e) {
		if(e.value){
			value = e.value;
			var inChecks = findTextInArr(checksShow,value);
			var inNightChecks = findTextInArr(nightChecksShow,value);
			var inleaveChecks = findTextInArr(leaveChecks,value);
			var inOtherChecks = findTextInArr(otherChecks,value);
			if(!inChecks && !inNightChecks && !inleaveChecks && !inOtherChecks){
				alert('考勤类型输入错误，请参照表格右边的填写提示进行填写');
				e.cancel = true;
			}
			var re = /^[0-9]+$/;
			if(deptType==0 && inNightChecks && ( !e.record.role||!e.record.role.match(re) ||e.record.role<3)){
				alert('考勤类型输入错误，仅科室主任与科室副主任有夜班');
				e.cancel = true;
			}
		}
   }
   var checksShow;//正常考勤选项
   var nightChecksShow;//夜班考勤选项
   var leaveChecks;//请假类型
   var otherChecks;//其他情况
   var deptUserType;//用户考勤职务
   //设置每种类型的考勤选项
   function setCheckEnterTip(deptType,deptId){
	   if(deptType==3){
		   //医技科室
		   checksShow = getChecksByStyleAndDeptType(1,deptType,deptId);
		   nightChecksShow = getChecksByStyleAndDeptType(2,deptType,deptId);
	   }else{
		   checksShow = getChecksByStyleAndDeptType(1,deptType);
		   nightChecksShow = getChecksByStyleAndDeptType(2,deptType);
	   }
	   leaveChecks = getChecksByStyleAndDeptType(3);
	   otherChecks = getChecksByStyleAndDeptType(4);
	   var deptTypeText;
	   for(var i=0;i<deptTypes.length;i++){
		   console.log(deptTypes[i]['id']);
		   if(deptTypes[i]['id'] == deptType){
			   deptTypeText = deptTypes[i]['text'];
		   }
	   }
	   $('#dayChecks').html(checkArrayToString(checksShow));
	   $('#nightChecks').html(checkArrayToString(nightChecksShow));
	   $('#leaveChecks').html(checkArrayToString(leaveChecks));
	   $('#otherChecks').html(checkArrayToString(otherChecks));
	   //$('.deptUserType').html(deptTypeText);
	 	if(deptType==0){
	 		$("#adminOnly").html('（仅科室主任与科室副主任）');
	 	}
   }