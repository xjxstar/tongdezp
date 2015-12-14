MYRESUME.date_startend = function(o,sy,sm,ey,em,compare,title,language){
	var s = this;
	s.ClientID = o;
	var str_s = s.ClientID+'_start';
	var str_e = s.ClientID+'_end'; 
	eval(str_s + ' = new MYRESUME.date_yyyym("'+str_s+'",sy,sm,title,language)');
	eval(str_e + ' = new MYRESUME.date_yyyym("'+str_e+'",ey,em,title,language)');
	s.start = eval(str_s);
	s.start.pObj = s;
	s.end = eval(str_e);
	s.end.pObj = s;
	s.start.type = 'start';
	s.end.type = 'end';
	if(compare){
		s.start.sibling_e = s.end;
		s.end.sibling_s = s.start;
	}
	s.setNow = function(){
		var s = this;
		s.end.objectY.input.value = '';
		s.end.objectM.input.value = '';
		if(window[s.end.objectY.input.name]&&window[s.end.objectY.input.name]['fnValidate']&&typeof(window[s.end.objectY.input.name]['fnValidate'])=='function') window[s.end.objectY.input.name]['fnValidate']();
		if(window[s.end.objectM.input.name]&&window[s.end.objectM.input.name]['fnValidate']&&typeof(window[s.end.objectM.input.name]['fnValidate'])=='function') window[s.end.objectM.input.name]['fnValidate']();
	}
}

