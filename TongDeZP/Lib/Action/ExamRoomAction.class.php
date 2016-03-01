<?php
    class ExamRoomAction extends Action{
        public function getExamRoom(){
            $data = D('ExamRoom')->getAllExamRoom();
            exit(json_encode($data));
        }
        public function saveExamRoom(){
            $data = isset($_POST['data'])?$_POST['data']:'';
            $data = json_decode($data,true);
            for($i=0;$i<count($data);$i++){
                unset($data[$i]['_id']);
                unset($data[$i]['_uid']);
                unset($data[$i]['name']);
                if($data[$i]['_state']=='added'){
                    M('ExamRoom')->add($data[$i]);
                }else{
                    M('ExamRoom')->save($data[$i]);
                }
            }
            //dump(M()->_sql());
            //D('ExamRoom')->saveExamRoom();
        }
        public function delExamRoom(){
            $data = isset($_POST['data'])?$_POST['data']:'';
            for($i=0;$i<count($data);$i++){
                M('exam_room')->where('id='.$data[$i]['id'])->delete();
            }
        }

        public function downloadExamUserTpl(){
            $fileName = "考试人员信息上传模板文件.xls";
            $filePath = 'upload/template/testTemplate.xlsx';
            D('Common')->downloadTpl($fileName,$filePath);
        }

        /**
         * 导入考试人员信息
         */
        public function exportExamUser(){
            $type = $_FILES['testExcel']['type'];
            //if(!strstr($type,'excel')){
                //exit('格式错误');
            //}else {
                $data = D('Common')->importExcel($_FILES['testExcel']['tmp_name']);
                $data = $data['data'][0]['Content'];
                $admissionArr = array();//准考证
                $startRow = 2;//招聘信息起始行号为2
                $roomMap = array();//缓存考点对应room_id
                $userIds = array();
                //我的魔板
                /*for($i=$startRow;$i<=count($data);$i++){
                    $user_id = $data[$i][0];
                    $userIds[] = $user_id;
                    $admissionCode = $data[$i][16];
                    $classroom = substr($admissionCode,8,3);//教室号
                    $seat  =substr($admissionCode,11);//座位号
                    if($roomMap[$data[$i][17]]){
                        $room_id = $roomMap[$data[$i][17]];
                    }else{
                        $room_id = M('exam_room')->where('room_name="'.$data[$i][17].'"')->getField('id');
                        if(!$room_id){
                            exit('上传excel失败，第'.$i.'行考点名称错误，没有这个考点');
                        }
                        $roomMap[$data[$i][17]] = $room_id;
                    }
                    $admissionArr[] = array(
                        'user_id' =>  $user_id,
                        'admission_no'=>    $admissionCode,
                        'classroom' =>  $classroom,
                        'seat'  =>  $seat,
                        'room_id'   =>  $room_id,
                    );
                }*/
                //医院的
                for($i=$startRow;$i<=count($data);$i++){
                    $admissionCode = $data[$i][0];
                    $classroom = substr($admissionCode,8,3);//教室号
                    $seat  =substr($admissionCode,11);//座位号
                    $room_id = 5;//先设置，以后再看情况改
                    $card_no = $data[$i][5];
                    $user_id = M('personal_information')->where('card_no="'.$card_no.'"')->getField('user_id');
                    $userIds[] = $user_id;
                    $admissionArr[] = array(
                        'user_id' =>  $user_id,
                        'admission_no'=>    $admissionCode,
                        'classroom' =>  $classroom,
                        'seat'  =>  $seat,
                        'room_id'   =>  $room_id,
                    );

                }
            //}
            $res = M('admission')->addAll($admissionArr);
            $users = implode($userIds, ',');
            $res2 = M('personal_information')->where("user_id in ($users)")->setField('status','4'); 
            if($res===false){
                exit('导入失败');
            }else{
                exit('1');
            }
        }
    }