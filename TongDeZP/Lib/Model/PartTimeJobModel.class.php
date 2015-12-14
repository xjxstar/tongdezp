<?php
    class PartTimeJobModel extends Model{
        public function savePartTimeJob($params){
            $paramArr = ParamsToArr($params);
            $paramArr['user_id'] = $_SESSION['user']['id'];
            $startY = $paramArr['psdate_y'];
            $startM = $paramArr['psdate_m'];
            $endY = $paramArr['pedate_y'];
            $endM = $paramArr['pedate_m'];
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
                M('parttime_job')->where('id='.$status)->save($paramsArr);
            }else{
                M('parttime_job')->add($paramArr);
            }
        }
        public function getPartTimeJob(){
            if(isset($_REQUEST['userId'])){
                $where['user_id'] = $_REQUEST['userId'];
            }else if(!empty($_SESSION['user']['id'])){
                $where['user_id'] = $_SESSION['user']['id'];
            }
            $data = M('parttime_job')->where($where)->select();
            for($i=0;$i<count($data);$i++){
                $data[$i]['start_time'] = date('Ym',$data[$i]['start_time']);
                $data[$i]['end_time'] = date('Ym',$data[$i]['end_time']);
            }
            return $data;
        }
    }