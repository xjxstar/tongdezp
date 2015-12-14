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
    }