<?php
    class PaperAction extends Action{
        public function savePaper(){
            $data = D('Paper')->savePaper();
        }
        public function getPaper(){
            $data = D('Paper')->getPaper();
            exit(json_encode($data));
        }
        public function delPaper(){
            $id = isset($_REQUEST['id'])?$_REQUEST['id']:'';
            M('paper')->where("id=$id")->delete();
        }
    }