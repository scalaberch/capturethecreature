

var _facebook = {


}

var _me = {
	
}

var _game = {
	
	// This checks if the player is playing or not.
	isPlaying: false,
	currenScore: 0,

	// Loads the resources and stuff.
	initGame: function(){

	},

	// Updates resources (audio/graphics) and stuff...
	updateResources: function(){
		// Playing Background Music
		_sound.playBGAudio();
	}

}

/*
* Utilizes HTML5 Audio. This is for the actions of the audio
*  	thingy: Background music and stuff.
*/
var _sound = {

	mainMenuBG: new Audio(''),
	mainMenuBG2: new Audio(''),

	playBGAudio: function(){
		if (_game.isPlaying){
			mainMenuBG2.play();
		} else { mainMenuBG.play(); }
	}

}


/*
* This sets up the screen manipulation for the game.
* Requires jQuery and stuff.
*/
var _screen = {

	// These are the screen attributes...
	// screenID(s) start with the hashtag/s.
	screenID: null,
	modalScreen: null, modalTitle:null, modalContent:null,

	// Initiator
	__init: function(){
		// Map attributes to jQuery objects...
		this.modalScreen  = $('#modalscreen');
		this.modalTitle   = $('#modalscreen-title');
		this.modalContent = $('#modalscreen-body');

		// Hide the modal screen first...
		this.modalScreen.hide(0);
	},

	// Getter + Setter
	getScreenID: function(){ return screenID; },
	setScreenID: function(_screenID){
		this.screenID = _screenID;
	},

	showScreen: function(screenID){
		switch(screenID){
			case "#highscorescreen":
				_screen.showHighScoreScreen(); break;
			case "#aboutscorescreen":
				_screen.showAboutScoreScreen(); break;
			default: // Won't do it.
				console.log("Default action. No action");
		}
	},

	isScreenModal: function(screenID){
		return (screenID == "#highscorescreen" || screenID == "#aboutscorescreen");
	},

	setInitScreen: function(){

	},

	showHighScoreScreen: function(){


		_screen.writeModalScreenTitle("Leaderboards");
		_screen.showModalScreen();
	},

	showGameScreen: function(){

	},

	showAboutScoreScreen: function(){


		_screen.writeModalScreenTitle("About the App");
		_screen.showModalScreen();
	},

	showQuitScreen: function(){

	},

	// Modal Screen Manipulations...
	showModalScreen: function(){
		this.modalScreen.slideDown(250);
	},
	hideModalScreen: function(){
		this.modalScreen.slideUp(250);
	},
	writeModalScreenTitle: function(title){
		this.modalTitle.html(title);
	},
	writeModalScreenContent:function(content){
		this.modalContent.html(content);
	}

}


$(function(){

	// Initialize screen functions
	_screen.__init();

	// If modal close button is clicked...
	$('#modalscreen-close').click(function(){
		_screen.hideModalScreen();
	});

	$('.main-menu-btn').click(function(){
		var targetID = $(this).attr('page-target');
		_screen.showScreen(targetID);
	});

	// Main Menu MouseUp and MouseDown
	$('.main-menu-btn').mousedown(function(){
		$(this).css('background', 'linear-gradient(#fbaf5d, #fbaf5d)' );
	}).mouseup(function(){
		$(this).css('background', 'linear-gradient(#fcc284, #fbaf5d)' );
	});

});