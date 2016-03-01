<?php
    class TestManageAction extends Action{
        public function index(){
            $where['user_id'] = $_SESSION['user']['id'];
            $personalInfo = D('PersonalInfo')->getPersonalInfo();
            $position = M('zhaopin')->where('id='.$personalInfo['zhaopin_id'])->find();
            $admission = M('admission')->where($where)->find();
            $examRoom = M('exam_room')->where('id='.$admission['room_id'])->find();
            $examRoom['exam_starttime'] = date('Y年n月j日 H:i',strtotime($examRoom['exam_starttime']));
            $examRoom['exam_endtime'] = date('H:i',strtotime($examRoom['exam_endtime']));
            $this->assign('examRoom',$examRoom)->assign('admission',$admission)
                ->assign('personalInfo',$personalInfo)->assign('position',$position)->assign('selected',2);
            if(is_null($_SESSION['user'])){
                redirect('../index.php');
            }else{
                $this->display('html/test_manage');
            }
        }
        public function printLog(){

        }
    }