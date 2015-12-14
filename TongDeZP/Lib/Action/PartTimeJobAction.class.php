<?php
    class PartTimeJobAction extends Action{
        public function savePartTimeJob(){
            $params = isset($_POST['params'])?$_POST['params']:'';
            D('PartTimeJob')->savePartTimeJob($params);
        }
        public function getPartTimeJob(){
            $data = D('PartTimeJob')->getPartTimeJob();
            exit(json_encode($data));
        }
        public function delPartTimeJob(){
            $id = isset($_REQUEST['id'])?$_REQUEST['id']:'';
            M('parttime_job')->where("id=$id")->delete();
        }
    }