<?php
ini_set('date.timezone','Asia/Shanghai');
use app\admin\controller\RequestController;

define('ABSPATH', dirname(__FILE__) . '/');

require_once ABSPATH . "async-task/autoload.php";

$host = $argv[1];
// $host = "http://121.196.197.45";

$container = $argv[2];

if($container == 'taxonomy')
{
    $param = [
        "json" => "{$argv[3]}"
    ];
    
    $url = "/wp-json/admin/v1/async_json";
    
    $param_array = json_decode($param['json'], true);
    
    if(!empty($param_array['lang']))
    {
        $url .= '?lang='.$param_array['lang'];
    }
    
    $result = RequestController::post($host . $url ,$param);
    
    echo json_encode($result);
}

if($container == 'post')
{

    $filepath = ABSPATH . "post.log";

    $myfile = fopen($filepath, "a");

    $json = file_get_contents($argv[3]);

    $param = [
        "json" => $json
    ];

    fwrite($myfile, date('Y-m-d H:i:s')." --cli参数：".$json . "\r\n");
    
    $url = "/wp-json/admin/v1/async_post";
    
    $param_array = json_decode($param['json'], true);

    if(!empty($param_array['lang']))
    {
        $url .= '?lang='.$param_array['lang'];
    }

    fwrite($myfile, date('Y-m-d H:i:s')." --：RequestController::post host".$host . '-- url：'.$url . '-- param：'.json_encode($param) . "\r\n");
    
    $result = RequestController::post($host . $url ,$param);

    echo json_encode($result);

    fwrite($myfile, date('Y-m-d H:i:s')." --cli结果：".json_encode($result) . "\r\n");

    fclose($myfile);
    chmod($filepath, 0755);
    

}