<?php
    class TaskAction extends Action{
       function saveTask(){
            $params = isset($_POST['params'])?$_POST['params']:'';
            $task = ParamsToArr($params);
            $task['user_id'] = $_SESSION['user']['id'];
            if(empty($task['id'])){
                M('task')->add($task);
            }else{
                M('task')->where('id='.$task['id'])->save($task);
            }
        }
        function delTask(){
            $id = isset($_REQUEST['id'])?$_REQUEST['id']:'';
            M('task')->where('id='.$id)->delete();
        }
        function getTask(){
            $where['user_id'] = $_SESSION['user']['id'];
            $data = M('task')->where($where)->select();
            exit(json_encode($data));
        }
    }