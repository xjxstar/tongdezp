<?php
    class PaperModel extends Model{
        public function savePaper(){
            $params = isset($_POST['params'])?$_POST['params']:'';
            $paramArr = ParamsToArr($params);
            $paramArr['user_id'] = $_SESSION['user']['id'];
            $publicDate = strtotime($paramArr['public_y'].'-'.$paramArr['public_m']);
            unset($paramArr['public_y']);
            unset($paramArr['public_m']);
            $paramArr['public_date'] = $publicDate;
            $status = isset($_POST['_status'])?$_POST['_status']:'';
            if($status){
                M('paper')->where('id='.$status)->save($paramArr);
            }else{
                M('paper')->add($paramArr);
            }
        }
        public function getPaper(){
            if(isset($_REQUEST['userId'])){
                $where['user_id'] = $_REQUEST['userId'];
            }else if(!empty($_SESSION['user']['id'])){
                $where['user_id'] = $_SESSION['user']['id'];
            }
            $data = M('paper')->where($where)->select();
            for($i=0;$i<count($data);$i++){
                $data[$i]['public_date'] = date('Ym',$data[$i]['public_date']);
            }
            return $data;
        }
    }