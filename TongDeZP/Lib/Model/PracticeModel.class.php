<?php
    class PracticeModel extends Model{
        public function savePractice(){
            $params = isset($_POST['params'])?$_POST['params']:'';
            $paramArr = ParamsToArr($params);
            $paramArr['user_id'] = $_SESSION['user']['id'];
            $startY = $paramArr['isdate_y'];
            $startM = $paramArr['isdate_m'];
            $endY = $paramArr['iedate_y'];
            $endM = $paramArr['iedate_m'];
            $startYM = strtotime($startY.'-'.$startM);
            $endYM = strtotime($endY.'-'.$endM);
            unset($paramArr['isdate_y']);
            unset($paramArr['isdate_m']);
            unset($paramArr['iedate_y']);
            unset($paramArr['iedate_m']);
            $paramArr['start_time'] = $startYM;
            $paramArr['end_time'] = $endYM;
            $status = isset($_POST['_status'])?$_POST['_status']:'';
            if($status){
                M('practice')->where('id='.$status)->save($paramArr);
            }else{
                M('practice')->add($paramArr);
            }
        }
        public function getPractice(){
            if(isset($_REQUEST['userId'])){
                $where['user_id'] = $_REQUEST['userId'];
            }else if(!empty($_SESSION['user']['id'])){
                $where['user_id'] = $_SESSION['user']['id'];
            }
            $data = M('practice')->where($where)->select();
            for($i=0;$i<count($data);$i++){
                $data[$i]['start_time'] = date('Ym',$data[$i]['start_time']);
                $data[$i]['end_time'] = date('Ym',$data[$i]['end_time']);
            }
            return $data;
        }
    }