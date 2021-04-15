<?php

define("MIN_LEN", 3);
define("MAX_LEN", 2048);
    
ini_set('serialize_precision', -1);

/*
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('P3P: CP="CAO PSA OUR"');
*/

header('Content-Type: application/json');

$postData = json_decode(file_get_contents('php://input'), true);
$_POST = $postData;

function bin2base64($bin) {
    $arr = str_split($bin, 8);
    $str = '';
    foreach ( $arr as $binNumber ) {
        $str .= chr(bindec($binNumber));
    }
    return str_replace("=", "", base64_encode($str));
}
