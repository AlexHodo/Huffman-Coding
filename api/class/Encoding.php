<?php

require_once __DIR__ . "./../init.php";

class Node {
	public $char;
	public $frequency;
	public $left;
	public $right;
	public $encoding;
}

class Encoding 
{
	
	public $input;
	public $output;
	public $success;
	public $errorMsg;
	public $frequencies;
	public $inputLength;
	public $tree;
	public $leaves;
	public $bit;

	public function __construct() {

		$this->frequencies = array();
		$this->tree = array();
		$this->input = "";
		$this->inputLength = 0;
		$this->leaves = array();
		$this->bit = array();
		$this->bit[0] = "0";
		$this->bit[1] = "1";

	}

	public function SetInput($input) {

		$input = trim($input);

		if(!$this->ValidateInput($input)) {
			return false;
		} else {
			$this->input = trim($input);
		}
		$this->ComputeFrequencies();
		return true;
	}

	public function GetOutput() {

		return $this->output;

	}

	public function GerError() {

		return $this->errorMsg;

	}

	public function Encode() {

		$this->SortFrequencies();
		$this->tree = array();
		foreach($this->frequencies as $char=>$frequency) {
			$tmpNode = new Node();
			$tmpNode->char = $char;
			$tmpNode->frequency = $frequency;
			array_push($this->tree, $tmpNode);
		}

		while(sizeof($this->tree) > 2) {

			$tmpNode = new Node();
			$tmpNode->left = $this->tree[sizeof($this->tree)-1];
			$tmpNode->right = $this->tree[sizeof($this->tree)-2];
			$tmpNode->frequency = $tmpNode->left->frequency + $tmpNode->right->frequency;


			unset($this->tree[sizeof($this->tree)-1]);
			unset($this->tree[sizeof($this->tree)-1]);

			$rightIndex = sizeof($this->tree)-1;

			for($i = $rightIndex; $i >= 0; $i--) {
				if($this->tree[$i]->frequency < $tmpNode->frequency) {
					$rightIndex = $i;
				} else {
					break;
				}
			}

			for($i = sizeof($this->tree); $i > $rightIndex; $i--) {
				$this->tree[$i] = $this->tree[$i-1];
			}

			$this->tree[$rightIndex] = $tmpNode;

		}

		$tmpNode = new Node();
		$tmpNode->left = $this->tree[1];
		$tmpNode->right = $this->tree[0];
		$this->tree = $tmpNode;

		$this->SetCharEncoding($this->bit[0], $this->tree->left);
		$this->SetCharEncoding($this->bit[1], $this->tree->right);
		
		$this->output = "";
		for($i = 0; $i < $this->inputLength; $i++) {
			$this->output .= $this->leaves[$this->input[$i]];
		}

	}

	private function SetCharEncoding($encoding, &$node) {

		if($node == null) {
			return;
		} else if($node->char == null) {
			$this->SetCharEncoding($encoding . $this->bit[0], $node->left);
			$this->SetCharEncoding($encoding . $this->bit[1], $node->right);
		} else {
			$node->encoding = $encoding;
			$this->leaves[$node->char] = $encoding;
		}

	}

	private function ComputeFrequencies() {

		for($i = 0; $i < $this->inputLength; $i++) {
			if(!isset($this->frequencies[$this->input[$i]])) {
				$this->frequencies[$this->input[$i]] = 1;
			} else {
				$this->frequencies[$this->input[$i]] += 1;
			}
		}

	}

	private function SortFrequencies() {

		uasort($this->frequencies, function($a, $b) {
		    return $b - $a;
		});

	}

	private function ValidateInput($inputToValidate) {

		$tmpLength = strlen($inputToValidate);
		if($tmpLength < MIN_LEN) {
			$this->success = false;
			$this->errorMsg = "The input must have at least " . MIN_LEN . " characters.";
			return false;
		}
		if($tmpLength > MAX_LEN) {
			$this->success = false;
			$this->errorMsg = "The input can have up to " . MAX_LEN . " characters.";
			return false;
		}

		$this->inputLength = $tmpLength;
		return true;

	}

}
