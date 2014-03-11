


var _server = {

	//host: "http://192.168.10.104/capturethecreature/Server",
	host: "http://capturethatcreature.ap01.aws.af.cm/Server",
	localhost: "/capturethecreature/Server",

	local:false,

	getLeaderBoardLocation: function(){
		if (this.local){
			return this.localhost + "/score/view/";
		} else { return this.host + "/score/view/"; }
		
		//return this.host;
	},
	submitScoreLocation: function(){
		if (this.local){
			return this.localhost + "/score/add/";
		} else { return this.host + "/score/add/"; }
	}

}


// localStorage objecvt
//	Requires: cordova.js
//	This implements the localStorage. Pero pwede ra gud ni sa normal na HTML5 but ang
//		implementation kay sa cordova man guuud... :3

var _localStorage = {

  db: null,

  init: function(){
    if (!window.openDatabase) {
           // not all mobile devices support databases  if it does not, thefollowing alert will display
           // indicating the device will not be albe to run this application
      console.log('Databases are not supported in this browser.');
      return;
    }

    //_localStorage.db = openDatabase("CTCLocalDB", "1.0000", "CTC Local DB", 65535);
    var db = openDatabase('CTCLocalDBFinal', '1.0000', 'CTCLocalDatabase', 65535);

    // This will execute the table chochoo....
    var context = this;

    db.transaction(function(t){
      //console.log(t);

      t.executeSql( 'DROP TABLE TempScores ', function(){ console.log("Query Null Data."); }, function(){ console.log("Query Error."); } );
      t.executeSql( 'CREATE TABLE TempScores (ScoresId INTEGER NOT NULL PRIMARY KEY, Name TEXT, Score INTEGER, Date TEXT, Transmit TEXT) ',  function(){ console.log("Query Null Data."); }, function(e){ console.log(e); } );
      t.executeSql( 'CREATE TABLE PhoneUser (Name TEXT)', function(){ console.log("Query Null Data."); },function(e){ console.log(e); } );

    }, function(t, e){ console.log("Initial Transaction failed."); }, this.successCallBack)



    this.db = db;
    return _localStorage.db;
  },

  // Insert to scores...
  insertScore: function(name, score){
    if (this.db == null){
      return false;
    } else {
      this.db.transaction(function(t) {
          t.executeSql('INSERT INTO TempScores(Name, Score, Transmit) VALUES (?,?,?)',[name, score, 'READY'], 
          this.nullHandler,this.errorHandler);
      }); 
    } 
  },

  // Update Fields as Sent...


  // Wipe out the data...
  wipeData: function(){
    if (this.db == null){
      return false;
    } else {
      this.db.transaction(function(t) {
          t.executeSql('DELETE FROM TempScores',[], this.nullHandler,this.errorHandler);
      });
    }
  },

  // View scores...
  viewScores: function(){
    var results = [], context = this;

    _localStorage.db.transaction(function(transaction) {
       transaction.executeSql('SELECT * FROM TempScores;', [],
         
         function(transaction, result) {

              if (result != null && result.rows != null) {
                  for (var i = 0; i < result.rows.length; i++) {

                    //var row = result.rows.item(i);
                    //$('#lbUsers').append('<br>' + row.ScoresId + '. ' +row.Name+ ' ' + row.Score + ' ' + row.GameDate);

                    results.push( result.rows.item(i) );

                  }

              }

              console.log(results);
         
         },context.errorHandler);
     }, _localStorage.errorHandler, this.nullHandler);

  },

  // Handlers...
  nullHandler:  function(){ },
  errorHandler: function(transaction, e) {
      console.log('Error: ' + e.message + ' code: ' + e.code);
  },
  successCallBack: function(){
      console.log("SQL Action success!");
  }

}

// This is the object for the gameplay...
//	You'll need this for the current game session. Each session is
//	limited to 2 minutes only. User credentials are either stored in
//	session/phone storage or at Facebook


var _facebook = {

	init: function(){

		if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) 
			alert('Cordova variable is missing. Check  cordova.js included correctly');
            	if (typeof CDV == 'undefined') 
			alert('CDV variable is missing. Check cdv-plugin-fb-connect.js is included correctly');
            	if (typeof FB == 'undefined') 
			alert('FB variable is missing. Check the Facebook JS SDK file included.');


			FB.Event.subscribe('auth.login', function(response) {
                               alert('login event fired !!');
                               });
            
            	FB.Event.subscribe('auth.logout', function(response) {
                               alert('logout event fired !!');
                               });
           
            
            	FB.Event.subscribe('auth.statusChange', function(response) {
                               alert('statusChange event fired !!');
                               });
            
/*
		window.fbAsyncInit = function() {
	        FB.init({
	          appId      : '783064738375108',
	          status     : true,
	          xfbml      : true
	        });
	    };

	    (function(d, s, id){
	         var js, fjs = d.getElementsByTagName(s)[0];
	         if (d.getElementById(id)) {return;}
	         js = d.createElement(s); js.id = id;
	         js.src = "//connect.facebook.net/en_US/all.js";
	         fjs.parentNode.insertBefore(js, fjs);
	    }(document, 'script', 'facebook-jssdk')); */
	},

	postOnWall: function(){

	},

	getLoginStatus: function()
	{
                FB.getLoginStatus(function(response) {
                                  if (response.status == 'connected') 
				  {
                                  	alert('You are connected to Fb');
                                  } 
				  else 
				  {
                                 	alert('not connected to FB');
                                  }
                                  });


	},

	logout: function()
	{
                FB.logout(function(response) {
                          alert('logged out');
                          });

	},

	login: function()
	{
                FB.login(
                         function(response) {
                         if (response.session) {
                         alert('you are logged in');
                         } else {
                         alert('you are not logged in');
                         }
                         },
                         { scope: "email" }
                         );
	},

	postMsg: function()
	{

		FB.login(function(response){
			alert("Logging in...");
			if (response.session){
				//_facebook.postMsg();
				alert("has logged in!");
			} else { alert("Could not authorize user to facebook."); }
		}, {scope:"email"} );

/*
		FB.ui( { 
			method:"feed", 
			name: 'I just scored '+_gamePlay.score+' points in Capture that Creature!', 
			caption: 'Play Capture that Creature now!', 
			description: ( 'Capture that Creature is a mobile game application ' + 
				'for Android. Find the cute creatures and get points if ' +
				'you get them!' ), link:"http://www.facebook.com/capturethatcreaturegame", 
			display: "dialog" 
		}, function(response) { 
			if (response && response.post_id) { console.log('Post was published.'); } 
			else { console.log('Post was not published.'); } 
		} );
*/

	}


}


