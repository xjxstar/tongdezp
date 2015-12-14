<?php
    class EducationAction extends Action{
        public function saveEducation(){
            $params = isset($_POST['params'])?$_POST['params']:'';
            dump($params);
            D('Education')->saveEducation($params);
        }
        public function getEducation(){
            $data = D('Education')->getEducation();
            exit(json_encode($data));
        }
        public function delEducation(){
            $id = isset($_REQUEST['id'])?$_REQUEST['id']:'';
            M('education')->where("id=$id")->delete();
        }
    }