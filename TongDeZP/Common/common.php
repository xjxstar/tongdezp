<?php
    function ParamsToArr($params){
        $arr1 = explode(',',$params);
        $paramArr = array();
        for($i=0;$i<count($arr1);$i++){
            $tempArr = explode(':',$arr1[$i]);
            $paramArr[$tempArr[0]] = $tempArr[1];
        }
        return $paramArr;
    }
    function checkLogin(){
        $admin = $_SESSION['admin'];
        if(is_null($admin)){
            redirect('../../index.php');
        }
    }
    function statusToString($status,$remark){
        $str = '';
        switch($status){
            case '0':$str = '简历未提交,请先填写简历';break;
            case '1':$str = '简历未审核,请耐心等待医院人事部的审核';break;
            case '2':$str ="简历审核不通过,理由($remark)";break;
            case '3':$str = '简历审核通过,请耐心等待笔试通知';break;
            case '4':$str = '简历审核通过，已成功分配考场，请在考试管理中打印准考证';break;
            case '5':$str = "简历审核不通过，理由($remark),请重新填写简历";break;
            default:break;
        }
        return $str;
    }
    function jobTitleToString($jobTitle){
        $str = '无';
        switch($jobTitle){
            case '0':$str = '无';break;
            case '1':$str = '待聘';break;
            case '2':$str = '初级';break;
            case '3':$str ="中级";break;
            case '4':$str = '副高';break;
            case '5':$str = '正高';break;
            default:break;
        }
        return $str;
    }
    function resumeLog($user_id,$action,$msg=''){
        $data = array(
            'user_id' => $user_id,
            'action' => $action,
            'opt_time' => time(),
            'msg' => $msg
        );
        M('loginfo')->add($data);
    }