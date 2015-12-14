<?php
    class CommonModel extends Model{
        function exportExcel($data=array(),$title=array(),$filename){
            vendor("PHPExcel");
            $objPHPExcel = new PHPExcel();
            $cellNum = count($title);
            $cellName = array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA','AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX','AY','AZ');
            $objPHPExcel->getActiveSheet(0)->mergeCells('A1:'.$cellName[$cellNum-1].'1');//合并单元格，表格标题
            $objPHPExcel->getActiveSheet(0)->mergeCells('A2:'.$cellName[$cellNum-1].'2');//合并单元格，表格副标题
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A2','导出时间：'.date('Y-m-d H:i:s',time()));
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A1',$filename);
            //主标题和副标题的格式
            $objPHPExcel->setActiveSheetIndex(0)->getRowDimension(1)->setRowHeight(35);
            $objPHPExcel->setActiveSheetIndex(0)->getStyle('A1')->getFont()->setName('黑体');
            $objPHPExcel->setActiveSheetIndex(0)->getStyle('A1')->getFont()->setSize(20);
            $objPHPExcel->setActiveSheetIndex(0)->getStyle('A2')->getFont()->setName('黑体');
            $objPHPExcel->setActiveSheetIndex(0)->getStyle('A2')->getFont()->setSize(16);
            $objPHPExcel->setActiveSheetIndex(0)->getStyle('A1')->getFont()->setBold(true);
            //设置居中
            $objPHPExcel->getActiveSheet(0)->getStyle('A1:'.$cellName[$cellNum].(count($data)+3))->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
            //设置Excel头
            $flag = 0;
            $temp = 0;
            for($i=0;$i<$cellNum;$i++){
                $objPHPExcel->setActiveSheetIndex(0)->setCellValue($cellName[$i].'3', $title[$i]);
                $objPHPExcel->setActiveSheetIndex(0)->getStyle($cellName[$i].'3')->getFont()->setBold(true);
                if($title[$i]=='备注'||$title[$i]=='月出勤天数'||$title[$i]=='考核状态'){
                    $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension($cellName[$i])->setWidth(12);
                    if($flag==1 && $title[$i]=='备注'){
                        $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension($cellName[$i])->setWidth(30);
                    }
                }else if($title[$i]=='考核时间'){
                    $flag = 1;
                    $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension($cellName[$i])->setWidth(20);
                }else if(is_numeric($title[$i])){
                    $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension($cellName[$i])->setWidth(6);
                }else if(strstr($title[$i],'星期')){
                    $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension($cellName[$i])->setWidth(25);
                }else if($title[$i]=='身份证号码'){
                    $temp = $cellName[$i];
                    $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension($cellName[$i])->setWidth(20);
                }else if($title[$i]=='现工作/学习单位'){
                    $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension($cellName[$i])->setWidth(25);
                }else if($title[$i]=='联系方式'){
                    $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension($cellName[$i])->setWidth(15);
                }else{
                    $objPHPExcel->setActiveSheetIndex(0)->getColumnDimension($cellName[$i])->setWidth(10);
                }
            }
            //填充数据
            for($i=0;$i<count($data);$i++){
                $count = 0;
                foreach($data[$i] as $k=>$v){
                    $objPHPExcel->getActiveSheet(0)->setCellValue($cellName[$count].($i+4), $data[$i][$k]);
                    if($k=='card_no'){
                        $objPHPExcel->getActiveSheet(0)->setCellValueExplicit($cellName[$count].($i+4), $data[$i][$k],PHPExcel_Cell_DataType::TYPE_STRING);
                        $objPHPExcel->getActiveSheet(0)->getStyle($cellName[$count])->getNumberFormat()
                            ->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_TEXT);
                    }
                    if($temp!=0){
                        $objPHPExcel->getActiveSheet()->setCellValueExplicit($temp.$i,$data[$i][$k],PHPExcel_Cell_DataType::TYPE_STRING);
                        $objPHPExcel->getActiveSheet()->getStyle($temp.$i)->getNumberFormat()->setFormatCode("@");
                    }
                    if(strpos($k,'day')!==false){
                        if(strpos($v,'旷工')!==false || strpos($v,'假')!==false){
                            $objPHPExcel->getActiveSheet()->getStyle( $cellName[$count].($i+4))->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);
                        }
                        if(strpos($v,'夜')!==false || strpos($v,'唤')!==false){
                            $objPHPExcel->getActiveSheet()->getStyle( $cellName[$count].($i+4))->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_GREEN);
                        }
                        if($v=='0') {
                            $objPHPExcel->getActiveSheet(0)->setCellValue($cellName[$count].($i+4),'');
                        }
                    }
                    $count++;
                }
            }
            $objPHPExcel->getActiveSheet()->getStyle('A3:'.$cellName[$cellNum-1].((count($data)+3)))->getBorders()->getAllBorders()->setBorderStyle(PHPExcel_Style_Border::BORDER_THIN);
            ob_end_clean();
            header("Content-type:application/octet-stream");
            header("Accept-Ranges:bytes");
            header("Content-type:application/vnd.ms-excel;charset=utf-8");
            header("Content-Disposition:attachment;filename=".$filename.".xlsx");
            header('Cache-Control: max-age=0');
            //header("Pragma: no-cache");
            header("Expires: 0");
            $timestamp = time();
            $encoded_filename = urlencode($filename);
            $encoded_filename = str_replace("+", "%20", $encoded_filename);
            $ua = $_SERVER["HTTP_USER_AGENT"];
            if (preg_match("/MSIE/", $ua)||preg_match("/Trident/",$ua)) {
                header('Content-Disposition: attachment; filename="' . $encoded_filename . $timestamp.'.xls"');
            } else if (preg_match("/Firefox/", $ua)) {
                header('Content-Disposition: attachment; filename*="utf8\'\'' . $filename .  $timestamp.'.xls"');
            } else {
                header('Content-Disposition: attachment; filename="' . $filename . $timestamp. '.xls"');
            }
            $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
            $objWriter->save('php://output');
            exit;
        }
        /**
         * 系统邮件发送函数
         * @param string $to    接收邮件者邮箱
         * @param string $name  接收邮件者名称
         * @param string $subject 邮件主题
         * @param string $body    邮件内容
         * @param string $attachment 附件列表
         * @return boolean
         */
        function think_send_mail($to, $name, $subject = '', $body = '', $attachment = null){
            $config = C('THINK_EMAIL');
            vendor('PHPMailer.class#phpmailer'); //从PHPMailer目录导class.phpmailer.php类文件
            vendor('PHPMailer.class#smtp');
            $mail             = new PHPMailer(); //PHPMailer对象
            $mail->CharSet    = 'UTF-8'; //设定邮件编码，默认ISO-8859-1，如果发中文此项必须设置，否则乱码
            $mail->IsSMTP();  // 设定使用SMTP服务
            $mail->SMTPDebug  = 1;                     // 关闭SMTP调试功能
            // 1 = errors and messages
            // 2 = messages only
            $mail->SMTPAuth   = true;                  // 启用 SMTP 验证功能
            $mail->SMTPSecure = '';                 // 使用安全协议
            $mail->Host       = $config['SMTP_HOST'];  // SMTP 服务器
            $mail->Port       = $config['SMTP_PORT'];  // SMTP服务器的端口号
            $mail->Username   = $config['SMTP_USER'];  // SMTP服务器用户名
            $mail->Password   = $config['SMTP_PASS'];  // SMTP服务器密码
            $mail->SetFrom($config['FROM_EMAIL'], $config['FROM_NAME']);
            $replyEmail       = $config['REPLY_EMAIL']?$config['REPLY_EMAIL']:$config['FROM_EMAIL'];
            $replyName        = $config['REPLY_NAME']?$config['REPLY_NAME']:$config['FROM_NAME'];
            $mail->AddReplyTo($replyEmail, $replyName);
            $mail->Subject    = $subject;
            $mail->MsgHTML($body);
            $mail->AddAddress($to, $name);
            if(is_array($attachment)){ // 添加附件
                foreach ($attachment as $file){
                    is_file($file) && $mail->AddAttachment($file);
                }
            }
            return $mail->Send() ? true : $mail->ErrorInfo;
        }
        public function importExcel($file){
            if(!file_exists($file)){
                return array("error"=>0,'message'=>'file not found!');
            }
            chmod($file,0777);
            if(!is_readable($file)) {
                return array("error"=>0,'message'=>'file is not readable');
            }
            Vendor("PHPExcel.IOFactory");
            //兼容多种版本的Excel
            $objReader = PHPExcel_IOFactory::createReader('Excel5');
            $PHPReader = $objReader->load($file);
            /* if(!$PHPReader){
                $objReader = PHPExcel_IOFactory::createReader('Excel2007');
                $PHPReader = $objReader->load($file);
                if(!$PHPReader){
                    $objReader = PHPExcel_IOFactory::createReader('Excel5');
                    $PHPReader = $objReader->load($file);
                    if(!$PHPReader){
                        return array("error"=>0,'message'=>'文件格式错误');
                    }
                }
            } */
            if(!isset($PHPReader)) return array("error"=>0,'message'=>'read error!');
            $allWorksheets = $PHPReader->getAllSheets();
            $i=0;
            foreach($allWorksheets as $objWorksheet){
                $sheetname=$objWorksheet->getTitle();
                $allRow = $objWorksheet->getHighestRow();//how many rows
                $highestColumn = $objWorksheet->getHighestColumn();//how many columns
                $allColumn = PHPExcel_Cell::columnIndexFromString($highestColumn);
                $array[$i]["Title"] = $sheetname;
                $array[$i]["Cols"] = $allColumn;
                $array[$i]["Rows"] = $allRow;
                $arr = array();
                $isMergeCell = array();
                foreach ($objWorksheet->getMergeCells() as $cells) {//merge cells
                    foreach (PHPExcel_Cell::extractAllCellReferencesInRange($cells) as $cellReference) {
                        $isMergeCell[$cellReference] = true;
                    }
                }
                for($currentRow = 1 ;$currentRow<=$allRow;$currentRow++){
                    $row = array();
                    for($currentColumn=0;$currentColumn<$allColumn;$currentColumn++){
                        $cell =$objWorksheet->getCellByColumnAndRow($currentColumn, $currentRow);
                        $afCol = PHPExcel_Cell::stringFromColumnIndex($currentColumn+1);
                        $bfCol = PHPExcel_Cell::stringFromColumnIndex($currentColumn-1);
                        $col = PHPExcel_Cell::stringFromColumnIndex($currentColumn);
                        $address = $col.$currentRow;
                        $value = $objWorksheet->getCell($address)->getValue();
                        if(substr($value,0,1)=='='){
                            return array("error"=>0,'message'=>'can not use the formula!');
                            exit;
                        }
                        if($cell->getDataType()==PHPExcel_Cell_DataType::TYPE_NUMERIC){
                            $cellstyleformat=$cell/* ->getParent() */->getStyle( $cell->getCoordinate() )->getNumberFormat();
                            $formatcode=$cellstyleformat->getFormatCode();
                            if (preg_match('/^([$[A-Z]*-[0-9A-F]*])*[hmsdy]/i', $formatcode)) {
                                $value=gmdate("Y-m-d", PHPExcel_Shared_Date::ExcelToPHP($value));
                            }else{
                                $value=PHPExcel_Style_NumberFormat::toFormattedString($value,$formatcode);
                            }
                        }
                        if($isMergeCell[$col.$currentRow]&&$isMergeCell[$afCol.$currentRow]&&!empty($value)){
                            $temp = $value;
                        }elseif($isMergeCell[$col.$currentRow]&&$isMergeCell[$col.($currentRow-1)]&&empty($value)){
                            $value=$arr[$currentRow-1][$currentColumn];
                        }elseif($isMergeCell[$col.$currentRow]&&$isMergeCell[$bfCol.$currentRow]&&empty($value)){
                            $value=$temp;
                        }
                        //$value = iconv( "UTF-8","gb2312", $content); 
                        $row[$currentColumn] = $value;
                    }
                $arr[$currentRow] = $row;
             }
             $array[$i]["Content"] = $arr;
             $i++;
         }
         spl_autoload_register(array('Think','autoload'));//must, resolve ThinkPHP and PHPExcel conflicts
         unset($objWorksheet);
         unset($PHPReader);
         unset($PHPExcel);
         unlink($file);
         return array("error"=>1,"data"=>$array);
       }
    /**
        * 下载模板文件
        * @param 文件名 $fileName
        * @param 文件路径 $filePath
        */
       public function downloadTpl($fileName,$filePath){
           //$filePath = 'upload/template/template.xls';
           $fp = fopen($filePath,'rwx');
           if(!$filePath || !$fp){
               header('HTTP/1.1 404 Not Found');
               echo "Error: 404 Not Found.(server file path error)<!-- Padding --><!-- Padding --><!-- Padding --><!-- Padding --><!-- Padding --><!-- Padding --><!-- Padding --><!-- Padding --><!-- Padding --><!-- Padding --><!-- Padding --><!-- Padding --><!-- Padding --><!-- Padding -->";
               exit;
           }
           $encoded_filename = urlencode($fileName);
           $encoded_filename = str_replace("+", "%20", $encoded_filename);
           ob_end_clean();
           header('HTTP/1.1 200 OK');
           header( "Pragma: public" );
           header( "Expires: 0" );
           header("Content-type: application/octet-stream");
           header("Content-Length: ".filesize($filePath));
           header("Accept-Ranges: bytes");
           header("Accept-Length: ".filesize($filePath));
           $ua = $_SERVER["HTTP_USER_AGENT"];
           if (preg_match("/MSIE/", $ua)) {
               header('Content-Disposition: attachment; filename="' . $encoded_filename . '"');
           } else if (preg_match("/Firefox/", $ua)) {
               header('Content-Disposition: attachment; filename*="utf8\'\'' . $fileName . '"');
           } else {
               header('Content-Disposition: attachment; filename="' . $fileName . '"');
           }
           // ob_end_clean(); <--有些情况可能需要调用此函数
           // 输出文件内容
           fpassthru($fp);
           exit;
       }
   }