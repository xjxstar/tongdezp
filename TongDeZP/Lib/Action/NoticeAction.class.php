<?php
    class NoticeAction extends Action{
        public function getNotice(){
            $pageSize = isset($_REQUEST['pageSize'])?$_REQUEST['pageSize']:'';
            $pageIndex = isset($_REQUEST['pageIndex'])?$_REQUEST['pageIndex']:'';
            $key = isset($_REQUEST['key'])?$_REQUEST['key']:'';
            $data = D('Notice')->getNotice($pageIndex,$pageSize,$key);
            for($i=0;$i<count($data);$i++){
                $data[$i]['public_time'] = date('Y-m-d H:i:s',$data[$i]['public_time']);
            }
            exit(json_encode($data));
        }
        public function saveNotice(){
            $notice['id']= isset($_REQUEST['id'])?$_REQUEST['id']:'';
            $notice['title']= isset($_REQUEST['title'])?$_REQUEST['title']:'';
            $notice['content']= isset($_REQUEST['content'])?$_REQUEST['content']:'';
            $notice['public_time'] = time();
            if(empty($notice['id'])){
                M('notice')->add($notice);
            }else{
                M('notice')->where('id='.$notice['id'])->save($notice);
            } 
        }
        public function delNotice(){
            $id = isset($_REQUEST['id'])?$_REQUEST['id']:'';
            M('notice')->where('id='.$id)->delete();
        }
        public function deleteNotice(){
            $rows = $_POST['rows'];
            foreach ($rows as $row) {
                $id = $row['id'];
                $res = M('notice')->delete($id);
                if(!$res){
                    $this->ajaxReturn('',$row['ritle'].'删除失败',0);
                }
                resumeLog($id,'NOTICE_DELETE',$row['title']);
            }
        }
        public function showNotice(){
            $id = isset($_REQUEST['id'])?$_REQUEST['id']:'';
            $notice = M('notice')->where("id=$id")->find();
            $this->notice = $notice;
            $this->display('html/show_notice');
        }
        public function moreNotice(){
            $data = M('notice')->select();
            $this->data = $data;
            $this->display('html/more_notice');
        }
    }