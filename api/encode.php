<?php

require_once __DIR__ . "/init.php";
require_once __DIR__ . "/class/Encoding.php";

// Initialize the JSON output object
$response = array(
	"success" => false,
	"errorMsg" => null,
	"input" => null,
	"bin" => null,
	"hex" => null,
	"encodings" => array(),
	"frequencies" => array(),
	"length" => null,
    "characters" => array(),
    "LC" => null
);

if(!isset($_POST['input'])) { // input is a mandatory POST parameter

	$response['success'] = false;
	$response['errorMsg'] = "Required field not set (input).";

} else {

	$input = $_POST['input'];

	$encoding = new Encoding(); // initialize the Encoding class
	if(!$encoding->SetInput($input)) { // if setting the input fails

		$response['success'] = false;
		$response['errorMsg'] = $encoding->errorMsg;

	} else { // if setting the innput is successful

		$encoding->Encode(); // encode the input and change the contents of $response accordingly 
		$response['success'] = true;
		$response['errorMsg'] = null;
		$response['bin'] = $encoding->output;
		$response['hex'] = bin2base64($encoding->output);
		$response['encodings'] = $encoding->leaves;
		$response['frequencies'] = $encoding->frequencies;
		$response['length'] = $encoding->inputLength;
        $response['data'] = array();
		$response['input'] = $encoding->input;
        $frequencies = $encoding->frequencies;
        $inputLength = $encoding->inputLength;
        $response['LC'] = 0;
        $key = 0;
        $colorsCount = sizeof($encoding->leaves);
        $count = 1;
        foreach($encoding->leaves as $char=>$encoding) { // for each leaf of the generated tree
        	$response['LC'] += strlen($encoding) * ($frequencies[$char] / $inputLength);
        	$color = "hsl(" . (360/$colorsCount * $count++). ", 100%, " . rand(30,40) . "%)"; // generate a distinct color for each character
            $response['data'][$char] = array(
                "encoding" => $encoding,
                "encodingLength" => strlen($encoding),
                "frequency" => $frequencies[$char],
                "weight" => $frequencies[$char] / $inputLength,
                "frequencyExtended" => $frequencies[$char] . "/" . $inputLength,
                "frequencyPercent" => number_format((float)(100 * $frequencies[$char] / $inputLength), 6, '.', ''),
                "contribution" => strlen($encoding) * ($frequencies[$char] / $inputLength),
                "key" => $key++,
                "color" => $color,
                "isSpecial" => isSpecial($char) !== false,
                "specialName" => isSpecial($char) !== false? isSpecial($char) : null,
                "char" => $char
            );
        }
        $response['LC'] = number_format($response['LC'], 6, '.', '');
	}
}

/**
 *
 * Check if a character is special (currently, it checks whether the character is a whitespace or a newline)
 *
 * @param char $char : a character
 * @return bool : $char is a special char
 *
**/
function isSpecial($char) {
	if($char == " ") {
		return "whitespace";
	} else if($char == "\n") {
		return "newline";
	} else {
		return false;
	}
}

echo json_encode($response); // print the JSON object
