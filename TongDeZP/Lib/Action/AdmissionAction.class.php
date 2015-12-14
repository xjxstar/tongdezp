<?php
    class AdmissionAction extends Action{
        public function getAdmission(){
            $roomId = isset($_REQUEST['room_id'])?$_REQUEST['room_id']:'';
            $pageIndex = isset($_REQUEST['pageIndex'])?$_REQUEST['pageIndex']:'';
            $pageSize = isset($_REQUEST['pageSize'])?$_REQUEST['pageSize']:'';
            $key = isset($_REQUEST['key'])?$_REQUEST['key']:'';
            $data = D('Admission')->getAdmission($pageIndex,$pageSize,$key,$roomId);
            exit(json_encode($data));
        }
        public function addUserAdmission(){
            $roomId = isset($_REQUEST['roomId'])?$_REQUEST['roomId']:'';
            if(empty($roomId)){
                exit('noRoomId');
            }
            $data = isset($_REQUEST['data'])?$_REQUEST['data']:'';
            if(is_null($data)){
                exit('nodata');
            }
            for($i=0;$i<count($data);$i++){
                $data[$i]['room_id'] = $roomId;
            }
            //设置简历状态为已经生成好准考证
            M('personal_information')->where('user_id='.$data[$i]['user_id'])->setField('status',4);
            D('Admission')->addUserAdmission($data);
        }
        public function saveAdmission(){
            $data = isset($_POST['data'])?$_POST['data']:'';
            $data = json_decode($data,true);
            $admissionData = array();
            for($i=0;$i<count($data);$i++){
                $admissionData['classroom'] = $data[$i]['classroom'];
                $admissionData['seat'] = $data[$i]['seat'];
                $admissionData['admission_no'] = '20160100'.$data[$i]['classroom'].$data[$i]['seat'];
                $admissionData['grade'] = $data[$i]['grade'];
                $admissionData['interview_grade'] = $data[$i]['interview_grade'];
                M('admission')->where('user_id='.$data[$i]['user_id'])->save($admissionData);
                //设置简历状态为已经生成好准考证
                //M('personal_information')->where('user_id='.$data[$i]['user_id'])->setField('status',2);
            }
        }
        public function removeExamUser(){
            $rows = $_POST['rows'];
            foreach($rows as $row){
                $userId = $row['user_id'];
                M('admission')->where('user_id='.$userId)->delete();
                M('personal_information')->where('user_id='.$userId)->setField('status',3);
                resumeLog($userId,'ADMISSION_DELETE');
            }
        }
        public function getCurAdmission(){
            $userId = $_SESSION['user']['id'];
            $where['user_id']=$userId;
            $status = M('personal_information')->where($where)->getField('status');
            $remark = M('personal_information')->where($where)->getField('remark');
            $seat = M('admission')->where($where)->getField('seat');
            if(!empty($seat) && $status==4){
                exit('1');
            }else if($status==2){
                $status = statusToString($status,$remark);
                exit($status);
            }else if($status==1){
                exit('简历还未审核');
            }else if($status==3){
                exit('还未分配考场');
            }else if($status==0){
                exit('简历还未提交');
            }else if($status==5){
                $status = statusToString($status,$remark);
                exit($status);
            }else if(empty($seat) && $status==4){
                exit('考场已分配，座位号还未分配');
            }
            /* if($status==0){
                exit('nosubmit');
            }else if(is_null($admission)){
                exit('notest');
            }elseif (empty($admission['seat'])){
                exit('noseat');
            }else{
                
            } */
        }
        public function getGrade(){
            //$userId = $_SESSION['user']['id'];
            $admission = isset($_POST['admission_no'])?$_POST['admission_no']:'';
            $cardNo = isset($_POST['card_no'])?$_POST['card_no']:'';
            $userId = M('personal_information')->where('card_no='.$cardNo)->getField('user_id');
            if($userId==0){
                exit('-1');
            }
            $where['admission_no'] = $admission;
            $where['user_id'] = $userId;
            $grade = M('admission')->where($where)->find();
            if(is_null($grade)){
                exit('-1');
            }else{
                exit(json_encode($grade));
            }
        }
    }