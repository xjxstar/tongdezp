<?php
    class AdmissionModel extends Model{
        public function getAdmission($pageIndex,$pageSize,$key,$roomId){
            if(!empty($key)){
                $where['name'] = $key;
            }
            if(!empty($roomId)){
                $where['room_id'] = $roomId;
            }
            $count = M('admission')
                ->join('left join personal_information pi on(admission.user_id = pi.user_id)')
                ->where($where)->count();
            if(empty($pageIndex)){
                $data = M('admission')
                ->field('admission.id,pi.user_id,name,gender,card_no,admission_no,level,classroom,seat,grade,interview_grade')
                ->join('left join personal_information pi on(admission.user_id = pi.user_id)')
                ->where($where)->select();
            }else{
                $data = M('admission')
                ->field('admission.id,pi.user_id,name,gender,card_no,admission_no,level,classroom,seat,grade,interview_grade')
                ->join('left join personal_information pi on(admission.user_id = pi.user_id)')
                ->where($where)->page($pageIndex,$pageSize)->select();
            }
            return array('total'=>$count,'data'=>$data);
        }
        
        public function addUserAdmission($data){
            $admission = array();
            for($i=0;$i<count($data);$i++){
                $admission['user_id'] = $data[$i]['user_id'];
                $admission['level'] = '统一招考';
                $admission['room_id'] = $data[$i]['room_id'];
                M('admission')->add($admission);
                M('personal_information')->where('user_id='.$data[$i]['user_id'])->setField('status',4);
            }
        }
    }