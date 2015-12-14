<?php
// 本类由系统自动生成，仅供测试用途
class IndexAction extends Action {
    public function index(){
        $this->selected='0';
        if(is_null($_SESSION['user'])){
            $notices = M('notice')->order('public_time desc')->limit(0,7)->select();
            $count = M('notice')->count();
            $this->notices = $notices;
            $this->count = $count;
            $this->display('html/index');
        }else{
            $this->redirect('ResumeManage/index');
        }
    }
    public function adminLogin(){
        $this->display('admin/index');
    }
}