<?php
    class AdminAction extends Action{
        public function index(){
            $this->display();
        }
        public function login(){
            $username = addslashes($_POST['username']);
            $pwd = addslashes($_POST['pwd']);
            if(!$username || !$pwd){
                $this->ajaxReturn('','非法登陆',0);
            }
            $pwd = md5('Aa1@_'.$pwd);
            $where['username'] = $username;
            $where['pwd'] = $pwd;
            $user = M('admin')->where($where)->find();
            if(is_null($user)){
                $this->error='用户名或者密码错误';
                $this->display('admin/index'); 
                //$this->ajaxReturn('','用户名或密码错误',0);;
            }else{
                $ip = $_SERVER['REMOTE_ADDR'];
                $loginTime = time();
                M('admin')->where($where)->setField(array('last_login_ip'=>$ip,'last_login_time'=>$loginTime));
                $user = M('admin')->where($where)->find();
                $_SESSION['admin'] = $user;
                redirect('home');
                //$this->ajaxReturn('','',1);
            }
        }
        public function loginout(){
            session_destroy();
            redirect('../../index.php');
        }
        public function modifyPwd(){
            $pwd1 = isset($_POST['pwd1'])?$_POST['pwd1']:'';
            $pwd = isset($_POST['pwd'])?$_POST['pwd']:'';
            $where['id'] = $_SESSION['admin']['id'];
            if(md5('Aa1@_'.$pwd1)!=$_SESSION['admin']['pwd']){
                exit('pwdError');
            }else{
                M('admin')->where($where)->setField('pwd',md5('Aa1@_'.$pwd));
                exit('1');
            }
        }
        public function changePwd(){
            $this->display('admin/change_pwd');
        }
        public function home(){
            checkLogin();
            $this->display('admin/home');
        }  
        public function resumeManage(){
            checkLogin();
            $this->display('admin/resume_manage');
        }
        public function recruitManage(){
            checkLogin();
            $this->display('admin/recruit_manage');
        }   
        public function addRecruit(){
            checkLogin();
            $id = isset($_REQUEST['id'])?$_REQUEST['id']:'';
            if(!empty($id)){
                $recruit = M('zhaopin')->where('id='.$id)->find();
                $this->recruit = $recruit;
            }
            $this->display('admin/add_recruit');
        }
        public function testManage(){
            checkLogin();
            $this->display('admin/test_manage');
        }
        public function addExamUser(){
            checkLogin();
            $roomId = isset($_REQUEST['roomId'])?$_REQUEST['roomId']:'';
            $this->roomId = $roomId;
            $this->display('admin/add_examUser');
        }
        public function notice(){
            checkLogin();
            $this->display('admin/commond');
        }
        public function addNotice(){
            $id = isset($_REQUEST['id'])?$_REQUEST['id']:'';
            if(!empty($id)){
                $notice = M('notice')->where('id='.$id)->find();
                $this->notice = $notice;
            }
            $this->display('admin/add_notice');
        }
        public function delNotice(){
            $id = isset($_REQUEST['id'])?$_REQUEST['id']:'';
            if(!empty($id)){
                $notice = M('notice')->delete($id);
            }
        }
    }