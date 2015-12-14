<?php
    class RecruitAction extends Action{
        public function saveRecruit(){
            $params= isset($_REQUEST['params'])?$_REQUEST['params']:'';
            $recruit = paramsToArr($params);
            $recruit['public_time'] = date('Y-m-d H:i:s',time());
            if(empty($recruit['id'])){
                M('zhaopin')->add($recruit);
            }else{
                M('zhaopin')->where('id='.$recruit['id'])->save($recruit);
            } 
        }
        public function getRecruit(){
            $pageIndex = isset($_REQUEST['pageIndex'])?$_REQUEST['pageIndex']:'';
            $pageSize = isset($_REQUEST['pageSize'])?$_REQUEST['pageSize']:'';
            $key = isset($_REQUEST['key'])?$_REQUEST['key']:'';
            if(!empty($key)){
               $where['position'] = $key; 
            }
            $count = M('zhaopin')->where($where)->count();
            if($pageSize){
                $pageIndex +=1;
                $data = M('zhaopin')->where($where)->order('sequence asc')->page($pageIndex,$pageSize)->select();
            }else{
                $data = M('zhaopin')->where($where)->select();
            }
            exit(json_encode(array('data'=>$data,'total'=>$count)));
        }
        public function delRecruit(){
            $id = isset($_REQUEST['id'])?$_REQUEST['id']:'';
            M('zhaopin')->where('id='.$id)->delete();
        }
        public function deleteRecruit(){
            $rows = $_POST['rows'];
            foreach ($rows as $row) {
                $res = M('zhaopin')->delete($row['id']);
                if(!$res){
                    $this->ajaxReturn('','删除失败',0);
                }
            }
        }
        public function index(){
            $recruits = M('zhaopin')->order('sequence asc')->select();
            $this->assign('recruits',$recruits);
            $this->selected = 1;
            $this->display('html/recruit');
        }
        public function exportRecruit(){
            $type = $_FILES['zpExcel']['type'];
            if(!strstr($type,'excel')){
                exit('格式错误');
            }else{
                $data = D('Common')->importExcel($_FILES['zpExcel']['tmp_name']);
                $data = $data['data'][0]['Content'];
                //解析Excel中数据
                $startRow = 3;//招聘信息起始行号为3
                $cols = 12;//招聘信息内容总共有12项
                for($i=$startRow;$i<=count($data);$i++){
                    $recruit['position'] = $data[$i][0];
                    $recruit['area'] = $data[$i][1];
                    $recruit['ptype'] = $data[$i][2];
                    $recruit['depart_code'] = $data[$i][3];
                    $recruit['needed'] = $data[$i][4];
                    $recruit['target'] = $data[$i][5];
                    $recruit['age_upper'] = $data[$i][6];
                    $recruit['major'] = $data[$i][7];
                    $recruit['education'] = $data[$i][8];
                    $recruit['jobtitle'] = $data[$i][9];
                    $recruit['remark'] = $data[$i][10];
                    $recruit['test_subject'] = $data[$i][11];
                    $recruit['sequence'] = $i;
                    M('zhaopin')->add($recruit);
                }
            }
            exit('1');
        }
        function downloadTpl(){
            $fileName = "招聘信息上传模板文件.xls";
            $filePath = 'upload/template/zpTemplate.xls';
            D('Common')->downloadTpl($fileName,$filePath);
        }
    }