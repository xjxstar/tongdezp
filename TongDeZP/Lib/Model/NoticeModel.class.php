<?php
    class NoticeModel extends Model{
        public function getNotice($pageIndex,$pageSize,$key){
            if(!empty($key)){
                $where['title'] = array('like',"%$key%");
            }
            if(!empty($pageSize)){
                $data = M('notice')->where($where)->page($pageIndex,$pageSize)->select();
            }else{
                $data = M('notice')->where($where)->select();
            }
            return $data;
        }
    }