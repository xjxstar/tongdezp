<?php
 class AccessoryAction extends Action{
     public function saveAccessory(){
         $userId = $_SESSION['user']['id'];
         $file = $_FILES['imgFile'];
         $userDir = 'upload/'.$userId;
         if(!file_exists($userDir)){
             mkdir($userDir);
         }
         $accessory['src'] = $userDir.'/'.time().'_'.$_FILES["imgFile"]["name"];
         $tmpSrc=iconv("UTF-8","GB2312//IGNORE", $accessory['src']);
         $result = move_uploaded_file($_FILES["imgFile"]["tmp_name"], $tmpSrc);
         $accessory['name'] = $_FILES["imgFile"]["name"];
         $accessory['description'] = isset($_REQUEST['description'])?$_REQUEST['description']:'';
         $accessory['user_id'] = $userId;
         M('accessory')->add($accessory);
         exit("1");
     }
     public function getAccessory(){
         $userId = $_SESSION['user']['id'];
         $data = M('accessory')->where('user_id='.$userId)->select();
         exit(json_encode($data));
     }
     public function delAccessory(){
         $id = isset($_REQUEST['id'])?$_REQUEST['id']:'';
         $src = M('accessory')->where('id='.$id)->getField('src');
         $src = str_replace('/','\\',$src);
         $src = __Root__.'\\'.$src;
         $src=iconv("UTF-8","GB2312//IGNORE", $src);
         if(file_exists($src)){
             unlink($src);
         }
         M('accessory')->where('id='.$id)->delete();
     }
 }