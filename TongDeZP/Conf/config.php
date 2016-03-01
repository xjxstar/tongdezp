<?php
return array(
	//'配置项'=>'配置值'
    'DB_TYPE'               => 'mysql',     // 数据库类型
    'DB_HOST'               => 'localhost', // 服务器地址
    'DB_NAME'               => 'tongde_zp',         // 数据库名
    'DB_USER'               => 'root',      // 用户名
    'DB_PWD'                => 'root',          // 密码
    'DB_PORT'               => '3306',        // 端口
    'DB_PREFIX'             => '',    // 数据库表前缀
    //'SHOW_PAGE_TRACE' =>true, // 显示页面Trace信息
    'URL_HTML_SUFFIX'=>'',
    'TMPL_PARSE_STRING' => array(
        '__HTML__' => __ROOT__.'/Tpl/html',
        '__JS__' => __ROOT__.'/Tpl/js',
        '__CSS__' => __ROOT__.'/Tpl/css',
        '__IMG__' => __ROOT__.'/Tpl/images',
        '__URL__' =>__ROOT__.'/index.php',
        '__Tpl__' =>__ROOT__.'/Tpl',
        '__APP__'=>__ROOT__.''
    ),
    'THINK_EMAIL' => array(
        'SMTP_HOST'   => 'smtp.sina.com', //SMTP服务器
        'SMTP_PORT'   => '25', //SMTP服务器端口
        'SMTP_USER'   => 'leafstar717@sina.com', //SMTP服务器用户名
        'SMTP_PASS'   => 'xjx823', //SMTP服务器密码
        'FROM_EMAIL'  => 'leafstar717@sina.com', //发件人EMAIL
        'FROM_NAME'   => 'tongde', //发件人名称
        'REPLY_EMAIL' => '', //回复EMAIL（留空则为发件人EMAIL）
        'REPLY_NAME'  => '', //回复名称（留空则为发件人名称）
    )
);
?>