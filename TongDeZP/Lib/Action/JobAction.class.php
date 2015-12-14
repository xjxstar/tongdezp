<?php
    class JobAction extends Action{
        public function getJob(){
            $data = D('Job')->getJob();
            exit(json_encode($data));
        }
        public function saveJob(){
            D('Job')->saveJob();
        }
        public function delJob(){
            $id = isset($_REQUEST['id'])?$_REQUEST['id']:'';
            M('job')->where("id=$id")->delete();
        }
    }