$(function(){
	$("#aLogin").click(function(){
		$('#u').next().remove();
		$('#p').next().remove();
		$(this).next().remove();
		$('#errorMsg').html('');
		var username = $("#u").val();
		var pwd = $("#p").val();
		var role = $("input[name='role']:checked").val();
		if(username==''){
			$('<span class="error">请输入用户名</span>').insertAfter($("#u"));
			return false;
		}
		if(role=='1' && !csdn.checkEM(username)){
			$('<span class="error">邮箱格式错误</span>').insertAfter($("#u"));
			return false;
		}
		if(pwd==''){
			$('<span class="error">请输入密码</span>').insertAfter($("#p"));
			return false;
		}
		if(role=='1'){
			$.ajax({
				url:'index.php/Login/login',
				type:'post',
				dataType:'json',
				data:{username:username,pwd:pwd},
				success:function(data){
					$('.oerror').remove();
					if(data.status==0){
						$('<span class="oerror">'+data.info+'</span>').appendTo($('#errorMsg'));
					}else{
						location.href = 'index.php/ResumeManage';
					}
				}
			})
		}else if(role=='2'){
			$.ajax({
				url:'index.php/Admin/login',
				type:'post',
				data:{username:username,pwd:pwd},
				success:function(data){
					$('.oerror').remove();
					if(data.status==0){
						$('<span class="oerror">'+data.info+'</span>').appendTo($('#errorMsg'));
						location.href = 'index.php/Admin/home';
					}else{
						location.href = 'index.php/Admin/home';
					}
				}
			})
		}
	});
});
