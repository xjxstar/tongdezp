<?php
    class EducationModel extends Model{
        public function saveEducation($params){
            $paramArr = ParamsToArr($params);
            $paramArr['user_id'] = $_SESSION['user']['id'];
            $startY = $paramArr['esdate_y'];
            $startM = $paramArr['esdate_m'];
            $endY = $paramArr['eedate_y'];
            $endM = $paramArr['eedate_m'];
            $startYM = strtotime($startY.'-'.$startM);
            $endYM = strtotime($endY.'-'.$endM);
            unset($paramArr['esdate_y']);
            unset($paramArr['esdate_m']);
            unset($paramArr['eedate_y']);
            unset($paramArr['eedate_m']);
            $paramArr['start_time'] = $startYM;
            $paramArr['end_time'] = $endYM;
            $status = isset($_POST['_status'])?$_POST['_status']:'';
            if($status){
                M('education')->where('id='.$status)->save($paramArr);
            }else{
                M('education')->add($paramArr);
            }
            dump(M()->_sql());
        }
        public function getEducation(){
            if(isset($_REQUEST['userId'])){
                $where['user_id'] = $_REQUEST['userId'];
            }else if(!empty($_SESSION['user']['id'])){
                $where['user_id'] = $_SESSION['user']['id'];
            }
            $data = M('Education')->where($where)->select();
            for($i=0;$i<count($data);$i++){
                $data[$i]['start_time'] = date('Ym',$data[$i]['start_time']);
                $data[$i]['end_time'] = date('Ym',$data[$i]['end_time']);
            }
            return $data;
        }
    }