MYRESUME.date_yyyym = function(o,y,m,t,l){
	var s = this;
	s.ClientID = o;
	s.y = y||null;
	s.m = m||null;
	s.title = t||null;
	s.language = l||null;
	s.config = {};
	s.cancelBubble = function(e){
		var eve = e?e:window.event;
		eve.cancelBubble = true;
	};
	s.fnKeyPress = function(e){
		var eve = e?e:window.event;
		return false;
	};
	s.year = function(p){
		var s = this;
		s.pObj = p;
		s.ClientID = s.pObj.ClientID+'_y';
		s.C = function(e){s.pObj.cancelBubble(e);};
		s.K_P = function(e){return s.pObj.fnKeyPress(e);};
		if(s.pObj.y){
			s.input = s.pObj.y;
			MYRESUME.EventUtils.addEvent(s.input,'click',s.C);
			s.input.onkeydown = s.K_P;
			s.nowVal = s.input.value;
			s.frame = function(p,index){
				var s = this;
				s.pObj = p;
				if(index==0){
					s.startIndex = 0;
					s.endIndex = s.pObj.data.length%s.pObj.itemsEachFrame==0?s.pObj.itemsEachFrame-1:s.pObj.data.length%s.pObj.itemsEachFrame-1;
				}
				else{
					s.startIndex = s.pObj.frames[index-1]?s.pObj.frames[index-1].endIndex+1:0;
					s.endIndex = s.startIndex+s.pObj.itemsEachFrame-1;
				}
				s.data = s.pObj.data.slice(s.startIndex,s.endIndex+1);
				s.toString = function(){
					var s = this;
					var col = 4,colIndex;
					var str = '<div id="'+s.pObj.ClientID+'_frame'+index+'" class="frame"><table cellspacing="1" cellpadding="0">';
					for(var i=0;s.data[i];i++){
						colIndex = i%col;
						if (i > 0 && colIndex == 0) str += '<tr><td colspan="' + col + '" class="line"></td></tr>';
						if(colIndex==0) str += '<tr>';
						str += '<td'+(s.pObj.nowVal==s.data[i]?' class="selected"':'')+' id="'+s.pObj.ClientID+'_'+s.data[i]+'" onclick="'+s.pObj.pObj.ClientID+'.objectY.fnPassValue(\''+s.data[i]+'\')" onmouseover="this.className+=\' focus\'" onmouseout="this.className=this.className.replace(\'focus\',\'\')">'+s.data[i]+'年</td>';
						if(colIndex==col-1) str += '</tr>';
					}
					str += '</table></div>';
					return str;
				};
			};
			s.scrollStep = 10;
			s.scrollSpeed = 5;
			s.dataAll = s.input.attributes['data'].value.split('|');
			s.data = s.dataAll;
			s.itemsEachFrame = 12;
			s.fixData = function(min,max){
				var startIndex=0,endIndex=s.data.length-1,i;
				if(min) for(i=0;s.data[i];i++) if(parseInt(min)==s.data[i]){
					startIndex = i;break;
				}
				if(max) for(i=s.data.length-1;i>-1;i--) if(parseInt(max)==s.data[i]){
					endIndex = i;break;
				}
				s.data = s.dataAll.slice(startIndex,endIndex+1);
			};
			s.initFrame = function(){
				s.numFrames = Math.ceil(s.data.length/s.itemsEachFrame);
				s.frames = new Array(s.numFrames);
				for(var i=0;i<s.numFrames;i++) s.frames[i]=new s.frame(s,i);
			};
			s.buildFrame = function(){
				function frameHTML(s){
					var str = '';
					for(var i=0;s.frames[i];i++) str += s.frames[i];
					return str;
				};
				function fixFrameWH(s){
					var width = parseInt(parseInt(s.divC.offsetWidth)>0?s.divC.offsetWidth:s.divC.style.width);
					var height = parseInt(parseInt(s.divC.offsetHeight)>0?s.divC.offsetHeight:s.divC.style.height);
					s.frameW = width;
					s.frameH = height;
					s.divF.style.width =  width*s.numFrames+'px';
					s.divF.style.height = height+'px';
					for(var i=0;i<s.numFrames;i++){
						s.frames[i].dhtmlObj.style.width = width+'px';
						s.frames[i].dhtmlObj.style.height = height+'px';
					}
				};
				if(!s.divF) s.buildDiv();
				if(s.divF){
					s.divF.innerHTML = frameHTML(s);
					for(var i=0;i<s.numFrames;i++) s.frames[i].dhtmlObj = document.getElementById(s.ClientID+'_frame'+i);
					fixFrameWH(s);
				}
			};
			s.fixFramePosition = function(){
				if(s.numFrames>0){
					var startIndex = s.numFrames-1,i,max,min;
					if(s.nowVal!=''){
						for(i=0;i<s.numFrames;i++){
							min = s.frames[i].data[0];
							max = s.frames[i].data[s.frames[i].data.length-1];
							if(s.nowVal<=max && s.nowVal>=min){
								startIndex = i;
								break;
							}
						}
					}
					var left = '-'+s.frameW*startIndex+'px';
					var top = '0px';
					s.divF.style.top = top;
					s.divF.style.left = left;
					s.nowFrameIndex = startIndex;
				}
			};
			s.allForFrames = function(){
				s.initFrame();
				s.buildFrame();
				s.fixFramePosition();
			};
			s.buildDiv = function(){
				function divHTML(s){
				    var str = '<div class="title"><img id="' + s.ClientID + '_previous" class="previous_disabled" title="更早的年份"  align="absmiddle" />&nbsp;请选择' + (s.pObj.title ? s.pObj.title : '') + (s.pObj.type && s.pObj.type == 'start' ? '开始' : s.pObj.type && s.pObj.type == 'end' ? '结束' : '') + '年份&nbsp;<img id="' + s.ClientID + '_next" class="next_disabled" title="更晚的年份"  align="absmiddle" /></div>';
					str += '<div class="spacer clearfix"><div id="'+s.ClientID+'_content" class="content">';
					str += '<div id="'+s.ClientID+'_loading" class="loading">Loading...</div>';
					str += '<div id="'+s.ClientID+'_FrameContainer" class="frameContainer"></div>';
					str += '</div></div>';//str += '<div class="bottom">'+(s.pObj.type&&s.pObj.type=='end'&&s.pObj.setNow&&typeof(s.pObj.setNow)=='function'?'<span class="span4a" onclick="'+s.pObj.ClientID+'.setNow();'+s.pObj.ClientID+'.objectY.fnClose();">[ 至今 ]</span>&nbsp;&nbsp;':'')+'<span class="span4a" onclick="'+s.pObj.ClientID+'.objectY.fnClearValue()">[ 清空 ]</span>&nbsp;&nbsp;<span class="span4a" onclick="'+s.pObj.ClientID+'.objectY.fnClose()">[ 关闭 ]</span></div>';
					str += '<div class="bottom"><span class="span4a" onclick="' + s.pObj.ClientID + '.objectY.fnClearValue()">[ 清空 ]</span>&nbsp;&nbsp;<span class="span4a" onclick="' + s.pObj.ClientID + '.objectY.fnClose()">[ 关闭 ]</span></div>';
					return str;
				};
				if(!s.flagDiv){
					var p = s.input.form||null;
					s.div = MYRESUME.util.Dom.createDiv(p,s.ClientID+'_div','zp_mr_dateDiv_y');
					if(s.div){
						MYRESUME.EventUtils.addEvent(s.div,'click',s.C);
						s.div.innerHTML = divHTML(s);
						s.divP = document.getElementById(s.ClientID+'_previous');
						s.divC = document.getElementById(s.ClientID+'_content');
						s.divL = document.getElementById(s.ClientID+'_loading');
						s.divF = document.getElementById(s.ClientID+'_FrameContainer');
						s.divN = document.getElementById(s.ClientID+'_next');
						s.flagDiv = true;
					}
				}
			};
			s.setLoading = function(action){
				if(action){
					s.divL.style.display = '';
					s.divF.style.display = 'none';
				}
				else{
					s.divL.style.display = 'none';
					s.divF.style.display = '';
				}
			};
			s.previousDisabled = function(action){
				if(action){
					if(s.divP.className.indexOf('_disabled')<0) s.divP.className = s.divP.className+'_disabled';
				}
				else{
					if(s.divP.className.indexOf('_disabled')>-1) s.divP.className = s.divP.className.replace('_disabled','');
					MYRESUME.EventUtils.addEvent(s.divP,'click',s.P);
				}
			};
			s.nextDisabled = function(action){
				if(action){
					if(s.divN.className.indexOf('_disabled')<0) s.divN.className = s.divN.className+'_disabled';
				}
				else{
					if(s.divN.className.indexOf('_disabled')>-1) s.divN.className = s.divN.className.replace('_disabled','');
					MYRESUME.EventUtils.addEvent(s.divN,'click',s.N);
				}
			};
			s.fnPrevious = function(){
				if(s.flagAction) return;
				else{
					var endX = parseInt(s.divF.style.left) + s.frameW;
					s.fnScroll('left',endX);
				}
			};
			s.fnNext = function(){
				if(s.flagAction) return;
				else{
					var endX = parseInt(s.divF.style.left) - s.frameW;
					s.fnScroll('right',endX);
				}
			};
			s.P = function(e){
				if(s.nowFrameIndex>0) s.fnPrevious();
				else return;
			};
			s.N = function(e){
				if(s.nowFrameIndex<s.numFrames-1) s.fnNext();
				else return;
			};
			s.fnScroll = function(dir,end){
				var flag = (dir=='left'&&parseInt(s.divF.style.left)<end)||(dir=='right'&&parseInt(s.divF.style.left)>end);
				if(flag){
					s.flagAction = true;
					if(dir=='left') s.divF.style.left = parseInt(s.divF.style.left) + s.scrollStep + 'px';
					else if(dir=='right') s.divF.style.left = parseInt(s.divF.style.left) - s.scrollStep + 'px';
					s.action = null;
					s.action = setTimeout(function(){s.fnScroll(dir,end)},s.scrollSpeed);
				}
				else{
					s.divF.style.left = end + 'px';
					if(dir=='left') s.nowFrameIndex--;
					else if(dir=='right') s.nowFrameIndex++;
					s.flagAction = false;
					if(s.nowFrameIndex>0) s.previousDisabled(false);
					else s.previousDisabled(true);
					if(s.nowFrameIndex<s.numFrames-1) s.nextDisabled(false);
					else s.nextDisabled(true);
				}
			};
			s.fnClearValue = function(){
				s.input.value = '';
				hideCurrentPopup();
			};
			s.fnClose = function(){
				hideCurrentPopup();
			};
			s.fnFocus = function(e){
				if(!s.flagDiv) s.buildDiv();
				if(s.flagDiv){
					var v = MYRESUME.util.Dom.getCurrentStyle(s.div,'visibility');
					if(v=='hidden'){
						s.setLoading(true);
						s.previousDisabled(true);
						s.nextDisabled(true);
						showPopup(s.div.id,e,MYRESUME.util.Dom.getXY(s.input).x,MYRESUME.util.Dom.getXY(s.input).y+22);
						
						if(s.nowVal!=s.input.value) s.nowVal = s.input.value;
						
						s.data = s.dataAll;
						if(s.pObj.sibling_e&&s.input.value==''&&s.pObj.sibling_e.objectY.input.value!=''){
							var compareVal = s.pObj.sibling_e.objectY.input.value;
							if(!isNaN(compareVal)&&parseInt(compareVal)<=s.dataAll[s.dataAll.length-1]&&parseInt(compareVal)>=s.dataAll[0]) 
							s.fixData(null,parseInt(compareVal));
						}
						if(s.pObj.sibling_s&&s.input.value==''&&s.pObj.sibling_s.objectY.input.value!=''){
							var compareVal = s.pObj.sibling_s.objectY.input.value;
							if(!isNaN(compareVal)&&parseInt(compareVal)<=s.dataAll[s.dataAll.length-1]&&parseInt(compareVal)>=s.dataAll[0]) 
							s.fixData(parseInt(compareVal),null);
						}
						
						s.allForFrames();
						if(s.nowFrameIndex>0) s.previousDisabled(false);
						if(s.nowFrameIndex<s.numFrames-1) s.nextDisabled(false);
						s.setLoading(false);
						if(s.div.shim) s.div.shim.setStyle('visibility','visible');
					}
				}
			};
			s.fnPassValue = function(v){
				var flagGoTo = false;
				if(s.pObj.objectM&&s.pObj.objectM.input.value=='') flagGoTo = true;
				s.nowVal = v;
				s.input.value = v;
				hideCurrentPopup();
				if(flagGoTo) 
					try{s.pObj.objectM.input.focus();}
					catch(e){}
			};
			s.FnF = function(e){s.fnFocus(e);};
			MYRESUME.EventUtils.addEvent(s.input,'focus',s.FnF);
		}
	};
	s.month = function(p){
		var s = this;
		s.pObj = p;
		s.ClientID = s.pObj.ClientID+'_m';
		s.C = function(e){s.pObj.cancelBubble(e);};
		s.K_P = function(e){return s.pObj.fnKeyPress(e);};
		if(s.pObj.m){
			s.input = s.pObj.m;
			MYRESUME.EventUtils.addEvent(s.input,'click',s.C);
			s.input.onkeydown = s.K_P;
			s.nowVal = s.input.value;
			s.dataAll = s.input.attributes['data'].value.split('|');
			s.data = s.dataAll;
			s.fixData = function(min,max){
				var s = this;
				var startIndex=0,endIndex=s.data.length-1,i;
				if(min) for(i=0;s.data[i];i++) if(parseInt(min)==s.data[i]){
					startIndex = i;break;
				}
				if(max) for(i=s.data.length-1;i>-1;i--) if(parseInt(max)==s.data[i]){
					endIndex = i;break;
				}
				s.data = s.dataAll.slice(startIndex,endIndex+1);
			};
			s.buildDiv = function(){
				function divHTML(s){
					var str = '<div class="title">请选择'+(s.pObj.title?s.pObj.title:'')+(s.pObj.type&&s.pObj.type=='start'?'开始':s.pObj.type&&s.pObj.type=='end'?'结束':'')+'月份</div>';
					str += '<div class="spacer clearfix"><div id="'+s.ClientID+'_content" class="content">';
					str += '<div id="'+s.ClientID+'_loading" class="loading">Loading...</div>';
					str += '<div id="'+s.ClientID+'_dataContainer" class="dataContainer"></div>';
					str += '</div></div>';//str += '<div class="bottom">'+(s.pObj.type&&s.pObj.type=='end'&&s.pObj.setNow&&typeof(s.pObj.setNow)=='function'?'<span class="span4a" onclick="'+s.pObj.ClientID+'.setNow();'+s.pObj.ClientID+'.objectM.fnClose();">[ 至今 ]</span>&nbsp;&nbsp;':'')+'<span class="span4a" onclick="'+s.pObj.ClientID+'.objectM.fnClearValue()">[ 清空 ]</span>&nbsp;&nbsp;<span class="span4a" onclick="'+s.pObj.ClientID+'.objectM.fnClose()">[ 关闭 ]</span></div>';
					str += '<div class="bottom"><span class="span4a" onclick="' + s.pObj.ClientID + '.objectM.fnClearValue()">[ 清空 ]</span>&nbsp;&nbsp;<span class="span4a" onclick="' + s.pObj.ClientID + '.objectM.fnClose()">[ 关闭 ]</span></div>';
					return str;
				}
				if(!s.flagDiv){
					var p = s.input.form||null;
					s.div = MYRESUME.util.Dom.createDiv(p,s.ClientID+'_div','zp_mr_dateDiv_m');
					if(s.div){
						MYRESUME.EventUtils.addEvent(s.div,'click',s.C);
						s.div.innerHTML = divHTML(s);
						s.divC = document.getElementById(s.ClientID+'_content');
						s.divL = document.getElementById(s.ClientID+'_loading');
						s.divD = document.getElementById(s.ClientID+'_dataContainer');
						s.flagDiv = true;
					}
				}
			};
			s.buildDataDiv = function(){
				function dataHTML(s){
					var col = 4,colIndex,i;
					var tWidth = parseInt(100/col)+'%';
					var str = '<table cellspacing="1" cellpadding="0" border="0">';
					for(i=0;s.data[i];i++){
						colIndex = i%col;
						if (i > 0 && colIndex == 0) str += '<tr><td colspan="' + col + '" class="line"></td></tr>';
						if(colIndex==0) str += '<tr>';
						str += '<td width="'+tWidth+'"'+(s.nowVal==s.data[i]?' class="selected"':'')+' id="'+s.ClientID+'_'+s.data[i]+'" onclick="'+s.pObj.ClientID+'.objectM.fnPassValue(\''+s.data[i]+'\')" onmouseover="this.className+=\' focus\'" onmouseout="this.className=this.className.replace(\'focus\',\'\')">'+s.data[i]+'月</td>';
						if(colIndex==col-1) str += '</tr>';
					}
					str += '</table>';
					return str;
				};
				if(!s.divD) s.buildDiv();
				if(s.divD) s.divD.innerHTML = dataHTML(s);
			}
			s.setLoading = function(action){
				if(action){ s.divL.style.display = ''; s.divD.style.display = 'none'; } else{ s.divL.style.display = 'none'; s.divD.style.display = ''; }
			};
			s.fnClearValue = function(){ s.input.value = ''; hideCurrentPopup(); };
			s.fnClose = function(){ hideCurrentPopup(); };
			s.fnFocus = function(e){
				if(!s.flagDiv) s.buildDiv();
				if(s.flagDiv){
					var v = MYRESUME.util.Dom.getCurrentStyle(s.div,'visibility');
					if(v=='hidden'){
						s.setLoading(true);
						showPopup(s.div.id,e,MYRESUME.util.Dom.getXY(s.input).x,MYRESUME.util.Dom.getXY(s.input).y+22);
						
						if(s.nowVal!=s.input.value) s.nowVal = s.input.value;
						
						s.data = s.dataAll;
						if(s.pObj.sibling_e&&s.input.value==''&&s.pObj.sibling_e.objectM.input.value!=''&&s.pObj.sibling_e.objectY.input.value!=''&&s.pObj.sibling_e.objectY.input.value==s.pObj.objectY.input.value){
							var compareVal = s.pObj.sibling_e.objectM.input.value;
							if(!isNaN(compareVal)&&parseInt(compareVal)<=s.dataAll[s.dataAll.length-1]&&parseInt(compareVal)>=s.dataAll[0]) 
							s.fixData(null,parseInt(compareVal));
						}
						if(s.pObj.sibling_s&&s.input.value==''&&s.pObj.sibling_s.objectM.input.value!=''&&s.pObj.sibling_s.objectY.input.value!=''&&s.pObj.sibling_s.objectY.input.value==s.pObj.objectY.input.value){
							var compareVal = s.pObj.sibling_s.objectM.input.value;
							if(!isNaN(compareVal)&&parseInt(compareVal)<=s.dataAll[s.dataAll.length-1]&&parseInt(compareVal)>=s.dataAll[0]) 
							s.fixData(parseInt(compareVal),null);
						}
						
						s.buildDataDiv();
						s.setLoading(false);
						if(s.div.shim) s.div.shim.setStyle('visibility','visible');
					}
				}
			};
			s.fnPassValue = function(v){
				var flagGoTo = false;
				if(s.pObj.sibling_e&&s.pObj.sibling_e.objectY.input.value=='') flagGoTo = true;
				s.nowVal = v;
				s.input.value = v;
				hideCurrentPopup();
				if(flagGoTo)
					try{s.pObj.sibling_e.objectY.input.focus();}
					catch(e){}
			};
			s.FnF = function(e){s.fnFocus(e);};
			MYRESUME.EventUtils.addEvent(s.input,'focus',s.FnF);
		}
	};
	s.setNow = function(){
		s.objectY.input.value = '';
		s.objectM.input.value = '';
		if(window[s.objectY.input.name]&&window[s.objectY.input.name]['fnValidate']&&typeof(window[s.objectY.input.name]['fnValidate'])=='function') window[s.objectY.input.name]['fnValidate']();
		if(window[s.objectM.input.name]&&window[s.objectM.input.name]['fnValidate']&&typeof(window[s.objectM.input.name]['fnValidate'])=='function') window[s.objectM.input.name]['fnValidate']();
		
		if(!s.conYearMonth) s.conYearMonth = s.objectY.input.parentNode;
		if(s.conYearMonth.nodeType==1){
			try{
				if(!s.conNow){
					var mySpan = document.createElement('span');
					if(s.conYearMonth.parentNode.tagName.toLowerCase()!='html') s.conYearMonth.parentNode.insertBefore(mySpan,s.conYearMonth);
					else document.body.appendChild(mySpan);
					s.conNow = mySpan;
					s.conNow.innerHTML = '<a href="javascript:' + s.ClientID + '.switchNow(0)" class="blue12line" title="修改' + s.title + (s.type == 'start' ? '开始' : '结束') + '时间，点击选择具体年月">' + (s.language && s.language == 'en' ? 'Now' : '现在') + '</a><a href="javascript:' + s.ClientID + '.switchNow(0)" class="blue12line" style="text-decoration:none;" title="修改' + s.title + (s.type == 'start' ? '开始' : '结束') + '时间，点击选择具体年月"> [ <img src="../web-assets/resume/images/note.gif"> ]</a>';
				}
				if(s.conYearMonth&&s.conNow) s.switchNow(1);
			}
			catch(e){}
		}
	};
	s.switchNow = function(flag){
		if(s.conYearMonth&&s.conNow){
			s.conYearMonth.style.display = flag?'none':'';
			s.conNow.style.display = flag?'':'none';
			if(!flag) s.objectY.input.focus();
		}
	};
	s.objectY = new s.year(s);
	s.objectM = new s.month(s);
}