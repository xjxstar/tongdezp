<?php
    class CertificateAction extends Action{
        public function saveCertificate(){
            $params = isset($_POST['params'])?$_POST['params']:'';
            $paramsArr = ParamsToArr($params);
            $paramsArr['user_id'] = $_SESSION['user']['id'];
            $status = isset($_POST['_status'])?$_POST['_status']:'';
            if($status){
                M('Certificate')->where('id='.$status)->save($paramsArr);
            }else{
                M('Certificate')->add($paramsArr);
            }
        }
        public function getCertificate(){
            $where['user_id'] = $_SESSION['user']['id'];
            $data = M('certificate')->where($where)->select();
            exit(json_encode($data));
        }
        public function delCertificate(){
            $id = isset($_REQUEST['id'])?$_REQUEST['id']:'';
            M('certificate')->where("id=$id")->delete();
        }
    }