<?php
    class RewardsAction extends Action{
        public function saveRewards(){
            D('Rewards')->saveRewards();
        }
        public function getRewards(){
            $data = D('Rewards')->getRewards();
            exit(json_encode($data));
        }
        public function delRewards(){
            $id = isset($_REQUEST['id'])?$_REQUEST['id']:'';
            M('rewards')->where("id=$id")->delete();
        }
    }