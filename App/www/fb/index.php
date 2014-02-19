<?php

	require_once("fbAPI/src/facebook.php");
	$config = array(
      'appId' => '783064738375108',
      'secret' => '3418ef41610f6800a80eee1369899cda',
      'fileUpload' => false, // optional
      'allowSignedRequest' => false, // optional, but should be set to false for non-canvas apps
  	);


  	$facebook = new Facebook($config);
  	$user_id = $facebook->getUser();

  	print_r($user_id);


?>