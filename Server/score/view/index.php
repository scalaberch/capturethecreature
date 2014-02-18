<?php

if(isset($_GET))
{

mysql_connect('localhost','damz', 'password') OR DIE ("Server is Busy");
mysql_select_db('ctcdb');


$result = mysql_query("SELECT * FROM player Order by score DESC");
$total_rows=mysql_num_rows($result);

echo "{";
	for($rows=0; $rows<$total_rows; $rows++)
	{ 
	$row=mysql_fetch_array($result, MYSQL_ASSOC);
	$name = $row['name'];
	$score = $row['score'];

	if($rows==$total_rows-1)
		echo '"name":"'.$name.'","score":'.$score.'}';
	else
		echo '"name":"'.$name.'","score":'.$score.',';


	}

}



?>