/**
 * 
 */

function loadSelect($container,data){
	for(var i=0;i<data.length;i++){
		$('<option value="'+data[i]['id']+'">'+data[i]['text']+'</option>').appendTo($container);
	}
}
/**
 * 载入发布的招聘信息
 */
var positions = new Array();
function loadRecruit(){
	$.ajax({
		async:false,
		url:'../../index.php/Recruit/getRecruit',
		dataType:'json',
		success:function(data){
			positions = data['data']; 
		}
	})
	if(positions){
		$('<option value="0">请选择</option>').appendTo($('#depart'));
		for(var i=0;i<positions.length;i++){
			var flag = 0;
			var options = $('#depart option');
			for(var j=0;j<options.length;j++){
				if(options.eq(j).val()==positions[i]['depart_code']){
					flag = 1;
					continue;
				}
			}
			if(!flag){
				$('<option value="'+positions[i]['depart_code']+'">'+positions[i]['depart_code']+'</option>').appendTo($('#depart'));
			}
		}
		$('#depart').change();
	}
}
$('#depart').change(function(){
	$('#rmajor').html('');
	$('<option value="0">请选择</option>').appendTo($('#rmajor'));
	if($(this).val()==0){
		$('#depart_code').val('');
		$('#major').val('');
	}else{
		for(var i=0;i<positions.length;i++){
			if(positions[i]['depart_code']==$(this).val()){
				$('#depart_code').val(positions[i]['position']);
			}
		}
	}
});
/**
 * 载入已经保存的教育经历
 */
	function loadEdu(){
		$.ajax({
			url:'../../index.php/Education/getEducation',
			dateType:'json',
			success:function(data){
				if(data && data!='null'){
					data = eval(data);
					dataArr['einfo'] = data;
					for(var i=0;i<data.length;i++){
						$('<tr><td>['+data[i]['start_time']+'-'+data[i]['end_time']+']'+'['+
								data[i]['education']+']['+data[i]['school']+']['+data[i]['major']+']</td>'+
								'<td class="w4"><a class="cursor" onclick="'+'edit(\'' + 'einfo' + '\','+i+',this);">编辑</a></td>'+
								'<td class="w4"><a class="cursor" onclick="'+'del(\'' + 'edu' + '\','+data[i]['id']+',this);">删除</a></td>'+
								'</tr>').appendTo($('#edu'));
					}
				}	
			},error:function(){
				alert('加载数据失败，请刷新页面重试！');
			}
		})
	}
	/**
	 * 载入已经保存的工作经历
	 */
		function loadJob(){
			$.ajax({
				url:'../../index.php/Job/getJob',
				dateType:'json',
				success:function(data){
					if(data && data!='null'){
						data = eval(data);
						dataArr['jinfo'] = data;
						for(var i=0;i<data.length;i++){
							$('<tr><td>['+data[i]['start_time']+'-'+data[i]['end_time']+']['+
									data[i]['unitname']+']['+data[i]['workon']+']['+data[i]['job']+']</td>'+
									'<td class="w4"><a class="cursor" onclick="'+'edit(\'' + 'jinfo' + '\','+i+',this);">编辑</a></td>'+
									'<td class="w4"><a class="cursor" onclick="'+'del(\'' + 'job' + '\','+data[i]['id']+',this);">删除</a></td>'+
									'</tr>').appendTo($('#job'));
						}
					}
						
				},error:function(){
					alert('加载数据失败，请刷新页面重试！');
				}
			})
		}	
		/**
		 * 载入已经保存的实习经历
		 */
