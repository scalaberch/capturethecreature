


var board,
	charToGuess; 	// The character to be guessed

$(function(){

	// Map jQuery frame to JS framework...
	//_board.jqueryBoardObj = $('#game-board .col-md-2');



	// Executing start game...
	// 	- Get random element from the list of characters...
	//charToGuess = _gamePlay.getRandomCharacter();
	//  - Then get the initial board
	//board = _board.shuffleBoard(charToGuess);
	//  - Then, print to the HTML board. Optional ni siya... HAHAHA...
	//var n = 0;
	//$('#game-board .col-md-2').each(function(){
	//	$(this).html(board[n]); n++;
	//});

	
	//$('.col-md-2').click(function(){
	//	var index = $(this).attr('id');
	//	var _continue = _gamePlay.updateMyGuess(index);

	//	if (_continue){
			// Do checking of answers...
	//		if (_board.checkIfGuessCorrect(_gamePlay.myGuess, charToGuess)){
	//			console.log("Correct answer!");
				

	//			charToGuess = _gamePlay.getRandomCharacter();
	//			board = _board.shuffleBoard(charToGuess);
	//			n = 0;
	//			$('#game-board .col-md-2').each(function(){
	//				$(this).html(board[n]); n++;
	//			});
	//		} else { console.log("Wrong answer!"); }

	//		_gamePlay.myGuess = [];
	//	}
	//});


});