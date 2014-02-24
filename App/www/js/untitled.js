// Put the pause button...
		

		var pButtonBG = new Kinetic.Circle({
			  radius: bottomLayer.width()*0.07,
			  fill: '#7a726a', x:0, y:10
		}); pauseButton.add(closeButtonBG);

		pButtonBG = new Kinetic.Circle({
			  radius: bottomLayer.width()*0.07,
			  fill: '#ffe284', x:0, y:0
		}); pauseButton.add(closeButtonBG);

		pButtonBG = new Kinetic.Circle({
			  radius: bottomLayer.width()*0.07,
			  fill: '#ffc14d', x:0, y:3
		}); pauseButton.add(closeButtonBG);

		pauseButton.on('touchend', function(evt){
			_gamePlay.pauseGame();

			var pauselayer = _app.screens[_app.PAUSE_MENU];
			pauselayer.y( 0 ); pauselayer.draw();
		}).on('touchstart', function(evt){

		});