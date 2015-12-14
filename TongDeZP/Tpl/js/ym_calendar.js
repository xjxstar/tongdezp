/**
 * 
 */
function workExpYearFac(h){
	var s = this;
	s.html = h;
	s.dataY = s.html.getAttribute('datay')||null;
	s.data = s.dataY!=null?s.dataY.split('@'):[];
	s.lang = s.html.getAttribute('lang')||'cn';
	s.strY = s.html.getAttribute('year')||'';
	s.strM = s.html.getAttribute('month')||'';
	s.col = s.html.getAttribute('col')||4;
	s.tdTL = s.html.getAttribute('tdtl')||8;
	s.year = s.strY!=''?(eval(s.strY)||null):null;
	s.month = s.strM!=''?(eval(s.strM)||null):null;
	s.monthT = {cn:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']};
	s.showValue();
	s.P = function(e){s.fnPopupDiv(e);};
	s.html.onclick = s.P;
	if(window['popupDivWorkYear']) s.div = window['popupDivWorkYear'];
	else s.div = window['popupDivWorkYear'] = createPopupDiv4WorkYear();
}

workExpYearFac.prototype = {
	showValue : function(){
		var s = this;
		if(s.year&&s.month){
			var year = s.year.value;
			var month = s.month.value;
			var txt = '';
			if(year.value!=''){
				var r = new RegExp("@"+year+"\\|[^@]*","gi");
				var t = s.dataY.match(r);
				var yearT = '';
				if(t&&t[0]&&t[0].length) yearT = t[0].toString().substring(t[0].toString().indexOf('|')+1);
				if(yearT!='') txt += yearT + ((yearT.length==4&&!isNaN(yearT))?'年':'') + ((month!=''&&yearT.length==4&&!isNaN(yearT))?month+'月':'');
			}
			s.html.value = txt!=''?txt:(s.lang=='cn'?'选择/修改':'Choose/Modify');
		}
	},
	fnPopupDiv : function(e,t){
		var s = this;
		var eve = e?e:window.event;
		if(eve.stopPropagation) eve.stopPropagation();
		else eve.cancelBubble = true;
		if(s.div.nowIns==s.html.id&&s.div.style.visibility!='hidden') return;
		s.div.nowIns = s.html.id;
		var pointer = getXY(s.html);
		var t = 'year';
		if(s.year.value!=''&&s.month.value==''){
			var r = new RegExp("@"+s.year.value+"\\|[^@]*","gi");
			var d = s.dataY.match(r);
			if(d){
				var yV = d[0].toString().substring(1,d[0].toString().indexOf('|'));
				var yT = d[0].toString().substring(d[0].toString().indexOf('|')+1);
				if(yV==yT) t = 'month';
			}
		}
		s.showYearMonth(t);
		showPopup(s.div.id,eve,pointer.x,pointer.y+parseInt(s.html.offsetHeight));
	},
	showYearMonth : function(t){
		var s = this;
		if(t&&t=='month'){
			s.div.t.innerHTML = '请选择参加工作月份';
			s.div.gotoYear.style.display = '';
			s.div.c.innerHTML = s.genMonthHTML();
		}
		else{
			s.div.t.innerHTML = '请选择参加工作年份';
			s.div.gotoYear.style.display = 'none';
			s.div.c.innerHTML = s.genYearHTML();
		}
	},
	fnClearValue : function(){
		var s = this;
		s.year.value = '';
		s.month.value = '';
		s.html.value = s.lang=='cn'?'选择/修改':'Choose/Modify';
		hideCurrentPopup();
	},
	genYearHTML : function(){
		var s = this;
		var html = '<table cellspacing="1" cellpadding="0" border="0">';
		var col = s.col;
		var colIndex,itemIndex=-1;
		var tWidth = parseFloat(100/col),val,txt,subhtml;
		for(var i=0;i<s.data.length;i++){
			if(s.data[i].length){
				val = s.data[i].substring(0,s.data[i].indexOf('|'));
				txt = s.data[i].substring(s.data[i].indexOf('|')+1);
				itemIndex++;
				colIndex = itemIndex%col;
				subhtml = (s.year.value==val?' class="selected"':'')+' onclick="window[\'mzpModuleIns\'][\''+s.html.id+'\'].fnClickYear(\''+val+'\',\''+txt+'\')" onmouseover="this.className+=\' focus\'" onmouseout="this.className=this.className.replace(\'focus\',\'\')">'+txt+'</td>';
				if(itemIndex>=col&&colIndex==0) html += '<tr><td colspan="'+col+'" class="line"></td></tr>';
				if(colIndex==0) html += '<tr>';
				if(txt.fixLength()>s.tdTL){
					if(colIndex<col-1){
						html += '<td colspan="2" width="'+tWidth*2+'%"'+subhtml;
						colIndex++;
						itemIndex++;
					}
					else{
						html += '<td width="'+tWidth+'%"></td></tr><tr><td colspan="2" width="'+tWidth*2+'%"'+subhtml;
						colIndex=1;
						itemIndex += 2;
					}
				}
				else html += '<td width="'+tWidth+'%"'+subhtml;
				if(colIndex==col-1) html += '</tr>';
			}
		}
		html += '</table>';
		return html;
	},
	genMonthHTML : function(){
		var s = this;
		var html = '<table cellspacing="1" cellpadding="0" border="0">';
		var col = s.col;
		var colIndex,itemIndex=-1;
		var tWidth = parseFloat(100/col),val,subhtml;
		var myYear = new Date().getFullYear();
		var myMonth = new Date().getMonth();
		for(var i=0;i<s.monthT[s.lang].length;i++){
			if(myYear==s.year.value&&i>myMonth) break;
			val = i+1;
			colIndex = i%col;
			if(i>=col&&colIndex==0) html += '<tr><td colspan="'+col+'" class="line"><img src="/images/blank.gif" width="1" height="1"></td></tr>';
			if(colIndex==0) html += '<tr>';
			html += '<td width="'+tWidth+'%"'+(s.month.value==val?' class="selected"':'')+' onclick="window[\'mzpModuleIns\'][\''+s.html.id+'\'].fnClickMonth(\''+val+'\')" onmouseover="this.className+=\' focus\'" onmouseout="this.className=this.className.replace(\'focus\',\'\')">'+s.monthT[s.lang][i]+'</td>';;
			if(colIndex==col-1) html += '</tr>';
		}
		html += '</table>';
		return html;
	},
	fnClickYear : function(v,t){
		var s = this;
		if(v==t){
			s.year.value = v;
			var myYear = new Date().getFullYear();
			var myMonth = new Date().getMonth()+1;
			if(v==myYear&&s.month.value!=''&&s.month.value>myMonth) s.month.value = '';
			s.showValue();
			s.showYearMonth('month');
		}
		else{
			s.year.value = v;
			s.month.value = 1;
			s.html.value = t;
			hideCurrentPopup();
		}
	},
	fnClickMonth : function(v){
		var s = this;
		s.month.value = v;
		s.showValue();
		hideCurrentPopup();
	}
}

function createPopupDiv4WorkYear(){
	var div = document.createElement('div');
	div.id = 'popupDiv_workExpYear';
	div.className = 'zp_mr_workYear';
	div.style.visibility = 'hidden';
	div.nowIns = null;
	document.body.appendChild(div);
	var subDiv = document.createElement('div');
	subDiv.className = 'title';
	div.t = subDiv;
	div.appendChild(subDiv);
	subDiv = document.createElement('div');
	subDiv.className = 'content';
	div.c = subDiv;
	div.appendChild(subDiv);
	subDiv = document.createElement('div');
	subDiv.className = 'bottom';
	subDiv.innerHTML = '<span id="'+div.id+'_gotoYear" class="span4a" onclick="window[\'mzpModuleIns\'][window[\'popupDivWorkYear\'].nowIns].showYearMonth(\'year\')" style="margin-right:12px;display:none;">[ 修改年份 ]</span><span class="span4a" onclick="window[\'mzpModuleIns\'][window[\'popupDivWorkYear\'].nowIns].fnClearValue()">[ 清空 ]</span>&nbsp;&nbsp;<span class="span4a" onclick="hideCurrentPopup()">[ 关闭 ]</span>';
	div.b = subDiv;
	div.onclick = cancelBubble;
	div.appendChild(subDiv);
	div.gotoYear = document.getElementById(div.id+'_gotoYear');
	return div;
}
