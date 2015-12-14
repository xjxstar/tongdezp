<?php
    class ResumeManageAction extends Action{
        public function index(){
            $this->selected='0';
            $where['user_id'] = $_SESSION['user']['id'];
            $arr = M('personal_information')->where($where)->getField('status,remark',true);
            $admission = M('admission')->where($where)->find();
            $status = '';
            if(!is_null($arr)){
                foreach($arr as $k=>$v){
                    if(empty($admission['seat']) && $k==4){
                        $status = '简历审核通过，考场已分配，座位号还未分配';
                    }else{
                        $status = statusToString($k,$v);
                    }
                    if(!empty($admission['grade']) && !empty($admission['interview_grade'])){
                        $status = '笔试成绩及面试成绩已经发布，请在考试管理中查询'; 
                    }else if(!empty($admission['grade'])){
                        $status = '笔试成绩已经发布，请在考试管理中查询';
                    }else if(!empty($admission['interview_grade'])){
                        $status = '面试成绩已经发布，请在考试管理中查询';
                    }
                }
            }
            $this->status = $status;
            if(is_null($_SESSION['user'])){
                $this->display('html/index');
            }else{
                $this->display('html/resume_center');
            }
        }
        public function resumeFill(){
            $email = $_SESSION['user']['email'];
            $userMessage = M('personal_information')->where("email='$email'")->find();
            $position = M('zhaopin')->where('id='.$userMessage['zhaopin_id'])->find();
            $this->assign('userMessage',$userMessage)->assign('position',$position);
            $this->selected='0';
            if(is_null($_SESSION['user'])){
                $this->display('html/index');
            }else{    
                $this->display('html/resume_fill');
            }
        }
        public function resumePreview(){
            if(isset($_REQUEST['userId'])){
                $where['user_id'] = $_REQUEST['userId'];
            }else if(!empty($_SESSION['user']['id'])){
                $where['user_id'] = $_SESSION['user']['id'];
            }
            $personalInfo = D('PersonalInfo')->getPersonalInfo();
            $position = M('zhaopin')->where('id='.$personalInfo['zhaopin_id'])->find();
            $educations = D('Education')->getEducation();
            $jobs = D('Job')->getJob();
            foreach ($jobs as &$j) {
                $j['jobtitle'] = jobTitleToString($j['jobtitle']);
            }
            $practices = D('Practice')->getPractice();
            $partTimeJobs = D('PartTimeJob')->getPartTimeJob();
            $languages = M('language')->where($where)->select();
            $certificates = M('certificate')->where($where)->select();
            $papers = D('Paper')->getPaper();
            $rewards = D('Rewards')->getRewards();
            $accessorys = M('accessory')->where($where)->select();
            $tasks = M('task')->where($where)->select();
            $this->assign('personalInfo',$personalInfo)
                ->assign('position',$position)
                ->assign('educations',$educations)
                ->assign('jobs',$jobs)->assign('practices',$practices)
                ->assign('partTimeJobs',$partTimeJobs)->assign('languages',$languages)
                ->assign('certificates',$certificates)->assign('papers',$papers)
                ->assign('rewards',$rewards)->assign('accessorys',$accessorys)
                ->assign('tasks',$tasks);
            $this->selected='0';
            if(is_null($_SESSION['user']) && is_null($_SESSION['admin'])){
                $this->display('html/index');
            }else{
                $this->display('html/resume_preview');
            }
        }
        public function resumeCheck(){
            $userId = isset($_REQUEST['userId'])?$_REQUEST['userId']:'';
            $info = M('personal_information')->where('user_id='.$userId)
                ->field('remark,status')->find();
            $this->assign('userId',$userId)->assign('remark',$info['remark'])
                ->assign('status',$info['status'])->display('admin/resume_check');
        }
        public function passCheck(){
            $userId = isset($_POST['userId'])?$_POST['userId']:'';
            $where['user_id'] = $userId;
            M('personal_information')->where($where)->setField(array('status'=>'3','remark'=>''));
        }
        public function checkNoPass(){
            $userId = isset($_POST['userId'])?$_POST['userId']:'';
            $remark = isset($_POST['remark'])?$_POST['remark']:'';
            $rewrite = isset($_POST['rewrite'])?$_POST['rewrite']:'';
            $where['user_id'] = $userId; 
            if($rewrite==1){
                M('personal_information')->where($where)->setField(array('status'=>5,'remark'=>$remark));
            }else{
                M('personal_information')->where($where)->setField(array('status'=>2,'remark'=>$remark));
            }
            resumeLog($userId,'RESUME_CHECKNOPASS',$remark);
        }
    }