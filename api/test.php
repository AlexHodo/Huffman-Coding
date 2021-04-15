<?php

require_once "class/HuffmanCoding.php";

$x = new Encoding();

if(!$x->SetInput("The Huffman algorithm will create a tree with leaves as the found letters and for value (or weight) their number of occurrences in the message. To create this tree, look for the 2 weakest nodes (smaller weight) and hook them to a new node whose weight is the sum of the 2 nodes. Repeat the process until having only one node, which will become the root (and that will have as weight the total number of letters of the message).")) {
	echo $x->errorMsg;
}

$x->Encode();
echo $x->GetOutput();