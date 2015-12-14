<?php
    class RewardsModel extends Model{
        public function saveRewards(){
            $params = isset($_POST['params'])?$_POST['params']:'';
            $status = isset($_POST['_status'])?$_POST['_status']:'';
            dump($_REQUEST);
            $paramArr = ParamsToArr($params);
            $paramArr['user_id'] = $_SESSION['user']['id'];
            $publicDate = strtotime($paramArr['rewards_y'].'-'.$paramArr['rewards_m']);
            unset($paramArr['rewards_y']);
            unset($paramArr['rewards_m']);
            $paramArr['rewards_date'] = $publicDate;
            if($status){
                M('rewards')->where('id='.$status)->save($paramArr);
                dump(M()->_sql());
            }else{
                M('rewards')->add($paramArr);
            }
        }
        public function getRewards(){
            if(isset($_REQUEST['userId'])){
                $where['user_id'] = $_REQUEST['userId'];
            }else if(!empty($_SESSION['user']['id'])){
                $where['user_id'] = $_SESSION['user']['id'];
            }
            $data = M('rewards')->where($where)->select();
            for($i=0;$i<count($data);$i++){
                $data[$i]['rewards_date'] = date('Ym',$data[$i]['rewards_date']);
            }
            return $data;
        }
    }