var _gamePlay = {

	isPlaying: false,
	isShowing: false,
	isPaused:  false,

	score:     0,
	myGuess:   [],
	level: 	   3, // limit of the taps :)
	target:    null,

	//temp var...
	gameLayer:null,

	playerStats: {
		showTimerOffset: 3000,
		showTimer: 3000/1000,
		numberOfCorrectGuesses: 0,

		initPlayerStats: function(){
			// This will get to the cordova data...
		},

		reset: function(){
			_gamePlay.level = 3;
			this.showTimerOffset = 3000;
			numberOfCorrectGuesses = 0;
		},
		update: function()
		{

			// Update on showTimerOffset
			if (this.showTimerOffset > 999){
				this.showTimerOffset -= 166;
				
				this.showTimer = this.showTimerOffset/1000;
			}

			// Update on number of taps...
			//switch(previousCorrectGuess){
			this.numberOfCorrectGuesses += 1;
			switch( this.numberOfCorrectGuesses){
				case 5: _gamePlay.level = 4; break;
				case 10: _gamePlay.level = 5; break;
				case 15: _gamePlay.level = 6; break;
			}

		}

	},

	startPlaying: function(){ this.isPlaying = true;  },
	stopPlaying : function(){ this.isPlaying = false; },
	pauseGame: function(){ 
		_gamePlay.isPaused = true; 
	},
	resumeGame: function(){ _gamePlay.isPaused = false; },

	// OnClick on the Start Game will execute this one!
	startGame: function(e){
		// Initialize the board daan...
		var gameLayer 		= null, //e.targetNode.getParent().getParent(),
			gameTimerObj 	= _app.screens[1].find("#GAME_TIMER_TXT")[0];

		// Reset stats...
		this.resetGameStats();
		this.playerStats.reset();
			
		if (_gamePlay.isPaused){
			_gamePlay.resumeGame();
		}

		// Start the timer and its animation/s...
		//_gamePlay.startPlaying();
		_gamePlay.gameTimer.start(gameTimerObj, _app.screens[1]);

		// this.gameTimer.start();
		this.executeGameShuffle();

	},
	stopGame: function(){
		this.stopPlaying();
		this.callEndGame();
	},

	// Do the algo on shuffle. This acts when on the start of the game.
	//	and/or during a correct guess...
	executeGameShuffle: function(){

		if (!this.isPaused){

			// On randomization....
			this.target = _gamePlay.getRandomCharacter(0);
			_board.shuffleBoard(this.target, this.level); // level depends on the players level // -1 is used since 

			// On printing the board...
			_board.printBoard();
			_animation.updateBoardLayers(_board.board);

			// Show what to find...
			_animation.showWhatToFind(this.target);

			// Shows all the board layers               
			this.showAllBoardLayers();

			// Show how many to be caught!
			_animation.updateNumberPieces("standby");

			// TODO: Please fix here later. Kana bitaw mag pause ka. Dapat
			//	mu pause pud siya sa setTimeout, and then once i.resume... kebs ra dayun
			//setTimeout(function(){
				//_animation.hideAllBoardLayers();
				//_gamePlay.isShowing = false;
			//}, _gamePlay.playerStats.showTimerOffset);        

		}
	},
	// Show all board layers								
	showAllBoardLayers: function()
	{
		this.isShowing = true;
		_animation.showAllBoardLayers();						
	},
	

	// 	Randomly getting a character from the you know :)
	// 	  Returns the index of the random character... 
	//	   say: just a random number generator... LOL
	
	// This function is also used in getting random characters except the specific character
	// This randomizes character index except the "find" object variable
	// This is used to fill the array with different characters indexes 
	// asside from the "find" object
	getRandomCharacter: function(except)
	{
		var characterListSize = _characters.length;
		var i;
		do
		{
			i = Math.floor( Math.random()*characterListSize );
		} while(i==except);
		return i;
	},
	// (NEW) Check if guess is correct
	isMyGuessCorrect: function(guess){
		return _board.checkIfGuessCorrect(guess, this.target);
	},


	// Guess controllers. These puts in on the current guess of the player...
	//	Handlers are didto sa pag touch

	// Appending and removing to my guess
	addToGuess: function(guess){
		this.myGuess.push(guess);
	},
	removeFromGuess: function(guess){
		var index = this.myGuess.indexOf(guess);
		this.myGuess.splice(index, 1);
	},
	// Updating the guess... LOL
	updateMyGuess: function(guess){
		if (this.myGuess.indexOf(guess) == -1){
			this.addToGuess(guess);
			if (this.myGuess.length == this.playerStats.allowableClicks){

				var submit = this.myGuess.map(function(item){
					return parseInt(item, 10);
				});

				this.myGuess = submit;
				return true;

			} else { return false; }

		} else { this.removeFromGuess(guess); return false; }
	},

	// Invoke the end-game actions...
	callEndGame: function(){
		//_animation.slidePostGameDown();
		_localStorage.insertScore("Player Name", this.score);
		_animation.endGameAnimations();
	},

	// Add up to score
	//	Adds up to the score on the _gameplay
	//	This is just a basic score = character.score * number
	//		The trick is just to increment by this value to the _gamePlay.score
	//	Assigned: @ellenp 
	addUpToScore: function(character){
		var prevScore = this.score,
			nextScore = prevScore + (_characters[character].value * this.level); 
			
			

		this.score = nextScore;
		console.log(this.score);
		_animation.updateScore(prevScore, nextScore); //didto ni i.butang sa addUpToScore
		

	},


	// Game Timer Structure
	gameTimer: {

		time: 2, timer: null,
		start: function(t, l){
			// Manually starting the timer...
			if (!_gamePlay.isPlaying){
				this.timer = setInterval(function(){
					_gamePlay.gameTimer.tiktok(t, l);

				}, 1000);

				_gamePlay.startPlaying();
			}	
		},
		stop: function(){

			// Manually stopping the timer...
			if (this.timer != null){

				clearInterval(this.timer);
				this.timer = null;
			} else { console.log("timer is: "+this.timer); }
			

			_gamePlay.stopGame();
		},
		tiktok: function(txt, lyer){
			if (_gamePlay.isPaused){

																
				
			} else if (_gamePlay.isShowing){

				if (_gamePlay.playerStats.showTimer < 0)
				{
					// Covers the layers
					_animation.hideAllBoardLayers();
					// Returns to original state
					_gamePlay.playerStats.showTimer = _gamePlay.playerStats.showTimerOffset/1000;
					_gamePlay.isShowing = false;
				} 		
				else 
				{
					_gamePlay.playerStats.showTimer--;
				}

			} else {
				console.log(this.timer);
				this.time--;

				this.updateToGUI(this.showInFormat(this.time), txt, lyer);
				if (this.time == 0){
					this.stop();
				}
			}

			
		},	
		showInFormat: function(seconds){
			var result = Math.floor(seconds/60) + ":";
			if (seconds % 60 < 10){ result += "0"; }

			return result + (seconds%60) + "";
		},
		updateToGUI: function(time, text, layer){
			//console.log("Time remaining: "+this.showInFormat(this.time)+" seconds");

			text.text(time); layer.draw();
			_animation.updateTimerBar(layer);
		}

	},


	// Reset thy game stats....
	resetGameStats: function(){
		this.score = 0; // Resetting the score...
		this.gameTimer.time = 2; //Reset the time...

		_animation.resetTimerBar(); //Resetting the timer bar in the UI...
		// TODO: Reset the score ui...
	},



	// Some methodological stuff
	shareToFacebook: function(){

		//fb_publish();
		_facebook.init();
		_facebook.postMsg();	
		

		

		// Consolidate the data from the localStorage...
		var gameData = [];

		_localStorage.db.transaction(function(transaction) {
       		transaction.executeSql('SELECT * FROM TempScores;', [],
         
	        function(transaction, result) {

	        	  var stringData = "";

	              if (result != null && result.rows != null) {
	                  

	                  for (var i = 0; i < result.rows.length; i++) {

	                    //var row = result.rows.item(i);
	                    //$('#lbUsers').append('<br>' + row.ScoresId + '. ' +row.Name+ ' ' + row.Score + ' ' + row.GameDate);

	                    //'{"name":"321","score":23}#$#{"name:"131"'

	                    var name =  result.rows.item(i).Name;
	                    var score = result.rows.item(i).Score;

	                    //if(i==result.rows.length-1)
	                    //	stringData += '{"name":"' + name + '","score":' + score + '}';
	                    //else
	                    	stringData += '{"name":"' + name + '","score":' + score + '}#';

	                  }


	              }
	              		//return stringData 
	              	stringData += '{}#{}'; // Dummy crap...
	              	console.log(stringData);
	              	// Then get the current data and add it to the queued data...
					//gameData.push( { "name":"Current Test Player", "score":_gamePlay.score, "timestamp":null } );

					// Send data to the server...
					var shareData = $.ajax({
						url: _server.submitScoreLocation(),
						type:"POST", data: { scores: stringData }  //{ scores:{"test":1, "test2":2} }
					});

					shareData.fail(function(){
						console.log("Could not connect to the server. Please try again.");
					});

					shareData.success(function(data){
						console.log("Receiving response...");
						console.log(data);
							// if data is true...

								// share to facebook...
						_localStorage.wipeData();
					});
	         
	        }, _localStorage.errorHandler);

     	}, _localStorage.errorHandler, _localStorage.nullHandler);

/*
		FB.ui(
	       {
	         method:"feed",
	         name: 'I just scored '+this.score+' points in Capture that Creature!',
		     caption: 'Play Capture that Creature now!',
		     description: (
		          'Capture that Creature is a mobile game application ' +
		          'for Android. Find the cute creatures and get points if  ' +
		          'you get them!'
		     ),
		     link:"http://scalaberch.wordpress.com",
		     display: "dialog"
	       },
	       function(response) {
	         if (response && response.post_id) {
	           console.log('Post was published.');
	         } else {
	           console.log('Post was not published.');
	         }
	       }
	     );


		console.log("Sending data...");
		//console.log(JSON.stringify(gameData));

		var stringData = "";
		for(var i=0; i<gameData.length; i++){
			console.log(gameData[i]);
			stringData += "#$#";
		}

		console.log(stringData);


		// Send data to the server...
		var shareData = $.ajax({
			url: _server.submitScoreLocation(),
			type:"POST", data: { scores:JSON.stringify(gameData) }  //{ scores:{"test":1, "test2":2} }
		});

		shareData.fail(function(){
			console.log("Could not connect to the server. Please try again.");
		});

		shareData.success(function(data){
			console.log("Receiving response...");
			console.log(data);
				// if data is true...

					// share to facebook...

		}); */

	}

}






// This is the player object. This holds all the attributes for the player
// 	This includes the level of the player, the experience level and the
//	other notions such as how many clicks to be allowed
//	Note: The data is usually stored in phone storage on in the database. LOL
//  Assigned: @dams

var __player = {

	_data: {
		// Will bring the defaults for the player...
		name: "Player Name", score: 0, fbToken: null
	},

	getPlayerName: function(){ return __player._data.name; },
	setPlayerName: function(name){ this._data.name = name; }

}

var _fb = {

	fb: null,
	ifFbLogin: function(){
		if (this.fb == null){
			return false;
		} else { return true; }
	},
	init: function(){

	}


}



// This is the board object. This holds all the
// 	data for the game board and the events for
//	switching the contents
//	Assigned: @jantaps2k, @ellenp

var _board = {

	board: [0, 0, 0, 0, 
			0, 0, 0, 0, 
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0],

	// Printing the board la...
	// To be used on console.log...
	printBoard: function(){
		var str = "";
		for(var i=0; i <this.boardSize(); i++){
			str += this.board[i];

			if ((i+1)%4 == 0 && i != 0){
				str += "\n";
			}
		} console.log(str);
	},


	// This returns the board Size
	boardSize: function(){ return this.board.length; },
	
	// Assigns an item to the board.
	// 	@index: The index of the assigned item in the board.
	//	@assign: The item/object to be assigned

	assignToBoard: function(index, assign){
		this.board[index] = assign;

		//console.log("assignToBoard: "+this.contents);
	},

	// Cleans the board to its original value. Like an zero matrix ;)
	cleanBoard: function(){
		for (var i=0; i< this.boardSize(); i++){
			this.assignToBoard(i, 0);
		}
	},

	// This shuffles the board, in which puts the character inside and then
	// 	the other characters. Values placed are integers, in which is the index
	//  of a character in the _characters.
	//		@find: The integer of the character to be find by the player. 


	shuffleBoard: function(find, number){
		// Place the find randomly in the board on N places. 
		// number or N depends on the level and the maturity of the game.
		var places = []; var N = number; // for now ;)

		var place = 0; this.cleanBoard();
		for (var p=0; p<N; p++){

			do {
				var size = this.boardSize();
				place = Math.floor( Math.random()*size );
			} while( places.indexOf(place) != -1);

			console.log("Has new place! At "+place);
			this.assignToBoard(place, find);
			places[p] = place;
		
		}

		// Then put the other types of the characters, ignoring the spot
		//	where find has been spotted on and "find" itself.

		// TODO: for now, "A" lang sa... ;)
		for (var n=0; n<this.boardSize(); n++){
			// Implement a funciton that gets an index randomly from
			// 	the _characters indeces except the current element.

			do {
				// find a random index, from the array of characters,
				// which is not equal to the index you want to find
				// AND not equal to zero -> NONE
				var randIndex = Math.floor( Math.random() * _characters.length);
			} while (randIndex==find || randIndex==0)
			
			var random = randIndex;


			if (places.indexOf(n) == -1){
				this.assignToBoard(n, random);
			}
		}

		// For console purposes...
		this.printBoard();
		
		return this.board;
	},
	
	
	// Checks the guess if it is correct... The guess is inside an array of
	//	integers. Returns a boolean object.
	//		@guess: The array which contains the guesses. Values are the index of the grid.
	//					Also, the size of @guess determines how many tries a player have done
	//					in which is dynamic.
	//		@obj:   The object in which i will find inside the grid.
	//				It is the character to check if correct

	checkIfGuessCorrect: function(guess, obj){
		console.log("Checking "+guess+" for obj:"+obj);
		var result = true, board = this.board;

		var sortedGuesses = guess.sort(), currentIndex;
		while(result && guess.length > 0){
			currentIndex = guess.pop();
			if (board[currentIndex] != obj){
				result = false;
			}
		}

		return result;
	}

}


// Character data is in here. You may call them using the 
//	index of the objects... The character data is as follows:
// 		{ name:<name_of_character>, value:<value_of_score>, img:<img_location> }

var _characters = [
	
	{ name:"NONE", value:0, img:"path_to_image/here", imgAlt:"", color:"black" },
	{ name:"cheekee", value:10, img:"path_to_image/here", imgAlt:"", color:"red" },
	{ name:"chaakee", value:12, img:"path_to_image/here", imgAlt:"", color:"yellow" },
	{ name:"chuukee", value:12, img:"path_to_image/here", imgAlt:"", color:"blue" },
	{ name:"doge", value:40, img:"path_to_image/here", imgAlt:"", color:"brown" }
	//{ name:"cheekee", value:40, img:"path_to_image/here", imgAlt:"", color:"violet" }

];

// Player data is in here... Just chuchu it..

var _player = {

	level:1,

	// This function stores the data of the player.
	// 	This could mean storing the data to the device 
	//	or to the database.
	storePlayerData: function(){

	},

	getFBCredentials: function(username, password){
		
	}

}


// This is the instantiator of the KineticJS. This handles everything right on
//	on the animation track and the whole game frontend framework and some of the 
// 	game backend
// Pre-requisites: Kinetic.JS

