<?php
    class LanguageAction extends Action{
        public function saveLanguage(){
            $params = isset($_POST['params'])?$_POST['params']:'';
            $paramArr = ParamsToArr($params);
            $paramArr['user_id'] = $_SESSION['user']['id'];
            $status = isset($_POST['_status'])?$_POST['_status']:'';
            if($status){
                M('language')->where('id='.$status)->save($paramsArr);
            }else{
                $data = M('language')->add($paramArr);
            }
            exit(json_encode($data));
        }
        public function getLanguage(){
            $where['user_id'] = $_SESSION['user']['id'];
            $data = M('language')->where($where)->select();
            exit(json_encode($data));
        }
        public function delLanguage(){
            $id = isset($_REQUEST['id'])?$_REQUEST['id']:'';
            M('language')->where("id=$id")->delete();
        }
    }