<?php

require_once __DIR__ . "/init.php";
require_once __DIR__ . "/class/Encoding.php";

$response = array(
	"success" => false,
	"errorMsg" => null,
	"input" => null,
	"bin" => null,
	"hex" => null,
	"encodings" => array(),
	"frequencies" => array(),
	"length" => null,
    "characters" => array()
);

if(!isset($_POST['input'])) {

	$response['success'] = false;
	$response['errorMsg'] = "Required field not set (input).";

} else {

	$input = $_POST['input'];

	$response['input'] = $input;
	$encoding = new Encoding();
	if(!$encoding->SetInput($input)) {

		$response['success'] = false;
		$response['errorMsg'] = $encoding->errorMsg;

	} else {

		$encoding->Encode();
		$response['success'] = true;
		$response['errorMsg'] = null;
		$response['bin'] = $encoding->output;
		$response['hex'] = bin2base64($encoding->output);
		$response['encodings'] = $encoding->leaves;
		$response['frequencies'] = $encoding->frequencies;
		$response['length'] = $encoding->inputLength;
        $response['data'] = array();
        $frequencies = $encoding->frequencies;
        $inputLength = $encoding->inputLength;
        $key = 0;
        $colorsCount = sizeof($encoding->leaves);
        $count = 1;
        foreach($encoding->leaves as $char=>$encoding) {
        	$color = "hsl(" . (360/$colorsCount * $count++). ", 100%, " . rand(30,40) . "%)";
            $response['data'][$char] = array(
                "encoding" => $encoding,
                "encodingLength" => strlen($encoding),
                "frequency" => $frequencies[$char],
                "frequencyExtended" => $frequencies[$char] . "/" . $inputLength,
                "frequencyPercent" => number_format((float)(100 * $frequencies[$char] / $inputLength), 6, '.', ''),
                "key" => $key++,
                "color" => $color,
                "isSpecial" => $char == " ",
                "specialName" => $char == " " ? "whitespace" : null,
                "char" => $char
            );
        }
	}
}

echo json_encode($response);