var _app = {

	// Some enum fixed chuchu...
	BACKGROUND_MAIN_MENU:0,
	PAUSE_MENU:4,


	// Application Attributes
	font:"Trebuchet MS", subFont:"Trebuchet MS",


	app: null, // Attribute for KineticJS Canvas

	// Screens is an array of KineticJS Layers :)
	// 	For now, it is still an empty array
	screens: [],

	// Resource Data Structure...
	resources: {

		__init: function(){
			console.log("Loading resources...");
			this.mainMenuBackground = new Image(); this.mainMenuBackground.src = "img/BG.png";
			this.gameScreenBackground = new Image(); this.gameScreenBackground.src = "img/gameBG.png";


			this.gameBackground = new Image(); this.gameBackground.src = "img/background.jpg";
			// Load images of the characters...
			this.__loadCharImages();
			
			// load the images										
			this.readyImage = new Image(); this.readyImage.src = 'img/ready.png';
			this.setImage = new Image(); this.setImage.src = 'img/set.png';
			this.goImage = new Image(); this.goImage.src = 'img/go.png';
			this.gameOverImage = new Image(); this.gameOverImage.src = 'img/gameover.png';

			// load the callout
			this.calloutImage = new Image(); this.calloutImage.src = "img/callout.png";

		},
		__loadCharImages: function(){
			var img, imgAlt, name;

			for(var i=1; i<_characters.length; i++){
				img = new Image(); imgAlt = new Image();


				name = "img/chars/"+ _characters[i].name + ".png";
				img.src = name; _characters[i].img = img;
				
				name = "img/chars/cheekee_catch.png";
				imgAlt.src = name; _characters[i].imgAlt = imgAlt;
				//img.src = "img/chars/cheekee_catch.png";
				//_characters[i].imgAlt = img;
			}

		},

		// Image resources...
		mainMenuBackground: 		null,
		gameScreenBackground: 		null,
		gameBackground: 	  		null,

		readyImage: 				null,
		setImage:  					null,
		goImage: 					null,
		gameOverImage: 				null,

		calloutImage: 				null
		

	},

	// Application Initiator. Call this on start of the application.
	__init__: function(){
		// Initialize localStorage issues...
		_localStorage.init();


		// Get the width and height of the screen...
		var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0];
		var _width = w.innerWidth || e.clientWidth || g.clientWidth, _height = w.innerHeight|| e.clientHeight|| g.clientHeight;

		// Load to app attribute.
		this.app = new Kinetic.Stage({
		    container: 'gameContainer',
		    width: _width,
		    height: _height
		});

		// Load the main layer
		//var mainLayer = this.initMainGameLayer(_width, _height);
		// Add to container
		//this.app.add(mainLayer);


		/*** --  Final na ni na version here! :) -- ***/
		// Main Menu and Game Background
		var backgroundMainMenu = this.initBackgroundMainMenu(_width, _height);
		this.app.add(backgroundMainMenu);

		// In-gameplay stats
		var gameStatsLayer = this.initGameStatsLayer(_width, _height);
		this.app.add(gameStatsLayer);

		// In-gameplay game board
		var gameBoardLayer = this.initGameBoardLayer(_width, _height);
		this.app.add(gameBoardLayer);


		// Newer version for the game board.
		// 	This puts on a board item is a layer.
		//	Rationale: For it to be independent for every layer draw.

		var params = { cols:4, rows:5, x:_width*0.01, y: _height*0.07, width: (_width - _width*0.04)/4, height: (_height - _height*0.28)/5 };
		var boardItemLayer, rect, itemLayers = [], i = 0;

		for (var vertical = 0; vertical < params.rows; vertical++) {

			for (var horizontal = 0; horizontal < params.cols; horizontal++) {

				boardItemLayer = new Kinetic.Layer({
					x:params.x, y:params.y, width:params.width, height:params.height, id:i
				});

				//console.log(boardItemLayer.width() +" x "+ boardItemLayer.height());


				var content = new Kinetic.Group({
					x: boardItemLayer.x(), y: boardItemLayer.y(),
					width: boardItemLayer.width(), height: boardItemLayer.height()
				});

				var shownImage, catchedImage;
				shownImage = new Kinetic.Image(); 
				catchedImage = new Kinetic.Image();

				content.add(shownImage);
				content.add(catchedImage);


				boardItemLayer.add(content);

				// Add up everything...
				var rect = new Kinetic.Rect({
					x: boardItemLayer.x(), y: boardItemLayer.y(),
					width: boardItemLayer.width(), height: boardItemLayer.height(),

					fill:"#86ab5e", 
					stroke:"white", cornerRadius: boardItemLayer.width() * 0.08,
					strokeWidth:1, dash: [5, 5]
				}); boardItemLayer.add(rect);


				// Reset on the sizing + opacity...
				boardItemLayer.opacity(0).visible(false);
				


				// Add up the animation dude...
				// This is on the event handlers of the clicking of the game...
				boardItemLayer.on('touchend', function(e){
					if (_gamePlay.isPlaying && !_gamePlay.isShowing && !_gamePlay.isPaused){
						
						//console.log(e.targetNode.getLayer());
						//rect.opacity(0); e.targetNode.getLayer().draw();

						var rect = e.targetNode.getLayer().children[1];


						if (_gamePlay.myGuess.indexOf(e.targetNode.getLayer().id()) == -1){ // The clicked btn is not yet in the array...
							// -- hide the cover...
							rect.opacity(0);
							_gamePlay.addToGuess(e.targetNode.getLayer().id());
							
							e.targetNode.getLayer().draw();
							if (_gamePlay.myGuess.length == _gamePlay.level){ // Number of clicks are in the limit...

								setTimeout(function(){
									// Submit it now...
									if (_gamePlay.isMyGuessCorrect(_gamePlay.myGuess)){
										// Updates gamePlay Stats
										_animation.updateNumberPieces("positive");
										_gamePlay.playerStats.update();
										
										// Add to score...
										_gamePlay.addUpToScore(_gamePlay.target);
										_gamePlay.executeGameShuffle();
									} else { 
										_animation.updateNumberPieces("negative");
										// Shows the current slide again if guess is incorrect  
										_gamePlay.showAllBoardLayers();	
										
										
									}
									
									// Clear the road for it...
									//_animation.clearClickedInteractions(_gamePlay.myGuess);
									_gamePlay.myGuess = [];	


								}, 500); // Stop for .5 secs para makita ang last na item...

							} //else { e.targetNode.getLayer().draw(); }

						} else { // The clicked btn is in the array, so don't move.

							//rect.opacity(1); 
							//_gamePlay.removeFromGuess(e.targetNode.getLayer().id());

							// Comment above: Kay MIND GAME LAGE SIYA...
						}

					

					}
					
				}).on('touchstart', function(e){
					if (_gamePlay.isPlaying){
						

					}
				});


				itemLayers.push(boardItemLayer);
				this.app.add(boardItemLayer);

				params.x += params.width / 2;

				i++;
			}

			params.x = _width*0.01;
			params.y += params.height / 2;

		} // End board layers...



		// In-gameplay game board
		var bottomBoardLayer = this.initGameBottomLayer(_width, _height);
		this.app.add(bottomBoardLayer);

		/*
		** Outside layer na ni sila... :)
		*/

		// Leaderboard pane...
		var leaderBoardLayer = this.initLeaderBoardLayer(_width, _height);
		this.app.add(leaderBoardLayer);

		// Countdown layer...
		var countdownLayer = this.initCountDownLayer(_width, _height);
		this.app.add(countdownLayer);

		// The "Find Me" Layer
		var findMeLayer = this.initFindMeLayer(_width, _height);
		this.app.add(findMeLayer);

		var findMeSLayer = this.initFindMeSwingingLayer(_width, _height);
		this.app.add(findMeSLayer);

		// Load the postGameLayer
		var postGameLayer = this.initPostGameLayer(_width, _height);
		this.app.add(postGameLayer);

		// In-gameplay: pause menu
		var pauseLayer = this.initPauseMenu(_width, _height);
		this.app.add(pauseLayer);

		// Help message...
		var helpMessage = this.initHelpMessage(_width, _height);
		this.app.add(helpMessage);


		// Put to screens array for reference in below objects
		//this.screens = [mainLayer, postGameLayer];
		this.screens = [backgroundMainMenu, gameStatsLayer, gameBoardLayer, leaderBoardLayer, 
							pauseLayer, itemLayers, bottomBoardLayer, countdownLayer, findMeLayer, findMeSLayer,
							postGameLayer, helpMessage];		
	},

	// Methods...
	appWidth:  function(){ return this.app.width();  },
	appHeight: function(){ return this.app.height(); },



	// Method: (NEW) on the loading screen
	initLoadingScreen: function(w, h){
		var mainMenuLayer = new Kinetic.Layer({
			width:w, height:h, x:0, y:0, id:"LOADING_SCREEN_MENU_LAYER"
		});

		return mainMenuLayer;
	},


	// Method: (NEW) gets on the layer for the background and the main menu... :)
	initBackgroundMainMenu: function(w, h){
		var mainMenuLayer = new Kinetic.Layer({
			width:w, height:h*2, x:0, y:0, id:"BACKGROUND_MENU_LAYER"
		});

		// Background...
		var bg = new Kinetic.Image({
			image: this.resources.gameBackground, width:mainMenuLayer.width(), height:mainMenuLayer.height()
		}); mainMenuLayer.add(bg);

		// Button/s
		// Add the button...

		var startGameButton = new Kinetic.Group({
			width: w*0.6, height: h*0.3, x: w*0.2, y: h*0.55, id:"START_BTN"
		});

		// Elems... :)
		var rect2 = new Kinetic.Rect({
			width:startGameButton.width(), height: h*0.11, x:0, y: 15,
			fill:"#9b8f82", cornerRadius:  startGameButton.width()*0.13
		}); startGameButton.add(rect2);

		var rect = new Kinetic.Rect({
			width:startGameButton.width(), height: h*0.1, x:0, y:0,
			fill:"#ffe284", cornerRadius:  startGameButton.width()*0.13
		}); startGameButton.add(rect);

		var rect1 = new Kinetic.Rect({
			width:startGameButton.width(), height: h*0.1, x:0, y: 5,
			fill:"#ffc14d", cornerRadius:  startGameButton.width()*0.13
		}); startGameButton.add(rect1);

		var t = new Kinetic.Text({
			width:rect1.width(), height:rect1.height(), x:rect1.x(), y:rect1.y() + 8,

			text:"PLAY GAME", fill:"white", fontSize: 30, fontFamily: _app.font, align:'center',
		}); startGameButton.add(t);

		// Add the animation...
		startGameButton.on('touchstart', function(evt){
			var btn = _app.screens[0].find("#START_BTN")[0];

			btn.children[1].y( btn.children[1].y() + 10 );
			btn.children[2].y( btn.children[2].y() + 10 );
			btn.children[3].y( btn.children[3].y() + 10 );

			_app.screens[0].draw();
			//evt.targetNode.getLayer().draw();
		}).on('touchend', function(evt){
			var btn = _app.screens[0].find("#START_BTN")[0];

			btn.children[1].y( btn.children[1].y() - 10 );
			btn.children[2].y( btn.children[2].y() - 10 );
			btn.children[3].y( btn.children[3].y() - 10 );

			_app.screens[0].draw();

			_animation.animateNewGame();
			//_gamePlay.startGame(evt);
		});




		var leaderBoardBtn = new Kinetic.Group({
			width: w*0.3, height: h*0.3, x: w*0.2, y: h*0.70, id:"LEADERBOARD_BTN"
		});

		// Elems... :)
		var rect2 = new Kinetic.Rect({
			width: leaderBoardBtn.width(), height: h*0.10, x:0, y: 15,
			fill:"#9b8f82", cornerRadius:  leaderBoardBtn.width()*2*0.13
		}); leaderBoardBtn.add(rect2);

		var rect = new Kinetic.Rect({
			width: leaderBoardBtn.width(), height: h*0.1, x:0, y:0,
			fill:"#ffe284", cornerRadius:  leaderBoardBtn.width()*2*0.13
		}); leaderBoardBtn.add(rect);

		var rect1 = new Kinetic.Rect({
			width: leaderBoardBtn.width(), height: h*0.1, x:0, y: 5,
			fill:"#ffc14d", cornerRadius:  leaderBoardBtn.width()*2*0.13
		}); leaderBoardBtn.add(rect1);

		var t = new Kinetic.Text({
			width:rect1.width(), height:rect1.height(), x:rect1.x(), y:rect1.y() + 12,

			text:"SCORES", fill:"white", fontSize: 24, fontFamily: _app.font, align:'center',
		}); leaderBoardBtn.add(t);


		// Leader Board Btn Action
		leaderBoardBtn.on('touchstart', function(evt){
			var btn = _app.screens[0].find("#LEADERBOARD_BTN")[0];

			btn.children[1].y( btn.children[1].y() + 6 );
			btn.children[2].y( btn.children[2].y() + 6 );
			btn.children[3].y( btn.children[3].y() + 6 );

			_app.screens[0].draw();
		}).on('touchend', function(evt){
			var btn = _app.screens[0].find("#LEADERBOARD_BTN")[0];

			btn.children[1].y( btn.children[1].y() - 6 );
			btn.children[2].y( btn.children[2].y() - 6 );
			btn.children[3].y( btn.children[3].y() - 6 );

			_app.screens[0].draw();

			_app.screens[3].find("#leaderBoardContainerScores")[0].opacity(0);
			_app.screens[3].find('#leaderBoardContentMsg')[0].opacity(1);
			_app.screens[3].find('#leaderBoardContentMsg')[0].text("LOADING LEADERBOARD...");  
			_app.screens[3].draw();

			
			_animation.slideLeaderBoardDown(); var data;

			setTimeout(function(){
				data = $.ajax({
					url: _server.getLeaderBoardLocation(),
					dataType:"json"
				});
				
				data.fail(function(jqXHR, textStatus){

					_app.screens[3].find('#leaderBoardContentMsg')[0].text("Unable to connect to server. Check your network connection and please try again.");
					_app.screens[3].draw();

					console.log(jqXHR);
					console.log(textStatus);
				});

				data.success(function(data){

					console.log(data);
					_app.screens[3].find('#leaderBoardContentMsg')[0].opacity(0);

					var items = _app.screens[3].find("#leaderBoardContainerScores")[0];
					
					var index_counter = 2;
					for(var i=0; i<data.length; i++){
						console.log(data[i]);

						items.children[index_counter].children[0].text( data[i].name );
						items.children[index_counter].children[1].text( data[i].score );

						index_counter++;
					}

					_app.screens[3].find("#leaderBoardContainerScores")[0].opacity(1);
					_app.screens[3].draw();

				});


			}, 1000); 
		});


		
		var helpBtn = new Kinetic.Group({
			width: w*0.3, height: h*0.3, x: w*0.51, y: h*0.70, id:"HELP_BTN"
		});

		// Elems... :)
		var rect2 = new Kinetic.Rect({
			width: helpBtn.width(), height: h*0.10, x:0, y: 15,
			fill:"#9b8f82", cornerRadius:  helpBtn.width()*2*0.13
		}); helpBtn.add(rect2);

		var rect = new Kinetic.Rect({
			width: helpBtn.width(), height: h*0.1, x:0, y:0,
			fill:"#d6d6d6", cornerRadius:  helpBtn.width()*2*0.13
		}); helpBtn.add(rect);

		var rect1 = new Kinetic.Rect({
			width: helpBtn.width(), height: h*0.1, x:0, y: 5,
			fill:"#b8b8b8", cornerRadius:  helpBtn.width()*2*0.13
		}); helpBtn.add(rect1);

		var t = new Kinetic.Text({
			width:rect1.width(), height:rect1.height(), x:rect1.x(), y:rect1.y() + 12,

			text:"HELP", fill:"white", fontSize: 24, fontFamily: _app.font, align:'center',
		}); helpBtn.add(t);


		helpBtn.on('touchstart', function(evt){
			var btn = _app.screens[0].find("#HELP_BTN")[0];

			btn.children[1].y( btn.children[1].y() + 6 );
			btn.children[2].y( btn.children[2].y() + 6 );
			btn.children[3].y( btn.children[3].y() + 6 );

			_app.screens[0].draw();

		}).on('touchend', function(evt){
			var btn = _app.screens[0].find("#HELP_BTN")[0];

			btn.children[1].y( btn.children[1].y() - 6 );
			btn.children[2].y( btn.children[2].y() - 6 );
			btn.children[3].y( btn.children[3].y() - 6 );

			_app.screens[0].draw();
			_animation.slideHelpViewDown();
		});


		mainMenuLayer.add(startGameButton);
		mainMenuLayer.add(leaderBoardBtn);
		mainMenuLayer.add(helpBtn);


		return mainMenuLayer;
	},
	// Method: (NEW) gets on the game statistics layer on the top.... 
	initGameStatsLayer: function(w, h){
		var gameStatsLayer = new Kinetic.Layer({
			width:w, height:h*0.1, x:0, y: 0 - h*0.1, id:"GAME_STATS_LAYER" //h*0.02
		});

		// Put the background...
		var background = new Kinetic.Group({
			width: gameStatsLayer.width() * 0.96, 
			height: gameStatsLayer.height(), x: w*0.02, y:0,
		});

		var r = new Kinetic.Rect({ 	
			width: background.width(), 
			height: background.height() * 0.88, 
			x:0, y:5, 

			cornerRadius:  w*0.01, fill:"#7a726a", 
		}); background.add(r);

		r = new Kinetic.Rect({ 	
			width: background.width(), 
			height: background.height() * 0.8, 
			x:0, y:0, 

			cornerRadius:  w*0.01, fill:"#ffe284", 
		}); background.add(r);

		r = new Kinetic.Rect({ 	
			width: background.width(), 
			height: background.height() * 0.8, 
			x:0, y:2, 

			cornerRadius:  w*0.01, fill:"#ffc14d", 
		}); background.add(r);

		gameStatsLayer.add(background);


		// Put the timer text...
		var timerText = new Kinetic.Text({
			text:"0:00", fontSize: 24, fontFamily: _app.font, fill: 'white', id:"GAME_TIMER_TXT", x:w*0.03, y:2
		}); gameStatsLayer.add(timerText);

		// Put the score text...
		var scoreText = new Kinetic.Text({
			text:"00000", fontSize: 24, fontFamily: _app.font, fill: 'white', id:"GAME_SCORE_TXT", align:'right',
			x: gameStatsLayer.width() - gameStatsLayer.width() * 0.24, y:2
		}); gameStatsLayer.add(scoreText);

		// Then the timer bar...
		var timerBarBG = new Kinetic.Rect({
			x:w*0.04, y:timerText.height() + 3, height:5, width:gameStatsLayer.width() * 0.92, fill:"#7a726a", stroke:"#7a726a", id:"TIMER_BAR_PARENT"
		}); gameStatsLayer.add(timerBarBG);

		var timerBar = new Kinetic.Rect({
			x:w*0.04, y:timerText.height() + 3, height:5, width:timerBarBG.width(), fill:"white", stroke:"white", id:"TIMER_BAR"
		}); gameStatsLayer.add(timerBar);

		// Update _animation attribute on timerBarOffset (needed for the animation...);
		_animation.timerBarOffset = timerBar.width() / _gamePlay.gameTimer.time; // 121 kay 2 minutes + 1 offset... :)


		return gameStatsLayer;
	},
	// Method: (NEW) Game Board Layer
	initGameBoardLayer: function(w, h){
		var gameBoardLayer = new Kinetic.Layer({
			width:w, height:h*0.75, x:0, y:h*0.13, id:"GAME_BOARD_LAYER" //h*0.02
		});

		// Put the background...
		var background = new Kinetic.Rect({ 	
								width: gameBoardLayer.width(), 
								height: gameBoardLayer.height(), 
								x:0, y:0,
								//fill:"#ac7441", 
								stroke:"#29230b", strokeWidth:3
						});

		//gameBoardLayer.add(background);


		return gameBoardLayer;
	},
	// Method: (NEW) LeaderBoardLayer
	initLeaderBoardLayer: function(w, h){
		var leaderBoardLayer = new Kinetic.Layer({
			width:w, height:h, x:0, y:0, id:"LEADERBOARD_LAYER" //h*0.02
		});

		// Background nigga!
		var background = new Kinetic.Rect({ 	
								width: leaderBoardLayer.width() * 0.8, 
								height: leaderBoardLayer.height() * 0.84, 
								x:leaderBoardLayer.width() * 0.1, 
								y:leaderBoardLayer.height() * 0.1, 

								cornerRadius:  leaderBoardLayer.width()*0.03,
								fill:"#7a726a", 
								//stroke:"#29230b", strokeWidth:3
		}); leaderBoardLayer.add(background);

		background = new Kinetic.Rect({ 	
								width: leaderBoardLayer.width() * 0.8, 
								height: leaderBoardLayer.height() * 0.79, 
								x:leaderBoardLayer.width() * 0.1, 
								y:leaderBoardLayer.height() * 0.09, 

								cornerRadius:  leaderBoardLayer.width()*0.03,
								fill:"#d8bfa3", 
								//stroke:"#29230b", strokeWidth:3
		}); leaderBoardLayer.add(background);

		background = new Kinetic.Rect({ 	
								width: leaderBoardLayer.width() * 0.8, 
								height: leaderBoardLayer.height() * 0.79, 
								x:leaderBoardLayer.width() * 0.1, 
								y:leaderBoardLayer.height() * 0.1, 

								cornerRadius:  leaderBoardLayer.width()*0.03,
								fill:"#9b8f82", 
								//stroke:"#29230b", strokeWidth:3
		}); leaderBoardLayer.add(background);

		// Title Bar...
		var title = new Kinetic.Text({
			width:background.width(), height:background.height(), x:background.x(), y:background.y() + 8,

			text:"LEADERBOARD", fill:"white", fontSize: 30, fontFamily: _app.font, align:'center',
		}); leaderBoardLayer.add(title);

		// loading message...
		var loadingMsg = new Kinetic.Text({
			text:"LOADING LEADERBOARD...", fill:"#ddd", fontSize: 24, fontFamily: _app.font, align:'center', width:background.width(), 
			id:"leaderBoardContentMsg", x: background.x(), y:background.height() * 0.5,
		}); leaderBoardLayer.add(loadingMsg);


		var leaderBoardContent = new Kinetic.Group({
			width:background.width() * 0.95, height:background.height(), x:background.width() * 0.15, y:background.height() * 0.30,
			id:"leaderBoardContainerScores", opacity:0
		});

		// Print the first part of the list
		var scoretext = new Kinetic.Text({
			text:"PLAYER NAME", fill:"#ddd", fontSize: 24, fontFamily: _app.font, align:'left', 
			width:leaderBoardContent.width(), x:0, y:0
		}); leaderBoardContent.add(scoretext);

		scoretext = new Kinetic.Text({
			text:"SCORE", fill:"#ddd", fontSize: 24, fontFamily: _app.font, align:'right', 
			width:leaderBoardContent.width(), x:0, y:0
		}); leaderBoardContent.add(scoretext);


		// The chuchu...
		var elem, container, str, name, score;

		var why = scoretext.height(), ex;
		for(var i=0; i<10; i++){ // Kay top ten raman...
			str = ""; //sc"+i;

			elem = new Kinetic.Group();

			name = new Kinetic.Text({
				text:str, fill:"#ddd", fontSize: 24, fontFamily: _app.font, align:'left', 
				width:leaderBoardContent.width(), x:0, y:why
			}); elem.add(name);

			score = new Kinetic.Text({
				text:str, fill:"#ddd", fontSize: 24, fontFamily: _app.font, align:'right', 
				width:leaderBoardContent.width(), x:0, y:why
			}); elem.add(score);

			leaderBoardContent.add(elem);
			why += scoretext.height();
		}


		// Put the group on the you know
		leaderBoardLayer.add(leaderBoardContent);


		// Close button nigga!
		var closeButton = new Kinetic.Group({ 
			x: leaderBoardLayer.width() *0.50,
			y: leaderBoardLayer.height() * 0.80,
			id:"LEADERBOARD_CLOSE_BTN"
		}),

		// Background of the close button
		closeButtonBG = new Kinetic.Circle({
			  radius: leaderBoardLayer.width()*0.07,
			  fill: '#7a726a', x:0, y:10
		}); closeButton.add(closeButtonBG);

		closeButtonBG = new Kinetic.Circle({
			  radius: leaderBoardLayer.width()*0.07,
			  fill: '#ffe284', x:0, y:0
		}); closeButton.add(closeButtonBG);

		closeButtonBG = new Kinetic.Circle({
			  radius: leaderBoardLayer.width()*0.07,
			  fill: '#ffc14d', x:0, y:3
		}); closeButton.add(closeButtonBG);


		closeButton.on('touchend', function(evt){
			var obj = _app.screens[3].find("#LEADERBOARD_CLOSE_BTN")[0];
			obj.children[1].y( obj.children[1].y() - 4 );
			obj.children[2].y( obj.children[2].y() - 4 );
			_app.screens[3].draw();

			_animation.slideLeaderBoardUp();
		}).on('touchstart', function(evt){
			var obj = _app.screens[3].find("#LEADERBOARD_CLOSE_BTN")[0];
			obj.children[1].y( obj.children[1].y() + 4 );
			obj.children[2].y( obj.children[2].y() + 4 );
			_app.screens[3].draw();
		});



		leaderBoardLayer.add(closeButton);

		// Reset on the height + position
		leaderBoardLayer.y( 0 - leaderBoardLayer.height());

		return leaderBoardLayer;
	},
	// Method: (NEW) Help message...
	initHelpMessage: function(w, h){
		var leaderBoardLayer = new Kinetic.Layer({
			width:w, height:h, x:0, y:0 //h*0.02
		});

		// Background nigga!
		var background = new Kinetic.Rect({ 	
								width: leaderBoardLayer.width() * 0.8, 
								height: leaderBoardLayer.height() * 0.84, 
								x:leaderBoardLayer.width() * 0.1, 
								y:leaderBoardLayer.height() * 0.1, 

								cornerRadius:  leaderBoardLayer.width()*0.03,
								fill:"#7a726a", 
								//stroke:"#29230b", strokeWidth:3
		}); leaderBoardLayer.add(background);

		background = new Kinetic.Rect({ 	
								width: leaderBoardLayer.width() * 0.8, 
								height: leaderBoardLayer.height() * 0.79, 
								x:leaderBoardLayer.width() * 0.1, 
								y:leaderBoardLayer.height() * 0.09, 

								cornerRadius:  leaderBoardLayer.width()*0.03,
								fill:"#d8bfa3", 
								//stroke:"#29230b", strokeWidth:3
		}); leaderBoardLayer.add(background);

		background = new Kinetic.Rect({ 	
								width: leaderBoardLayer.width() * 0.8, 
								height: leaderBoardLayer.height() * 0.79, 
								x:leaderBoardLayer.width() * 0.1, 
								y:leaderBoardLayer.height() * 0.1, 

								cornerRadius:  leaderBoardLayer.width()*0.03,
								fill:"#9b8f82", 
								//stroke:"#29230b", strokeWidth:3
		}); leaderBoardLayer.add(background);

		// Title Bar...
		var title = new Kinetic.Text({
			width:background.width(), height:background.height(), x:background.x(), y:background.y() + 8,

			text:"HOW TO PLAY", fill:"white", fontSize: 30, fontFamily: _app.font, align:'center',
		}); leaderBoardLayer.add(title);


		var helpText = "Tap the characters to play. You are given two minutes to solve the game.";


		var loadingMsg = new Kinetic.Text({
			text:helpText, fill:"#ddd", fontSize: 17, fontFamily: _app.font, align:'center', width:background.width(), 
			x: background.x(), y:background.height() * 0.3,
		}); leaderBoardLayer.add(loadingMsg);


		// Close button nigga!
		var closeButton = new Kinetic.Group({ 
			x: leaderBoardLayer.width() *0.35,
			y: leaderBoardLayer.height() * 0.75,
			id:"HELP_CLOSE_BTN"
		}),

		// Background of the close button
		closeButtonBG = new Kinetic.Rect({
			width: leaderBoardLayer.width() * 0.3, height: leaderBoardLayer.height()*0.082,
			fill: '#7a726a', x:0, y:13, cornerRadius: leaderBoardLayer.width() * 0.03
		}); closeButton.add(closeButtonBG);

		closeButtonBG = new Kinetic.Rect({
			width: leaderBoardLayer.width() * 0.3, height: leaderBoardLayer.height()*0.065,
			fill: '#ffe284', x:0, y:10, cornerRadius: leaderBoardLayer.width() * 0.03
		}); closeButton.add(closeButtonBG);

		closeButtonBG = new Kinetic.Rect({
			width: leaderBoardLayer.width() * 0.3, height: leaderBoardLayer.height()*0.065,
			fill: '#ffc14d', x:0, y:12, cornerRadius: leaderBoardLayer.width() * 0.03
		}); closeButton.add(closeButtonBG);

		var closeText = new Kinetic.Text({
			text:"CLOSE", x:0, y:22, width:leaderBoardLayer.width() * 0.3, 
			height:leaderBoardLayer.height()*0.065, align:'center', fill:'white'
		}); closeButton.add(closeText);


		closeButton.on('touchend', function(evt){
			var obj = _app.screens[11].find("#HELP_CLOSE_BTN")[0];
			obj.children[1].y( obj.children[1].y() - 3 );
			obj.children[2].y( obj.children[2].y() - 3 );
			obj.children[3].y( obj.children[3].y() - 3 );
			_app.screens[11].draw();

			//_animation.slideLeaderBoardUp();
			_animation.slideHelpViewUp();
		}).on('touchstart', function(evt){
			var obj = _app.screens[11].find("#HELP_CLOSE_BTN")[0];
			obj.children[1].y( obj.children[1].y() + 3 );
			obj.children[2].y( obj.children[2].y() + 3 );
			obj.children[3].y( obj.children[3].y() + 3 );
			_app.screens[11].draw();
		});



		leaderBoardLayer.add(closeButton);

		// Reset on the height + position
		leaderBoardLayer.y( 0 - leaderBoardLayer.height());

		return leaderBoardLayer;
	},
	// Method: (NEW) BottomLayer
	initGameBottomLayer: function(w, h){
		var bottomLayer = new Kinetic.Layer({
			width:w, height:h*0.12, x:0, y:h*0.92, //id:"GAME_BOARD_LAYER" //h*0.02
		});

		var pauseButton = new Kinetic.Group({
			x:bottomLayer.width() * 0.90, y:0, 
			width:bottomLayer.width() * 0.15, height:bottomLayer.height() * 0.8,
			id:"GAME_PAUSE_BTN"
		});

		var pButtonBG = new Kinetic.Circle({
			  radius: bottomLayer.width()*0.07,
			  fill: '#7a726a', x:0, y:10
		}); pauseButton.add(pButtonBG);

		pButtonBG = new Kinetic.Circle({
			  radius: bottomLayer.width()*0.07,
			  fill: '#ffe284', x:0, y:0
		}); pauseButton.add(pButtonBG);

		pButtonBG = new Kinetic.Circle({
			  radius: bottomLayer.width()*0.07,
			  fill: '#ffc14d', x:0, y:3
		}); pauseButton.add(pButtonBG);

		// Add the pause logo...
		var r = new Kinetic.Rect({
			width:pauseButton.height() * 0.2, height: pauseButton.height() * 0.5, x:0 + pauseButton.width() * 0.03, 
			y:0 - pauseButton.height() * 0.23,
			fill:"#7a726a"
		}); pauseButton.add(r);

		r = new Kinetic.Rect({
			width:pauseButton.height() * 0.2, height: pauseButton.height() * 0.5, x:0 - pauseButton.width() * 0.23, 
			y:0 - pauseButton.height() * 0.23,
			fill:"#7a726a"
		}); pauseButton.add(r);

		pauseButton.on('touchend', function(evt){
			if ( _gamePlay.isPlaying)
			{										
				var obj = _app.screens[6].find("#GAME_PAUSE_BTN")[0];

				obj.children[1].y( obj.children[1].y() - 4 );
				obj.children[2].y( obj.children[2].y() - 4 );
				obj.children[3].y( obj.children[3].y() - 4 );
				obj.children[4].y( obj.children[4].y() - 4 );

				_app.screens[6].draw();


				_gamePlay.pauseGame();

				var pauselayer = _app.screens[_app.PAUSE_MENU];
				pauselayer.y( 0 ); pauselayer.draw();
			}
		}).on('touchstart', function(evt){
			if (_gamePlay.isPlaying)
			{
				var obj = _app.screens[6].find("#GAME_PAUSE_BTN")[0];

				obj.children[1].y( obj.children[1].y() + 4 );
				obj.children[2].y( obj.children[2].y() + 4 );
				obj.children[3].y( obj.children[3].y() + 4 );
				obj.children[4].y( obj.children[4].y() + 4 );

				_app.screens[6].draw();

			}
		});	
		


		bottomLayer.add(pauseButton);
		bottomLayer.visible(false);
		return bottomLayer;
	},
	// Method: (NEW) Pause Menu...
	initPauseMenu: function(w, h){

		var layer = new Kinetic.Layer({
			width:w, height:h, x:0, y:0
		});

		var backdrop = new Kinetic.Rect({
			width:layer.width(), height:layer.height(), x:0, y:0,
			fill:"black", opacity:0.6
		}); layer.add(backdrop);

		var pauseLayer = new Kinetic.Group({
			width:w*0.8, height:h*0.5, x:w*0.1, y:h*0.25, id:"PAUSE_MENU_LAYER" //h*0.02
		});

		// Background nigga!
		var background = new Kinetic.Rect({ 	
								width: pauseLayer.width(), 
								height: pauseLayer.height(), 
								x:0, 
								y:3, 

								cornerRadius:  pauseLayer.width()*0.03,
								fill:"#7a726a", 
								//stroke:"#29230b", strokeWidth:3
		}); pauseLayer.add(background);

		background = new Kinetic.Rect({ 	
								width: pauseLayer.width(), 
								height: pauseLayer.height() * 0.95, 
								x:0, 
								y:0, 

								cornerRadius:  pauseLayer.width()*0.03,
								fill:"#d8bfa3", 
								//stroke:"#29230b", strokeWidth:3
		}); pauseLayer.add(background);

		background = new Kinetic.Rect({ 	
								width: pauseLayer.width(), 
								height: pauseLayer.height() * 0.95, 
								x:0,
								y:3, 

								cornerRadius:  pauseLayer.width()*0.03,
								fill:"#9b8f82", 
								//stroke:"#29230b", strokeWidth:3
		}); pauseLayer.add(background);

		// Title Bar...
		var title = new Kinetic.Text({
			width:pauseLayer.width(), height:pauseLayer.height(), x:0, y:3,

			text:"GAME PAUSED", fill:"white", fontSize: 24, fontFamily: _app.font, align:'center',
		}); pauseLayer.add(title);


		// Buttons...


		// Continue button...
		var btn = new Kinetic.Group({
			width: pauseLayer.width() * 0.9, height: pauseLayer.height() * 0.2,
			x:pauseLayer.width() * 0.05, y:pauseLayer.height() * 0.2, id:"PAUSE_MENU_CONT_BTN"
		}), txt;

		background = new Kinetic.Rect({
			width: btn.width(), height:btn.height() * 0.90, x:0, y:5,
			cornerRadius:  btn.width()*0.05,
			fill: "#7a726a"
		}); btn.add(background);

		background = new Kinetic.Rect({
			width: btn.width(), height:btn.height() * 0.80, x:0, y:0,
			cornerRadius:  btn.width()*0.05,
			fill: "#ffe284"
		}); btn.add(background);

		background = new Kinetic.Rect({
			width: btn.width(), height:btn.height() * 0.80, x:0, y:2,
			cornerRadius:  btn.width()*0.05,
			fill: "#ffc14d"
		}); btn.add(background);

		txt = new Kinetic.Text({
			width:btn.width(), height:btn.height(), x:0, y:8,
			text:"CONTINUE", fill:"white", fontSize: 24, fontFamily: _app.font, align:'center',
		}); btn.add(txt);

		btn.on('touchend', function(evt){
			var btn = _app.screens[4].find("#PAUSE_MENU_CONT_BTN")[0];

			btn.children[1].y( btn.children[1].y() - 4 );
			btn.children[2].y( btn.children[2].y() - 4 );
			btn.children[3].y( btn.children[3].y() - 4 );

			_app.screens[4].draw();

			_animation.hidePauseMenu(evt.targetNode.getLayer());
			_gamePlay.resumeGame();
		}).on('touchstart', function(evt){
			var btn = _app.screens[4].find("#PAUSE_MENU_CONT_BTN")[0];

			btn.children[1].y( btn.children[1].y() + 4 );
			btn.children[2].y( btn.children[2].y() + 4 );
			btn.children[3].y( btn.children[3].y() + 4 );

			_app.screens[4].draw();
		}); pauseLayer.add(btn);


		// Restart
		btn = new Kinetic.Group({
			width: pauseLayer.width() * 0.9, height: pauseLayer.height() * 0.2,
			x:pauseLayer.width() * 0.05, y:pauseLayer.height() * 0.43, id:"PAUSE_MENU_RESTART_BTN"
		}), txt;

		background = new Kinetic.Rect({
			width: btn.width(), height:btn.height() * 0.9, x:0, y:5,
			cornerRadius:  btn.width()*0.05,
			fill: "#7a726a"
		}); btn.add(background);

		background = new Kinetic.Rect({
			width: btn.width(), height:btn.height() * 0.80, x:0, y:0,
			cornerRadius:  btn.width()*0.05,
			fill: "#ffe284"
		}); btn.add(background);

		background = new Kinetic.Rect({
			width: btn.width(), height:btn.height() * 0.80, x:0, y:2,
			cornerRadius:  btn.width()*0.05,
			fill: "#ffc14d"
		}); btn.add(background);

		txt = new Kinetic.Text({
			width:btn.width(), height:btn.height(), x:0, y:8,
			text:"RESTART", fill:"white", fontSize: 24, fontFamily: _app.font, align:'center',
		}); btn.add(txt);

		btn.on('touchend', function(evt){
			var btn = _app.screens[4].find("#PAUSE_MENU_RESTART_BTN")[0];

			btn.children[1].y( btn.children[1].y() - 4 );
			btn.children[2].y( btn.children[2].y() - 4 );
			btn.children[3].y( btn.children[3].y() - 4 );

			_app.screens[4].draw();
			
			// Re-initialize when paused
			_gamePlay.isPaused = true;
			
			_animation.hidePauseMenu(evt.targetNode.getLayer());
			_animation.updateScore(00000, 00000);

			_animation.animateCountDown();
			_gamePlay.resumeGame();
		}).on('touchstart', function(evt){
			var btn = _app.screens[4].find("#PAUSE_MENU_RESTART_BTN")[0];

			btn.children[1].y( btn.children[1].y() + 4 );
			btn.children[2].y( btn.children[2].y() + 4 );
			btn.children[3].y( btn.children[3].y() + 4 );

			_app.screens[4].draw();
		}); pauseLayer.add(btn);
	

		// QUIT TO MAIN MENU
		btn = new Kinetic.Group({
			width: pauseLayer.width() * 0.9, height: pauseLayer.height() * 0.2,
			x:pauseLayer.width() * 0.05, y:pauseLayer.height() * 0.66, id:"PAUSE_MENU_QUIT_BTN"
		}), txt;

		background = new Kinetic.Rect({
			width: btn.width(), height:btn.height() * 0.9, x:0, y:5,
			cornerRadius:  btn.width()*0.05,
			fill: "#7a726a"
		}); btn.add(background);

		background = new Kinetic.Rect({
			width: btn.width(), height:btn.height() * 0.80, x:0, y:0,
			cornerRadius:  btn.width()*0.05,
			fill: "#ffe284"
		}); btn.add(background);

		background = new Kinetic.Rect({
			width: btn.width(), height:btn.height() * 0.80, x:0, y:2,
			cornerRadius:  btn.width()*0.05,
			fill: "#ffc14d"
		}); btn.add(background);

		txt = new Kinetic.Text({
			width:btn.width(), height:btn.height(), x:0, y:8,
			text:"QUIT GAME", fill:"white", fontSize: 24, fontFamily: _app.font, align:'center',
		}); btn.add(txt);

		btn.on('touchend', function(evt){
			var btn = _app.screens[4].find("#PAUSE_MENU_QUIT_BTN")[0];

			btn.children[1].y( btn.children[1].y() - 4 );
			btn.children[2].y( btn.children[2].y() - 4 );
			btn.children[3].y( btn.children[3].y() - 4 );

			_app.screens[4].draw();


			_animation.hidePauseMenu(evt.targetNode.getLayer());
			_animation.updateScore(00000, 00000);
			_animation.backToMainMenu();
		}).on('touchstart', function(evt){
			var btn = _app.screens[4].find("#PAUSE_MENU_QUIT_BTN")[0];

			btn.children[1].y( btn.children[1].y() + 4 );
			btn.children[2].y( btn.children[2].y() + 4 );
			btn.children[3].y( btn.children[3].y() + 4 );

			_app.screens[4].draw();
		}); pauseLayer.add(btn);



		layer.add(pauseLayer);

		// Put it on the top board...
		//pauseLayer.y( 0 - pauseLayer.height());
		layer.y( 0 - layer.height());
		return layer;
	},
	// Count Down Layer stuff...
	initCountDownLayer: function(w, h){
		var layer = new Kinetic.Layer({
			width:w, height:h*0.25, x:0, y:h*0.17 //h*0.02
		});

		// Ready!
		//var ready = new Kinetic.Text({
		//	width:layer.width(), height:layer.height(), x:layer.x(), y:layer.y(), id:"READY_TXT",

		//	text:"ready?", fill:"white", fontSize: 80, fontFamily: 'bubbleboddy', align:'center',
		//	stroke:"black", strokeWidth:5, opacity:0
		//}); layer.add(ready);
		
		var ready = new Kinetic.Image({
			width:layer.width(), height:layer.height(), x:layer.x(), y:layer.y(), id:"READY_TXT", image: _app.resources.readyImage, opacity:0
		}); layer.add(ready);

		ready = new Kinetic.Image({
			width:layer.width(), height:layer.height(), x:layer.x(), y:layer.y(), id:"SET_TXT", image: _app.resources.setImage, opacity:0
		}); layer.add(ready);

		ready = new Kinetic.Image({
			width:layer.width(), height:layer.height(), x:layer.x(), y:layer.y(), id:"GO_TXT", image: _app.resources.goImage, opacity:0
		}); layer.add(ready);

		ready = new Kinetic.Image({
			width:layer.width(), height:layer.height(), x:layer.x(), y:layer.y(), id:"GAME_OVER_TXT", image: _app.resources.gameOverImage, opacity:0
		}); layer.add(ready);

		layer.visible(false);
		return layer;
	},
	initFindMeLayer: function(w, h){
		var layer = new Kinetic.Layer({
			width:w, height:h*0.12, x:0, y:h*0.88, //id:"GAME_BOARD_LAYER" //h*0.02
		});

		// Put the background...
		var bg = new Kinetic.Rect({ 	
								width: layer.width() * 0.36, 
								height: layer.height(), 
								x:0, y:0,
								fill:"#ac7441", 
								stroke:"#29230b", strokeWidth:3
		}); //layer.add(bg);

	
		// Put the holder of the target
		var targetImage = new Kinetic.Image({
			width:layer.width() * 0.25, height:layer.height(),
			x:layer.width() * 0.025, y:0,

			id:"TARGET_IMG"
		}); layer.add(targetImage);


		var callOut = new Kinetic.Group({
			id:"BOTTOM_CALLOUT", x: layer.width() * 0.26, y:0 - layer.height()*0.12,
			width: layer.width()*0.8, height:layer.height()*1
		});

		var callOutBG = new Kinetic.Image({
			image:_app.resources.calloutImage, width: callOut.width()*0.65, height:callOut.height()*1
		}); callOut.add(callOutBG);

		var callOutText = new Kinetic.Text({
			text:"This is a text.", fontSize: 20, fontFamily: _app.font, fill: 'white', id:"TIMES_TEXT", align:'right',
			x: callOut.width() * 0.1, y:callOut.height() * 0.15
		}); callOut.add(callOutText); //callOut.add(calloutText);


		layer.add(callOut);

		// Put the x3 or x4 or xN thingy...
		//var timesSomethingTxt = new Kinetic.Text({
		//	text:"x3", fontSize: 20, fontFamily: _app.font, fill: 'white', id:"TIMES_TEXT", align:'right',
		//	x: layer.width() * 0.270, y:layer.height()*0.55
		//}); layer.add(timesSomethingTxt);

		//layer.add(pauseButton);
		layer.visible(false);
		return layer
	},
	// Katong mag swing swing... bow...
	initFindMeSwingingLayer: function(w, h){
		// Rationale: bulagon nimo ang layer ana para dili hago sa system. 
		//		layer management thingy as per adviced sa kinetic.js
		var layer = new Kinetic.Layer({
			width:w, height:h*0.12, x:0, y:h*0.88, //id:"GAME_BOARD_LAYER" //h*0.02
		});

		var timesSomethingTxt = new Kinetic.Text({
			text:"find me!", fontSize: 24, fontFamily: 'bubbleboddy', fill: '#29230b', align:'right',
			x: layer.width() * 0.38, y:layer.height()*0.2,

			padding:3
		}); 

		var triangle = new Kinetic.Shape({
			x:0, y:0,
			sceneFunc: function(context) {
	          context.beginPath();
	          context.moveTo(layer.width() * 0.39, layer.height()*0.26);
	          context.lineTo(layer.width() * 0.37, layer.height()*0.55);
	          //context.quadraticCurveTo(300, 100, 260, 170);
	          context.lineTo(layer.width() * 0.30, layer.height()*0.44);
	          context.closePath();
	          // KineticJS specific context method
	          context.fillStrokeShape(this);
	        },
	        fill: '#ac7441',
	        //stroke: "#29230b",
	        //strokeWidth: 3
		});

		var container = new Kinetic.Rect({
			width: layer.width() * 0.30, 
			height: timesSomethingTxt.height(), 
			x:layer.width() * 0.37, y:layer.height()*0.2,
			fill:"#ac7441", 
			//stroke:"#29230b", //strokeWidth:3, 
			cornerRadius:8
		}); 

		//layer.add(triangle);
		//layer.add(container);
		//layer.add(timesSomethingTxt);

		layer.visible(false);
		return layer;
	},
	// Post Game Layer Methods and stuff
	initPostGameLayer: function(w, h){
		var postGameLayer = new Kinetic.Layer({ width:w, height:h, x:0, y:0, id:"POST_GAME_LAYER" });
		postGameLayer.y( 0 - postGameLayer.height());

		// Get the grouping...
		var grp = new Kinetic.Group({ width:w*0.8, height:h*0.4, x:(w - w*0.8)/2, y:(h - h*0.4)/2, id:"POST_GAME_CONT" });
		//grp.y( 0 - grp.height()); // Set it to the hidden position;


		// Get the background...
		//var bg = new Kinetic.Rect({ width:grp.width(), height:grp.height(), x:0, y:0, fill:"#ac7441", stroke:"#29230b", strokeWidth:3, cornerRadius: grp.width()*0.03, });
		//grp.add(bg);
		var backdrop = new Kinetic.Rect({
			width:postGameLayer.width(), height:postGameLayer.height(), x:0, y:0,
			fill:"black", opacity:0.6
		}); //postGameLayer.add(backdrop);


		var bg = new Kinetic.Rect({ 	
			width: grp.width(), 
			height: grp.height() * 0.88, 
			x:0, y:5, 

			cornerRadius:  w*0.04, fill:"#7a726a", 
		}); grp.add(bg);

		bg = new Kinetic.Rect({ 	
			width: grp.width(), 
			height: grp.height() * 0.8, 
			x:0, y:0, 

			cornerRadius:  w*0.04, fill:"#d8bfa3", 
		}); grp.add(bg);

		bg = new Kinetic.Rect({ 	
			width: grp.width(), 
			height: grp.height() * 0.8, 
			x:0, y:2, 

			cornerRadius:  w*0.04, fill:"#9b8f82", 
		}); grp.add(bg);



		// Title Message
		var titleText = new Kinetic.Text({ x:0, y:3, 
					width:grp.width(),  
					height:grp.height(), 
					text:"Game Over!",
					fill:"white", align:"center",
					fontSize: 24, fontFamily: _app.subFont

		});

		//text:"game paused", fill:"white", fontSize: 24, fontFamily: _app.subFont, align:'center',
		grp.add(titleText);
		// Score counter...

		var scoreText = new Kinetic.Text({ x:0, y:grp.height() * 0.3, 
					width:grp.width(),  
					height:grp.height(), 
					text:"Your score is 00000 pts!",
					fill:"white", align:"center",
					fontSize: 20, fontFamily: _app.subFont,

					id:"END_GAME_SCORE_TXT"
		}); grp.add(scoreText);


		// Experience counter...

		// Get the button groups... Button group constants..
		var buttonWidth = grp.width()*0.30, buttonHeight = grp.height()*0.18;

		//	Play again button...
		var playAgainBtn  = new Kinetic.Group({ x:grp.width()*0.03, y:grp.height()*0.6, width:buttonWidth, height:buttonHeight, id:"END_GAME_PLAY_AGAIN" }),
			playAgainBG   = new Kinetic.Rect({ x:0, y:0, fill:"blue", width:playAgainBtn.width(), height:playAgainBtn.height()}),
			playAgainText = new Kinetic.Text({ x:0, y:playAgainBtn.height() * 0.25, text:"Play Again?", width:playAgainBG.width(), fontFamily: _app.subFont,
												height:playAgainBG.height(), fill:"white", align:"center", fontSize:12 });


		var bgElem = new Kinetic.Rect({ 	
			width: playAgainBtn.width(), 
			height:playAgainBtn.height() - 3, 
			x:0, y:3, 

			cornerRadius:  w*0.02, fill:"#7a726a", 
		}); playAgainBtn.add(bgElem);

		bgElem = new Kinetic.Rect({ 	
			width: playAgainBtn.width(), 
			height:playAgainBtn.height() * 0.80, 
			x:0, y:0, 

			cornerRadius:  w*0.02, fill:"#ffe284", 
		}); playAgainBtn.add(bgElem);

		bgElem = new Kinetic.Rect({ 	
			width: playAgainBtn.width(), 
			height:playAgainBtn.height() * 0.80, 
			x:0, y:playAgainBtn.height() * 0.05, 

			cornerRadius:  w*0.02, fill:"#ffc14d", 
		}); playAgainBtn.add(bgElem);


		playAgainBtn.add(playAgainText);
		playAgainBtn.on('touchstart', function(evt){
			var obj = _app.screens[10].find("#END_GAME_PLAY_AGAIN")[0];

			obj.children[1].y( obj.children[1].y() + 3);
			obj.children[2].y( obj.children[2].y() + 3);
			obj.children[3].y( obj.children[3].y() + 3);

			_app.screens[10].draw();
		}).on('touchend', function(evt){
			var obj = _app.screens[10].find("#END_GAME_PLAY_AGAIN")[0];

			obj.children[1].y( obj.children[1].y() - 3);
			obj.children[2].y( obj.children[2].y() - 3);
			obj.children[3].y( obj.children[3].y() - 3);

			_app.screens[10].draw();

			// Do the reset of the game...
			_animation.slidePostGameUp();
			_animation.updateScore(00000, 00000);
		}); grp.add(playAgainBtn);





		// Share to Facebook Button...
		playAgainBtn  = new Kinetic.Group({ x:buttonWidth + grp.width()*0.05, y:grp.height()*0.6, width:buttonWidth, height:buttonHeight, id:"END_GAME_SHARE_BTN" }),
		playAgainBG   = new Kinetic.Rect({ x:0, y:0, fill:"blue", width:playAgainBtn.width(), height:playAgainBtn.height()}),
		playAgainText = new Kinetic.Text({ x:0, y:playAgainBtn.height() * 0.25, text:"Share Score!", width:playAgainBG.width(), fontFamily: _app.subFont,
											 height:playAgainBG.height(), fill:"white", align:"center" });

		bgElem = new Kinetic.Rect({ 	
			width: playAgainBtn.width(), 
			height:playAgainBtn.height() - 3, 
			x:0, y:3, 

			cornerRadius:  w*0.02, fill:"#7a726a", 
		}); playAgainBtn.add(bgElem);

		bgElem = new Kinetic.Rect({ 	
			width: playAgainBtn.width(), 
			height:playAgainBtn.height() * 0.80, 
			x:0, y:0, 

			cornerRadius:  w*0.02, fill:"#94c1f7", 
		}); playAgainBtn.add(bgElem);

		bgElem = new Kinetic.Rect({ 	
			width: playAgainBtn.width(), 
			height:playAgainBtn.height() * 0.80, 
			x:0, y:playAgainBtn.height() * 0.05, 

			cornerRadius:  w*0.02, fill:"#477ec1", 
		}); playAgainBtn.add(bgElem);


		playAgainBtn.add(playAgainText);
		playAgainBtn.on('touchstart', function(evt){
			var obj = _app.screens[10].find("#END_GAME_SHARE_BTN")[0];

			obj.children[1].y( obj.children[1].y() + 3);
			obj.children[2].y( obj.children[2].y() + 3);
			obj.children[3].y( obj.children[3].y() + 3);

			_app.screens[10].draw();
		}).on('touchend', function(evt){
			var obj = _app.screens[10].find("#END_GAME_SHARE_BTN")[0];

			obj.children[1].y( obj.children[1].y() - 3);
			obj.children[2].y( obj.children[2].y() - 3);
			obj.children[3].y( obj.children[3].y() - 3);

			_app.screens[10].draw();


			// Check if logged in...
			// TODO: This is the popup publish feature of facebook. Share ni diritso.
			_gamePlay.shareToFacebook();
			


		});
		grp.add(playAgainBtn);




		// Back to Main Menu Button...
		playAgainBtn  = new Kinetic.Group({ x:buttonWidth*2 + grp.width()*0.075, y:grp.height()*0.6, width:buttonWidth, height:buttonHeight, id:"END_GAME_BACK_BTN" }),
		playAgainBG   = new Kinetic.Rect({ x:0, y:0, fill:"blue", width:playAgainBtn.width(), height:playAgainBtn.height()}),
		playAgainText = new Kinetic.Text({ x:0, y:playAgainBtn.height() * 0.25, text:"Back to Menu", width:playAgainBG.width(), fontFamily: _app.subFont,
											height:playAgainBG.height(), fill:"white", align:"center" });

		bgElem = new Kinetic.Rect({ 	
			width: playAgainBtn.width(), 
			height:playAgainBtn.height() - 3, 
			x:0, y:3, 

			cornerRadius:  w*0.02, fill:"#7a726a", 
		}); playAgainBtn.add(bgElem);

		bgElem = new Kinetic.Rect({ 	
			width: playAgainBtn.width(), 
			height:playAgainBtn.height() * 0.80, 
			x:0, y:0, 

			cornerRadius:  w*0.02, fill:"#d6d6d6", 
		}); playAgainBtn.add(bgElem);

		bgElem = new Kinetic.Rect({ 	
			width: playAgainBtn.width(), 
			height:playAgainBtn.height() * 0.80, 
			x:0, y:playAgainBtn.height() * 0.05, 

			cornerRadius:  w*0.02, fill:"#b8b8b8", 
		}); playAgainBtn.add(bgElem);


		playAgainBtn.add(playAgainText);
		playAgainBtn.on('touchstart', function(evt){
			var obj = _app.screens[10].find("#END_GAME_BACK_BTN")[0];

			obj.children[1].y( obj.children[1].y() + 3);
			obj.children[2].y( obj.children[2].y() + 3);
			obj.children[3].y( obj.children[3].y() + 3);

			_app.screens[10].draw();

		}).on('touchend', function(evt){
			var obj = _app.screens[10].find("#END_GAME_BACK_BTN")[0];

			obj.children[1].y( obj.children[1].y() - 3);
			obj.children[2].y( obj.children[2].y() - 3);
			obj.children[3].y( obj.children[3].y() - 3);

			_app.screens[10].draw();


			_animation.hidePostGame();
			_animation.backToMainMenu();
			_animation.updateScore(00000, 00000);
		}); grp.add(playAgainBtn);


		postGameLayer.add(grp);
		return postGameLayer;
	}

}

