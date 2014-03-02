<?php

if(isset($_GET))
{

$link = mysql_connect('localhost','root', 'root') OR DIE ("Server is Busy");
mysql_select_db('ctc', $link);

$data = $_POST['scores'];

$success = true;
foreach($data as $d){
	$string = "INSERT INTO player VALUES(NULL, '".$d['name']."', ".$d['score'].", ";

	if ($d['timestamp'] == null){
		$string .= "CURRENT_TIMESTAMP)";
	} else { $string .= "'".$d['timestamp']."')"; }
		

	//echo $string;
	//echo "<br>";
	$info = mysql_query($string);
	if (!$info){ $success = false; }
}

mysql_close($link);
if ($success){
	echo '{"success":"true"}';
} else { echo '{"success":"false"}'; }


}






?>