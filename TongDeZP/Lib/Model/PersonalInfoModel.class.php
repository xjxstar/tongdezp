<?php
    class PersonalInfoModel extends Model{
        public function savePersonalInfo($params){
            $paramArr = ParamsToArr($params);
            $paramArr['gender'] =  $paramArr['gender']=='1'?'男':'女';
            $paramArr['marital_status'] =  $paramArr['marital_status']=='1'?'未婚':'已婚';
            if(!empty($paramArr['oversea'])){
                $paramArr['oversea'] =  $paramArr['oversea']=='1'?'有':'无';
            }
            if($paramArr['current']=='2'){
                $paramArr['graduate_time'] = '';
            }
            $paramArr['current'] =  $paramArr['current']=='1'?'是':'否';
            $email = $_SESSION['user']['email'];
            M('personal_information')->where("email='$email'")->save($paramArr);
        }
        public function getPersonalInfo(){
            if(isset($_REQUEST['userId'])){
                $where['user_id'] = $_REQUEST['userId'];
            }else if(!empty($_SESSION['user']['id'])){
                $where['user_id'] = $_SESSION['user']['id'];
            }
            $data = M('personal_information')->where($where)->find();
            $data['work_ym'] = date('Y年m月',$data['work_ym'])?date('Y年m月',$data['work_ym']):$data['work_ym'];
            $data['native_place'] = str_replace(array('直辖市','市辖区','|区|','|县|','|','请选择'),'',$data['native_place']);
            return $data;
        }
        public function getExamPersonalInfo($pageIndex,$pageSize,$key){
            if(!empty($key)){
                $where['name'] = $key;
            }
            $where['status'] = 3;
            $count = M('personal_information')->where($where)->count(1);
            if(empty($pageSize)){
                $data = M('personal_information pi')
                    ->join('left join zhaopin on pi.zhaopin_id = zhaopin.id')
                    ->field('pi.*,zhaopin.depart_code,test_subject')
                    ->where($where)
                    ->order('user_id')->select();
            }else{
                $data = M('personal_information pi')
                    ->join('left join zhaopin on pi.zhaopin_id = zhaopin.id')
                    ->field('pi.*,zhaopin.depart_code,test_subject')
                    ->where($where)
                    ->page($pageIndex,$pageSize)
                    ->order('user_id')->select();
            }
            for($i=0;$i<count($data);$i++){
                $data[$i]['native_place'] = str_replace(array('直辖市','市辖区','|区|','|县|','|'),'',$data[$i]['native_place']);
            }
            return array('total'=>$count,'data'=>$data);
        }
    }