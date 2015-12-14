/**
 * 
 */
if(typeof(window['mzpModuleIns'])=='undefined'||!window['mzpModuleIns']) window['mzpModuleIns']=[];
function initMZPModule(){
	var e=/<[^>]+\smzpmodule=[\'\"]?([\w|]+)[^>]+/g;
	var g=/id=[\'\"]?([\w\-]+)/i;
	var i,j;
	window.document.body.innerHTML.replace(e,function(a,b){if((i=a.match(g))&&(j=document.getElementById(i[1]))){if(window[b]){var x,y,z,js,preFnStr,preFn;
	if(b=='LogAjaxBlockFac'||b=='ResumeAjaxBlockFac'){
		if(typeof(window['mzpLogBlockModIns'])=='undefined'||!window['mzpLogBlockModIns']) window['mzpLogBlockModIns'] = [];
		if(window['submitCallback'] && typeof(window['submitCallback'])=='function') window['mzpModuleIns'][i[1]] = new window[b](j);
		else{y=i[1];z=j;$loadJs('/js/new_v3/ajaxbase.js','utf-8',function(){window['mzpModuleIns'][y] = new window[b](z);})}
	}
	else if(b=='resumeChEnFac'){
		if(!window['popupDivChEnTips']) try{window['popupDivChEnTips'] = createPopupDiv4ChEnTips();}catch(e){}; 
		window['mzpModuleIns'][i[1]] = new window[b](j);
	}
	else if(b=='workExpYearFac'){
		if(!window['popupDivWorkYear']) try{window['popupDivWorkYear'] = createPopupDiv4WorkYear();}catch(e){}; 
		window['mzpModuleIns'][i[1]] = new window[b](j);
	}
	else if(b=='resumeViewNumFac'){
		//if(window['submitCallback'] && typeof(window['submitCallback'])=='function') window['mzpModuleIns'][i[1]] = new window[b](j); else{y=i[1];z=j;$loadJs('/js/new_v3/ajaxbase.js','utf-8',function(){window['mzpModuleIns'][y] = new window[b](z);})}
	}
	else{
		y=i[1];z=j;js=j.getAttribute("modjs")||null;preFnStr=j.getAttribute("modprefn")||null;
		function mainFn(){if(preFn&&typeof(preFn)=="function"){if(!window[b].flagPreFn){window[b].flagPreFn=true;preFn(z);}}window['mzpModuleIns'][y]=new window[b](z);}
		if(preFnStr){try{if(preFnStr.indexOf(".")>0){var preFnChain=preFnStr.split(".");var index4f=0;preFn=window[preFnChain[index4f++]]||window;for(;index4f<preFnChain.length;index4f++){preFn=preFn[preFnChain[index4f]];if(!preFn) break;}}else preFn=window[preFnStr];}catch(e){};}
		if(js){var jsData=js.split("|"),jsFile=jsData[0],jsFlag=jsData[1];if(window[jsFlag]) mainFn();else{$loadJs(jsFile,'utf-8',mainFn);}}
		else mainFn();
	}
}}return '';});}
$regEventDomReady(initMZPModule);
function cancelBubble(e){var myEve = e?e:event;if(myEve.stopPropagation) myEve.stopPropagation();else myEve.cancelBubble=true;}
function $loadJs(a,b,c){var d=arguments.callee;var e=d.queue||(d.queue={});b=b||(((window.document.charset?window.document.charset:window.document.characterSet)||"").match(/^(gb2312|big5|utf-8)$/gi)||"utf-8").toString().toLowerCase();if(a in e){if(c){if(e[a]) e[a].push(c);else c();}return;}e[a]=c?[c]:[];var f=window.document.createElement("script");f.type="text/javascript";f.charset=b;f.onload=f.onreadystatechange=function(){if(f.readyState&&f.readyState!="loaded"&&f.readyState!="complete") return;f.onreadystatechange=f.onload=null;	while(e[a].length) e[a].shift()();e[a]=null};f.src=a;window.document.getElementsByTagName("head")[0].appendChild(f)};
function $regEventDomReady(fn){var callFn=arguments.callee;if(!callFn['domReadyUtil']){var userAgent=navigator.userAgent.toLowerCase();callFn['domReadyUtil']={browser:{version:(userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1],safari:/webkit/.test(userAgent),opera:/opera/.test(userAgent),msie:/msie/.test(userAgent)&&!/opera/.test(userAgent),mozilla:/mozilla/.test(userAgent)&&!/(compatible|webkit)/.test(userAgent)},readyList:[],each:function(object,callback,args){var name,i=0,length=object.length;if(args){if(length==undefined){for(name in object)if(callback.apply(object[name],args)===false)break}else for(;i<length;)if(callback.apply(object[i++],args)===false)break}else{if(length==undefined){for(name in object)if(callback.call(object[name],name,object[name])===false)break}else for(var value=object[0];i<length&&callback.call(value,i,value)!==false;value=object[++i]){}}return object},ready:function(){var dom=callFn['domReadyUtil'];if(!dom.isReady){dom.isReady=true;if(dom.readyList){dom.each(dom.readyList,function(){this.call(document)});dom.readyList=null}}}}}var domReadyUtil=callFn['domReadyUtil'];(function(){if(callFn['readyBound'])return;callFn['readyBound']=true;if(document.addEventListener&&!domReadyUtil.browser.opera)document.addEventListener("DOMContentLoaded",domReadyUtil.ready,false);if(domReadyUtil.browser.msie&&window==top)(function(){if(domReadyUtil.isReady)return;try{document.documentElement.doScroll("left")}catch(error){setTimeout(arguments.callee,0);return}domReadyUtil.ready()})();if(domReadyUtil.browser.opera)document.addEventListener("DOMContentLoaded",function(){if(domReadyUtil.isReady)return;for(var i=0;i<document.styleSheets.length;i++)if(document.styleSheets[i].disabled){setTimeout(arguments.callee,0);return}domReadyUtil.ready()},false);myAttachEvent(window,"load",domReadyUtil.ready)})();if(domReadyUtil.isReady)fn.call(document,domReadyUtil);else domReadyUtil.readyList.push(function(){return fn.call(this,domReadyUtil)});return this};
function myAttachEvent(d,e,f){try{if(d.attachEvent) d.attachEvent("on"+e,f);else if(d.addEventListener) d.addEventListener(e,f,false);else{var oldF = eval('d.on'+e);if(typeof oldF!='function') eval('d.on'+e+'=f');else eval('d.on'+e)=function(){oldF();f();}}}catch (error){}};
function myDetachEvent(d,e,f){try{if(d.detachEvent) d.detachEvent("on"+e,f);else if(d.removeEventListener) d.removeEventListener(e,f,false);}catch(error){}};
String.prototype.fixLength=function(){return this.replace(/[^\x00-\xff]/g,"aa").length;}
String.prototype.fixByLen=function(l){if(this.fixLength()<=l) return this;var fixedStr='';var c,i,n=0;for(i=0;i<this.length;i++){if(n<l){c=this.charAt(i);if(/[^\x00-\xff]/.test(c)) n+=2;else n+=1;fixedStr+=c;}else break;}return fixedStr+'...';}
function $getDocWH(){var d={w:0,h:0};if(window.innerHeight&&window.scrollMaxY) d.h=window.innerHeight+window.scrollMaxY;else if(document.body.scrollHeight>document.body.offsetHeight) d.h=document.body.scrollHeight;else d.h=document.body.offsetHeight+document.body.offsetTop;if(window.innerWidth&&window.scrollMaxX) d.w=window.innerWidth+window.scrollMaxX;else if(document.body.scrollWidth>document.body.offsetWidth) d.w=document.body.scrollWidth;else d.w=document.body.offsetWidth+document.body.offsetLeft;return d;}
function $getWinWH(){var pointer={w:0,h:0};if(typeof(window.innerWidth)=='number'){pointer.w=window.innerWidth;pointer.h=window.innerHeight;}else if(document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)){pointer.w=document.documentElement.clientWidth;pointer.h=document.documentElement.clientHeight;}else if(document.body&&(document.body.clientWidth||document.body.clientHeight)){pointer.w = document.body.clientWidth;pointer.h = document.body.clientHeight;}return pointer;}
function $dashify(str){return str.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase();}
function $getCurrentStyle(element,styleProp){var retVal;if(element.currentStyle){retVal=element.currentStyle[styleProp];}else if(document.defaultView&&document.defaultView.getComputedStyle){retVal=document.defaultView.getComputedStyle(element,null).getPropertyValue($dashify(styleProp));}else{retVal=null;}return retVal;}
function $getLocalOffset(offset,direction){var y=offset['offset' + direction];var div;try{div=offset.offsetParent;}catch(ex){return y;}while(div&&$getCurrentStyle(div,'position')=='static'){y+=div['offset'+direction];try{div=div.offsetParent;}catch(ex){return y;}}return y;}
function $getXY(object){var pt=new $Point(0,0);pt.x=$getLocalOffset(object,'Left');pt.y=$getLocalOffset(object,'Top');return pt;}
function $Point(iX,iY){this.x=iX;this.y=iY;}