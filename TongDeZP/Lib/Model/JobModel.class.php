<?php
    class JobModel extends Model{
        public function saveJob($params){
            $params = isset($_POST['params'])?$_POST['params']:'';
            $paramArr = ParamsToArr($params);
            $paramArr['user_id'] = $_SESSION['user']['id'];
            $startY = $paramArr['wsdate_y'];
            $startM = $paramArr['wsdate_m'];
            $endY = $paramArr['wedate_y'];
            $endM = $paramArr['wedate_m'];
            $startYM = strtotime($startY.'-'.$startM);
            $endYM = strtotime($endY.'-'.$endM);
            unset($paramArr['wsdate_y']);
            unset($paramArr['wsdate_m']);
            unset($paramArr['wedate_y']);
            unset($paramArr['wedate_m']);
            $paramArr['start_time'] = $startYM;
            $paramArr['end_time'] = $endYM;
            $status = isset($_POST['_status'])?$_POST['_status']:'';
            if($status){
                M('job')->where('id='.$status)->save($paramArr);
            }else{
                M('job')->add($paramArr);
            }
        }
        public function getJob(){
            if(isset($_REQUEST['userId'])){
                $where['user_id'] = $_REQUEST['userId'];
            }else if(!empty($_SESSION['user']['id'])){
                $where['user_id'] = $_SESSION['user']['id'];
            }
            $data = M('Job')->where($where)->select();
            for($i=0;$i<count($data);$i++){
                $data[$i]['start_time'] = date('Ym',$data[$i]['start_time']);
                $data[$i]['end_time'] = date('Ym',$data[$i]['end_time']);
            }
            return $data;
        }
    }