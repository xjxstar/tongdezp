function saveResume(id,subStatus) {
		if($('#submited').length==1){
			alert('修改失败，简历已经提交，不能修改！');
			return false;
		}
		var submitStatus=true;
    	var paramsStr = '';
    	var native_place = '';
    	$("table[id=" + id + "] input[type='text']").each(function() { 
    		if(!checkNeeded($(this))){
    			submitStatus = false;
    		}
    		$val = $(this).val()==''?'':$(this).val();
    		paramsStr += $(this).attr('name') +':'+$val+','; 
    	}); 
    	
    	$("table[id=" + id + "] select").each(function() { 
    		if(!checkNeeded($(this))){
    			submitStatus = false;
                return;
    		}
    		if($(this).attr('name')=='province'||$(this).attr('name')=='city'||$(this).attr('name')=='country'){
    			$val = $(this).val();
    			native_place = native_place+$val+'|';
    		}else if($(this).attr('name')=='jobtitle'){
    			$val = $(this).val()==0?'':$(this).val();
    			paramsStr += $(this).attr('name') +':'+$val+',';
    		}else{
    			$val = $(this).find('option:selected').text()=='请选择'?'':$(this).find('option:selected').text();
        		paramsStr += $(this).attr('name') +':'+$val+',';
    		}
    	}); 
    	$("table[id=" + id + "] input[type='radio']:checked").each(function() { 
    		if(!checkNeeded($(this))){
    			submitStatus = false;
                return;
    		}
    		paramsStr += $(this).attr('name') +':'+$(this).val()+',';
    	}); 
    	$("table[id=" + id + "] input[type='button'].selectBut2").each(function() { 
    		if(!checkNeeded($(this))){
    			submitStatus = false;
                return;
    		}
    		var $val = $(this).val();
    		if($(this).attr('class') && $(this).attr('class').indexOf('dateButton')>=0){
    			var str = $(this).val();
                if(id=='binfo')workExpShow();
    			ym = str.match(/[0-9]+/g);
    			if(ym){
    				var date = new Date(ym[0]+'/'+ym[1]+'/'+'02');
        			$val = date.getTime()/1000;
    			}
    		}
    		paramsStr += $(this).attr('name') +':'+$val+',';
    	});
    	$("table[id=" + id + "] textarea").each(function() { 
    		if(!checkNeeded($(this))){
    			submitStatus = false;
    		}
    		paramsStr += $(this).attr('name') +':'+$(this).val().trim()+','; 
    	});
        if(id=='binfo'){
            if(!checkCardCode()){
                submitStatus = false;
                return;
            }
            if(!checkPhone()){
                submitStatus = false;
                return;
            }
        }
    	if(!submitStatus){
    		if(id=='binfo'&& $('#brithButton').val()=='选择/修改'){
    			alert('出生日期未填写');
    		}else if(id=='binfo'&& $('#expeButton').val()=='选择/修改'){
    			alert('参加工作年份未填写');
    		}
    		return;
    	}
    	if(id=='binfo'&&!$('input[name="gender"][type="radio"]:checked').val()){
    		alert('性别未填写');
    		return;
    	}
    	/*if(id=='binfo'&&!$('input[name="marital_status"][type="radio"]:checked').val()){
    		alert('婚姻状况未填写');
    		return;
    	}*/
    	if(id=='binfo'&&!$('input[name="current"][type="radio"]:checked').val()){
    		alert('是否应届毕业生未填写');
    		return;
    	}
        if(id=='binfo'){
            var cardNo = $('input[name="card_no"]').val();
            $('input[name="card_no"]').next().empty();
            var flag=false;
            if(cardNo){
                $.ajax({
                    url:'../../index.php/Resume/checkCardNo',
                    data:{cardNo:cardNo},
                    async:false,
                    type:'post',
                    success:function(text){
                        if(text>0){
                            $('<span class="error">身份证号码已注册</span>')
                            .insertAfter($('input[name="card_no"]'));
                            flag = true;
                            return;
                        }
                    },
                    error:function(){

                    }
                })  
            }
            if(flag){
                return;
            }
        }
    	var _status = $('#'+id).attr('edit');
    	var status;
    	if(_status){
    		status = _status;
    	}else{
    		status = '';
    	}
    	if(native_place){
    		paramsStr +='native_place:'+native_place+',';
    	}
    	paramsStr = paramsStr.substr(0,paramsStr.length-1);
    	switch(id){
    		case 'zpinfo':url='../../index.php/Resume/savePosition';break;	
    		case 'binfo':url='../../index.php/Resume/savePersonalInfo';break;
    		case 'einfo':url='../../index.php/Education/saveEducation';break;
    		case 'jinfo':url='../../index.php/Job/saveJob';break;
    		case 'iinfo':url='../../index.php/Practice/savePractice';break;
    		case 'plinfo':url='../../index.php/PartTimeJob/savePartTimeJob';break;
    		case 'linfo':url='../../index.php/Language/saveLanguage';break;
    		case 'cinfo':url='../../index.php/Certificate/saveCertificate';break;
    		case 'pinfo':url='../../index.php/Paper/savePaper';break;
    		case 'rinfo':url='../../index.php/Rewards/saveRewards';break;
            case 'tinfo':url='../../index.php/Task/saveTask';break;
    	}
    	$.ajax({ 
    		url: url,
    		type :"post",
    		data:{params:paramsStr,_status:status},
    		datatype: "json", 
            async:'false',
    		success: function(data) {
    			alert('数据保存成功');
    			$('#'+id).prev().html('');
    			switch (id) {
					case "einfo": loadEdu(); break;
					case "jinfo": loadJob(); break;
					case "iinfo": loadPractice(); break;
					case "plinfo": loadPartTimeJob(); break;
					case "linfo": loadLanguage(); break;
					case "cinfo": loadCertificate(); break;
					case "pinfo": loadPaper(); break;
					case "rinfo": loadRewards(); break; 
                    case "tinfo": loadTask();break;
				}
    			if(id!='binfo'&& id!='zpinfo'){
    				$("table[id=" + id + "] input").each(function() { 
        				$(this).val('');
        			})
    			}
    			$('#'+id).removeAttr('edit').next().find('input').val('保存');
    		},
    		complete :function(){
    			nation_place='';
    		},
    		error: function() { 
    			alert("加载数据失败，请刷新页面重试！"); 
    		} 
    	}); 
        return;
	}
	/**
	 * 检查输入项是否必须
	 */
	function checkNeeded($input){
		var need = $input && $input.parent().prev().html();
		if(need && need.indexOf('*')>=0 && (!$input.val() ||$input.val()=='请选择'||$input.val()=='选择/修改')){
			$input.focus().css('border-color','red');
			return false;
		}else{
			$input.css('border-color','');
			return true;
		}
	}
    function checkCardCode(){
        var cardType = $('#card_type').val();
        var cardNo = $('#card_no').val();
        if(cardType==1){
            var reg = /^(\d{18,18}|\d{15,15}|\d{17,17}x|\d{17,17}X)$/;
            if(!cardNo.match(reg)){
                alert('身份证号码格式错误');
                $('#card_no').css('border-color','red');
                $('#card_no').focus();
                return false;
            }else{
                $('#card_no').css('border-color','');
                return true;
            }
        }else if(cardType==2){
            var reg=/^[a-zA-Z0-9]{7,21}$/;
            if(!cardNo.match(reg)){
                alert('军官证号码格式错误');
                $('#card_no').css('border-color','red');
                $('#card_no').focus();
                return false;
            }else{
                $('#card_no').css('border-color','');
                return true;
            }
        }else if(cardType==3){
            var reg=/^\d{10}$/;
            if(!cardNo.match(reg)){
                alert('台胞证号码格式错误');
                $('#card_no').css('border-color','red');
                $('#card_no').focus();
                return false;
            }else{
                $('#card_no').css('border-color','');
                return true;
            }
        }
    }
    function checkPhone(){
        var phone1 = $('input[name=link1]').val();
        var phone2 = $('input[name=link2]').val();
        var reg = /^([1]\d{10}$)|(\d{3}-\d{8}$|\d{4}-\d{7})$/;
        if(!phone1.match(reg)){
            alert('首选联系方式格式错误');
            $('input[name=link1]').css('border-color','red');
            $('input[name=link1]').focus();
            return false;
        }else{
            $('input[name=link2]').css('border-color','');
            return true;
        }
        if(phone2 && !phone2.match(reg)){
            alert('备用联系方式格式错误');
            $('input[name=link2]').css('border-color','red');
            $('input[name=link2]').focus();
            return false;
        }else{
            $('input[name=link2]').css('border-color','');
            return true;
        }
    }