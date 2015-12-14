<?php
    class PracticeAction extends Action{
        public function savePractice(){
            D('Practice')->savePractice();
        }
        public function getPractice(){
            $data = D('Practice')->getPractice();
            exit(json_encode($data));
        }
        public function delPractice(){
            $id = isset($_REQUEST['id'])?$_REQUEST['id']:'';
            M('practice')->where("id=$id")->delete();
        }
    }