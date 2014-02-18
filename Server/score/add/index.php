<?php

if(isset($_GET))
{

mysql_connect('localhost','damz', 'password') OR DIE ("Server is Busy");
mysql_select_db('ctcdb');

$name=$_GET['name'];
$score=$_GET['score'];

$result = mysql_query("INSERT INTO player VALUES (NULL, '$name', '$score')");


}






?>