// This is the collective object for the animations... hihihihi :)

var _animation = {

	timerTextObject:null,
	timerBarOffset:null,
	//isAnimating: false,

	counter: 0,

	
	animateNewGame: function(){
		var layer = _app.screens[0];

		// Slide Down the pane...
		this.slideMainMenuUp(layer);

	},

	// Sliding the menu up from main menu to the game pane... :)
	slideMainMenuUp: function(l){
		var offset = 0 - (l.height() / 2);
		var tween = new Kinetic.Tween({ 
			node:l,
			duration: 1,
	        y:offset,
	        easing: Kinetic.Easings.BounceEaseOut,
	        onFinish: function(){
	        	// After that, please animate the slide stats pane in nao...
	        	_animation.slideStatsPaneIn();
	        }
		}); tween.play();
	},
	// Animate the stats menu in...
	slideStatsPaneIn: function(){
		var statsPane = _app.screens[1];
		var tween = new Kinetic.Tween({
			node:statsPane,
			duration:1,
			y:statsPane.getParent().height()*0.025,
			easing:Kinetic.Easings.BounceEaseOut,
			onFinish: function(){
				_animation.animateClickables();
			}
		}); tween.play();
	},
	// Leaderboard chuchu
	slideLeaderBoardDown: function(){
		var layer = _app.screens[3];
		var tween = new Kinetic.Tween({
			node: layer,
			duration:1,
			y:0,
			easing:Kinetic.Easings.BounceEaseOut
		}); tween.play();
	},
	slideLeaderBoardUp: function(){
		var layer = _app.screens[3];
		var tween = new Kinetic.Tween({
			node: layer,
			duration:1,
			y:0 - layer.height(),
			easing:Kinetic.Easings.BounceEaseIn
		}); tween.play();
	},

	// Pause Menu...
	showPauseMenu: function(pauseMenuLayer){

		pauseMenuLayer.y( 0 );
		pauseMenuLayer.draw();


		// Execute Pause Game (before ani)....

	},
	hidePauseMenu: function(pauseMenuLayer){
		pauseMenuLayer.y( 0 - pauseMenuLayer.height());
		pauseMenuLayer.draw();
	},


	// Back to uranus...
	backToMainMenu: function(){
		// Main menu p[ane]
		_app.screens[0].y(0);
		_app.screens[0].draw();

		// Hide the stats pane...
		_app.screens[1].y(0 - _app.screens[1].height());
		_app.screens[1].draw();

		// Hide the bottom pane...
		_app.screens[6].visible(false).draw();

		// Hide the "find me"
		_app.screens[8].visible(false).draw();
		_app.screens[9].visible(false).draw();

		// Hide the board layers...
		var layers = _app.screens[5], i;
		for(i=0; i<layers.length; i++){
			layers[i].visible(false).opacity(0).draw();
		}
	},


	// Animate the clickables in...
	animateClickables: function(){
		var clickables = _app.screens[5], tweens = [], tween;

		_animation.a(clickables, 0);
	},
	a: function(ts, i){ //Helper function for the animation...
		if (ts.length > i){
			var t = new Kinetic.Tween({
				node:ts[i],
				opacity:1,
				visible:true,
				duration:0.001,
				easing: Kinetic.Easings.EaseOut,
				onFinish: function(){
					//console.log("yeah");
					console.log(i);
					if (i+1 >= ts.length){
						console.log("dun");
						_animation.animateCountDown();
					} else {
						_animation.a(ts, i+1);
					}
				}
			}); t.play();
		} else { 
			//console.log("Stahpp..."); 
			//this.animateCountDown();
		}

	},

	// Animate the 3, 2, 1 chuchu
	animateCountDown: function(){
		var layer = _app.screens[7],
			ready = layer.find('#READY_TXT')[0],
			set   = layer.find('#SET_TXT')[0],
			go    = layer.find('#GO_TXT')[0];

		layer.visible(true);

		if (_gamePlay.isPaused){
			_gamePlay.resetGameStats();
		}


		// Get the tweens...
		// TODO: Get them out later...

		var ready_showTween = new Kinetic.Tween({
			node:ready,
			opacity:1,
			duration:0.3,
			onFinish: function(){ 
				ready_showTween.reverse(); 
				setTimeout(function(){
					set_showTween.play();
				}, 300);
			}
		});

		var set_showTween = new Kinetic.Tween({
			node:set,
			opacity:1,
			duration:0.3,
			onFinish: function(){ 
				set_showTween.reverse(); 
				setTimeout(function(){
					go_showTween.play();
				}, 300);
			}
		});

		var go_showTween = new Kinetic.Tween({
			node:go,
			opacity:1,
			duration:0.3,
			onFinish: function(){
				go_showTween.reverse();
				setTimeout(function(){
					layer.visible(false).draw();
					// The pause button...
					_app.screens[6].visible(true).draw();
					// Show the "find me " layer
					_app.screens[8].visible(true).draw();
					_app.screens[9].visible(true).draw();

					_animation.findMeSwivel.start();

					_gamePlay.startGame();
				}, 0);
			}
		});

		
		//setTimeout(function(){
			ready_showTween.play();
		//}, 500);
	},
	// Updating timerBar
	updateTimerBar: function(layer){
		var timerBar = layer.find("#TIMER_BAR")[0];
		timerBar.width( timerBar.width() - this.timerBarOffset);
		layer.draw();
	},
	// Clearing the cliked ones...
	clearClickedInteractions: function(guessdata){

		var elems = _app.screens[5];
		for(var i=0; i<elems.length; i++){
			if (guessdata.indexOf(elems[i].id()) != -1){


				elems[i].children[1].opacity(1);
				elems[i].draw();
			}
		}

	},


	// 
	// Updating the board layers...
	updateBoardLayers: function(board){
		var elems = _app.screens[5], index;

		for (var i=0; i<elems.length; i++){

			index = board[i];

			//elems[i].children[0].fill( _characters[index].color );


			// elems[i].children[0].children[0] --> Uncovered image...
			// elems[i].children[0].children[1] --> dakpan image...

			elems[i].children[0].children[0].setImage( _characters[index].img );
			//elems[i].children[0].children[0].setImage( _characters[index].imgAlt );




			elems[i].draw();

		}
	},




	// Showing it out... hihihihi....
	showAllBoardLayers: function(){
		var elems = _app.screens[5];
		for (var i=0; i<elems.length; i++){

			elems[i].children[1].opacity(0);
			elems[i].draw();

		}
	},
	// Hiding it out...
	hideAllBoardLayers: function(){
		var elems = _app.screens[5];
		for (var i=0; i<elems.length; i++){

			elems[i].children[1].opacity(1);
			elems[i].draw();

		}
	},
	// Animating the scoresheets...
	updateScore: function(previousScore, currentScore){
		var scoreObj = _app.screens[1].find("#GAME_SCORE_TXT")[0];
		scoreObj.text(this.fiveDigit(currentScore));

		_app.screens[1].draw();
	},

	// The swivel motion of the "find me"
	findMeSwivel: new Kinetic.Animation(function(frame){
		var context = _app.screens[9];
		//context.y( 150 * Math.sin(frame.time * 2 * Math.PI / 1000) + (context.y()/2) );


		//context
	}, _app.screens[9]),
	
	// Update the target character i.e. show it...
	showWhatToFind: function(target){
		var obj = _app.screens[8].find("#TARGET_IMG")[0];

		//obj.fill( _characters[target].color );
		obj.setImage( _characters[target].img );

		_app.screens[8].draw();
	},

	// Reset the timer bar...
	resetTimerBar: function(){
		var timerBar  = _app.screens[1].find("#TIMER_BAR")[0],
			parentBar = _app.screens[1].find("#TIMER_BAR_PARENT")[0];

		timerBar.width( parentBar.width() );
		_app.screens[1].draw();
	},


	// End Game animation...
	endGameAnimations: function(){



		// Show the "game over" thingy...
		_app.screens[7].visible(true);
		var gameOver = _app.screens[7].find('#GAME_OVER_TXT')[0],
			
			gameOverTween = new Kinetic.Tween({
				node: gameOver,
				opacity:1,
				duration:1,
				onFinish: function(){ 
					gameOverTween.reverse(); 
					setTimeout(function(){
						_app.screens[7].visible(false);

						// Scroll down the post game pane...
						_animation.slidePostGameDown();

					}, 1000);
				}
		}); 

		// update the score...
		var score = _app.screens[10].find("#END_GAME_SCORE_TXT")[0];
		score.text("Your score is "+this.fiveDigit(_gamePlay.score)+" pts");
		_app.screens[10].draw();






		gameOverTween.play();
	},
	slidePostGameUp: function(){
		var postGamePane = _app.screens[10];

		var tween = new Kinetic.Tween({
			node: postGamePane,
			duration: 1,
	        y: 0 - postGamePane.height(),
	        easing: Kinetic.Easings.BounceEaseIn,
	        onFinish: function(){
	        	// After that, please animate the slide stats pane in nao...
	        	//_animation.slideStatsPaneIn();

	        	_animation.animateCountDown();

	        }
		}); tween.play();
		
	},
	slidePostGameDown: function(){
		var postGamePane = _app.screens[10];

		var tween = new Kinetic.Tween({
			node: postGamePane,
			duration: 1,
	        y: 0,
	        easing: Kinetic.Easings.BounceEaseOut,
	        onFinish: function(){
	        	// After that, please animate the slide stats pane in nao...
	        	//_animation.slideStatsPaneIn();



	        }
		}); tween.play();
	},
	hidePostGame: function(){
		_app.screens[10].y( 0 - _app.screens[10].height() ).draw();
	},
	// Animate up and down the help menu...
	slideHelpViewDown: function(){
		var layer = _app.screens[11];
		var tween = new Kinetic.Tween({
			node: layer,
			duration:1,
			y:0,
			easing:Kinetic.Easings.BounceEaseOut
		}); tween.play();
	},
	slideHelpViewUp: function(){
		var layer = _app.screens[11];
		var tween = new Kinetic.Tween({
			node: layer,
			duration:1,
			y:0 - layer.height(),
			easing:Kinetic.Easings.BounceEaseIn
		}); tween.play();
	},
	updateNumberPieces: function(n){

		var string;

		if (n == "standby"){
			string = "Find "+_gamePlay.level+" of me";
		} else if (n == "positive"){
			string = "You got it!";
		} else if (n == "negative"){
			string = "No, no. It's not!";
		}
		_app.screens[8].find("#TIMES_TEXT")[0].text(string);
		_app.screens[8].draw();
	},



























	// Button Animation/s...
	enlargeButton: function(btn){
		var obj = btn;

		// Enlarge it!
		obj.width( obj.width() + obj.width()*0.2 );
		obj.height( obj.height() + obj.height()*0.2 );
		obj.x( obj.x() - obj.width()*0.1);
		//obj.y( obj.y() - obj.height()*0.1);

		return obj;
	},
	shrinkButton: function(btn){
		var obj = btn;

		// Enlarge it!
		obj.width( obj.width() - obj.width()*0.166666666666666 );
		obj.height( obj.height() - obj.height()*0.166666666666666 );
		obj.x( obj.x() + obj.width()*0.01);
		//obj.y( obj.y() + obj.height()*0.01);

		return obj;
	},

	// Updating Grid Characters...
	//	TEMP: This is for the current test...
	//		just for numbers only...
	updateGameGridCharacters: function(board, layer){
		var gridElems = layer.find(".GAME_GRID_ELEM"), txtInside; //txtInside is a temp var	
		for (var i=0; i<board.length; i++){

			txtInside = gridElems[i].children[1];
			txtInside.text( board[i] );

		} layer.draw();
	},

	// Clearing isClicked Interactions.
	//	Kini siya kay mu clear ang sa pag click bitaw nimo sa grid, mu clear out siya...
	//	
	

	// Helper: gets a number to a five-digit one...
	fiveDigit: function(number){
		var s = "000000000" + number;
		return s.substr(s.length-5);
	}

}


// Input the Apache Cordova actions right here..
var __cordova = {

	init: function(){

	},


}


// Pre-load all the resources right here...
_app.resources.__init();

// Map the init function in the onload event...
window.onload = function(){
	console.log("Starting application...!");
	// Start! :)
	_app.__init__();

	//document.addEventListener('deviceready', function() {
        try {
            FB.init({ appId: "711981072158404", nativeInterface: CDV.FB, useCachedDialogs: false });
            document.getElementById('data').innerHTML = "";
        } catch (e) { alert(e); }
   // }, false);
	//_animation.slideMainMenuUp();
}

function onDeviceReady() {
    _app.__init__();
    setTimeout(function(){
    	_app.screens
    }, 5000);
}
//document.addEventListener("deviceready", onDeviceReady, false);








