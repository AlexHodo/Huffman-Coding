<?php

require_once __DIR__ . "/class/Encoding.php";

$x = new Encoding();

if(!isset($_GET['input'])) {
	die("Please enter an input.");
}

if(!$x->SetInput($_GET['input'])) {
	echo $x->errorMsg;
}

$x->Encode();
