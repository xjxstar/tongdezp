<?php
    class ResumeAction extends Action{
        public function savePersonalInfo(){
            $params = isset($_POST['params'])?$_POST['params']:'';
            D('PersonalInfo')->savePersonalInfo($params);
        }
        public function saveSelfImg(){
            $userId = $_SESSION['user']['id'];
            $userDir = 'upload/'.$userId;
            $type = $_FILES["self_photo"]['type'];
            if(strstr($type,'image/')){
                    if(!file_exists($userDir)){
                    mkdir($userDir);
                }
                $file = $userDir.'/self.jpg';
                $result = move_uploaded_file($_FILES["self_photo"]["tmp_name"], $file);
                if($result==true){
                    M('personal_information')->where('user_id='.$userId)->setField('self_photo',$file); 
                }
                exit("1");
            }else{
                exit('-1');
            }
            
        }
        public function delSelfImg(){
            $userId = $_SESSION['user']['id'];
            $src = M('personal_information')->where('user_id='.$userId)->getField('self_photo');
            M('personal_information')->where('user_id='.$userId)->setField('self_photo',null);
            if(is_file($src)){
                unlink($src);
            }
        }
        public function checkResume(){
            $userId = $_SESSION['user']['id'];
            $data = M('personal_information')->where('user_id='.$userId)->find();
            $count = M('education')->where('user_id='.$userId)->count();
            $position = M('personal_information')->where('user_id='.$userId)->getField('zhaopin_id');
            if(empty($data['link1'])){
                exit('noMessage');
            }else if(empty($position)){
                exit('noPosition');   
            }else if(empty($data['self_photo'])){
                exit('noPhoto');
            }else if($count==0){
                exit('noEducation');
            }else if($data['current']=='否'){
                $descriptions = M('accessory')->where('user_id='.$userId)->getField('description',true);
                $descriptions = implode(',',$descriptions);
                if(strpos($descriptions,'学位证书')===false && strpos($descriptions,'毕业证书')===false){
                    exit('noGraduate');
                }else{
                    M('personal_information')->where('user_id='.$userId)->setField('status','1');
                    exit("1");
                }
            }else{
                $save['status']  = 1;
                $save['submit_time'] = time();
                M('personal_information')->where('user_id='.$userId)->save($save);
                resumeLog($userId,'RESUME_SUBMIT');
                exit("1");
            }
        }

        public function deleteResume(){
            $rows = $_POST['rows'];
            foreach($rows as $row){
                $userId = intval($row['user_id']);
                $name = addslashes($row['name']);
                $res = M('personal_information')->where("user_id=$userId")->setField('status',-1);
                if(!$res){
                    $this->ajaxReturn('',"{$name}删除失败",0);
                }
                resumeLog($userId,'DELETE_RESUME');
            } 
        }
        //获取所有已提交的简历信息
        public function getAllPersonalInfo(){
            $params = addslashes($_REQUEST['params']);
            $params = str_replace('&', ',', $params);
            $params = str_replace('=', ':', $params);
            $arr = paramsToArr($params);
            $paramsArr = array();
            $flag = 1;//标记计算total时是否需要联表查询
            if(!empty($arr['education'])){
                $paramsArr['pi.education'] = urldecode($arr['education']);
                $flag = 0;
            }
            if(!empty($arr['depart_code'])){
                $paramsArr['depart_code'] = $arr['depart_code'];
                $flag = 0;
            }
            if(!empty($arr['name'])){
                $paramsArr['name'] = array('like',"%".urldecode($arr['name'])."%");
            }
            if(!empty($arr['status'])){
                $paramsArr['status'] = $arr['status'];
                if($arr['status']==3){
                    $paramsArr['status'] = array('in',array(3,4));
                }
            }else{
                $paramsArr['status'] = array('gt',0);
            }
            if(!empty($arr['jobtitle'])){
                $paramsArr['job.jobtitle'] = $arr['jobtitle'];
                $flag = 0;
            }   
            $pageIndex = isset($_REQUEST['pageIndex'])?$_REQUEST['pageIndex']:'';
            $pageIndex +=1;
            $pageSize = isset($_REQUEST['pageSize'])?$_REQUEST['pageSize']:'';
            set_time_limit(0);
            if($flag){
                //没有查询参数的时候 ，提高查询效率
                $count = M('personal_information pi')->where($paramsArr)->count(1);
                $data = M('personal_information pi')
                ->join('left join zhaopin on zhaopin.id = pi.zhaopin_id')
                ->join('left join education on (pi.user_id = education.user_id and pi.education = education.education)')
                ->join('left join job on pi.user_id = job.user_id' )
                ->field('pi.*,zhaopin.position,zhaopin.depart_code,education.major,education.train,education.school,max(job.jobtitle) as jobtitle,job.workon')  
                ->group('pi.user_id')
                ->page($pageIndex,$pageSize)->where($paramsArr)->select();
            }else{
                //有查询参数的时候，只查询一次
                $data = M('personal_information pi')
                    ->join('left join zhaopin on zhaopin.id = pi.zhaopin_id')
                    ->join('left join education on (pi.user_id = education.user_id and pi.education = education.education)')
                    ->join('left join job on pi.user_id = job.user_id' )
                    ->field('pi.*,zhaopin.position,zhaopin.depart_code,education.major,education.train,education.school,max(job.jobtitle) as jobtitle,job.workon')  
                    ->group('pi.user_id')
                    ->order('null')
                    ->where($paramsArr)->select();
                $count = count($data);
                $pageStart = ($pageIndex-1)*$pageSize;
                $pageEnd = $pageSize;
                if($count>10){
                    //需要分页
                    $data = array_slice($data, $pageStart,$pageEnd);
                }
            }
            for($i=0;$i<count($data);$i++){
                $data[$i]['native_place'] = str_replace(array('直辖市','市辖区','|区|','|县|','|市|','|','请选择'),'',$data[$i]['native_place']);
                $data[$i]['work_ym'] = date('Y-m',$data[$i]['work_ym'])?date('Y年m月',$data[$i]['work_ym']):$data[$i]['work_ym'];
                $data[$i]['work_ym'].='';
                $data[$i]['current'] = $data[$i]['current']=='是'?'应届':'往届';
                $data[$i]['jobtitle'] = jobTitleToString($data[$i]['jobtitle']);
                if(!empty($data[$i]['submit_time'])){
                    $data[$i]['submit_time'] = date('Y-m-d H:i:s',$data[$i]['submit_time']);
                }
                switch ($data[$i]['status']){
                    case '1':$data[$i]['status'] = '未审核';break;
                    case '3':$data[$i]['status'] = '审核通过';break;
                    case '4':$data[$i]['status'] = '审核通过';break;
                    case '2':$data[$i]['status'] = '审核不通过';break;
                    case '5':$data[$i]['status'] = '重新填写待审核';break;
                }
            }
            exit(json_encode(array('total'=>$count,'data'=>$data)));
        }
        public function exportPersonalInfo(){
            $params = addslashes($_REQUEST['params']);
            $params = str_replace('&', ',', $params);
            $params = str_replace('=', ':', $params);
            $arr = paramsToArr($params);
            $paramsArr = array();
            if(!empty($arr['education'])){
                $paramsArr['pi.education'] = urldecode($arr['education']);
            }
            if(!empty($arr['depart_code'])){
                $paramsArr['depart_code'] = $arr['depart_code'];
            }
            if(!empty($arr['name'])){
                $paramsArr['name'] = array('like',"%".$arr['name']."%");
            }
            if(!empty($arr['status'])){
                $paramsArr['status'] = $arr['status'];
                if($arr['status']==3){
                    $paramsArr['status'] = array('in',array(3,4));
                }
            }else{
                $paramsArr['status'] = array('gt',0);
            }
            $data = M('personal_information pi')
                ->join('left join zhaopin on zhaopin.id = pi.zhaopin_id')
                ->join('left join education on (pi.user_id = education.user_id and pi.education = education.education)')
                ->join('left join job on pi.user_id = job.user_id' )
                ->field('pi.user_id,name,gender,nation,native_place,card_no,position,depart_code,current,max(job.jobtitle) as jobtitle,
                    pi.education,education.major,train,education.school,job.workon,link1,status,pi.remark,pi.submit_time')
                ->group('pi.user_id')
                ->order('null')
                ->where($paramsArr) 
                ->select();
            for($i=0;$i<count($data);$i++){
                switch ($data[$i]['status']){
                    case '1':$data[$i]['status'] = '未审核';break;
                    case '3':$data[$i]['status'] = '审核通过';break;
                    case '4':$data[$i]['status'] = '审核通过';break;
                    case '2':$data[$i]['status'] = '审核不通过';break;
                    case '5':$data[$i]['status'] = '重新填写待审核';break;
                }
                $data[$i]['native_place'] = str_replace(array('直辖市','市辖区','|区|','|县|','|市|','|','请选择'),'',$data[$i]['native_place']);
                $data[$i]['card_no'] = $data[$i]['card_no'];
                $data[$i]['jobtitle'] = jobTitleToString($data[$i]['jobtitle']);
                if($data[$i]['submit_time'])$data[$i]['submit_time'] = date('Y-m-d H:i:s',$data[$i]['submit_time']);
            }
            $ths = '应聘者编号,姓名,性别,民族,籍贯,身份证号码,应聘科室,岗位代码,应/往届,职称,学历学位,专业,培养方式,'.
                '毕业院校,工作单位,联系方式,审核状态,审核备注,提交时间';
            $titles = explode(',',$ths);
            $filename ='应聘人员信息';
            set_time_limit(0);
            D('Common')->exportExcel($data,$titles,$filename);
        }
        
        /**
         * 获得提交了简历但未生成准考证的应聘人员
         */
        public function getExamPersonalInfo(){
            $pageIndex = isset($_REQUEST['pageIndex'])?$_REQUEST['pageIndex']:'';
            $pageSize = isset($_REQUEST['pageSize'])?$_REQUEST['pageSize']:'';
            $key = isset($_REQUEST['key'])?$_REQUEST['key']:'';
            $data = D('PersonalInfo')->getExamPersonalInfo($pageIndex+1,$pageSize,$key);
            exit(json_encode($data));
        }
        public function savePosition(){
            $params = isset($_POST['params'])?$_POST['params']:'';
            $paramsArr = ParamsToArr($params);
            $paramsArr['position'] = $paramsArr['depart'];
            unset($paramsArr['depart']);
            unset($paramsArr['position']);
            $id = M('zhaopin')->where($paramsArr)->getField('id');
            $where['user_id'] = $_SESSION['user']['id'];
            M('personal_information')->where($where)->setField('zhaopin_id',$id);
            exit('1');
        }
        public function checkCardNo(){
            $cardNo = $_POST['cardNo'];
            if($cardNo){
                $where['card_no'] = $cardNo;
                $where['user_id'] = array('neq',$_SESSION['user']['id']);
                $count = M('personal_information')->where($where)->count(1);
                exit($count);
            }
        }
    }