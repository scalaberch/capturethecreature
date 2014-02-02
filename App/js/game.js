



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
			// This will get to the cordova data...
		}
	},

	startPlaying: function(){ this.isPlaying = true;  },
	stopPlaying : function(){ this.isPlaying = false; },

	// OnClick on the Start Game will execute this one!
	startGame: function(e){
		// Initialize the board daan...
		var gameLayer 		= e.targetNode.getParent().getParent(),
			gameTimerObj 	= gameLayer.find("#GAME_TIMER_TXT")[0];

		// Implement the animation of the 3-2-1 countdown here...
		//	Assigned: @hillary




		// Do the delay of 3 seconds...
		setTimeout(function(){

			// Start the timer and its animation/s...
			_gamePlay.gameTimer.start(gameTimerObj, gameLayer);


		}, 3000);



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

	// Do the submission of guess
	// 	This also handles the recurring action of the game...



	// Game Timer Structure
	gameTimer: {

		time: 121, timer: null,
		start: function(t, l){
			// Manually starting the timer...
			this.timer = setInterval(function(){
				_gamePlay.gameTimer.tiktok(t, l);
			}, 1000);
		},
		stop: function(){
			// Manually stopping the timer...
			if (this.timer != null){
				clearInterval(this.timer);
				this.timer = null;
			}	
		},
		tiktok: function(txt, lyer){
			this.time--;

			this.updateToGUI(this.showInFormat(this.time), txt, lyer);
			if (this.time == 0){
				this.stop();
			}
		},
		showInFormat: function(seconds){
			var result = Math.floor(seconds/60) + ":";
			if (seconds % 60 < 10){ result += "0"; }

			return result + (seconds%60) + "";
		},
		updateToGUI: function(time, text, layer){
			console.log("Time remaining: "+this.showInFormat(this.time)+" seconds");

			text.text(time); layer.draw();
			_animation.updateTimerBar(layer);
		}

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
	},

	// Add up to score
	//	Adds up to the score on the _gameplay
	//	This is just a basic score = character.score * number
	//		The trick is just to increment by this value to the _gamePlay.score
	//	Assigned: @ellenp 
	addUpToScore: function(character, number){

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

	// Resource Data Structure...
	resources: {

		__init: function(){
			console.log("Loading resources...");
			this.mainMenuBackground = new Image(); this.mainMenuBackground.src = "img/BG.png";
			this.gameScreenBackground = new Image(); this.gameScreenBackground.src = "img/gameBG.png";

		},

		// Image resources...
		mainMenuBackground:null,
		gameScreenBackground:null


	},

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

		// Print out the screen width and height:
		console.log(_width + " x " + _height);


		// Load the main layer
		var mainLayer = this.initMainGameLayer(_width, _height);

		// Add to container
		this.app.add(mainLayer);
		// Put to screens array for reference in below objects
		this.screens = [mainLayer];		
	},

	// Methods...
	appWidth:  function(){ return this.app.width();  },
	appHeight: function(){ return this.app.height(); },

	// Method: initialize main menu layer...
	initMainGameLayer: function(w, h){
		// Load the main layer
		var mainLayer = new Kinetic.Layer({ width:w, height:h*2, x:0, y:0, id:"GAME_LAYER" }),
			mainMenuPage = this.initMainMenuScreen(w, h),
			gameScreen = this.initGameScreen(w, h);


		mainLayer.add(mainMenuPage);
		mainLayer.add(gameScreen);
		return mainLayer;
	},


	// Method: initialize main menu screen
	initMainMenuScreen: function(w, h){
		var page = new Kinetic.Group({ width:w, height:h, x:0, y:0, id:"MAIN_MENU_PAGE" });

		// Put the background on the page
		var bg = new Kinetic.Image({
	         image: this.resources.mainMenuBackground, width: page.width(), height:page.height()
		}); page.add(bg);

			// Add the button...
		var startGameButton = new Kinetic.Rect({ 	
								width:page.width()*0.6, 
								height:page.width()*0.1, 
								x:page.width()*0.2, 
								y:page.height()*0.7,
								fill:"#68b646", 
								cornerRadius: page.width()*0.03,
								stroke:"#c3da42",

								fillLinearGradientStartPoint: {x:-50, y:-50},
								fillLinearGradientEndPoint: {x:50,y:50},
								fillLinearGradientColorStops: [0, 'red', 300, 'yellow']  
							});

			// Add the animation...
		startGameButton.on('touchstart', function(evt){
			var obj = evt.targetNode;
			obj.fill('#c3da42'); 

			// Enlarge it!
			//var btn = _animation.enlargeButton(obj);

			obj.draw();

		}).on('touchend', function(evt){

			var obj = evt.targetNode;
			obj.fill('#68b646'); 

			//Return to normal size...
			//var btn = _animation.shrinkButton(obj);
			//Redraw the background image/s
			//obj.parent.children[0].draw();
			//console.log(obj.parent.children[0]);

			obj.draw();
			_animation.slideMainMenuUp();
			_gamePlay.startGame(evt);
		});

		// Add to mainMenuPage
		page.add(startGameButton);

		return page;
	},

	// Method: initialize game screen...
	initGameScreen: function(w, h){
		// Create the main game screen
		var page = new Kinetic.Group({ width:w, height:h, x:0, y:h, id:"GAME_SCREEN" });

		// Put the background on the gameScreen
		var bg = new Kinetic.Image({
	        image: this.resources.gameScreenBackground, width: page.width(), height:page.height()
		}); page.add(bg);

		// Add up the score and the timer text..
		var gameStats = this.initGameStatsScreen(w, h);
		page.add(gameStats);

		// Then put the character placement grid...
		//var characterGrid = this.initCharacterGrid(w, h, { w:4, h:5 });

		// Then put the clickable grid...
		//var clickableGrid = this.initClickableGrid(w, h, { w:4, h:5 });
		//page.add(clickableGrid);
		//page.add(characterGrid);
		var gameGrid = this.initGameGrid(w, h, gameStats.y() + gameStats.height() + 5);

		return page;
	},

	// Method: initialize gameGrid
	initGameGrid: function(gameWidth, gameHeight, offsetY){
		var gameGrid = new Kinetic.Group({ width:gameWidth, height:gameHeight, x:0, y:offsetY });

		// Add up the elements....
		var params = { w:4, h:5 }, elemParams = {};
		var gameGridElement;

		// Heihercy of the grid:
		// gameGrid > gameGridElement > character
		//							  > cover

		// Some Temporary Vars for TEMP*
		var contentText; var contentBG
		// End Temporary Vars

		var index = 0;
		for(var ver = 0; ver < params.h; ver++){

			for (var hor = 0; hor < params.w; hor++){

				gameGridElement = new Kinetic.Group({ name:"GAME_GRID_ELEM", id:index });

				// Add up the elements inside...
				// TEMP*: Just a grid with some text inside....
				contentBG = new Kinetic.Rect({
					stroke:"black", x:0, y:0
				}); gameGridElement.add(contentBG);

				content = new Kinetic.Text({
					text:"0:00", fontSize: 24, fontFamily: 'Calibri', fill: '#29230b', x:0, y:0
				}); gameGridElement.add(content);

				

				index++;
			}


		}


		return gameGrid;
	},


	// Method: initialize game screen: clickable grid...
	initClickableGrid: function(w, h, dimension){
		// Put the clickable grid...
		var clickableGrid = new Kinetic.Group({ width:w*0.8, height:h*0.8, x:w*0.1, y:h*0.1 });
		var gridElement = null;

		// Grid Dimensions...
		var count = 0;
		var params = { width:clickableGrid.width() / dimension.w, height:clickableGrid.height() / dimension.h, x:0, y:0};
		for(var h=0; h<dimension.h; h++){
			params.x = 0;

			for(var w=0; w<dimension.w; w++){
				gridElement = new Kinetic.Rect(params);
				gridElement.id(count); //Map the index...
				count++;

				// Some UI tweak
				gridElement.stroke('rgba(0,255,0,0.2');
				gridElement.fill('rgba(0,255,0,0.3');

				gridElement.on('touchstart', function(evt){
					console.log("mousedown a grid elem");

					var object = evt.targetNode;
					//object.setFill('red'); object.draw();

					// INSERT ANIMATION ON CLICK GRID HERE...
				}).on('touchend', function(evt){
					console.log("mouseup a grid elem");

					var object = evt.targetNode;
					object.setFill('blue'); object.draw();
					console.log(object.id());


					if (_gamePlay.myGuess.indexOf(object.id()) == -1){ //Wala pa sa array
						// Add them...
						_gamePlay.addToGuess(object.id());

						// If 3 na kabuok ang elements
						if (_gamePlay.myGuess.length == _gamePlay.playerStats.allowableClicks){
							// Execute sa function ni noodles...

							console.log(_gamePlay.myGuess);
							_gamePlay.myGuess = [];
						}		

					} else {
						// Animate out it...
					}

				});


				clickableGrid.add(gridElement);
				params.x += params.width;
			}

			params.y += params.height;
		}

		return clickableGrid;
	},

	// Method: initialize the grid for character placement...
	initCharacterGrid: function(w, h, dimension){
		var characterGrid = new Kinetic.Group({ width:w*0.8, height:h*0.8, x:w*0.15, y:h*0.1 });
		var gridElement = null; var offset = w*0.025;

		var params = { width:characterGrid.width() / dimension.w - offset, height:characterGrid.height() / dimension.h - offset, x:0, y:offset*3};

		//TEMPORARY LAYOUT
		var text, box;

		for(var h=0; h<dimension.h; h++){
			params.x = 0;

			for(var w=0; w<dimension.w; w++){
				//gridElement = new Kinetic.Rect(params);
				
				// TEMPORARY LAYOUT:
				gridElement = new Kinetic.Group(params);
				box = new Kinetic.Rect({ width:characterGrid.width() / dimension.w - offset, height:characterGrid.height() / dimension.h - offset });
				text = new Kinetic.Text({ text:'0', fontSize: 30, fontFamily: 'Calibri', fill: 'black', name:'CHARACTER_GRID_TXT' });
				
				box.stroke("black");
				gridElement.add(box);
				gridElement.add(text);

				characterGrid.add(gridElement);
				params.x += params.width;
			}

			params.y += params.height;
		}

		return characterGrid;
	},

	// Method: updates the character grid by the board generated...
	// 	@board: is an array of integers. 
	//
	// 	Temporary Fix: The contents were just text only...
	updateCharacterGrid: function(board){
		var items = this.screens[0].find('.CHARACTER_GRID_TXT'); //this.screens[0]
		for(var i=0; i<items.length; i++){
			items[i].text(board[i]);
			items[i].fill("red");

			items[i].getParent().draw();

			console.log(items[i].text());
		}
	},

	// Method: draws the game stats screen...
	initGameStatsScreen: function(w, h){
		var gameStatsContainer = new Kinetic.Group({ width:w+4, height:h*0.8, x:0, y:h*0.05 });

		// Put the background...
		var background = new Kinetic.Rect({ 	
								width: gameStatsContainer.width(), 
								height:gameStatsContainer.height()*0.125, 
								x:-2, y:0,
								fill:"#ac7441", 
								stroke:"#29230b", strokeWidth:3
						});
		gameStatsContainer.add(background);

		// Put the timer text...
		var timerText = new Kinetic.Text({
			text:"0:00", fontSize: 24, fontFamily: 'Calibri', fill: '#29230b', id:"GAME_TIMER_TXT", x:5, y:2
		}); gameStatsContainer.add(timerText);

		// Put the score text...
		var scoreText = new Kinetic.Text({
			text:"00000", fontSize: 24, fontFamily: 'Calibri', fill: '#29230b', id:"GAME_SCORE_TXT", align:'right',
			x: gameStatsContainer.width() - 70, y:2
		}); gameStatsContainer.add(scoreText);

		var timerBarBG = new Kinetic.Rect({
			x:6, y:timerText.height() + 7, height:5, width:gameStatsContainer.width() * 0.95, fill:"#ac7441", stroke:"#29230b"
		}); gameStatsContainer.add(timerBarBG);

		var timerBar = new Kinetic.Rect({
			x:6, y:timerText.height() + 7, height:5, width:timerBarBG.width(), fill:"#29230b", stroke:"#29230b", id:"TIMER_BAR"
		}); gameStatsContainer.add(timerBar);

		// Update _animation attribute on timerBarOffset (needed for the animation...);
		_animation.timerBarOffset = timerBar.width() / 121; // 121 kay 2 minutes + 1 offset... :)


		return gameStatsContainer;
	}



}

