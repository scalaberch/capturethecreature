<?php




//mysql_connect('localhost','damz', 'password') OR DIE ("Server is Busy");
//mysql_select_db('ctcdb');

//print_r($mysql_config);

$link = mysql_connect('localhost', 'root', 'root');
if (!$link){
	//echo "cant connect...";
}

$db_selected = mysql_select_db('ctc', $link);

$query = mysql_query("SELECT * FROM player ORDER BY score DESC");
//$total_rows=mysql_num_rows($result);

$json = '['; $first = true;
while($result = mysql_fetch_array($query)){
	if ($first){ $first = false; } else { $json .= ", "; }

	$json .= '{"name":"'.$result['name'].'", "score":'.$result['score'].'}';
} $json .= ']';

echo $json;
mysql_close($link);




?>