<?php
    class TestManageAction extends Action{
        public function index(){
            $where['user_id'] = $_SESSION['user']['id'];
            $personalInfo = D('PersonalInfo')->getPersonalInfo();
            $major = M('zhaopin')->where('id='.$personalInfo['zhaopin_id'])->getField('major');
            $admission = M('admission')->where($where)->find();
            $examRoom = M('exam_room')->where('id='.$admission['room_id'])->find();
            $examRoom['exam_time'] = date('Y年n月j日 H:m:s',strtotime($examRoom['exam_time']));
            $this->assign('examRoom',$examRoom)->assign('admission',$admission)
                ->assign('personalInfo',$personalInfo)->assign('major',$major)->assign('selected',2);
            if(is_null($_SESSION['user'])){
                redirect('../index.php');
            }else{
                $this->display('html/test_manage');
            }
        }
    }