// This is the collective object for the animations... hihihihi :)

var _animation = {

	timerTextObject:null,
	timerBarOffset:null,

	counter: 0,
	slideMainMenuUp: function(){
		var mainMenu   = _app.screens[0].find('#MAIN_MENU_PAGE')[0],
	        gameScreen = _app.screens[0].find('#GAME_SCREEN')[0];

		// The second motion animation...
		var scrollingDown = new Kinetic.Animation(function(frame) {
	        mainMenu.y( mainMenu.y() - 18 );
	        gameScreen.y( gameScreen.y() - 18);
	        mainMenu.draw(); gameScreen.draw();

	        //console.log(gameScreen.y());

	        if (gameScreen.y() < 0){
	        	this.stop();
	        }

	    }, _app.screens[0]);

	    // The first motion animation...
		var exciteMotion = new Kinetic.Animation(function(frame){
			var distance = mainMenu.height() * 0.1;

			mainMenu.y( mainMenu.y() + 3);
			gameScreen.y( gameScreen.y() + 3);
			mainMenu.draw(); gameScreen.draw();

			if (distance < mainMenu.y()){
				this.stop(); scrollingDown.start();
			}

		}, _app.screens[0]);

		// Start the animation!
		exciteMotion.start();
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

	// Updating timerBar
	updateTimerBar: function(layer){
		var timerBar = layer.find("#TIMER_BAR")[0];
		timerBar.width( timerBar.width() - this.timerBarOffset);
		layer.draw();
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



// Input the Apache Cordova actions right here..
var __cordova = {

	init: function(){

	}

}


// Pre-load all the resources right here...
_app.resources.__init();

// Map the init function in the onload event...
window.onload = function(){
	console.log("Starting application...!");
	// Start! :)
	_app.__init__();
	//_animation.slideMainMenuUp();
}