function loadPractice(){
	$.ajax({
		url:'../../index.php/Practice/getPractice',
		dateType:'json',
		success:function(data){
			if(data && data!='null'){
				data = eval(data);
				dataArr['iinfo'] = data;
				for(var i=0;i<data.length;i++){
				$('<tr><td>['+data[i]['start_time']+'-'+data[i]['end_time']+']['+
					data[i]['practice_unit']+']['+data[i]['practice_position']+']</td>'+
					'<td class="w4"><a class="cursor" onclick="'+'edit(\'' + 'iinfo' + '\','+i+',this);">编辑</a></td>'+
					'<td class="w4"><a class="cursor" onclick="'+'del(\'' + 'practice' + '\','+data[i]['id']+',this);">删除</a></td>'+
					'</tr>').appendTo($('#practice'));
				}
			}
		},error:function(){
			alert('加载数据失败，请刷新页面重试！');
		}
	})
}
/**
 * 载入已经保存的实习经历
*/
function loadPartTimeJob(){
	$.ajax({
		url:'../../index.php/PartTimeJob/getPartTimeJob',
		dateType:'json',
		success:function(data){
			if(data && data!='null'){
				data = eval(data);
				dataArr['plinfo'] = data;
				for(var i=0;i<data.length;i++){
					curData = data[i];
					$('<tr><td>['+data[i]['start_time']+'-'+data[i]['end_time']+']['+
						data[i]['unitname']+']['+data[i]['position']+']</td>'+
						'<td class="w4"><a class="cursor" onclick="'+'edit(\'' + 'plinfo' + '\','+i+',this);">编辑</a></td>'+
						'<td class="w4"><a class="cursor" onclick="'+'del(\'' + 'parttime_job' + '\','+data[i]['id']+',this);">删除</a></td>'+
						'</tr>').appendTo($('#parttime_job'));
				}
			}
		},error:function(){
			alert('加载数据失败，请刷新页面重试！');
		}
	})
}
/**
 * 载入已经保存的语言能力
*/
function loadLanguage(){
	$.ajax({
		url:'../../index.php/Language/getLanguage',
		dateType:'json',
		success:function(data){
			if(data && data!='null'){
				data = eval(data);
				dataArr['linfo'] = data;
				for(var i=0;i<data.length;i++){
					$('<tr><td>['+data[i]['language']+']&nbsp;读写能力&nbsp;['+
							data[i]['read_write']+']&nbsp;听说能力&nbsp;['+data[i]['spoken']+']</td>'+
						'<td class="w4"><a class="cursor" onclick="'+'edit(\'' + 'linfo' + '\','+i+',this);">编辑</a></td>'+
						'<td class="w4"><a class="cursor" onclick="'+'del(\'' + 'language' + '\','+data[i]['id']+',this);">删除</a></td>'+
						'</tr>').appendTo($('#language'));
				}
			}
		},error:function(){
			alert('加载数据失败，请刷新页面重试！');
		}
	})
}
/**
 * 载入已经保存的证书
*/
function loadCertificate(){
	$.ajax({
		url:'../../index.php/Certificate/getCertificate',
		dateType:'json',
		success:function(data){
			if(data && data!='null'){
				data = eval(data);
				dataArr['cinfo'] = data;
				for(var i=0;i<data.length;i++){
					$('<tr><td>证书类型&nbsp;['+data[i]['cetype']+']&nbsp;证书名称&nbsp;['+
							data[i]['cename']+']</td>'+
						'<td class="w4"><a class="cursor" onclick="'+'edit(\'' + 'cinfo' + '\','+i+',this);">编辑</a></td>'+
						'<td class="w4"><a class="cursor" onclick="'+'del(\'' + 'certificate' + '\','+data[i]['id']+',this);">删除</a></td>'+
						'</tr>').appendTo($('#certificate'));
				}
			}
		},error:function(){
			alert('加载数据失败，请刷新页面重试！');
		}
	})
}
/**
 * 载入已经保存的论文
*/
function loadPaper(){
	$.ajax({
		url:'../../index.php/Paper/getPaper',
		dateType:'json',
		success:function(data){
			if(data && data!='null'){
				data = eval(data);
				dataArr['pinfo'] = data;
				for(var i=0;i<data.length;i++){
					$('<tr><td>论文题目&nbsp;['+data[i]['paper_title']+']&nbsp;发表刊物&nbsp;['+
							data[i]['journal']+']&nbsp;发表时间&nbsp;['+data[i]['public_date']+']</td>'+
							'<td class="w4"><a class="cursor" onclick="'+'edit(\'' + 'pinfo' + '\','+i+',this);">编辑</a></td>'+
						'<td class="w4"><a class="cursor" onclick="'+'del(\'' + 'paper' + '\','+data[i]['id']+',this);">删除</a></td>'+
						'</tr>').appendTo($('#paper'));
				}
			}
		},error:function(){
			alert('加载数据失败，请刷新页面重试！');
		}
	})
}
/**
 * 载入已经保存的获奖信息
*/
var dataArr = new Array();
function loadRewards(){
	$.ajax({
		url:'../../index.php/Rewards/getRewards',
		dateType:'json',
		success:function(data){
			if(data && data!='null'){
				data = eval(data);
				dataArr['rinfo'] = data;
				for(var i=0;i<data.length;i++){
					$('<tr><td>奖励名称&nbsp;['+data[i]['rewards_name']+']&nbsp;授奖单位&nbsp;['+
							data[i]['rewards_unit']+']&nbsp;获奖日期&nbsp;['+data[i]['rewards_date']+']</td>'+
						'<td class="w4"><a class="cursor" onclick="'+'edit(\'' + 'rinfo' + '\','+i+',this);">编辑</a></td>'+
						'<td class="w4"><a class="cursor" onclick="'+'del(\'' + 'rewards' + '\','+data[i]['id']+',this);">删除</a></td>'+
						'</tr>').appendTo($('#rewards'));
				}
			}
		},error:function(){
			alert('加载数据失败，请刷新页面重试！');
		}
	})
}
function loadAccessory(){
	$.ajax({
		url:'../../index.php/Accessory/getAccessory',
		dateType:'json',
		success:function(data){
			if(data && data!='null'){
				data = eval(data);
				dataArr['acinfo'] = data;
				for(var i=0;i<data.length;i++){
					$('<tr><td>附件名称&nbsp;['+data[i]['name']+']&nbsp;附件描述&nbsp;['+
							data[i]['description']+']&nbsp;</td>'+
						'<td class="w4"><a class="cursor" onclick="'+'del(\'' + 'accessory' + '\','+data[i]['id']+',this);">删除</a></td>'+
						'</tr>').appendTo($('#accessory'));
				}
			}
		},error:function(){
			alert('加载数据失败，请刷新页面重试！');
		}
	})
}
function loadTask(){
	$.ajax({
		url:'../../index.php/Task/getTask',
		dateType:'json',
		success:function(data){
			if(data && data!='null'){
				data = eval(data);
				dataArr['tinfo'] = data;
				for(var i=0;i<data.length;i++){
					$('<tr><td>项目名称&nbsp;['+data[i]['task_name']+']&nbsp;立项机构&nbsp;['+
							data[i]['org']+']&nbsp;立项日期&nbsp;['+
							data[i]['pro_date']+']&nbsp;</td>'+
						'<td class="w4"><a class="cursor" onclick="'+'edit(\'' + 'tinfo' + '\','+i+',this);">编辑</a></td>'+
						'<td class="w4"><a class="cursor" onclick="'+'del(\'' + 'task' + '\','+data[i]['id']+',this);">删除</a></td>'+
						'</tr>').appendTo($('#task'));
				}
			}
		},error:function(){
			alert('加载数据失败，请刷新页面重试！');
		}
	})
}
/**
 * 删除已经保存的某条信息
 * @param tableId  保存信息的表格Id  如教育信息 edu1;
 * @param dataId
 */
	function del(tableId,dataId,e){
		if($('#submited').length==1){
			alert('删除失败，简历已经提交，不能修改！');
			return false;
		}
		if (confirm("确定删除此记录？")) {
			var url;
			switch(tableId){
				case 'edu':url='../../index.php/Education/delEducation';break;
				case 'job':url='../../index.php/Job/delJob';break;
				case 'practice':url='../../index.php/Practice/delPractice';break;
				case 'parttime_job':url='../../index.php/PartTimeJob/delPartTimeJob';break;
				case 'language':url='../../index.php/Language/delLanguage';break;
				case 'certificate':url='../../index.php/Certificate/delCertificate';break;
				case 'paper':url='../../index.php/Paper/delPaper';break;
				case 'rewards':url='../../index.php/Rewards/delRewards';break;
				case 'accessory':url='../../index.php/Accessory/delAccessory';break;
				case 'task':url='../../index.php/Task/delTask';break;
			}
			$(e).parent().parent().remove();
			$.ajax({
				data:{id:dataId},
				url:url,
				success:function(){
					alert('操作成功');
				}
			})
		}	
	}
	/**
	 * 编辑已经保存的某条信息
	 * @param tableId  保存信息的表格Id  如教育信息 edu1;
	 */
	function edit(tableId,dataId,e){
		var url;
		var editData = new Array();
		editData = dataArr[tableId][dataId];
		$tr = $(e).parent().parent().css('background','rgb(235,236,237)');
		$tr.siblings().css('background','#FFD')
		$tr.parent().parent().next().attr('edit',editData['id']);//.next().find('input').val('保存并新增');
		$("table[id=" + tableId + "] input[type='text']").each(function() {
			var name = $(this).attr('name');
			if(name.indexOf('_y')>=0){
				yname = name.replace('_y','_date');
				if(editData[yname]){
					$(this).val(editData[yname].substring(0,4));
				}
			}
			if(name.indexOf('_m')>=0){
				yname = name.replace('_m','_date');
				if(editData[yname]){
					$(this).val(editData[yname].substring(4,6));
				}
			}
			if(name.indexOf('sdate_y')>=0){
				if(editData['start_time']){
					$(this).val(editData['start_time'].substring(0,4));
				}
			}
			if(name.indexOf('sdate_m')>=0){
				if(editData['start_time']){
					$(this).val(editData['start_time'].substring(4,6));
				}
			}
			if(name.indexOf('edate_y')>=0){
				if(editData['start_time']){
					$(this).val(editData['end_time'].substring(0,4));
				}
			}
			if(name.indexOf('edate_m')>=0){
				if(editData['start_time']){
					$(this).val(editData['end_time'].substring(4,6));
				}
			}
			var dval = editData[name];
			if(dval){
				$(this).val(dval);
			}
		})
		$("table[id=" + tableId + "] select").each(function() { 
			var name = $(this).attr('name');
			var dval = editData[name];
			if(dval){
				for(var i=0;i<$(this).get(0).options.length;i++){
					if($(this)[0].options[i].innerHTML==dval){
						$(this).val($(this)[0].options[i].value);
					}
				}
				if($(this).attr('name')=='jobtitle'){
					$(this).val(dval);
				}
			}
    	})
    	if(tableId=='tinfo'){
    		$('#pro_date').val(dataArr[tableId][dataId]['pro_date']);
    	}
	}