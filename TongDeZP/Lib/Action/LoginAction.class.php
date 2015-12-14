<?php
    class LoginAction extends Action{
        public function showRegister(){
            $this->display('html/register');
        }
        public function emailCheck(){
            $email = isset($_REQUEST['email'])?$_REQUEST['email']:'';
            $count = M('user')->where("email='$email'")->count();
            exit($count);
        }
        public function register(){
            $email = $_POST['regEmail'];
            $pwd = $_POST['pwd'];
            $name = $_POST['name'];
            $gender = $_POST['gender'];
            $password = md5('Aa1@_'.$pwd);
            $where['email'] = $email;
            $where['password'] = $password;
            $where['last_login_time'] = time(); 
            $where['last_login_ip'] = $_SERVER['REMOTE_ADDR'];
            $where['user_id'] = M('user')->add($where);
            $_SESSION['user'] = M('user')->where($where)->find();
            $_SESSION['user']['name'] = $name;
            unset($where['password']);
            $where['gender'] = $gender;
            $where['name'] = $name;
            M('personal_information')->add($where);
            redirect('../ResumeManage');
        }
        public function login(){
            $username = $_POST['username'];
            $pwd = $_POST['pwd'];
            $pwd = md5('Aa1@_'.$pwd);
            $where['email'] = $username;
            $where['password'] = $pwd;
            $user = M('user')->where($where)->find();
            if(is_null($user)){
                exit('0');
            }else{
                $ip = $_SERVER['REMOTE_ADDR'];
                $loginTime = time();
                M('user')->where($where)->setField(array('last_login_ip'=>$ip,'last_login_time'=>$loginTime));
                M('user')->where($where)->setInc('total_login');
                $user = M('user')->where($where)->find();
                $name = M('personal_information')->where('user_id='.$user['id'])->getField('name');
                $_SESSION['user'] = $user;
                $_SESSION['user']['name'] = $name;
                exit('1');
            }
        }
        public function loginout(){
            session_destroy();
            redirect('../../index.php');
        }
        public function resetPwd(){
            $this->display('html/resetPwd');
        }
        public function findPwd(){
            $this->em = $_REQUEST['em'];
            $this->display('html/findPwd');
        }
        public function sendEmail(){
            $em = isset($_REQUEST['em'])?$_REQUEST['em']:'';
            $count = M('user')->where('email="'.$em.'"')->count();
            if($count==0){
                exit('notexist');
            }else{
                $href = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['SCRIPT_NAME'].'/Login/findPwd?em='.$em;
                $result = D('Common')->think_send_mail($em,$em,'重置密码确认邮件',
                    '您正在找回同德医院招聘系统的密码，如不是本人的操作请忽略，点击下面链接找回密码<br/>'.
                    '<a href="'.$href.'"  style="display:block;corsur:pointer;text-decoration:underline;color:blue;" target="_blank">'.$href.'</a>');
                exit('-1');
            }
        }
        public function changePwd(){
            $id = $_SESSION['user']['id'];
            $where['id']=$id;
            $prePwd = isset($_POST['prePwd'])?$_POST['prePwd']:'';
            $newPwd = isset($_POST['newPwd'])?$_POST['newPwd']:'';
            $where['password'] = md5('Aa1@_'.$prePwd);
            $count = M('user')->where($where)->count();
            if($count){
                M('user')->where('id='.$id)->setField('password',md5('Aa1@_'.$newPwd));
                exit('1');
            }else{
                exit('-1');
            }
        }
        public function findPwdByEmail(){
            $pwd = isset($_POST['pwd'])?$_POST['pwd']:'';
            $em = isset($_POST['em'])?$_POST['em']:'';
            M('user')->where('email="'.$em.'"')->setField('password',md5('Aa1@_'.$pwd));
            $user = M('user')->where('email="'.$em.'"')->find();
            $_SESSION['user'] = $user;
        }
    }