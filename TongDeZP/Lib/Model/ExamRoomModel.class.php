<?php
    class ExamRoomModel extends Model{
        public function getAllExamRoom(){
            $data = M('exam_room')->select();
            return $data;
        }
        public function saveExamRoom(){
            $data = $_POST['data'];
            dump($data);
        }
        public function delExamRoom($id){
            M('exam_room')->where('id='.$id)->delete();
        }
    }