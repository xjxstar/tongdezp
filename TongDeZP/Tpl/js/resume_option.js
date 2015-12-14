function submitResume(){
		if($('#ps').is(':checked')==false){
			alert('简历填写承诺未勾选');
			return;
		}
		if(confirm('确定提交（提交后不能修改）')){
			$.ajax({
				url:'../Resume/checkResume',
				success:function(data){
					if(data==1){
						alert("简历提交成功,请耐心等待医院人事部门的审核");
						location.reload();
					}else if(data=='noPhoto'){
						alert('简历提交失败，个人照片未上传');
					}else if(data=='noMessage'){
						alert('简历提交失败，个人信息未填写');
					}else if(data=='noEducation'){
						alert('简历提交失败，教育经历未填写');
					}else if(data=='noGraduate'){
						alert('简历提交失败，学位/毕业证书未上传（请检查附件描述中是否写明毕业/学位证书字样）');
					}else if(data=='noPosition'){
						alert('简历提交失败，应聘岗位信息未填写');
					}	
				}
			})
		}
	}
function delSelfImg(){
	if($('#submited').length==1){
		alert('删除失败，简历已经提交，不能修改！');
		return false;
	}
	if(confirm('确定删除')){
		$.ajax({url:'../Resume/delSelfImg',
			success:function(){
				alert('个人照片删除成功');
				location.reload();
			},error:function(){
				alert('服务器异常，请刷新后重试')
			}
		});
	}
}
function ajaxFileUpload() {
	if($('#self_photo').val()==''){
		alert('未选择照片');
		return;
	}
    $.ajaxFileUpload
    (
        {
            url: '../Resume/saveSelfImg', //用于文件上传的服务器端请求地址
            secureuri: false, //是否需要安全协议，一般设置为false
            fileElementId: 'self_photo', //文件上传域的ID
            dataType: 'json', //返回值类型 一般设置为json
            success: function (data, status)  //服务器成功响应处理函数
            {
            	if(data=='-1'){
            		alert('文件格式错误，请检查上传的文件是否为图片')
            	}else if(data=='1'){
            		alert('照片上传成功');
            		location.reload();
            	}
                
            },
            error: function (data, status, e)//服务器响应失败处理函数
            {
                alert(e);
            }
        }
    )
    return false;
}
function ajaxFileUpload2() {
	if($('#submited').length==1){
		alert('上传失败，简历已经提交，不能修改！');
		return false;
	}
	var description = $('#description').val();
	if(description==''){
		alert('请输入附件描述');
		$('#description').focus();
		return;
	}
	if($('#imgFile').val()==''){
		alert('请选择文件');
		return;
	}
    $.ajaxFileUpload
    (
        {
            url: '../Accessory/saveAccessory', //用于文件上传的服务器端请求地址
            secureuri: false, //是否需要安全协议，一般设置为false
            fileElementId: 'imgFile', //文件上传域的ID
            data:{description:description},
            dataType: 'json', //返回值类型 一般设置为json
            success: function (data, status)  //服务器成功响应处理函数
            {
            	alert('附件上传成功');
                location.reload();
            },
            error: function (data, status, e)//服务器响应失败处理函数
            {
                alert(e);
            }
        }
    )
    return false;
}