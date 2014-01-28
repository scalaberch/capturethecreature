



// This is the object for the gameplay...
//	You'll need this for the current game session. Each session is
//	limited to 2 minutes only. User credentials are either stored in
//	session/phone storage or at Facebook

var _gamePlay = {

	isPlaying: false,
	score:     0,
	myGuess:   [],
	level: 	   3,

	playerStats: {
		allowableClicks:3,
		initPlayerStats: function(){

		}
	},

	startPlaying: function(){ this.isPlaying = true;  },
	stopPlaying : function(){ this.isPlaying = false; },

	addToMyGuess: function(){
		
	},


	//TODO: This is the temporary action... Final action is on button click...
	// Starting on this
	
	startGame: function(){
	// this.gameTimer.start(); <-- 
	_board.shuffleBoard(_gamePlay.getRandomCharacter(0), this.level); // level depends on the players level // -1 is used since 
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

	// Do the submission of guess
	// 	This also handles the recurring action of the game...



	// Game Timer Structure
	gameTimer: {

		time: 121, timer: null,
		start: function(){
			// Manually starting the timer...
			this.timer = setInterval(function(){
				_gamePlay.gameTimer.tiktok()
			}, 1000);
		},
		stop: function(){
			// Manually stopping the timer...
			if (this.timer != null){
				clearInterval(this.timer);
				this.timer = null;
			}	
		},
		tiktok: function(){
			this.time--;

			console.log("Time remaining: "+this.showInFormat(this.time)+" seconds");
			if (this.time == 0){
				this.stop();
			}
		},
		showInFormat: function(seconds){
			var result = Math.floor(seconds/60) + ":";
			if (seconds % 60 == 0){ result += "0"; }

			return result + (seconds%60) + "";
		}

	}

}

// This is the player object. This holds all the attributes for the player
// 	This includes the level of the player, the experience level and the
//	other notions such as how many clicks to be allowed
//	Note: The data is usually stored in phone storage on in the database. LOL

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
			var random = 2; // Insert implementaiton here


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
	
	{ name:"NONE", value:0, img:"path_to_image/here" },
	{ name:"Cheekee", value:10, img:"path_to_image/here" },
	{ name:"Chaakee", value:12, img:"path_to_image/here" },
	{ name:"Chuukee", value:12, img:"path_to_image/here" }

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

	// Application Attributes


	app: null, // Attribute for KineticJS Canvas

	// Screens is an array of KineticJS Layers :)
	// 	For now, it is still an empty array
	screens: [],


	// Application Initiator. Call this on start of the application.
	__init__: function(){
		// Get the width and height of the screen...
		var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0];
		var _width = w.innerWidth || e.clientWidth || g.clientWidth, _height = w.innerHeight|| e.clientHeight|| g.clientHeight;

		// Load to app attribute.
		this.app = new Kinetic.Stage({
		    container: 'gameContainer',
		    width: _width,
		    height: _height
		});

		// Load main menu page and game page...
		var mainMenuScreen = this.initMainMenuScreen(_width, _height); this.screens.push(mainMenuScreen);
		var gameMenuScreen = this.initGameScreen(_width, _height); this.screens.push(gameMenuScreen);


		// Call all initiators of pages...
		//_gameScreen.initAttach_ClickableGrid();

		//this.app.add(_gameScreen._screen);

		console.log(this.appWidth());
		console.log(this.appHeight());

		// Add to the main app...
		for (var i = 0; i < this.screens.length; i++) {
			this.app.add(this.screens[i]);
		};
	},

	// Methods...
	appWidth:  function(){ return this.app.width();  },
	appHeight: function(){ return this.app.height(); },

	// Method: initialize main menu screen
	initMainMenuScreen: function(w, h){
		// Initialize Layer...
		var layer = new Kinetic.Layer({
			width: w, height: h
		});

		// Add the background image...
		var bg = new Kinetic.Rect({ fill:"red", width:w, height:h });
		layer.add(bg);

		// Add the buttons...
		var playGameButton = new Kinetic.Rect({ fill:"green", width:w*0.6, height:h*0.10, x:w*0.25, y:h*0.7 });


		// Add the animation for the buttons and append to layer...
		playGameButton.on('mouseup touchend', function(evt){
			console.log("I mouseup you!");

			// Animate the layer upward, while getting the other layer downward...
				var amplitude = 150;
		      var period = 2000;
		      // in ms
		      var centerX = stage.width()/2;


			var anim = new Kinetic.Animation(function(frame) {
				// TEMP
		       _app.screens[0].setX(50 * Math.sin(frame.time * 2 * Math.PI / period) + centerX);
		    }, _app.app);

		    anim.start();

		}).on('mousedown touchstart', function(){
			console.log("I mousedown you!");
		});


		layer.add(playGameButton);


		return layer;
	},

	// Method: initialize game screen...
	initGameScreen: function(w, h){
		// Initialize Layer...
		var layer = new Kinetic.Layer({
			width: w, height: h,

			// In this case, i'll put this layer BELOW the main menu screen....
			x:0, y:h
		});

		// Add the background image...
		var bg = new Kinetic.Rect({ fill:"blue", width:w, height:h });
		layer.add(bg);

		return layer;
	}


}



// This is the game screen. This holds the gameGrid layer, in which is the
//	playable layer ;)

var _gameScreen = {

	_screen: new Kinetic.Layer({ id:"GAME_SCREEN" }),	 


	// This is the gameGrid. We can play in here...]
	// 	There are two types of grid that will generate here
	//		1. GridClickable: This is the outer layer of the grid. This is where we can click/touch
	//				the grid elements to execute the backend.
	//		2. GridDrawable:  This is the third layer of the grid. This is where the characters are drawn
	//				and are animated. Their actions are based on the events done by GridClickable.
	gameGrid: {
		layer: new Kinetic.Group(),

		gridSlotOffset:{ left:0.1, right:0.1, top:0.1, bottom:0.1 },
		gridSlotAttr:  { x:0, y:0, width:60, height:60, id:null, fill:'green', stroke:'black', strokeWidth:1 },
		gridSize:      { h:4, v:5 },



		// You can only call this function everytime you click "Start Game"
		initializeGridClickable: function(){
			var group = new Kinetic.Group();

			// Plot the first point of coords...
			this.gridSlotAttr.x = 20; this.gridSlotAttr.y = 20; 

			var gridSlot, i=0;
			for(var vertical = 0; vertical < this.gridSize.v; vertical++){

				for(var horiz = 0; horiz < this.gridSize.h; horiz++){
					this.gridSlotAttr.id = "GAME_SLOT_"+i;
					gridSlot = new Kinetic.Rect(this.gridSlotAttr);
					
					// Map the touch and click events to this slot
					gridSlot.on('mouseup', function(){
						console.log(this.id());
					}).on('mouseover', function(){
						this.fill = "blue";
					});


					group.add(gridSlot); i++;
					this.gridSlotAttr.x += this.gridSlotAttr.width;
				}

				this.gridSlotAttr.y += this.gridSlotAttr.height;
				this.gridSlotAttr.x = 20;
			} 

			this.layer = group;
		}
	},



	// Attaching the gameGrids to parent screen...
	initAttach_ClickableGrid: function(){
		this.gameGrid.initializeGridClickable();
		this._screen.add( this.gameGrid.layer  );
	}
}



// Start! :)
_app.__init__();

// Input the Apache Cordova actions right here..
var __cordova = {

	init: function(){

	}

}








